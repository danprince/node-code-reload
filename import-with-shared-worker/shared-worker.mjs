import { Worker, isMainThread, parentPort } from "worker_threads";
import { fileURLToPath } from "url";

/**
 * @type {Worker}
 */
let worker;
let requests = {};
let uid = 0;

export function resetSharedWorker() {
  closeSharedWorker();

  let file = fileURLToPath(import.meta.url);
  worker = new Worker(file);
  worker.on("message", ({ id, result, error }) => {
    if (error) {
      requests[id].reject(error);
    } else {
      requests[id].resolve(result);
    }
  });
}

export function callWithSharedWorker(src) {
  return new Promise((resolve, reject) => {
    let id = uid++;
    requests[id] = { resolve, reject };
    worker.postMessage({ id, src });
  });
}

if (isMainThread) {
  resetSharedWorker();
} else {
  parentPort.on("message", async ({ id, src }) => {
    try {
      let module = await import(src);
      let result = module.call();
      parentPort.postMessage({ id, result });
    } catch (error) {
      parentPort.postMessage({ id, error });
    }
  });
}

export function closeSharedWorker() {
  worker?.terminate();
}
