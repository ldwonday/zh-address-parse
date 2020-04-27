'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/zh-address-parse.min');
} else {
    module.exports = require('./app/lib/address-parse');
}
