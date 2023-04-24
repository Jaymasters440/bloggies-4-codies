const { Model, DataTypes, STRING } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class blog extends Model {
 
}

blog.init(
  {
   id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
     
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model:"user",
        key: "id",
      }
    },

        textContent: {
      type: DataTypes.STRING,
      allowNull: false,
       
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    creation_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'blog',
  }
);

module.exports = blog;
