const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/boxCovers'

const boxSchema = new mongoose.Schema({
  title: {
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
  boxWeight: {
    type: Number
  },
  coverImage: {
    type: String,
    required: true
  },
  coverImageType: {
    type: String,
    required: true
  },
  source: {
    type: String
  },
  destination: {
    type: String
  },
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  itemPhoto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }

})




boxSchema.virtual('coverImagePath').get(function() {
  if (this.coverImageName != null) {
    return path.join('/', coverImageBasePath, this.coverImageName)
  }
})

module.exports = mongoose.model('Box', boxSchema)
module.exports.coverImageBasePath = coverImageBasePath
