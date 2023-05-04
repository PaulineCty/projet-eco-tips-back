const endPoint = 'http://localhost:3000';

const signUp = {
    "firstname": "John",
    "lastname": "Doe",
    "email":"john.doe@gmail.com",
    "password":"Azerty123!",
    "confirmpassword": "Azerty123!",
    "birthdate": "1990-05-05"
};

const signIn = {
    "email":"john.doe@gmail.com",
    "password":"Azerty123!"
};

const adminSignIn = {
  "email":"jean.biance@gmail.com",
  "password":"Azerty123!"
}

const updatedUser = {
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@gmail.com",
  "birthdate": "1990-05-06"
};

const updatedPassword = {
  "password": "Azerty12345!",
  "confirmpassword": "Azerty12345!"
}

const achievement = {
  "title": "TestCypress",
  "image": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII",
  "description": "description"
};

const newCard = {
  "image": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII",
  "title":"Cypress",
  "description":"description",
  "environmentalrating":3,
  "economicrating":3,
  "value": 20,
  "tags": [1,2]
};

const updatedSignIn = {
    "email":"john.doe@gmail.com",
    "password":"Azerty12345!"
};

const updatedNewCard = {
  "title": "Cypress",
  "description": "description2",
  "environmentalrating": 5,
  "economicrating": 3,
  "value": 20,
  "tags": [8]
};

const updatedAchievement = {
  "image": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII",
  "title": "TestCypress",
  "description": "updatedDescription"
};

const newTag = {
  "name": "Cypress",
  "color":"#FF00FF"
};

const updatedNewTag = {
  "name": "Cypress",
  "color":"#94a3b7"
};


