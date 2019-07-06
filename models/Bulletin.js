const Sequelize = require('sequelize');

module.exports = sequelize.define('bulletin',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    content: Sequelize.STRING,
    imageType: Sequelize.STRING,
    imageName: Sequelize.STRING,
    imageData: Sequelize.BLOB
});