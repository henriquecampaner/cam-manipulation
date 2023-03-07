/// <reference lib="webworker" />
import { Service } from './service'
await import('https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js')
await import(
  'https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js'
)
await import(
  'https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js'
)
await import(
  'https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js'
)

const { faceLandmarksDetection, tf } = self
tf.setBackend('webgl')

const service = new Service({ faceLandmarksDetection })

console.log('Loading model')
await service.loadModel()
console.log('TF Model loaded')

export const getBlinked = async (video) => {
  const blinked = await service.handBlinked(video)

  if (!blinked) return
  return blinked
}

export const xd = {
  postMessage(dd) {
    console.log('Post message: ', dd)
  },

  onmessage() {},
}
