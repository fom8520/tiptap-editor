export interface ImageProps {
  memoryLimit?: number; // 10
  isCompression?: boolean; // true
}

export interface BarProps {
  size?: number; // 22
  color?: string; // #757575
}

export interface EditorOptions {
  image?: ImageProps;
  bar?: BarProps;
}

export interface EditorPorps {
  value: string;
  editable?: boolean; // true
  showImage?: boolean; // true
  option?: EditorOptions;
}
