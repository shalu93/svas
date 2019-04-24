import chaiHttp from 'chai-http';
import server from '../server';
import chai from 'chai';


let expect = chai.expect;
chai.use(chaiHttp);

/*global it*/
/*global describe*/
/*eslint no-undef: "error"*/

describe('User signup validations', () => {

    //no rows found
    it('no data in users table', (done) => {
        chai.request(server)
            .post('/api/v1//users')
            .send({
    
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.an('object');
                done();
            });
    }); 

    // should not register a user with an integer email  

    it('only integers cannot be entered in email', (done) => {
        chai.request(server)
            .post('/api/v1/auth/signup')
            .send({
                firstName: 'shalu',
                lastName : 'chandwani',
                email: 9,
                password: 'Shalu@1993',
                confirmPassword: 'Shalu@1993'
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    
    it('password should have at least 1 digit,special character,upper and lower case English letter and a Min 10 characters', (done) => {
        chai.request(server)
            .post('/api/v1/auth/signup')
            .send({
                firstName: 'shalu',
                lastName : 'chandwani',
                email: 'shaluchandwani@mail.com',
                password: 'shaluuuuuu',
                confirmPassword: 'shaluuuuuu'
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
                    firstName: 'shalu',
                    lastName : 'chandwani',
                    email: 'shaluchandwani@svassvasbanka.com',
                    password: 'Shalu@1993',
                    confirmPassword: 'Shalu@1993'
                })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    // should not register a user with empty email field
    it('email is required', (done) => {
        chai.request(server)
            .post('/api/v1/auth/signup')
            .send({
                firstName: 'shalu',
                lastName : 'chandwani',
                email: '',
                password: 'Shalu@1993',
                confirmPassword: 'Shalu@1993'
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
                firstName: 'Shalu',
                lastName : 'chandwani',
                email: 'shaluvaswani555@rocketmail.com',
                password: 'Shalu@1993',
                confirmPassword: 'Shalu@1993'
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
                firstName: 'Shalu',
                lastName : 'chandwani',
                email: 'shaluchandwanisvasbanka.com',
                password: 'Shalu@1993',
                confirmPassword: 'Shalu@1993'
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
                    firstName: '',
                    lastName : 'chandwani',
                    email: 'shaluchandwani@svasbanka.com',
                    password: 'Shalu@1993',
                    confirmPassword: 'Shalu@1993'
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
                firstName: 'Shalu',
                lastName : 'chandwani',
                email: 'shaluchandwani@svasbanka.com',
                password: 'shal',
                confirmPassword: 'Shal'
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
                firstName: 'Shalu',
                lastName : '',
                email: 'shaluchandwani@svasbanka.com',
                password: 'Shalu@1993',
                confirmPassword: 'Shalu@1993'
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
                    email: 'shalu@svasbanka.com',
                    password : 'Shalu@1993'
                })
            .end((err, res) => {
                expect(res).to.have.status(400);
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
                email: 'shaluchandwani@svasbanka.com',
                password : ''
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
                   email: 'shalu@svasbanka.com',
                   password : 'Shalu'})
               .end((err, res) => {
                   expect(res).to.have.status(400);
                   expect(res.body).to.be.an('object');
                   done();
               });
       });
    
    //should not log in user with an integer email
    it('email format should be like google@gmail.com ', (done) => {
        chai.request(server)
            .post('/api/v1/auth/signin')
            .send({
                email: 'shalulkhag.com',
                password : 'Shalu@1993'
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
                email: '',
                password : 'Shalu@1993'
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
            });
    });


});
        