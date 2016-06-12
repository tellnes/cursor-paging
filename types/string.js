/* eslint-env es6, node */
'use strict'

const base64url = require('urlsafe-base64')

module.exports = StringCursor

function StringCursor() {
  this.value = null
  this.skip = 0
}

StringCursor.parse = function(value) {
  if (!value) return null

  const cursor = new StringCursor()

  try {
    value = base64url.decode(value)
    cursor.skip = value.readUInt8(0)
    cursor.value = value.toString('utf8', 1)
  } catch (err) {
    return null
  }

  return cursor
}

StringCursor.prototype.update = function(value) {
  if (!value) return

  value = String(value)

  if (this.value === value) {
    this.skip++
  } else {
    this.skip = 0
    this.value = value
  }
}

StringCursor.prototype.toString = function() {
  if (this.value === null) return ''

  const buf = new Buffer(1 + Buffer.byteLength(this.value))

  buf.writeUInt8(this.skip, 0)
  buf.write(this.value, 1)

  return base64url.encode(buf)
}

StringCursor.prototype.toJSON = function() {
  return this.toString()
}
