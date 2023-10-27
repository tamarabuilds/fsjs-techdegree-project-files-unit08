const db = require('./db')
const { Movie, Person } = db.models;
// Destructure to extract the property Op from db.Sequelize
const { Op } = db.Sequelize;

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
            title: "a",
            runtime: 81,
            releaseDate: "1908-11-22",
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


        // DATA for PERSON
        await Person.create({
            firstName: "mary",
            lastName: "gilmore",
        })

        await Person.create({
            firstName: "Jim",
            lastName: "Beluchi",
        })



        // New Instance using the build method.
        // Build() is a non-persistent model instance
        const movie3 = await Movie.build({
            title: "Toy Story 3",
            runtime: 103,
            releaseDate: '2010-06-18',
            isAvailableOnVHS: false,
        });
        await movie3.save(); // with build()  you need to save(). This will actually save the record.
        console.log(movie3.toJSON());



        // To retreive records by primary key, we use findByPk()
        const movieById = await Movie.findByPk(1);      // pass the primary key, (1) in this case
        console.log(movieById.toJSON());


        // To retreive one specific element, the first one matching, we  use findOne()
        const movieByRuntime = await Movie.findOne({where: {runtime: 123 }});
        console.log(movieByRuntime.toJSON());

        // To retreive all records matching criteria, we use findAll()
        const movies = await Movie.findAll({
            attributes: ['id', 'title'],    // return only id and title,  then added releaseDate and runtime
            where: {
                // releaseDate: {
                //     [Op.gte]: '2004-01-01'  // greater than or equal to (gte) date
                // },
                // runtime: {
                //     [Op.gt]: '30'       // greater than 30 min
                // }
                // isAvailableOnVHS: true,     // can add filter criteria to findAll()
                title: {
                    [Op.endsWith]: '3'
                }
            },
            order: [['id', 'DESC']] // IDs in descending order
        });
        console.log(movies.map(movie => movie.toJSON()));


        // To update, first find record
        const toyStory3 = await Movie.findByPk(6)
        console.log(toyStory3.toJSON());

        // Update with save()
        toyStory3.isAvailableOnVHS = true;
        await toyStory3.save();

        console.log(toyStory3.get({plain: true}));      // calling get({plain:true}) is same as calling.toJSON()
        
        
        
        // UPDATE
        // To update a record with update()
        await toyStory3.update({
            title: 'Trinket Tale 3', // new title
            releaseDate: '2009-01-01'
        },{
            fields: ['isAvailableOnVHS', 'title']      // adding whitelist of fields that can ben updated
        });
        console.log(toyStory3.get({plain: true}));      // calling get({plain:true}) is same as calling.toJSON()




        // DELETE
        // To delete a record, first find it
        const aMovie = await Movie.findByPk(1);
        console.log(aMovie.toJSON());

        // Find and log all movies
        const allMovies = await Movie.findAll({
            attributes: ["id", "title"],
        });
        console.log(allMovies.map(movie => movie.toJSON()));
        
        // call destroy to delete a record
        await aMovie.destroy();
        
        // See all movies again and deleted  one is missing.
        console.log(allMovies.map(movie => movie.toJSON()));

    } catch(error){
        if (error.name === "SequelizeValidationError"){
            const errors = error.errors.map(err => err.message);
            console.log('Validation errors: ', errors);
        } else {
            throw error;
        }
    }
})();