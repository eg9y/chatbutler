'use strict'

const util = require('util')
const contentType = require('content-type')
const fastContentTypeParser = require('..')
const { parseContentType } = require('busboy/lib/utils')
const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()

const str = 'application/json; charset=utf-8'

suite
  .add('util#MIMEType', function () {
    new util.MIMEType(str) // eslint-disable-line no-new
  })
  .add('fast-content-type-parse#parse', function () {
    fastContentTypeParser.parse(str)
  })
  .add('fast-content-type-parse#safeParse', function () {
    fastContentTypeParser.safeParse(str)
  })
  .add('content-type#parse', function () {
    contentType.parse(str)
  })
  .add('busboy#parseContentType', function () {
    parseContentType(str)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()
