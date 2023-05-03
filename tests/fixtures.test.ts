import bcrypt from "bcryptjs";
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import server from '../src/bin/server';
import User from '../src/api/v1/components/users/users.model';
import Team from '../src/api/v1/components/teams/teams.model';
import Fixture from '../src/api/v1/components/fixtures/fixtures.model';

chai.use(chaiHttp);

let teamId1 = ""
let teamId2 = ""
let userToken = ""
let fixturesId = ""
let adminToken = ""
const password = "Password1!"

before(async() => {
    server.close();
    await User.insertMany([
        {
            "firstName": "John",
            "lastName": "Doe",
            "password": bcrypt.hashSync(password, 12),
            "email": 'testuserplus@gmail.com'
        },
        {
            "firstName": "Admin",
            "lastName": "Admin",
            "password": bcrypt.hashSync(password, 12),
            "email": "testadminplus@gmail.com",
            "role": "admin"
        }
    ]);

    const team = [
        {
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
        },
        {
            "name": "Chelsea",
            "stadium": {
                "name": "Stanford Bridge",
                "location": {
                    "city": "londorn",
                    "country": "England"
                }
            },
            "players": [
                {
                    "name": "Reece James",
                    "position": "Defender",
                    "nationality": "England"
                }
            ],
            "manager": {
                "name": "Frank Lampard",
                "nationality": "England"
            }
        }
    ]
    await Team.insertMany(team);
});

after(async() => {
    await Promise.all([
        User.deleteMany({}),
        Team.deleteMany({}),
        Fixture.deleteMany({})
    ])
});

