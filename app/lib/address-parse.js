import provinces from './provinces'
import cities from './cities'
import areas from './areas'
import zhCnNames from './names'

/*const provinceFormat = addressJson.reduce((per, cur) => {
    const { children, ...others } = cur
    return per.concat(others)
}, [])

const cityFormat = addressJson.reduce((per, cur) => {
    return per.concat(cur.children.map(({ children, ...others }) => ({ provinceCode: cur.code, ...others })))
}, [])

const areaFormat = addressJson.reduce((per, cur) => {
    const provinceCode = cur.code
    return per.concat(cur.children.reduce((p, c) => {
        const cityCode = c.code
        return p.concat(c.children.map(({ children, ...others }) => ({ provinceCode, cityCode, ...others })))
    }, []))
}, [])*/

const AddressParse = (address) => {
    if (!address) {
        return {}
    }
    const parseResult = {
        phone: '',
        province: [],
        city: [],
        area: [],
        detail: [],
        name: '',
    }
    address = cleanAddress(address)
    console.log('清洗后address --->', address)

    // 识别手机号
    const filter = filterPhone(address)
    address = filter.address
    parseResult.phone = filter.phone
    console.log('获取手机号的结果 --->', address)

    // 地址分割
    const splitAddress = address.split(' ').filter(item => item).map(item => item.trim())
    console.log('分割地址 --->', splitAddress)

    // 找出姓名
    const nameIndex = splitAddress.findIndex(item => judgeFragmentIsName(item))
    if (nameIndex >= 0) {
        parseResult.name = splitAddress.splice(nameIndex, 1)[0]
    }

    console.log('获取姓名后 --->', splitAddress)

    // 找省市区和详细地址
    splitAddress.forEach((item, index) => {
        // 识别地址
        if (!parseResult.province[0] || !parseResult.city[0] || !parseResult.area[0]) {
            const parse = parseRegion(item, parseResult)
            const { province, city, area, detail } = parse
            parseResult.province = province || []
            parseResult.area = area || []
            parseResult.city = city || []
            parseResult.detail = parseResult.detail.concat(detail || [])
        } else {
            parseResult.detail.push(item)
        }
    })

    // 地址都解析完了，如果还没有姓名，那么姓名应该是在详细地址里面，取详细地址里面长度最小的那个
    if (!parseResult.name) {
        const detail = JSON.parse(JSON.stringify(parseResult.detail))
        detail.sort((a, b) => a.length - b.length)
        parseResult.name = detail[0]
        const nameIndex = parseResult.detail.findIndex(item => item === parseResult.name)
        parseResult.detail.splice(nameIndex, 1)
    }

    const province = parseResult.province[0]
    const city = parseResult.city[0]
    const area = parseResult.area[0]
    const detail = parseResult.detail

    return Object.assign(parseResult,{
        province: (province && province.name) || '',
        city: (city && city.name) || '',
        area: (area && area.name) || '',
        detail: (detail && detail.length > 0 && detail.join('')) || ''
    })
}

