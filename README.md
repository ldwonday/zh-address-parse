China's delivery address parse
===========
## Test
[Test page](https://ldwonday.github.io/zh-address-parse/)
## Usage
> 语法：AddressParse(address[, [option|0|1]])

> import

```js
import AddressParse from './dist/zh-address-parse.min.js'
// options为可选参数
const options = {
  type: 0,
  textFilter: [],
}
// type参数0表示使用正则解析，1表示采用树查找, textFilter地址预清洗过滤字段。
const parseResult = AddressParse('your address', options)
// The parseResult is an object contain { province: '', name: '', city: '', area: '', detail: '', phone: '', postalCode: '' }
```
> script引入

```html
<script async defer src="./zh-address-parse.min.js"></script>
<script>
    const parse = () => {
        const onTextAreaBlur = (e) => {
            const address = e.target.value
            const parseResult = window.ZhAddressParse(address, { type: 0, textFilter: ['电話', '電話', '聯系人'] })
            // The parseResult is an object contain { province: '', name: '', city: '', area: '', detail: '', phone: '', postalCode: '' }
            console.log(parseResult)
            $('#result').empty();
            $('#result').append(`<ul>${Object.entries(parseResult).map(([k, v]) => `<li>${k}：${v}</li>`).join('')}</ul>`)
        }
        $('#addressContent').bind('input propertychange', onTextAreaBlur)

        $('#addressList li').on('click', (e) => {
            $('#addressContent').val(e.target.innerText)
            $('#addressContent')[0].dispatchEvent(new Event('input'));
        })
    }

    parse()
</script>
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
## Donate
> 您的支持是我前进的动力，更好的支持开源事业！~

<span><img src="./assets/images/wechat.png" width="300" height="300"></span>
<span><img src="./assets/images/alipay.png" width="300" height="300"></span>
