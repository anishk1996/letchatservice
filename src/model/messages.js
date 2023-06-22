'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-long')(mongoose)

const messagesSchema = new Schema({
    name: {
      type: String
    },
    time: {
      type: Date
    },
    msg: {
      type: String
    },
    file: {
      type: String,
    },
    file_type: {
      type: String
    },
    type: {
      type: String
    },
    chat: {
      _id: {
        type: String
      },
      users: {
        type: [{
          _id: {
            type: String
          }
        }]
      }
    },
    sender: {
      _id: {
        type: String
      }
    }
}, {
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on'
      }
}, {
  collection: 'messages'
})

module.exports = mongoose.model('messages', messagesSchema)
