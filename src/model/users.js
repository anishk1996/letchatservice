'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-long')(mongoose)

const usersSchema = new Schema({
    name: {
        type: String
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String
    }
}, {
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on'
      }
}, {
  collection: 'users'
})

module.exports = mongoose.model('users', usersSchema)
