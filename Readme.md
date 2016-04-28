# cursor-paging

[![Version npm](https://img.shields.io/npm/v/cursor-paging.svg?style=flat-square)](https://www.npmjs.com/package/cursor-paging)[![npm Downloads](https://img.shields.io/npm/dm/cursor-paging.svg?style=flat-square)](https://www.npmjs.com/package/cursor-paging)[![Dependencies](https://img.shields.io/david/tellnes/cursor-paging.svg?style=flat-square)](https://david-dm.org/tellnes/cursor-paging)[![Tips](http://img.shields.io/gratipay/tellnes.png?style=flat-square)](https://gratipay.com/~tellnes/)


`cursor-paging` is a transform stream that can be used to implement cursor based
pagination. It should be added to the pipeline so it can inspect each row and
calculate the cursors needed for the pagination.


## Example Usage

Please look at `example.js`


## Install

```bash
npm install -S cursor-paging
```


## License

MIT
