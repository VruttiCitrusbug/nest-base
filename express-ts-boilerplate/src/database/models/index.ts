import sequelize from 'config/database';
import { User } from 'modules/user/user.model';

/**
 * Models Registry
 *
 * This file imports all models and registers them with Sequelize
 * All models must be imported here to be recognized by Sequelize
 */

// Register models with Sequelize
sequelize.addModels([User]);

// Export models for easy access
export { User };

export default sequelize;
