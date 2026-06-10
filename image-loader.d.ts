declare module "cornerstone-wado-image-loader" {
  const cornerstoneWADOImageLoader: {
    external: {
      cornerstone: unknown;
      dicomParser: unknown;
    };
    wadouri: {
      dataSetCacheManager: unknown;
    };
  };
  export default cornerstoneWADOImageLoader;
}