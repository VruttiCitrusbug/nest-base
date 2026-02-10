'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Create users table
         * 
         * This migration creates the users table with all necessary columns
         * Matches the User model structure
         */
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        // Add index on email for faster lookups
        await queryInterface.addIndex('users', ['email']);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Revert the migration
         */
        await queryInterface.dropTable('users');
    },
};
