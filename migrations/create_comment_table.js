'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('comments', {
            id:{
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            comment:{
                type: Sequelize.STRING,
                allowNull: false
            },
            bulletinId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references:{
                    model: 'bulletins',
                    key: 'id',
                    // This declares when to check the foreign key constraint. PostgreSQL only.
                    deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
                }
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('comments');
    }
};