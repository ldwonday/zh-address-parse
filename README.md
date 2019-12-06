China's delivery address parse
===========
## Test
[Test page](https://ldwonday.github.io/zh-address-parse/)
## Usage
> import

```js
import AddressParse from './dist/zh-address-parse.min.js'
// 参数0表示使用正则解析，1表示采用树查找
const parseResult = AddressParse('your address', 0)
// The parseResult is an object contain { province: '', name: '', city: '', area: '', detail: '', phone: '', postalCode: '' }
```
> script引入

```html
<script async defer src="./zh-address-parse.min.js"></script>
<script>
    const parse = () => {
        const onTextAreaBlur = (e) => {
            const address = e.target.value
            const parseResult = window.ZhAddressParse(address, 0)
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
## donate
> 您的支持是我前进的动力，更好的支持开源事业！~
<p align="left">
	<img src="https://github.com/ldwonday/zh-address-parse/blob/master/assets/images/wechat.jpeg" alt="微信打赏" style="display: inline-block; margin-right: 16px;" width="300" height="400">
	<img src="https://github.com/ldwonday/zh-address-parse/blob/master/assets/images/alipay.jpeg" alt="支付宝打赏" style="display: inline-block" width="300" height="400">
</p>
