const { Sequelize, Op } = require("sequelize");
const sequelize = require("../database/db"); // Veritabanı bağlantısı
const Users = require("./Users");

module.exports = {
  sequelize,
  Sequelize,
  Users,
  Op,
};
