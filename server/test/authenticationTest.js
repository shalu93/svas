import chaiHttp from 'chai-http';
import server from '../server';
import chai from 'chai';


// Error messages Used
// 201 - fetch all users
// 202 - email is required
// 203 - only integers are not allowed in email
// 204 - create a user with right signup credentials
// 205 - email already existing
// 206 - wrong email format
// 207 - First Name field is empty
// 208 - Last Name field is empty
// 209 - password must be atleast 10 characters
// 210 - password and confirm password do not match
// 211 - Incorrect credentials
// 212 - Incorrect password
// 213 - Invalid email address
// 211 - Invalid email and password

let expect = chai.expect;
chai.use(chaiHttp);

describe('User signup validations', () => {


// should not register a user with an integer email  

  it('only integers cannot be entered in email', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send({
      firstName: "shalu",
      lastName : "chandwani",
      email: 9,
      password: "Shalu@1993",
      confirmPassword: "Shalu@1993"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
});

//It Should create a user with right signup credentials
it('create a user with right signup credentials', (done) => {
  chai.request(server)
  .post('/api/v1/auth/signup')
  .send(
    {
      firstName: "shalu",
      lastName : "chandwani",
      email: "shaluchandwani@svassvasbanka.com",
      password: "Shalu@1993",
      confirmPassword: "Shalu@1993"
    })
    .end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      done();
    });
});

// should not register a user with empty email field
it('email is required', (done) => {
  chai.request(server)
  .post('/api/v1/auth/signup')
  .send({
    firstName: "shalu",
    lastName : "chandwani",
    email: "",
    password: "Shalu@1993",
    confirmPassword: "Shalu@1993"
  })
  .end((err, res) => {
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    done();
  });
});

//should not register a new user with an already existing email
it('This email already exists', (done) => {
  chai.request(server)
  .post('/api/v1/auth/signup')
  .send({
    firstName: "Shalu",
    lastName : "chandwani",
    email: "shaluchandwani@svasbanka.com",
    password: "Shalu@1993",
    confirmPassword: "Shalu@1993"
  })
  .end((err, res) => {
    expect(res).to.have.status(409);
    expect(res.body).to.be.an('object');
    done();
  });
});
        
// should not register user with a wrong email format
it('wrong email format', (done) => {
  chai.request(server)
  .post('/api/v1/auth/signup')
  .send({
    firstName: "Shalu",
    lastName : "chandwani",
    email: "shaluchandwanisvasbanka.com",
    password: "Shalu@1993",
    confirmPassword: "Shalu@1993"
  })
  .end((err, res) => {
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    done();
  });
});

//should not register user with an empty First Name field
it('First Name field is empty', (done) => {
  chai.request(server)
  .post('/api/v1/auth/signup')
  .send(
    {
      firstName: "",
      lastName : "chandwani",
      email: "shaluchandwani@svasbanka.com",
      password: "Shalu@1993",
      confirmPassword: "Shalu@1993"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
  });
  
  //should register a password that has at least 10 characters 
  it('password must be atleast 10 characters ', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send({
      firstName: "Shalu",
      lastName : "chandwani",
      email: "shaluchandwani@svasbanka.com",
      password: "shal",
      confirmPassword: "shal"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
  });

    //should not register a user with an empty Last Name field 
    it('Last Name field is empty', (done) => {
      chai.request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstName: "Shalu",
        lastName : "",
        email: "shaluchandwani@svasbanka.com",
        password: "Shalu@1993",
        confirmPassword: "Shalu@1993"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
    });
  
  //should give an error when password and confirm password do not match 
  it('password and confirm password do not match', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send({
      firstName: "Shalu",
      lastName : "chandwani",
      email: "shaluchandwani@svasbanka.com",
      password: "chandwani",
      confirmPassword: "Shalu@1993"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
  });
});



//should login a user without the correct credentials
describe('User login validation', () => {
  it('Incorrect credentials', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signin')
    .send(
      {
        email: "shalu@svasbanka.com",
        password : "Shalu@1993"
        })
      .end((err, res) => {
        expect(res).to.have.status(211);
        expect(res.body).to.be.an('object');
        done();
      });
    });

    // should fetch all users
    it('fetch all users', (done) => {
      chai.request(server)
      .get('/api/v1/users')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

    //should not login user without password
    it('Incorrect password', (done) => {
      chai.request(server)
      .post('/api/v1/auth/signin')
      .send({
        email: "shaluchandwani@svasbanka.com",
        password : ""
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
        });
    });

    //should not login user with an incorrect email and password
    it('Invalid email and password', (done) => {
      chai.request(server)
      .post('/api/v1/auth/signin')
      .send({ 
        email: "shalu@svasbanka.com",
        password : "Shalu"})
      .end((err, res) => {
        expect(res).to.have.status(211);
        expect(res.body).to.be.an('object');
        done();
      });
    });
    
    //should not log in user with an integer email
    it('email format should be like google@gmail.com ', (done) => {
      chai.request(server)
      .post('/api/v1/auth/signin')
      .send({
        email: 1,
        password : "Shalu@1993"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
    });
    
    //should not login user without email address
    it('Invalid email address', (done) => {
      chai.request(server)
      .post('/api/v1/auth/signin')
      .send({
        email: "",
        password : "Shalu@1993"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
    });


    });
        