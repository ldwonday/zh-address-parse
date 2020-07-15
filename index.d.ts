export = zhAddressParse;
declare function zhAddressParse (address: string, option?: zhAddressParse.OptionType): zhAddressParse.ParseResult
declare namespace zhAddressParse{
    export type ParseResult = {
        province: string,
        name: string,
        city: string,
        area: string,
        detail: string,
        phone: string,
        postalCode: string
    }

    export type OptionType = {
        type: 0 | 1,
        textFilter: string[],
        nameMaxLength: number
    }
}
