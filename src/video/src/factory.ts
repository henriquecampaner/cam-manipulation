/* eslint-disable no-undef */
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

    const tf = await import('@tensorflow/tfjs-core')
    await import('@tensorflow/tfjs-converter')
    await import('@tensorflow/tfjs-backend-webgl')
    const faceLandmarksDetection = await import(
      '@tensorflow-models/face-landmarks-detection'
    )

    tf.setBackend('webgl')

    const service = new Service({
      faceLandmarksDetection,
    })

    console.log('Loading model...')
    service
      .loadModel()
      .then(() => {
        console.log('TF Model loaded')
      })
      .catch((err) => console.log(err))

    const getBlinked = async (video) => {
      const blinked = await service.handBlinked(video)

      if (!blinked) return
      return blinked
    }

    const blockingFunc = () => {
      new Array(100_000_000)
        .map((elm, index) => elm + index)
        .reduce((acc, cur) => acc + cur, 0)

      console.log('Blocking func called')
    }

    return {
      blockingFunc,
      getBlinked,
    }
  }
}

export const worker = getWorker()
  .then((ready) => ready)
  .catch((err) => console.log(err))

export const camera = Camera.init()
  .then((ready) => ready)
  .catch((err) => console.log(err))
