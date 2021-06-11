const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Box = require('../models/box')
const Item = require('../models/item')
const uploadPath = path.join('public', Box.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})


// All Route BOX
router.get('/', async (req, res) => {
  let query = Box.find()
  if (req.query.title != null ) {
    query = query.regex('title', new RegExp(req.query.title, 'i'))

  }
  try {
    const boxes = await query.exec()
    res.render('boxes/index', {
      boxes: boxes,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})


// New Route BOX
router.get('/new', async (req, res) => {
  renderNewPage(res, new Box())


})

// Create Route BOX 24
router.post('/', upload.single('cover'), async (req, res) => {
  //console.log('req', req.body)
  const fileName = req.file != null ? req.file.filename : null
  const box = new Box({
    title: req.body.title,
    item: req.body.item,
    addedDate: new Date(req.body.addedDate),
    //boxWeight: req.body.boxWeight,
    coverImageName: fileName,
    description: req.body.description
  })

  try {
    const newBox = await box.save()
    //res.redirect(`boxes/${newBox.id}`)
    res.redirect(`boxes`)
  } catch {
    if (box.coverImageName != null) {
      removeBoxCover(box.coverImageName)
    }
    renderNewPage(res, box, true)
  }
})



function removeBoxCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}


async function renderNewPage(res, box, hasError = false) {
  try {
    const items = await Item.find({})
    const params = {
      items: items,
      box: box
    }
    res.render('boxes/new', params)
  } catch {
    res.redirect('/boxes')
  }
}






module.exports = router
