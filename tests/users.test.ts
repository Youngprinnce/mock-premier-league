import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import server from '../src/bin/server';
import User from '../src/api/v1/components/users/users.model';

chai.use(chaiHttp);
let password = 'Password1!';

before(async() => {
    server.close();
});

after(async() => {
  await User.deleteMany({});
});

describe('USER', () => {

    describe('POST /auth/signup', () => {
    
        it('Should signup a user', async () => {
            const res = await chai.request(server).post('/v1/auth/signup')
            .send({
                "firstName": "John",
                "lastName": "Doe",
                "password": password,
                "email": 'testuserr@gmail.com'
            });

            console.log(res.body)

            expect(res.status).to.be.eql(201);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Registration successful');
        });

        it('Should fail because user exists', async () => {
            const res = await chai.request(server).post('/v1/auth/signup')
                .send({
                    "firstName": "John",
                    "lastName": "Doe",
                    "password": password,
                    "email": 'testuserr@gmail.com'
                });
            expect(res.status).to.be.eql(400);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('user exists, please login');
        });

        it('Should fail because payload is not complete', async () => {
            const res = await chai
                .request(server).post('/v1/auth/signup')
                .send({
                    "firstName": "John",
                    "lastName": "Doe",
                    "password": password
                });
            expect(res.status).to.be.eql(422);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('email is required.');
        });

        it('Should signup an admin', async () => {
            const res = await chai.request(server).post('/v1/auth/signup')
            .send({
                "firstName": "Admin",
                "lastName": "Admin",
                "password": password,
                "email": "testadminn@gmail.com",
                "role": "admin"
            });

            console.log(res.body)

            expect(res.status).to.be.eql(201);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Registration successful');
        });
    });

    describe('POST /auth/login', () => {
    
        it('should login a user', async () => {
            const res = await chai.request(server).post('/v1/auth/login')
            .send({
                "password": password,
                "email": 'testuserr@gmail.com'
            });
            expect(res.status).to.be.eql(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Logged in');
            expect(res.body.user).to.be.an('object');
        });

        it('should login an admin', async () => {
            const res = await chai.request(server).post('/v1/auth/login')
            .send({
                "password": password,
                "email": 'testadminn@gmail.com'
            });
            expect(res.status).to.be.eql(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Logged in');
            expect(res.body.user).to.be.an('object');
        });

        it('Should fail because payload is not complete', async () => {
            const res = await chai.request(server).post('/v1/auth/login')
            .send({
                "email": 'testuser@gmail.com'
            });
            expect(res.status).to.be.eql(422);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Password cannot be empty');
        });

        it('should fail because of invalid credentials', async () => {
            const res = await chai.request(server).post('/v1/auth/login')
            .send({
                "password": 'grewgttgwtg',
                "email": 'testadmin@gmail.com'
            });
            expect(res.status).to.be.eql(400);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql(`invalid credentials`);
        });
    });
})




