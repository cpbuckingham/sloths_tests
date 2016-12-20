const express = require('express');
const app = express();
const knex = require('./db/knex');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

app.get('/sloths', (req, res) => {
  knex('sloths').select().then(sloths => {
    res.send(sloths);
  });
  // res.send({});
});

app.get('/sloths/:id', (req, res) => {
  knex('sloths').where('id', req.params.id).returning('*').first().then(sloth => { {}
    if (!sloth) {
      res.status(404).send({msg: 'There\'s no sloth with an id of ' + req.params.id });
      return;
    }
    res.send(sloth);
  });
});

app.post('/sloths', (req, res) => {
  knex('sloths').insert(req.body.sloth).returning('*').then(sloth => {
    res.send(sloth);
  }).catch(err => {
    res.status(400).send(err);
  });
});

app.put('/sloths/:id', (req, res) => {
  knex('sloths').where('id', req.params.id).update(req.body.sloth).returning('*').then(sloth => {
    if (Object.keys(sloth).length === 0) {
      // if (!Object.keys(sloth).length) {
      res.status(404).send({msg: 'There\'s no sloth with an id of ' + req.params.id});
      return
    }
    res.send(sloth);
  }).catch(err => {
    res.status(400).send(err);
  });
});

app.delete('/sloths/:id', (req, res) => {
  knex('sloths').where('id', req.params.id).returning('*').del().then(sloth => {
    if (!Object.keys(sloth).length) {
      res.status(404).send({msg: 'There\'s no sloth with an id of ' + req.params.id });
      return;
    }
    res.send(sloth);
  }).catch(err => {
    res.status(400).send(err);
  });
});


// app.get('/sloths/new', (req, res) => {

// });


// app.get('/sloths/:id/edit', (req, res) => {

// });

app.get('*', (req, res) => res.render('404'));

app.listen(3000, () => console.log("Listening on localhost:3000"));

module.exports = app
