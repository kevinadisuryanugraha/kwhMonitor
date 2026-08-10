export interface MeterData {
  v: number;
  a: number;
  w: number;
  sld: number;
}

export interface DataPoint extends MeterData {
  time: string;
}
