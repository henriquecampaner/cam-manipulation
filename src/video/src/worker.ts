/// <reference lib="webworker" />
import { Service } from './service'
import * as tf from '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-converter'
import '@tensorflow/tfjs-backend-webgl'
import * as faceLandmarksPackage from '@tensorflow-models/face-landmarks-detection'

tf.setBackend('webgl')

const service = new Service({ faceLandmarksDetection: faceLandmarksPackage })

console.log('Loading model...')
service
  .loadModel()
  .then(() => {
    console.log('TF Model loaded')
  })
  .catch((err) => console.log(err))

export const getBlinked = async (video) => {
  const blinked = await service.handBlinked(video)

  if (!blinked) return
  return blinked
}
