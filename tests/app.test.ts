import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import server from '../src/bin/server';

chai.use(chaiHttp);

before(() => {
  server.close();
});

describe('Server', () => {

  it('Should load the base url', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.be.eql(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.eql('welcome');
        done();
      });
  });

  it('Should return 404 - for unregistered route', (done) => {
    chai
      .request(server)
      .get('/invalid-url')
      .end((err, res) => {
        expect(res.status).to.be.eql(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.eql('Sorry, requested URL GET /invalid-url not found!');
        expect(res.body.success).to.eql(false);
        done();
      });
  });
});