const Sequalize = require('sequelize');
const { sequelize } = require('..');

// Expoert the initalized Person model
module.exports = (sequelize) => {
    class Person extends Sequalize.Model {}
    Person.init({
        // Set custom primary key column
        id: {
            type: Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: Sequalize.STRING,
            allowNull: false, // disallow null
            validate: {
                notNull: {
                    msg: "I know it's hard to remember names but you need the first name"
                },
                notEmpty: {
                    msg: "Ha, empty doesn't work. We need a first name here"
                },
            },
        },
        lastName: {
            type: Sequalize.STRING,
            allowNull: false, // disallow null
            validate: {
                notNull: {
                    msg: "I know it's hard to remember names but you need the first name"
                },
            },
        },
    },
    { sequelize}
    );
    
    return Person;
};
