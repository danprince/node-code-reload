import { Worker, isMainThread, workerData, parentPort } from "worker_threads";
import { fileURLToPath } from "url";

export function callWithWorker(src) {
  let file = fileURLToPath(import.meta.url);
  let worker = new Worker(file, { workerData: { src } });
  return new Promise((resolve, reject) => {
    worker.once("error", reject);
    worker.once("message", resolve);
  });
}

if (!isMainThread) {
  import(workerData.src).then(module => {
    let result = module.call();
    parentPort.postMessage(result);
  });
}
