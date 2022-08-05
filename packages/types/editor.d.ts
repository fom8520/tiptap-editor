export interface ImageProps {
    memoryLimit?: number;
    isCompression?: boolean;
    resize?: boolean;
}
export interface BarProps {
    size?: number;
    color?: string;
    class?: string;
}
export interface EditorOptions {
    image?: ImageProps;
    bar?: BarProps;
}
export interface EditorPorps {
    value: string;
    height?: number;
    editable?: boolean;
    onlyShowText?: boolean;
    contentClass?: string;
    option?: EditorOptions;
    imageUploadChange?: ImageUploadChangeType;
}
export declare type ImageUploadChangeType = (file: File) => false | string;
