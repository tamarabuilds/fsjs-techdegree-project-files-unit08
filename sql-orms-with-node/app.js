const db = require('./db')
const { Movie } = db.models;
// const Sequelize = require('sequelize');

// // Moved to db/index.js
// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: 'movies.db',
//     // disable logging of SQL to the console
//     logging: false 
// });

// // Moved to movies.js
// // Movie model
// class Movie extends Sequelize.Model {}
// // This code initializes a model representing a 'Movies' table in the database with one column: 'title'
// Movie.init({
//     title: Sequelize.STRING
// // the sequelize property below is required and defines the sequelize instance to attach to the model
// },{ sequelize });


// async IIFE
(async () => {
    // sync all tables. At app start, this drops any tables that exist and then recreates it from the model definition
    await db.sequelize.sync({ force: true });
    
    try {
        // TESTING the DB connection
        // await sequelize.authenticate();
        // console.log('Connection to the database successful!');

        // Instance of the Movie class represents a database row
        const movie = await Movie.create({
            // passing an object with a title property
            title: "",
            runtime: 81,
            releaseDate: "1708-11-22",
            isAvailableOnVHS: true,
        });
        // converting the instance to JSON
        console.log(movie.toJSON());
        
        // New entry
        const movie2 = await Movie.create({
            title: "Barbie",
            runtime: 123,
            releaseDate: '2023-09-01',
            isAvailableOnVHS: false,
        });
        console.log(movie2.toJSON());

        // Another way to add an entry without declaring a variable
        await Movie.create({
            title: "Who rules the world?",
            runtime: 1,
            releaseDate: '1981-09-09',
            isAvailableOnVHS: true,
        })

        // A third way of creating multiple records with a Promose.all(), which waits until all promises returned by the model .create() method are fulfilled
        const movieInstances = await Promise.all([
            Movie.create({
                title: "Happy Gilmore",
                runtime: 93,
                releaseDate: '2003-04-12',
                isAvailableOnVHS: true,
            }),
            Movie.create({
                title: "Kung Fu Panda",
                runtime: 111,
                releaseDate: '2010-11-22',
                isAvailableOnVHS: true,
            })
        ]);
        const moviesJSON = movieInstances.map(movie => movie.toJSON());
        console.log(moviesJSON);


    } catch(error){
        if (error.name === "SequelizeValidationError"){
            const errors = error.errors.map(err => err.message);
            console.log('Validation errors: ', errors);
        } else {
            throw error;
        }
    }
})();