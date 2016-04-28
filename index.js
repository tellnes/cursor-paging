/* eslint-env es6, node */
'use strict'

const Transform = require('stream').Transform
const inherits = require('inherits')
const querystring = require('querystring')
const Query = require('./lib/query')
const types = require('./lib/types')

module.exports = CursorPaging
CursorPaging.Query = Query
CursorPaging.types = types


inherits(CursorPaging, Transform)
function CursorPaging(options) {
  Transform.call(this, { objectMode: true })

  this.query = new Query(options)
  this.counter = 0
  this.base = options.base
  this.field = options.field

  this.after = new types[options.type]()

  if (options.before)
    this.before = new types[options.type]()
}

CursorPaging.prototype._transform = function(row, enc, cb) {
  if (this.before && !this.counter)
    this.before.update(row[this.field])

  this.counter++

  this.after.update(row[this.field])

  cb(null, row)
}

CursorPaging.prototype._flush = function(cb) {
  this.hasMore = this.query.limit <= this.counter
  this.emit('flush')
  cb()
}

CursorPaging.prototype.toJSON = function() {
  const paging =
    { hasMore: this.hasMore
    }

  const params = this.query.toJSON()

  if (this.hasMore) {
    delete params.before
    params.after = paging.after = this.after.toString()
    paging.next = this.base + '?' + querystring.stringify(params)
  } else {
    paging.after = paging.next = null
  }

  if (this.before) {
    if (this.query.after.value) {
      delete params.after
      params.before = paging.before = this.before.toString()
      paging.previous = this.base + '?' + querystring.stringify(params)
    } else {
      paging.before = paging.previous = null
    }
  }

  return paging
}
