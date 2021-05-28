const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  fragile: {
    type: Boolean
  },
  addedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  itemWeight: {
    type: Number
  },
  itemPhoto: {
    type: String
  }

})
module.exports = mongoose.model('Item', itemSchema)
