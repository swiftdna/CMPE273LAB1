// Set env variable
process.env.NODE_ENV = 'test';
const Sequelize = require("sequelize");
//Require the dev-dependencies
let chai = require('chai');
let sinon = require('sinon');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Products', async () => {
    before(async () => { //Before each test we empty the database
        sinon.stub(console, 'log')  // disable console.log
        sinon.stub(console, 'info')  // disable console.info
        sinon.stub(console, 'warn')  // disable console.warn
        sinon.stub(console, 'error')  // disable console.error
        const Op = Sequelize.Op;        
        const {models: {product: Product, sequelize}} = COREAPP;
        await Product.destroy({
            where: {
                id: {[Op.notIn]:[27]}
            }
        });
    });
    /*
    * Test the /GET route
    */
    describe('/GET products', () => {
      it('it should GET all the products', (done) => {
        chai.request(server)
            .get('/api/products')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.success.should.be.eql(true);
              res.body.data.should.be.a('array');
              res.body.data.length.should.be.eql(1);
              done();
            });
      });
    });

    describe('/POST products', () => {
      it('it should POST a the products', (done) => {
        chai.request(server)
            .post('/api/products')
            .send({
                "name": "Basic Badge Of Sport Tee Test",
                "photo_url": "https://m.media-amazon.com/images/I/81M6uvpVmoL._AC_UY879_.jpg",
                "description": "A casual tee for everyday comfort",
                "price": 12,
                "qty": 24
            })
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.success.should.be.eql(true);
              done();
            });
      });
    });

    describe('/PUT products', () => {
      it('it should PUT a the product', (done) => {
        chai.request(server)
            .put('/api/products/27')
            .send({
                "name": "Basic Badge Of Sport Tee Edited"
            })
            .end((err, res) => {
                    console.log(JSON.stringify(res));
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.success.should.be.eql(true);
              done();
            });
      });
    });
});