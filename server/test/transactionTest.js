import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';


let expect = chai.expect;
chai.use(chaiHttp);
let usertoken;

/*global it*/
/*global describe*/
/*eslint no-undef: "error"*/

describe('Debit bank account', () => {

        //It should sign in user with the credentials
        it('signin user with right credentials', (done) => {
            chai.request(server)
                .post('/api/v1/auth/signin')
                .send(
                    {
                        email: 'shaluvaswani555@rocketmail.com',
                        password: 'shalu@1993'
                    })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    usertoken = res.body.data.token; 
                    console.log(usertoken);
                    done();
                });
        });

    //should be able to debit a bank account
    it('should be able to debit a bank account', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/200002/debit')
            .set('Authorization',usertoken)
            .send({
                amount : 2,
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //should give an error when the bank account is not found
    it('bank account is not found', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/8/debit')
            .set('Authorization',usertoken)
            .send({
                amount : 20,
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //should give an error if the bank account is inactive/dormant/draft
    it('You have to activate this account first', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/200004/debit')
            .set('Authorization',usertoken)
            .send({
                amount : 20,
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });
});

describe('Credit a bank account', () => {

    //should be able to credit a bank account
    it('credit a bank account', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/1/credit')
            .set('Authorization',usertoken)
            .send({
                amount : 20,
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //should give an error if the bank account is not found
    it('bank account is not found', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/8/credit')
            .set('Authorization',usertoken)
            .send({
                amount : 20,
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //should give an error if the bank account is inactive/dormant/draft
    it('You have to activate this account first', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/200004/credit')
            .set('Authorization',usertoken)
            .send({
                amount : 20,
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    //should not credit a bank account with no enough amount
    it('crediting a bank account with no enough amount', (done) => {
        chai.request(server)
            .post('/api/v1/transactions/266/credit')
            .set('Authorization',usertoken)
            .send({
                amount : 20,
                Authorization:usertoken
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });
});
  