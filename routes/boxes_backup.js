const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Box = require('../models/box')
const Item = require('../models/item')
const uploadPath = path.join('public', Box.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
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
  console.log('req', req.body)
  const fileName = req.file != null ? req.file.filename : null
  const box = new Box({
    title: req.body.title,
    item: req.body.item,
    addedDate: new Date(req.body.addedDate),
    boxWeight: req.body.boxWeight,
    coverImageBasePath: fileName,
    description: req.body.description
  })

  //savePhoto(box, req.body.cover)
  try {
    const newBox = await box.save()
    res.redirect(`boxes/${newBox.id}`)
  } catch {
    if (book.coverImageName != null) {
      removeBookCover(box.coverImageName)
    }

    renderNewPage(res, box, true)
  }
})

// Show the box
router.get('/:id', async (req, res) => {
  try {
    const box = await Box.findById(req.params.id).populate('item').exec()
    res.render('boxes/show', {box: box})
  } catch {
    res.redirect('/')
  }
})

// EDIT Route BOX
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Box.findById(req.params.id)
    renderEditPage(res, box)
  } catch {
    res.redirect('/')
  }


})



// UPDATE Route BOX
router.put('/:id', async (req, res) => {
  let box

  try {
    box = await Box.findById(req.params.id)
    box.title = req.body.title
    box.item = req.body.item
    box.addedDate = new Date(req.body.addedDate)
    box.description = req.body.description
    if (req.body.cover != null && req.body.cover !=='') {
    //  savePhoto(box, req.body.cover)
        console.log('TO DO')
    }
    await box.save()
    res.redirect(`/boxes/${box.id}`)
  } catch {
    // remove box cover
    if (box != null) {
      renderEditPage(res, box, true)
    } else {
      redirect('/')
    }
    //renderNewPage(res, box, true)
  }

})

// DELETE BOX
router.delete('/:id', async (req, res) => {
  let box
  try {
    box = await Box.findById(req.params.id)
    await box.remove()
    res.redirect('/boxes')
  } catch {
    if (box != null) {
      res.render('/boxes/show', {
        box: box,
        errorMessage: 'Im not able to remove'
      })
    } else {
      res.redirect('/')
    }
  }
})


function removeBookCover(fileName) {
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

async function renderEditPage(res, box, hasError = false) {
  try {
    const items = await Item.find({})
    const params = {
      items: items,
      box: box
    }
    res.render('boxes/edit', params)
  } catch {
    res.redirect('/boxes')
  }

}





module.exports = router
