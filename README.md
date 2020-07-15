China's delivery address parse
===========
## New Feature
> 增加自定义解析[国家统计局数据](http://www.mca.gov.cn/article/sj/xzqh/2020/2020/202003301019.html)，数据更新至2020年2月26日，代码：[https://github.com/ldwonday/zh-address-parse/blob/master/app/lib/getMcaGovData.js](https://github.com/ldwonday/zh-address-parse/blob/master/app/lib/getMcaGovData.js)
## Preview
[Test page](https://ldwonday.github.io/zh-address-parse/)
## Syntax
> AddressParse(address[, [option|0|1]])

option可选参数属性列表

|参数名|说明|类型|是否必填|默认值|
|----|----|----|----|----|
|type|解析方式|Number|否|0|
|textFilter|预过滤字段|Array|否|[]|
|nameMaxLength|中文名最大长度|Number|否|4|

## Usage
> npm
```sh
npm i zh-address-parse -s

import AddressParse from 'zh-address-parse'
```
> import

```js
import AddressParse from './dist/zh-address-parse.min.js'
// options为可选参数，不传默认使用正则查找
const options = {
  type: 0, // 哪种方式解析，0：正则，1：树查找
  textFilter: [], // 预清洗的字段
  nameMaxLength: 4, // 查找最大的中文名字长度
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


## Developed with Open Source Licensed [WebStorm](http://www.jetbrains.com/webstorm/)

<a href="http://www.jetbrains.com/webstorm/" target="_blank">
<img src="http://ww1.sinaimg.cn/large/005yyi5Jjw1elpp6svs2eg30k004i3ye.gif" width="240" />
</a>
