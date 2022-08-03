export interface ImageProps {
  memoryLimit?: number;
  isCompression?: boolean;
}
export interface BarProps {
  size?: number;
  color?: string;
}
export interface EditorOptions {
  image?: ImageProps;
  bar?: BarProps;
}
export interface EditorPorps {
  value: string;
  editable?: boolean;
  showImage?: boolean;
  option?: EditorOptions;
}
