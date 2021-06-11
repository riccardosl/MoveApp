const express = require('express')
const router = express.Router()
const Item = require('../models/item')
// boxes

// All Route
router.get('/', async (req, res) => {
  let searchOptions = {}
//  if (req.query.name != null && req.query.name !== '') {
    searchOptions = { name: RegExp(req.query.name, 'i')}
//  }
  try {
    const items = await Item.find(searchOptions)
    res.render('items/index', { items: items,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Route
router.get('/new', (req, res) => {
  res.render('items/new', { item: new Item() })
})

// Create Route
router.post('/', async (req, res) => {
  const item = new Item({
    name: req.body.name
  })
  try {
    const newItem = await item.save()
    res.redirect(`items/${newItem.id}`)

  } catch {
    res.render('items/new', {
      item: item,
      errorMessage: 'Error creating...'
    })
  }
})

// SHOW ITEMs PAGE
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
    //const books = await Book.find({ author: author.id }).limit(6).exec()
    res.render('items/show', {
      item: item
      // add box
    })
  } catch (err){

    res.redirect('/')
  }

})

//
router.get('/:id/edit', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
    res.render('items/edit', { item: item })
  } catch {
    res.redirect('/items')
  }


})

// EDIT ROUTE
router.put('/:id', async (req, res) => {
  let item
  try {
    item = await Item.findById(req.params.id)
    item.name = req.body.name
    await item.save()
    res.redirect(`/items/${item.id}`)

  } catch {
    // check if null
    res.render('items/edit', {
      item: item,
      errorMessage: 'Error update...'
    })
  }

})
// DELETE
router.delete('/:id', async (req, res) => {
  let item
  try {
    item = await Item.findById(req.params.id)
    await item.remove()
    res.redirect('/items')

  } catch {
    // check if null
    if (item == null) {
      res.redirect('/')
    } else {
      res.redirect(`/items/${item.id}`)
    }
}
})

module.exports = router
