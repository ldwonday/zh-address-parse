China's delivery address parse
===========
## Test
[Test page](https://ldwonday.github.io/zh-address-parse/)
## Usage
```js
import AddressParse from './dist/zh-address-parse.min.js'
// 参数0表示使用正则解析，1表示采用树查找
const parseResult = AddressParse('your address', 0)

// The parseResult is an object contain { province: '', name: '', city: '', area: '', detail: '', phone: '' }
```

## Setup
Install dependencies
```sh
$ npm install
```

## Development
Run the local webpack-dev-server with livereload and autocompile on [http://localhost:8080/](http://localhost:8080/)
```sh
$ npm run dev
```
## Deployment
Build the current application
```sh
$ npm run build
```
