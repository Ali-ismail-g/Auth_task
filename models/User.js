const Sequelize = require("sequelize");
// const sequelize = require("")
const database = require("../database/database");

module.exports =(sequelize,Sequelize)=> {
    
    const User = sequelize.define(
    'user',
    {
        id:{
            type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        first_name:{
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name:{
            type: Sequelize.STRING,
            allowNull: false
        },
        username:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        email:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password:{
            type: Sequelize.STRING,
            allowNull: false
        },
        city:{
            type: Sequelize.STRING,
            allowNull: false
        },
        DateOfBirth:{
            type: Sequelize.DATEONLY ,
            allowNull: false
        }
    }
)
return User;
}