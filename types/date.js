/* eslint-env es6, node */
'use strict'

const base64url = require('urlsafe-base64')

module.exports = DateCursor

function DateCursor() {
  this.value = 0
  this.skip = 0
}

DateCursor.parse = function(value) {
  if (!value) return null

  const cursor = new DateCursor()

  try {
    value = base64url.decode(value)

    if (value.length !== 9)
      return null

    cursor.value = new Date(value.readDoubleBE(0))
    cursor.skip = value.readUInt8(8)
  } catch (err) {
    return null
  }

  return cursor
}

DateCursor.prototype.update = function(value) {
  if (!value) return

  if (Number(this.value) === Number(value)) {
    this.skip++
  } else {
    this.skip = 0
    this.value = value
  }
}

DateCursor.prototype.toString = function() {
  if (!this.value) return ''

  const buf = new Buffer(9)

  buf.writeDoubleBE(Number(this.value) || 0, 0)
  buf.writeUInt8(this.skip, 8)

  return base64url.encode(buf)
}

DateCursor.prototype.toJSON = function() {
  return this.toString()
}
