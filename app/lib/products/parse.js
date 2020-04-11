import products from './productList'
import path from 'path'

const parse = () => {
    const productList = []
    products.forEach(item => {
        const { sku } = item
        const images = sku.images.map(image => image.url)
        const detailImages =
        productList.push({
            productName: sku.name
            bannerImages: images,
        })
    })
}
