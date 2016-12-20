process.env.NODE_ENV = "test";

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');
const knex = require('../db/knex');


beforeEach(done => {
  Promise.all([
    knex('sloths').insert({id: 1, name: 'Jerry', age: 4, image: 'https://gifts.worldwildlife.org/gift-center/Images/large-species-photo/large-Three-toed-Sloth-photo.jpg'}),
    knex('sloths').insert({id: 2, name: 'Sally', age: 2, image: 'http://www.wildlifeextra.com/resources/listimg/world/Africa/3_toed_sloth@large.jpg'}),
    knex('sloths').insert({id: 3, name: 'Sawyer', age: 1, image: 'http://www.rainforest-alliance.org/sites/default/files/styles/responsive_breakpoints_theme_rainforest_wide_1x/public/slideshow/header/three-toed-sloth.jpg'})
  ]).then(() => done());
});

afterEach(done => { knex('sloths').del().then(() => done()) });

describe('GET /sloths', () => {

  it('responds with JSON', done => {
    request(app)
      .get('/sloths')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('returns an array of all sloth objects when responding with JSON', done => {
    request(app)
      .get('/sloths')
      .end((err, res) => {
        expect(res.body).to.deep.equal([{
          id: 1,
          name: 'Jerry',
          age: 4,
          image: 'https://gifts.worldwildlife.org/gift-center/Images/large-species-photo/large-Three-toed-Sloth-photo.jpg'
        }, {
          id: 2,
          name: 'Sally',
          age: 2,
          image: 'http://www.wildlifeextra.com/resources/listimg/world/Africa/3_toed_sloth@large.jpg'
        }, {
          id: 3,
          name: 'Sawyer',
          age: 1,
          image: 'http://www.rainforest-alliance.org/sites/default/files/styles/responsive_breakpoints_theme_rainforest_wide_1x/public/slideshow/header/three-toed-sloth.jpg'
        }]);
        done();
      });
  });

});

xdescribe('GET /sloths/:id', () => {

  it('responds with JSON', done => {
    request(app)
      .get('/sloths/1')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('returns information on the sloth with the given id', done => {
    request(app)
      .get('/sloths/1')
      .end((err, res) => {
        expect(res.body).to.deep.equal({
          id: 1,
          name: 'Jerry',
          age: 4,
          image: 'https://gifts.worldwildlife.org/gift-center/Images/large-species-photo/large-Three-toed-Sloth-photo.jpg'
        });
        done();
      });
  });

  it('returns a 404 error and custom message if there is no sloth with the given id', done => {
    request(app)
      .get('/sloths/1000000')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.msg).to.equal('There\'s no sloth with an id of 1000000');
        done();
      });
  });
});

describe('POST /sloths', () => {

  var newSloth = {
    sloth: {
      id: 4,
      name: 'Veronica',
      age: 8,
      image: 'http://www.wherecoolthingshappen.com/wp-content/uploads/2016/01/1200.jpg'
    }
  };

  it('responds with JSON', done => {
    request(app)
      .post('/sloths')
      .type('form')
      .send(newSloth)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('adds the new sloth to the database', done => {
    request(app)
      .post('/sloths')
      .type('form')
      .send(newSloth)
      .end((err, res) => {
        knex('sloths').select().then(sloths => {
          expect(sloths).to.have.lengthOf(4);
          expect(sloths).to.deep.include(newSloth.sloth);
          done();
        });
      });
  });

  it('returns the new sloth in the response', done => {
    request(app)
      .post('/sloths')
      .type('form')
      .send(newSloth)
      .end((err, res) => {
        expect(res.body[0].name).to.equal(newSloth.sloth.name);
        expect(res.body[0].age).to.equal(newSloth.sloth.age);
        expect(res.body[0].image).to.equal(newSloth.sloth.image);
        done();
      });
  });

  it('returns an error message with a 400 status code if there\'s an error posting', done => {
    request(app)
      .post('/sloths')
      .type('form')
      .send({ sloth: { age: "I am not a number!!!" } })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.name).to.equal('error');
        done();
      });
  });

});

describe('PUT /sloths/:id', () =>{

  var updatedSloth = {
    sloth: {
      name: 'Homunculus',
      age: 500,
      image: 'http://i878.photobucket.com/albums/ab344/TheScav/FMA%20Characters/sloth.png'
    }
  };

  it('responds with JSON', done => {
    request(app)
      .put('/sloths/1')
      .type('form')
      .send(updatedSloth)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('updates the sloth in the database', done => {
    request(app)
      .put('/sloths/1')
      .type('form')
      .send(updatedSloth)
      .end((err, res) => {
        knex('sloths').where('id', 1).first().then(sloth => {
          expect(sloth.name).to.equal(updatedSloth.sloth.name);
          expect(sloth.age).to.equal(updatedSloth.sloth.age);
          expect(sloth.image).to.equal(updatedSloth.sloth.image);
          done();
        });
      });
  });

  it('returns the updated sloth in the response', done => {
    request(app)
      .put('/sloths/1')
      .type('form')
      .send(updatedSloth)
      .end((err, res) => {
        expect(res.body[0].name).to.equal(updatedSloth.sloth.name);
        expect(res.body[0].age).to.equal(updatedSloth.sloth.age);
        expect(res.body[0].image).to.equal(updatedSloth.sloth.image);
        done();
      });
  });

  it('returns an error message with a 400 status code if there\'s an error updating an existing sloth', done => {
    request(app)
      .put('/sloths/1')
      .type('form')
      .send({ sloth: { age: "I am not a number!!!" } })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.name).to.equal('error');
        done();
      });
  });

  it('returns a 404 error and custom message if there is no sloth with the given id', done => {
    request(app)
      .put('/sloths/1000000')
      .type('form')
      .send(updatedSloth)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.msg).to.equal('There\'s no sloth with an id of 1000000');
        done();
      });
  });

});

describe('DELETE /sloths/:id', () =>{

  it('responds with JSON', done => {
    request(app)
      .delete('/sloths/1')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('removes the sloth in the database', done => {
    request(app)
      .delete('/sloths/1')
      .end((err, res) => {
        knex('sloths').where('id', 1).then(sloths => {
          expect(sloths).to.be.empty;
          done();
        });
      });
  });

  it('returns the deleted sloth in the response', done => {
    request(app)
      .delete('/sloths/1')
      .end((err, res) => {
        expect(res.body[0].name).to.equal('Jerry');
        expect(res.body[0].age).to.equal(4);
        expect(res.body[0].image).to.equal('https://gifts.worldwildlife.org/gift-center/Images/large-species-photo/large-Three-toed-Sloth-photo.jpg');
        done();
      });
  });

  it('returns a 404 error and custom message if there is no sloth with the given id', done => {
    request(app)
      .delete('/sloths/1000000')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.msg).to.equal('There\'s no sloth with an id of 1000000');
        done();
      });
  });

});
