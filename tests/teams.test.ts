import bcrypt from "bcryptjs";
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import server from '../src/bin/server';
import User from '../src/api/v1/components/users/users.model';
import Team from '../src/api/v1/components/teams/teams.model';

chai.use(chaiHttp);

let teamId = ""
let userToken = ""
let adminToken = ""
const password = "Password1!"

before(async() => {
    server.close();
    await User.insertMany([
        {
            "firstName": "John",
            "lastName": "Doe",
            "password": bcrypt.hashSync(password, 12),
            "email": 'testuser@gmail.com'
        },
        {
            "firstName": "Admin",
            "lastName": "Admin",
            "password": bcrypt.hashSync(password, 12),
            "email": "testadmin@gmail.com",
            "role": "admin"
        }
    ])
});

after(async() => {
  await User.deleteMany({});
  await Team.deleteMany({});
});

describe('TEAM', () => {

    describe('POST /auth/login', () => {
        it('should login a user', async () => {
            const res = await chai.request(server).post('/v1/auth/login')
            .send({
                "password": password,
                "email": 'testuser@gmail.com'
            });
            expect(res.status).to.be.eql(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Logged in');
            expect(res.body.user).to.be.an('object');
            userToken = res.body.accessToken
            console.log({userToken})
        });

        it('should login an admin', async () => {
            const res = await chai.request(server).post('/v1/auth/login')
            .send({
                "password": password,
                "email": 'testadmin@gmail.com'
            });
            expect(res.status).to.be.eql(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Logged in');
            expect(res.body.user).to.be.an('object');
            adminToken = res.body.accessToken
            console.log({adminToken})
        });
    });

    describe("POST /teams/create", () => {
        it("should create a team", async () => {
            const res = await chai.request(server).post(`/v1/teams/create`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    "name": "Tottenham",
                    "stadium": {
                        "name": "Spurs",
                        "location": {
                            "city": "london",
                            "country": "England"
                        }
                    },
                    "players": [
                        {
                            "name": "Harry Maguire",
                            "position": "Defender",
                            "nationality": "England"
                        },
                        {
                            "name": "Bruno Fernandes",
                            "position": "Midfielder",
                            "nationality": "Portugal"
                        },
                        {
                            "name": "Edinson Cavani",
                            "position": "Forward",
                            "nationality": "Uruguay"
                        }
                    ],
                    "manager": {
                        "name": "Ole Gunnar Solskjaer",
                        "nationality": "Norway"
                    }
                });
                console.log(res.body)
                expect(res.status).to.be.eql(201);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('Team created successfully');
        });

        it("should fail because authorization header is not set", async () => {
            const res = await chai.request(server).post(`/v1/teams/create`)
                .send({
                    "name": "Manchester United",
                    "stadium": {
                        "name": "Old Trafford",
                        "location": {
                            "city": "Manchester",
                            "country": "England"
                        }
                    },
                    "players": [
                        {
                            "name": "Harry Maguire",
                            "position": "Defender",
                            "nationality": "England"
                        },
                    ],
                    "manager": {
                        "name": "Ole Gunnar Solskjaer",
                        "nationality": "Norway"
                    }
                });
                expect(res.status).to.be.eql(401);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql('unauthenticated, please try logging in again');
        });

        it("should fail because user is not an admin", async () => {
            const res = await chai.request(server).post(`/v1/teams/create`)
                .set({ Authorization: `Bearer ${userToken}` })
                .send({
                    "name": "Manchester United",
                    "stadium": {
                        "name": "Old Trafford",
                        "location": {
                            "city": "Manchester",
                            "country": "England"
                        }
                    },
                    "players": [
                        {
                            "name": "Harry Maguire",
                            "position": "Defender",
                            "nationality": "England"
                        }
                    ],
                    "manager": {
                        "name": "Ole Gunnar Solskjaer",
                        "nationality": "Norway"
                    }
                });
                expect(res.status).to.be.eql(403);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql('You are not authorized to perform this action.');
        });

        it("should fail because team exist", async () => {
            const res = await chai.request(server).post(`/v1/teams/create`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    "name": "Tottenham",
                    "stadium": {
                        "name": "Spurs",
                        "location": {
                            "city": "london",
                            "country": "England"
                        }
                    },
                    "players": [
                        {
                            "name": "Harry Maguire",
                            "position": "Defender",
                            "nationality": "England"
                        },
                        {
                            "name": "Bruno Fernandes",
                            "position": "Midfielder",
                            "nationality": "Portugal"
                        },
                        {
                            "name": "Edinson Cavani",
                            "position": "Forward",
                            "nationality": "Uruguay"
                        }
                    ],
                    "manager": {
                        "name": "Ole Gunnar Solskjaer",
                        "nationality": "Norway"
                    }
                });
                expect(res.status).to.be.eql(400);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql('team with the same name exists, please choose another name');
        });

        it("should fail because payload is incomplete", async () => {
            const res = await chai.request(server).post(`/v1/teams/create`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    "name": "Manchester United",
                    "stadium": {
                        "name": "Old Trafford",
                        "location": {
                            "city": "Manchester",
                            "country": "England"
                        }
                    },
                    "manager": {
                        "name": "Ole Gunnar Solskjaer",
                        "nationality": "Norway"
                    }
                });
                expect(res.status).to.be.eql(422);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql(`expected the value of 'players' to be an array of Object(s) with 'name', 'position' and 'nationality' as fields`);
        });
    });

    describe("GET /teams", () => {
        it("should return all teams with adminToken", async () => {
            const res = await chai.request(server).get(`/v1/teams`)
                .set({ Authorization: `Bearer ${adminToken}` })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('data fetched');
                teamId = res.body.teams[0].id;
        });

        it("should fail because authorization header is not set", async () => {
            const res = await chai.request(server).get(`/v1/teams`)
                expect(res.status).to.be.eql(401);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql('unauthenticated, please try logging in again');
        });

        it("should return all teams with userToken", async () => {
            const res = await chai.request(server).get(`/v1/teams`)
                .set({ Authorization: `Bearer ${userToken}` })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('data fetched');
                teamId = res.body.teams[0].id;
        });

        it("should return a single team by Id", async () => {
            const res = await chai.request(server).get(`/v1/teams/${teamId}`)
                .set({ Authorization: `Bearer ${adminToken}` })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
        });
    });

    describe("GET /teams/search", () => {
        it("should return teams based on keywords provided", async () => {
            const res = await chai.request(server).get(`/v1/teams/search?name=manchester&position=defender`)
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('data fetched');
        });
    });

    describe("PUT/DELETE /teams/:teamId", () => {
        it("should edit a team", async () => {
            const res = await chai.request(server).put(`/v1/teams/${teamId}`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    "manager": {
                        "name": "Erik Ten Hag",
                        "nationality": "Netherlands"
                    }
                })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('Team successfully updated.');
        });

        it("should fail if update payload is invalid", async () => {
            const res = await chai.request(server).put(`/v1/teams/${teamId}`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    "manager": {
                        "name": "Erik Ten Hag",
                    }
                })
                expect(res.status).to.be.eql(422);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql(`'manager' object should have both the 'name' and 'nationality' fields`);
        });

        it("should fail if you update with userToken", async () => {
            const res = await chai.request(server).put(`/v1/teams/${teamId}`)
                .set({ Authorization: `Bearer ${userToken}` })
                .send({
                    "manager": {
                        "name": "Erik Ten Hag",
                        "nationality": "Netherlands"
                    }
                })
                expect(res.status).to.be.eql(403);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql('You are not authorized to perform this action.');
        });

        it("should delete a team", async () => {
            const res = await chai.request(server).delete(`/v1/teams/${teamId}`)
                .set({ Authorization: `Bearer ${adminToken}` })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('Team successfully deleted.');
        });
    });
})







