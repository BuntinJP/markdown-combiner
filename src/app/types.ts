export type FileInfo = {
  path: string;
  content: string;
  url?: string;
};

export type CloudImageInfo = {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  result?: any;
};

export type CloudImageInfoWithCalculatedUrl = CloudImageInfo & {
  calculatedUrl: string;
};
