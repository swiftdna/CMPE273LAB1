// Set env variable
process.env.NODE_ENV = 'test';
//Require the dev-dependencies
let chai = require('chai');
let sinon = require('sinon');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Login', async () => {
    before(async () => { //Before each test we empty the database
        const {models: {user: User}} = COREAPP;
        await User.destroy({
            where: {}
        });
    });
    /*
    * Test the /GET route
    */
    describe('/POST signup', () => {
      it('it should POST the signup data', (done) => {
        chai.request(server)
            .post('/signup')
            .send({ username: 'test', email: 'test@gmail.com', password: '123'})
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.success.should.be.eql(true);
              done();
            });
      });
    });

    describe('/POST signin', () => {
      it('it should POST the login details', (done) => {
        chai.request(server)
            .post('/signin')
            .send({ username: 'test', password: '123'})
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.success.should.be.eql(true);
              done();
            });
      });
    });
});