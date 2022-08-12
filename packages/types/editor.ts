export interface ImageProps {
  memoryLimit?: number; // 10
  isCompression?: boolean; // true
  resize?: boolean; // false
}

export interface FormatType {
  name: string;
  attributes?: any;
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
  linkOnClick: boolean; // true
  height?: number; // 500
  isScroll?: boolean; // true // 为false时，height将用不可用， height将用于编辑器容器最小高度,输入框高度默认最小500px
  editable?: boolean; // true
  onlyShowText?: boolean; // fasle
  contentClass?: string; // 编辑器容器className
  option?: EditorOptions; // 子组件以及功能模块参数
  imageUploadChange?: ImageUploadChangeType; // 导入图片的回调函数
}

export type ImageUploadChangeType = (file: File) => false | string;
