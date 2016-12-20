// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'knex_sloths'
    }
  },

  test: {
    client: 'pg',
    connection: {
      database: 'knex_sloths_test'
    },
      pool: {
      min: 1,
      max: 5
    },
    // debug:true
  },

};
