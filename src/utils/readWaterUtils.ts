import { PdaReadDataDto } from '../../apiclient/src/models';

export const normalCalc = (data: PdaReadDataDto) => {
  return data.reading - data.lastReading + data.replaceWater;
};

export const overCircleCalc = (data: PdaReadDataDto) => {
  return data.rangeValue - data.lastReading + data.reading + data.replaceWater;
};

export const reverseCalc = (data: PdaReadDataDto) => {
  return data.lastReading - data.reading + data.replaceWater;
};

export const noWatterCalc = (_data: PdaReadDataDto) => {
  return 0;
};

export const roundCalc = (data: PdaReadDataDto) => {
  return data.reading - data.lastReading + data.replaceWater;
};

export const calcReadWater = (data: PdaReadDataDto) => {
  return normalCalc(data);
};

export const judgeReadWater = (value: number, data: PdaReadDataDto) => {
  if (value > data.highWater) {
    return '水量偏高，是否重新抄表？';
  }
  if (value < data.lowWater) {
    return '水量偏低，是否重新抄表？';
  }
  return null;
};