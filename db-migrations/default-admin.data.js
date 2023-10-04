const { users: Users } = require("./db");
const bcrypt = require("bcrypt");
require("dotenv").config();

const default_admin_migration = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const generateSalt = () => {
        try {
          return bcrypt.genSalt(10);
        } catch (error) {
          throw error;
        }
      };

      const generateHashPassword = (plainPassword, salt) => {
        try {
          return bcrypt.hash(plainPassword, salt);
        } catch (error) {
          throw error;
        }
      };

      const salt = await generateSalt();
      const hash_password = await generateHashPassword(process.env.DEFAULT_ADMIN_PASSWORD, salt);

      const admin_info = {
        name: "Admin",
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: hash_password,
        role: "ADMIN"
      };

      let admin = await Users.findFirst({ where: { role: "ADMIN" } });
      if (admin) {
        admin = await Users.update({
          where: { id: admin.id },
          data: admin_info
        });
      } else {
        admin = await Users.create({ data: admin_info });
      }

      if (admin) {
        console.log("------------------- Admin migrated successfully !!---------------------");
      } else {
        console.log("---------------- Unable to migrate admin !!---------------------");
      }
    } catch (err) {
      return reject(err);
    }
  });
};

default_admin_migration();
