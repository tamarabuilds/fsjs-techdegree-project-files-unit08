// Require sequelize
const Sequelize = require('sequelize');

// Configure the sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'movies.db',
    logging: false
});

// Created db object containing db instance, main Sequalize object, models from the sequelize.models
const db = {
    sequelize,
    Sequelize,
    models: {},
};

// Require the loading of the Movie model defined in the other file
db.models.Movie = require('./models/movie.js')(sequelize);

// export the DB object with the Sequelize and db configurations and models.
// Exposing the Sequelize package wherever I import models into your code means I'll  have lal of Sequelize's methods and functionality to use.
module.exports = db;