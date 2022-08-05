export interface ImageProps {
  memoryLimit?: number; // 10
  isCompression?: boolean; // true
  resize?: boolean; // false
}

export interface BarProps {
  size?: number; // 22
  color?: string; // #757575
  class?: string;
}

export interface EditorOptions {
  image?: ImageProps;
  bar?: BarProps;
}

export interface EditorPorps {
  value: string;
  height?: number; // 500
  editable?: boolean; // true
  onlyShowText?: boolean; // fasle
  contentClass?: string;
  option?: EditorOptions;
  imageUploadChange?: ImageUploadChangeType;
}

export type ImageUploadChangeType = (file: File) => false | string;
