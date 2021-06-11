const express = require('express')
const router = express.Router()
const Box = require('../models/box')

router.get('/', async (req, res) => {
  let boxes

  try {
    boxes = await Box.find()

  } catch {
    boxes = []

  }
  res.render('index', {boxes: boxes})
})

module.exports = router
