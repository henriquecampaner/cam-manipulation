/* eslint-disable no-undef */
// @ts-nocheck
import Controller from './controller'
import { Camera } from '../../shared/camera'
import { supportsWorkerType } from '../../shared/util'
import { Service } from './service'

export async function getWorker() {
  if (supportsWorkerType()) {
    console.log('WebWorker supported')

    const worker = new ComlinkWorker<typeof import('./worker')>(
      new URL('./worker', import.meta.url),
    )

    return worker
  } else {
    console.log('WebWorker not supported')

    await import('@tensorflow/tfjs-core')
    await import('@tensorflow/tfjs-converter')
    await import('@tensorflow/tfjs-backend-webgl')
    const faceLandmarksDetection = await import(
      '@tensorflow-models/face-landmarks-detection'
    )

    const service = new Service({
      faceLandmarksDetection,
    })

    const workerMock = {
      async postMessage(video) {
        const blinked = await service.handBlinked(video)
        if (!blinked) return
        workerMock.onmessage({ data: { blinked } })
      },
      onmessage(msg) {},
    }

    setTimeout(() => worker.onmessage({ data: 'READY' }), 500)
    return workerMock
  }
}

export const worker = getWorker()
  .then((ready) => ready)
  .catch((err) => console.log(err))

export const camera = Camera.init()
  .then((ready) => ready)
  .catch((err) => console.log(err))

export const factory = (worker, camera) => {
  return {
    async initialize() {
      return Controller.initialize({
        worker,
        camera,
      })
    },
  }
}
