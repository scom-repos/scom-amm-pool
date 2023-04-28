export interface PageBlock {
    // Properties
    getData: () => any;
    setData: (data: any) => Promise<void>;
    getTag: () => any;
    setTag: (tag: any) => Promise<void>
    validate?: () => boolean;
    defaultEdit?: boolean;
    tag?: any;
}