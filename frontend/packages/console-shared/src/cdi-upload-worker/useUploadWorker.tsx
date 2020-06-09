import { wrap, releaseProxy } from 'comlink';
import { useEffect, useState, useMemo } from 'react';

/**
 * Creates a worker, a cleanup function and returns it
 */
const cdiUploadAPI = () => {
  // Here we create our worker and wrap it with comlink so we can interact with it
  const worker = new Worker('./cdi-upload-worker', {
    name: 'cdi-upload-worker',
    type: 'module',
  });
  const workerApi = wrap<import('./cdi-upload-worker').UploadCDIWorker>(worker);

  // A cleanup function that releases the comlink proxy and terminates the worker
  const cleanup = () => {
    workerApi[releaseProxy]();
    worker.terminate();
  };

  const workerApiAndCleanup = { workerApi, cleanup };

  return workerApiAndCleanup;
};

const useCDIUploadWorker = () => {
  // memoise a worker so it can be reused; create one worker up front
  // and then reuse it subsequently; no creating new workers each time
  const workerApiAndCleanup = useMemo(() => cdiUploadAPI(), []);

  useEffect(() => {
    const { cleanup } = workerApiAndCleanup;

    // cleanup our worker when we're done with it
    return () => {
      cleanup();
    };
  }, [workerApiAndCleanup]);

  return workerApiAndCleanup;
};

/**
 * Our hook that performs the calculation on the worker
 */
export const useCDIUpload = (number1: number, number2: number) => {
  // We'll want to expose a wrapping object so we know when a calculation is in progress
  const [data, setData] = useState({
    isCalculating: false,
    total: undefined as number | undefined,
  });

  // acquire our worker
  const { workerApi } = useCDIUploadWorker();

  useEffect(() => {
    // We're starting the calculation here
    setData({ isCalculating: true, total: undefined });

    // eslint-disable-next-line promise/catch-or-return
    workerApi
      .uploadToCDI(number1, number2)
      .then((total) => setData({ isCalculating: false, total })); // We receive the result here
  }, [workerApi, setData, number1, number2]);

  return data;
};