describe('API Automation Test', ()=> {
    // Declaring the variables we'll use in our test
    let userId;
    let accessToken;
    let cardId;
    let newCardId;
    let adminAccessToken;
    let achievementId;
    let newTagId;


    it('Gets the latest created and validated card', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/card/latest`,
      }).as('getLatestCard');

      cy.get('@getLatestCard').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });


    it('Gets one random achievement', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/achievement/random`,
      }).as('getOneRandomAchievement');

      cy.get('@getOneRandomAchievement').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });


    it('Posts a new user', () => {
        cy.request({
            method: "POST",
            url: `${endPoint}/sign-up`,
            body: signUp
        }).as('postNewUser');

        cy.get('@postNewUser').then( response => {
            expect(response.status).to.eq(200);
        });
    });


    it('Posts user log in order to connect', () => {
      cy.request({
        method: "POST",
        url: `${endPoint}/sign-in`,
        body: signIn
      }).as('postUserLog');

      cy.get('@postUserLog').then( response => {
        expect(response.status).to.eq(200);
        accessToken = response.body.accessToken;
      });
    });


    it('Gets the user\'s profile information', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/me/user`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('getUserProfile');

      cy.get('@getUserProfile').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
        userId = response.body.id;
      });
    });


    it('Updates the user\'s profile information', () => {
    
      cy.request({
        method: "PATCH",
        url: `${endPoint}/me/user`,
        body: updatedUser,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('updateProfile');

      cy.get('@updateProfile').then( response => {
        expect(response.status).to.eq(200);
      });
    });


    it('Updates the user\'s password', () => {
    
      cy.request({
        method: "PATCH",
        url: `${endPoint}/me/user/password`,
        body: updatedPassword,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('updatePassword');

      cy.get('@updatePassword').then( response => {
        expect(response.status).to.eq(204);
      });
    });


    it('Gets a random card', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/me/collection/card`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('getOneRandomCard');

      cy.get('@getOneRandomCard').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
        cardId = response.body.id
      });
    });


    it('Adds the random card in user_card', () => {
      cy.request({
        method: "POST",
        url: `${endPoint}/me/collection/card`,
        body: {
          "cardId": cardId,
          "expirationDate":"01-01-2023"
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('addUserCard');

      cy.get('@addUserCard').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });


    it('Updates the card status in the user\'s card collection', () => {
      cy.request({
        method: "PATCH",
        url: `${endPoint}/me/collection/card/${cardId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('updateUserCardState');

      cy.get('@updateUserCardState').then( response => {
        expect(response.status).to.eq(204);
      });
    });


    it('Adds an achievement as proposal', () => {
      cy.request({
        method: "POST",
        url: `${endPoint}/me/achievement`,
        body: achievement,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('addAchievement');

      cy.get('@addAchievement').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
        achievementId = response.body.achievement.id;
      });
    });


    it('Gets the user\'s card collection', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/me/collection`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('getUsersCollection');

      cy.get('@getUsersCollection').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });


    it('Deleting the card from the user\'s card collection', () => {
      cy.request({
        method: "DELETE",
        url: `${endPoint}/me/collection/card/${cardId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('deleteUserCard');

      cy.get('@deleteUserCard').then( response => {
        expect(response.status).to.eq(204);
      });
    });


    it('Gets all existing tags', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/tag`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('getAllTags');

      cy.get('@getAllTags').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });


    it('Adds a card as proposal', () => {
      cy.request({
        method: "POST",
        url: `${endPoint}/me/proposal`,
        body: newCard,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('addCard');

      cy.get('@addCard').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
        newCardId = response.body.card.id;
      });
    });


    it('Gets all cards created by a user', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/me/card`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('getUsersCollection');

      cy.get('@getUsersCollection').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });


    it('Gets the 5 best users ordered by score', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/ranking/score`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('getRankingScore');

      cy.get('@getRankingScore').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });


    it('Gets the 5 best users ordered by card creation', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/ranking/creation`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('getRankingCreation');

      cy.get('@getRankingCreation').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });


    it('Posts admin\'s user log', () => {
      cy.request({
        method: "POST",
        url: `${endPoint}/sign-in`,
        body: adminSignIn
      }).as('postAdminUserLog');

      cy.get('@postAdminUserLog').then( response => {
        expect(response.status).to.eq(200);
        adminAccessToken = response.body.accessToken;
      });
    });


    it('Gets all users', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/user`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        }
      }).as('getAllUsers');

      cy.get('@getAllUsers').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });


    it('Updates a user\'s role to administrator', () => {
      cy.request({
        method: "PATCH",
        url: `${endPoint}/user/${userId}`,
        headers: {
          Authorization: `Bearer ${adminAccessToken}`
        }
      }).as('updateUserAsAdmin');

      cy.get('@updateUserAsAdmin').then( response => {
        expect(response.status).to.eq(204);
      });
    });


    it('John Doe is now an administrator and he has logged back in', () => {
      cy.request({
        method: "POST",
        url: `${endPoint}/sign-in`,
        body: updatedSignIn
      }).as('postUserLog');

      cy.get('@postUserLog').then( response => {
        expect(response.status).to.eq(200);
        accessToken = response.body.accessToken;
      });
    });


    it('Gets all proposed cards', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/proposal`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('getAllProposalCard');

      cy.get('@getAllProposalCard').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });


    it('Updates a card to an approved state', () => {
      cy.request({
        method: "PATCH",
        url: `${endPoint}/proposal/${newCardId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('updateProposalCardToFalse');

      cy.get('@updateProposalCardToFalse').then( response => {
        expect(response.status).to.eq(204);
      });
    });


    it('Gets all approved cards', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/card`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('getAllNotProposalCard');

      cy.get('@getAllNotProposalCard').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });


    it('Updates a card', () => {
      cy.request({
        method: "PATCH",
        url: `${endPoint}/card/${newCardId}`,
        body: updatedNewCard,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('updateCard');

      cy.get('@updateCard').then( response => {
        expect(response.status).to.eq(204);
      });
    });


    it('Deletes a card', () => {
      cy.request({
        method: "DELETE",
        url:`${endPoint}/card/${newCardId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('deleteCard');

      cy.get('@deleteCard').then( response => {
        expect(response.status).to.eq(204);
      });
    });


    it('Gets all approved achievements', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/achievement`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('getAllNotProposalAchievement');

      cy.get('@getAllNotProposalAchievement').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });


    it('Gets all proposed achievements', () => {

      cy.request({
        method: "GET",
        url: `${endPoint}/achievement/proposal`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('getAllProposalAchievement');

      cy.get('@getAllProposalAchievement').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
      });
    });


    it('Updates an achievement to an approved state', () => {
      cy.request({
        method: "PATCH",
        url: `${endPoint}/achievement/proposal/${achievementId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('updateProposalAchievementToFalse');

      cy.get('@updateProposalAchievementToFalse').then( response => {
        expect(response.status).to.eq(204);
      });
    });


    it('Updates an achievement', () => {
      cy.request({
        method: "PATCH",
        url: `${endPoint}/achievement/${achievementId}`,
        body: updatedAchievement,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('updateAchievement');

      cy.get('@updateAchievement').then( response => {
        expect(response.status).to.eq(204);
      });
    });


    it('Deletes an achievement', () => {
      cy.request({
        method: "DELETE",
        url: `${endPoint}/achievement/${achievementId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('deleteAchievement');

      cy.get('@deleteAchievement').then( response => {
        expect(response.status).to.eq(204);
      });
    });


    it('Adds a new tag', () => {
      cy.request({
        method: "POST",
        url: `${endPoint}/tag`,
        body: newTag,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('createTag');

      cy.get('@createTag').then( response => {
        expect(response.status).to.eq(200);
        cy.log(JSON.stringify(response.body));
        newTagId = response.body.id;
      });
    });


    it('Updates a tag', () => {
      cy.request({
        method: "PATCH",
        url: `${endPoint}/tag/${newTagId}`,
        body: updatedNewTag,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('editTag');

      cy.get('@editTag').then( response => {
        expect(response.status).to.eq(204);
      });
    });


    it('Deletes a tag', () => {
      cy.request({
        method: "DELETE",
        url: `${endPoint}/tag/${newTagId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('deleteTag');

      cy.get('@deleteTag').then( response => {
        expect(response.status).to.eq(204);
      });
    });


    it('Deletes the user\'s profile', () => {
    
      cy.request({
        method: "DELETE",
        url: `${endPoint}/me/user`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('deleteUserProfile');

      cy.get('@deleteUserProfile').then( response => {
        expect(response.status).to.eq(204);
      });
    });
})