require("chai").should();
const server = require('../server');
const request = require('supertest')(server);

const { userController } = require("../app/controllers/index.js");

describe('Sign-up form', function() {
    it('should create a new user', function(done) {
        request(server)
        .post('/sign-up')
        .send({
            "firstname": "Jean",
            "lastname": "Biance",
            "email":"jean.biance@gmail.com",
            "password":"Azerty123!",
            "confirmpassword": "Azerty123!",
            "birthdate": "05/05/1990"
        })
        .expect(200)
        .end((err, res) =>{
            if (err) {
                return done(err);
            }
            const response = JSON.parse(res.text);
            expect(response).to.be.an('string');
            done();
        })
    });
});