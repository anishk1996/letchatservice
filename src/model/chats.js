'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-long')(mongoose)

const chatsSchema = new Schema({
    user_ids: {
      type: [String]
    },
    chat_type: {
      type: String
    }
}, {
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on'
    }
}, {
  collection: 'chats'
})


module.exports = mongoose.model('chats', chatsSchema);
