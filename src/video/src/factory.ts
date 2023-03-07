/* eslint-disable no-undef */
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
    await import(
      'https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js'
    )
    await import(
      'https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js'
    )
    await import(
      'https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js'
    )
    await import(
      'https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js'
    )

    const service = new Service({
      faceLandmarksDetection: window.faceLandmarksDetection,
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

export const worker = await getWorker()

export const camera = await Camera.init()

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
