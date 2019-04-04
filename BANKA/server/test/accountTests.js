import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';


// error messages and number used
// 200 - Successfully created a bank account
// 300 - account type cannot be empty
// 400 - user email does not exist
// 401 - activate or deactivate a bank account
// 402 - bank account is not found
// 403 - deleted a bank account
// 404 - bank account is not found

let expect = chai.expect;
chai.use(chaiHttp);

// should be able to create a bank account
describe('Bank account', () => {
  it('Successfully created a bank account', (done) => {
    chai.request(server)
    .post('/api/v1/accounts')
    .send({
        firstName: "shalu",
        lastName : "chandwani",
        email: "shaluchandwani@svasbanka.com",
        type: "savings"
    })
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      done();
    });
});
//should not create a bank account when the account type is empty
it('account type cannot be empty', (done) => {
    chai.request(server)
    .post('/api/v1/accounts')
    .send({
        firstName: "shalu",
        lastName : "chandwani",
        email: "shaluchandwani@svasbanka.com",
        type: ""
    })
    .end((err, res) => {
      expect(res).to.have.status(300);
      expect(res.body).to.be.an('object');
      done();
    });
});

//should not create a bank account if user email does not exist
it('user email does not exist', (done) => {
    chai.request(server)
    .post('/api/v1/accounts')
    .send({
        firstName: "shalu",
        lastName : "chandwani",
        email: "",
        type: "savings"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
});

//it should let a staff/admin be able to activate/deactivate a bank account

it('activate or deactivate a bank account', (done) => {
    chai.request(server)
    .patch('/api/v1/account/1')
    .send({
        status: "active"
    })
    .end((err, res) => {
      expect(res).to.have.status(401);
      expect(res.body).to.be.an('object');
      done();
    });
});

// it should give an error if the bank account is not found
it('bank account is not found', (done) => {
    chai.request(server)
    .patch('/api/v1/account/10')
    .send({
        status: "active"
    })
    .end((err, res) => {
      expect(res).to.have.status(402);
      expect(res.body).to.be.an('object');
      done();
    });
});


// it should let a staff/admin delete a specific bank account
it('deleted a bank account', (done) => {
  chai.request(server)
  .delete('/api/v1/accounts/1')
  .send()
  .end((err, res) => {
    expect(res).to.have.status(403);
    expect(res.body).to.be.an('object');
    done();
  });
});

//should notify the staff/admin when the bank account is not found
it('bank account is not found', (done) => {
  chai.request(server)
  .delete('/api/v1/accounts/10')
  .send()
  .end((err, res) => {
    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    done();
  });
});
})