require('dotenv').config();

module.exports = {
  name: 'default',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'qeraty',
  synchronize: true,
  dropSchema: false,
  logging: true,
  entities: ['src/**/*.entity.ts', 'dist/**/*.entity.js'],
};