const Sequelize = require("sequelize");
const database = {};
const sequelize = new Sequelize("auth_task_nodejs","phpmyadmin","root",{
    host:"localhost",
    dialect:"mysql",
    operatorAliases: false,
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle:10000
    }
})
database.Sequelize = Sequelize
database.sequelize = sequelize
database.users = require("../models/User")(sequelize,Sequelize);
module.exports = database;
