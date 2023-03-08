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

export const getBothBlink = async (video) => {
  const blinked = await service.handBlinked(video)

  if (!blinked) return
  return blinked
}

export const getLeftBlink = async (video) => {
  const blinked = await service.handLeftBlinked(video)

  console.log('blinked', blinked)

  if (!blinked) return
  return blinked
}

export const getRightBlink = async (video) => {
  const blinked = await service.handRightBlinked(video)

  console.log('blinked', blinked)

  if (!blinked) return
  return blinked
}