describe('FIXTURE', () => {

    describe('POST /auth/login', () => {
        it('should login a user', async () => {
            const res = await chai.request(server).post('/v1/auth/login')
            .send({
                "password": password,
                "email": 'testuserplus@gmail.com'
            });
            expect(res.status).to.be.eql(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Logged in');
            expect(res.body.user).to.be.an('object');
            userToken = res.body.accessToken
        });

        it('should login an admin', async () => {
            const res = await chai.request(server).post('/v1/auth/login')
            .send({
                "password": password,
                "email": 'testadminplus@gmail.com'
            });
            expect(res.status).to.be.eql(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Logged in');
            expect(res.body.user).to.be.an('object');
            adminToken = res.body.accessToken
        });
    });

    describe('GET /teams', () => {
        it("should return all teams", async () => {
            const res = await chai.request(server).get(`/v1/teams`)
                .set({ Authorization: `Bearer ${adminToken}` })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('data fetched');
                expect(res.body.totalTeams).to.be.eql(2);
                teamId1 = res.body.teams[0].id;
                teamId2 = res.body.teams[1].id;
        });
    });

    describe("POST /fixtures/fixture/create", () => {
        it("should create a fixture", async () => {
            const res = await chai.request(server).post(`/v1/fixtures/fixture/create`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    "homeTeam": teamId1,
                    "awayTeam": teamId2,
                    "date": "2022-05-15T16:00:00Z",
                    "venue": "Old Trafford"
                });
                expect(res.status).to.be.eql(201);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('Fixture created successfully');
        });

        it("should fail because authorization header is not set", async () => {
            const res = await chai.request(server).post(`/v1/fixtures/fixture/create`)
                .send({
                    "homeTeam": teamId1,
                    "awayTeam": teamId2,
                    "date": "2022-05-15T16:00:00Z",
                    "venue": "Old Trafford"
                });
                expect(res.status).to.be.eql(401);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql('unauthenticated, please try logging in again');
        });

        it("should fail because user is not an admin", async () => {
            const res = await chai.request(server).post(`/v1/fixtures/fixture/create`)
                .set({ Authorization: `Bearer ${userToken}` })
                .send({
                    "homeTeam": teamId1,
                    "awayTeam": teamId2,
                    "date": "2022-05-15T16:00:00Z",
                    "venue": "Old Trafford"
                });
                console.log(res.body)
                expect(res.status).to.be.eql(403);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql('You are not authorized to perform this action.');
        });

        it("should fail because fixture exist", async () => {
            const res = await chai.request(server).post(`/v1/fixtures/fixture/create`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    "homeTeam": teamId1,
                    "awayTeam": teamId2,
                    "date": "2022-05-15T16:00:00Z",
                    "venue": "Old Trafford"
                });
                expect(res.status).to.be.eql(400);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql('fixture with the same home ans away team exist, please choose another team');
        });

        it("should fail because payload is incomplete", async () => {
            const res = await chai.request(server).post(`/v1/fixtures/fixture/create`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    "homeTeam": teamId1,
                    "awayTeam": teamId2,
                    "date": "2022-05-15T16:00:00Z",
                });
                expect(res.status).to.be.eql(422);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql(`Venue is required`);
        });
    });

    describe("GET /fixtures", () => {
        it("should return all fixtures", async () => {
            const res = await chai.request(server).get(`/v1/fixtures/fixtures/view`)
                .set({ Authorization: `Bearer ${adminToken}` })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('data fetched');
                expect(res.body.totalFixtures).to.be.eql(1);
                fixturesId = res.body.fixtures[0].id;
        });

        it("should return all pending fixtures", async () => {
            const res = await chai.request(server).get(`/v1/fixtures/fixtures/view?status=pending`)
                .set({ Authorization: `Bearer ${userToken}` })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('data fetched');
        });

        it("should return all completed fixtures", async () => {
            const res = await chai.request(server).get(`/v1/fixtures/fixtures/view?status=completed`)
                .set({ Authorization: `Bearer ${userToken}` })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('data fetched');
        });

        it("should fail because authorization header is not set", async () => {
            const res = await chai.request(server).get(`/v1/fixtures/fixtures/view`)
                expect(res.status).to.be.eql(401);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql('unauthenticated, please try logging in again');
        });

        it("should return all fixtures with userToken", async () => {
            const res = await chai.request(server).get(`/v1/fixtures/fixtures/view`)
                .set({ Authorization: `Bearer ${userToken}` })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('data fetched');
                expect(res.body.totalFixtures).to.be.eql(1);
        });

        it("should return a single fixture by Id", async () => {
            const res = await chai.request(server).get(`/v1/fixtures/fixtures/${fixturesId}`)
                .set({ Authorization: `Bearer ${adminToken}` })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('data fetched');
        });
    });

    describe("GET /fixtures/fixtures/search", () => {
        it("should return teams based on keywords provided", async () => {
            const res = await chai.request(server).get(`/v1/fixtures/fixtures/search?venue=old&team=${teamId1}`)
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('data fetched');
        });
    });

    describe("PUT/DELETE /fixtures/fixtures/:fixtureId", () => {
        it("should edit a fixture", async () => {
            const res = await chai.request(server).put(`/v1/fixtures/fixtures/${fixturesId}`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    "homeTeam": teamId1,
                    "awayTeam": teamId2,
                    "date": "2022-05-15T16:00:00Z",
                    "venue": "Anfield"
                })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('Fixture successfully updated.');
        });

        it("should fail if update payload is invalid", async () => {
            const res = await chai.request(server).put(`/v1/fixtures/fixtures/${fixturesId}`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    "homeTeam": teamId1,
                    "awayTeam": teamId2,
                    "date": "2022-05-15T16:00:00Z",
                    "venue": 555
                })
                expect(res.status).to.be.eql(422);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql(`Venue must be a string`);
        });

        it("should fail if you update with userToken", async () => {
            const res = await chai.request(server).put(`/v1/fixtures/fixtures/${fixturesId}`)
                .set({ Authorization: `Bearer ${userToken}` })
                .send({
                    "homeTeam": teamId1,
                    "awayTeam": teamId2,
                    "date": "2022-05-15T16:00:00Z",
                    "venue": "Anfield"
                })
                expect(res.status).to.be.eql(403);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql('You are not authorized to perform this action.');
        });

        it("should update fixture score for a team", async () => {
            const res = await chai.request(server).put(`/v1/fixtures/${fixturesId}/update-score/${teamId1}`)
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    "score": 3
                })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('Fixture successfully updated.');
        });

        it("should delete a fixture", async () => {
            const res = await chai.request(server).delete(`/v1/fixtures/fixtures/${fixturesId}`)
                .set({ Authorization: `Bearer ${adminToken}` })
                expect(res.status).to.be.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.message).to.eql('Fixture successfully deleted.');
        });
    });
});