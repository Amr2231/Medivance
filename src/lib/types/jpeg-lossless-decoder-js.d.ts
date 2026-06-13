declare module "jpeg-lossless-decoder-js" {
  export class Decoder {
    decode(buffer: ArrayBuffer): Uint16Array | Uint8Array;
  }
}
