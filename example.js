'use strict'

const JSONListStream = require('json-list-stream')
const CursorPaging = require('cursor-paging')
const mongo = require('./mongo')
const app = require('./app')

app.get('/resource', function(req, res) {
  const $and = [ ]


  $and.push({ type: 'resource' })


  const pagingOptions =
    { type: 'date'
    , field: 'modified'
    , base: 'https://api.example.com/resource'
    , query: req.query
    , before: false
    }
  const paging = new CursorPaging(pagingOptions)


  const listres = new JSONListStream()
  listres.set('query', paging.query)
  paging.on('flush', () => listres.set('paging', paging))


  const cursor = mongo.db.collection('resource').find({ $and })
  cursor.limit(paging.query.limit)
  cursor.sort({ modified: -1 })

  if (paging.query.after) {
    $and.push({ modified: { $lte: paging.query.after.value } })
    cursor.skip(paging.query.after.skip + 1)
  }


  const pipeline =
    [ cursor.stream()
    , paging
    , listres
    , res
    ]

  pipeline.reduce((src, dest) => src.pipe(dest))
})
