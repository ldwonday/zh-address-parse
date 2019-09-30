China's delivery address parse
===========
## Test
[Test page](https://ldwonday.github.io/zh-address-parse/)
## Usage
```js
import AddressParse from './lib/address-parse'
const parseResult = AddressParse('your address')

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
