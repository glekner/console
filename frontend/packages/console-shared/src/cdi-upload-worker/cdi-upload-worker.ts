import { expose } from 'comlink';

export const uploadToCDI = (number1: number, number2: number) => {
  console.log('Start to add...');
  const seconds = 5;
  const start = new Date().getTime();
  const delay = seconds * 1000;
  while (true) {
    if (new Date().getTime() - start > delay) {
      break;
    }
  }
  const total = number1 + number2;
  console.log('Finished adding');
  return total;
};

const exports = {
  uploadToCDI,
};
export type UploadCDIWorker = typeof exports;

expose(exports);
