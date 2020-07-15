import cheerio from 'cheerio'
import http from 'http'
import path from 'path'

const fs = require('fs');

const Province = () => ({
    code: '',
    name: '',
    children: []
})

const Area = () => ({
    code: '',
    name: '',
})

const City = () => ({
    code: '',
    name: '',
    children: []
})

class GetMcaGovData {
    sourceUrl = ''
    headerClass = ''
    cityClass = ''
    constructor(sourceUrl, headerClass, cityClass) {
        this.sourceUrl = sourceUrl
        this.headerClass = headerClass
        this.cityClass = cityClass
    }

    loadData = () => {
        if (!this.sourceUrl) {
            throw new Error('not set the url of parser !')
        }
        if (!this.headerClass || !this.cityClass) {
            throw new Error('not set the city or header class of header !')
        }
        try {
            http.get(this.sourceUrl, (res) => {
                // 设置编码
                res.setEncoding('utf8');
                // 当接收到数据时，会触发 'data' 事件的执行
                let html = "";
                res.on('data', (data) => {
                    html += data;
                });
                // 数据接收完毕，会触发 'end' 事件的执行
                res.on('end', () => {
                    const $ = cheerio.load(html);

                    // 去除里面的空格和空值
                    let elementsArea = $('.' + this.cityClass)
                    // 注意这里的filter用的是cheerio的filter不是es6的
                    elementsArea = elementsArea.filter((index, item) => $(item).text().trim())

                    let elementsProAndCity = $('.' + this.headerClass)
                    elementsProAndCity = elementsProAndCity.filter((index, item) => $(item).text().trim())

                    console.log('省市总计数量：' + elementsProAndCity.length / 2)
                    console.log('区总计数量：' + elementsArea.length / 2)
                    let total = (elementsArea.length + elementsProAndCity.length) / 2
                    console.log('省市区总计数量：' + total)

                    const listProvince = []
                    for(let i = 0; i <= elementsProAndCity.length; i += 2) {
                        const codeOrName = $(elementsProAndCity[i]).text().trim()
                        const next = $(elementsProAndCity[i + 1]).text().trim()
                        if (/\d/.test(codeOrName)) {
                            // 省份
                            if (codeOrName.endsWith('0000')) {
                                const province = new Province()
                                province.name = next
                                province.code = codeOrName
                                province.children = province.children || []
                                listProvince.push(province)
                            } else { // 市
                                const city = new City()
                                city.name = next
                                city.code = codeOrName
                                city.children = city.children || []

                                // 省份前缀
                                const prefixProvinceCode = codeOrName.substring(0, 2)
                                // 市区前缀
                                const prefixCityCode = codeOrName.substring(2, 4)
                                const provinceRegexp = new RegExp(`^${prefixProvinceCode}`)
                                // 市前缀匹配，加入到省份里面
                                const province = listProvince.find(item => {
                                    return provinceRegexp.test(item.code)
                                })
                                province && province.children.push(city)
                            }
                        }
                    }

                    // 处理区和县
                    listProvince.forEach(item => {
                        // 省份前缀
                        const prefixProvinceCode = item.code.substring(0, 2)
                        const cityList = item.children

                        // 对于区，一个个处理，处理一个删除一个
                        do {
                            let codeOrName = $(elementsArea[0]).text().trim()
                            let next = $(elementsArea[1]).text().trim()

                            // 匹配省份
                            let regExp = new RegExp(`^${prefixProvinceCode}`)
                            if (/\d/.test(codeOrName)) {
                                if (regExp.test(codeOrName)) {
                                    const area = new Area()
                                    area.code = codeOrName
                                    area.name = next

                                    // 取区中间两位市的代号
                                    const prefixCityCode = codeOrName.substring(2, 4)
                                    regExp = new RegExp(`^${prefixProvinceCode}${prefixCityCode}`)

                                    // 找出市，找到就加入到市里的下面的区
                                    const currentCity = cityList.find(cityItem => regExp.test(cityItem.code) && cityItem.code.endsWith('00'))
                                    if (cityList.length && currentCity) {
                                        currentCity.children.push(area)
                                    } else {
                                        // 解析直辖市下面的区和县
                                        if (cityList.length === 0) {
                                            const city = new City()
                                            city.name = item.name
                                            city.code = item.code
                                            city.children.push(area)
                                            cityList.push(city)
                                        } else {
                                            cityList[0].children.push(area)
                                        }
                                    }
                                    elementsArea.splice(0, 2)
                                } else {
                                    break
                                }
                            }
                        } while (elementsArea.length > 0)
                    })

                    let i = 0
                    listProvince.forEach(p => {
                        i++
                        p.children.forEach(c => {
                            i++
                            c.children && c.children.forEach(a => {
                                i++
                            })
                        })
                    })

                    // 多了4个直辖市
                    const parseTotal = i - 4
                    console.log('解析完成总计数量：' + parseTotal, total)
                    console.log('解析数量是否相等：' + (parseTotal === total ? '相等' : '不相等'))

                    if (parseTotal === total) {
                        fs.writeFile(path.join(__dirname, 'provinceList.json'), JSON.stringify(listProvince), function(err) {
                            if (err)
                                return;
                            console.log('导出成功')
                        });
                    } else {
                        throw new Error('解析前后数量不相等，解析失败！')
                    }
                })
            });
        } catch (e) {
            throw new Error('parse with error !')
        }
    }
}

// headerClass和cityClass在统计局的官网查看css的class
const data = new GetMcaGovData('http://www.mca.gov.cn/article/sj/xzqh/2020/2020/202003301019.html', 'xl7030721', 'xl7130721')
data.loadData()
