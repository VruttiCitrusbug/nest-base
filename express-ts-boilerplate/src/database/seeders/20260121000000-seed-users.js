'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Seed initial users
         * 
         * Creates sample users for development/testing
         * NOTE: In production, remove or modify this seeder
         */
        await queryInterface.bulkInsert('users', [
            {
                id: '550e8400-e29b-41d4-a716-446655440001',
                email: 'john.doe@example.com',
                password: 'password123', // TODO: Hash before using in production
                first_name: 'John',
                last_name: 'Doe',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440002',
                email: 'jane.smith@example.com',
                password: 'password123', // TODO: Hash before using in production
                first_name: 'Jane',
                last_name: 'Smith',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440003',
                email: 'bob.johnson@example.com',
                password: 'password123', // TODO: Hash before using in production
                first_name: 'Bob',
                last_name: 'Johnson',
                is_active: false,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Revert the seeder
         */
        await queryInterface.bulkDelete('users', null, {});
    },
};