const parseRegion = (fragment, hasParseResult) => {
    let province = [], city = [], area = [], detail = []

    if (hasParseResult.province[0]) {
        province = hasParseResult.province
    } else {
        // 从省开始查找
        for (const tempProvince of provinces) {
            const {name} = tempProvince
            let replaceName = ''
            for (let i = name.length; i > 1; i--) {
                const temp = name.substring(0, i)
                if (fragment.indexOf(temp) === 0) {
                    replaceName = temp
                    break
                }
            }
            if (replaceName) {
                province.push(tempProvince)
                fragment = fragment.replace(replaceName, '')
                break
            }
        }
    }

    if (hasParseResult.city[0]) {
        city = hasParseResult.city
    } else {
        // 从市区开始查找
        for (const tempCity of cities) {
            const {name, provinceCode} = tempCity
            const currentProvince = province[0]
            // 有省
            if (currentProvince) {
                if (currentProvince.code === provinceCode) {
                    let replaceName = ''
                    for (let i = name.length; i > 1; i--) {
                        const temp = name.substring(0, i)
                        if (fragment.indexOf(temp) === 0) {
                            replaceName = temp
                            break
                        }
                    }
                    if (replaceName) {
                        city.push(tempCity)
                        fragment = fragment.replace(replaceName, '')
                        break
                    }
                }
            } else {
                // 没有省，市不可能重名
                for (let i = name.length; i > 1; i--) {
                    const replaceName = name.substring(0, i)
                    if (fragment.indexOf(replaceName) === 0) {
                        city.push(tempCity)
                        province.push(provinces.find(item => item.code === provinceCode))
                        fragment = fragment.replace(replaceName, '')
                        break
                    }
                }
                if (city.length > 0) {
                    break
                }
            }
        }
    }

    // 从区市县开始查找
    for (const tempArea of areas) {
        const {name, provinceCode, cityCode} = tempArea
        const currentProvince = province[0]
        const currentCity = city[0]

        // 有省或者市
        if (currentProvince || currentCity) {
            if ((currentProvince && currentProvince.code === provinceCode)
                || (currentCity && currentCity.code) === cityCode) {
                let replaceName = ''
                for (let i = name.length; i > 1; i--) {
                    const temp = name.substring(0, i)
                    if (fragment.indexOf(temp) === 0) {
                        replaceName = temp
                        break
                    }
                }
                if (replaceName) {
                    area.push(tempArea)
                    !currentCity && city.push(cities.find(item => item.code === cityCode))
                    !currentProvince && province.push(provinces.find(item => item.code === provinceCode))
                    fragment = fragment.replace(replaceName, '')
                    break
                }
            }
        } else {
            // 没有省市，区县市有可能重名，这里暂时不处理，因为概率极低，可以根据添加市解决
            for (let i = name.length; i > 1; i--) {
                const replaceName = name.substring(0, i)
                if (fragment.indexOf(replaceName) === 0) {
                    area.push(tempArea)
                    city.push(cities.find(item => item.code === cityCode))
                    province.push(provinces.find(item => item.code === provinceCode))
                    fragment = fragment.replace(replaceName, '')
                    break
                }
            }
            if (area.length > 0) {
                break
            }
        }
    }

    // 解析完省市区如果还存在地址，则默认为详细地址
    if (fragment.length > 0) {
        detail.push(fragment)
    }

    return {
        province,
        city,
        area,
        detail,
    }
}

/**
 * 判断是否是名字
 * @param fragment
 * @returns {string}
 */
const judgeFragmentIsName = (fragment) => {
    if (!fragment) {
        return ''
    }

    // 如果包含下列称呼，则认为是名字，可自行添加
    const nameCall = ['先生', '小姐', '同志', '哥哥', '姐姐', '妹妹', '弟弟', '妈妈', '爸爸', '爷爷', '奶奶', '姑姑', '舅舅']
    if (nameCall.find(item => fragment.indexOf(item) !== -1)) {
        return fragment
    }

    // 如果百家姓里面能找到这个姓，并且长度在1-5之间
    const nameFirst = fragment.substring(0, 1)
    if (fragment.length < 5 && fragment.length > 1 && zhCnNames.indexOf(nameFirst) !== -1) {
        return fragment
    }

    return ''
}

const filterPhone = (address) => {
    let phone = ''
    // 整理电话格式
    address = address.replace(/(\d{3})-(\d{4})-(\d{4})/g, '$1$2$3')
    address = address.replace(/(\d{3}) (\d{4}) (\d{4})/g, '$1$2$3')
    const mobileReg = /(86-[1][0-9]{10})|(86[1][0-9]{10})|([1][0-9]{10})/g
    const mobile = mobileReg.exec(address)
    if (mobile) {
        phone = mobile[0]
        address = address.replace(mobile[0], ' ')
    }
    return {address, phone}
}

const cleanAddress = (address) => {
    // 去换行等
    address = address
        .replace(/\r\n/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\t/g, ' ')

    // 自定义去除关键字，可自行添加
    const search = [
        '详细地址',
        '收货地址',
        '收件地址',
        '地址',
        '所在地区',
        '地区',
        '姓名',
        '收货人',
        '收件人',
        '联系人',
        '收',
        '邮编',
        '联系电话',
        '电话',
        '联系人手机号码',
        '手机号码',
        '手机号',
    ]
    search.forEach(str => {
        address = address.replace(new RegExp(str, 'g'), ' ')
    })

    const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]\.<>/?~！@#￥……&*（）——|{}【】‘；：”“’。，、？]", 'g')
    address = address.replace(pattern, ' ')

    // 多个空格replace为一个
    address = address.replace(/ {2,}/g, ' ')

    return address
}

export default AddressParse
