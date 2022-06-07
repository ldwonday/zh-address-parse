export = zhAddressParse;
declare function zhAddressParse (address: string, option?: zhAddressParse.OptionType): zhAddressParse.ParseResult
declare namespace zhAddressParse{
    export type ParseResult = {
        province: string;
        name: string;
        city: string;
        area: string;
        detail: string;
        phone: string;
        postalCode: string;
    }

    export type GovData = {
        code: string;
        provinceCode?: string;
        cityCode?: string;
        name: string;
    }

    export type OptionType = {
        type?: 0 | 1;
        textFilter?: string[];
        nameMaxLength?: number;
        extraGovData?: Partial<Record<'province' | 'city' | 'area', GovData[]>>;
    }
}
