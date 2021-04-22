declare module "@talabes/throng" {

  export interface Options {
    worker: () => Promise<void> | void,
    master?: () => Promise<void> | void,
    count?: number,
    delay?: number,
    lifetime?: number,
    grace?: number,
    signals?: array<string>
  }
  
  function throng(options: Options): Promise<void>

  export default throng

}