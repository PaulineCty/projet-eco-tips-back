const endPoint = 'http://localhost:3000';

const signUp = {
    "firstname": "John",
    "lastname": "Doe",
    "email":"john.doe@gmail.com",
    "password":"Azerty123!",
    "confirmpassword": "Azerty123!",
    "birthdate": "05/05/1990"
};

const signIn = {
    "email":"john.doe@gmail.com",
    "password":"Azerty123!"
};

const updatedUser = {
  "firstname": "John",
  "lastname": "Doedoe",
  "email": "john.doe@gmail.com",
  "password": "Azerty123!",
  "confirmpassword": "Azerty123!",
  "birthdate": "05/05/1990"
};


describe('API AUtomation Test', ()=> {
    // Declaring the variables we'll use in our test
    let accessToken;
    let cardId;


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

    it('Gets the user\'s profil informations', () => {
      cy.wrap(accessToken).as('accessToken');

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
      });
    });

    it('Updates the user\'s profil informations', () => {
      cy.wrap(accessToken).as('accessToken');
    
      cy.request({
        method: "PATCH",
        url: `${endPoint}/me/user`,
        body: updatedUser,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).as('updateUserProfile');

      cy.get('@updateUserProfile').then( response => {
        expect(response.status).to.eq(200);
      });
    });

    it('Gets a random card', () => {
      cy.wrap(accessToken).as('accessToken');

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

    it('Adds the random card in userCard', () => {
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

    it('Adds the random card in Updating the card status in the user\'s card collection', () => {
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


    it('Deletes the user\'s profil', () => {
      cy.wrap(accessToken).as('accessToken');
    
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