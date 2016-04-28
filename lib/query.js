/* eslint-env es6, node */
'use strict'

const types = require('./types')

module.exports = Query

const LIMIT_DEFAULT = 100
const LIMIT_MAX = 1000

function Query(options) {
  const query = options.query
  if (query instanceof Query) return query


  // Limit
  this.limit =
    'limit' in query ?
    parseInt(query.limit, 10) :
    options.limitDefault || LIMIT_DEFAULT

  if (this.limit < 0)
    this.limit = 0

  const limitMax = options.limitMax || LIMIT_MAX
  if (this.limit > limitMax)
    this.limit = limitMax


  // After
  this.after = types[options.type].parse(query.after)


  // Before
  if (options.before)
    this.before = types[options.type].parse(query.before)
}

Query.prototype.toJSON = function() {
  return this
}
