import { useRef, useState } from 'react'
import { worker, camera } from './video/src/factory'
export default function Home() {
  const [logs, setLogs] = useState<string>('Waiting for service...')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [buttonText, setButtonText] = useState<string>(
    'Initialize Blink Recognition',
  )

  const [leftBlink, setLeftBlink] = useState(0)
  const [rightBlink, setRightBlink] = useState(0)
  const [bothBlink, setBothBlink] = useState(0)

  const videoFrameCanvas = document.createElement('canvas')

  const canvasContext = videoFrameCanvas?.getContext('2d', {
    willReadFrequently: true,
  })

  async function getStarted() {
    const workerSync = await worker
    const cameraSync = await camera

    setLogs('Service is ready!')

    setButtonText('Blink Recognition started!')

    setInterval(async () => {
      await loop(cameraSync?.video, workerSync)
    }, 300)
  }

  function getVideoFrame(video) {
    const canvas = videoFrameCanvas
    const [width, height] = [video.videoWidth, video.videoHeight]
    canvas.width = width
    canvas.height = height

    canvasContext?.drawImage(video, 0, 0, width, height)

    return canvasContext?.getImageData(0, 0, width, height)
  }

  function tooglePlayVideo() {
    if (videoRef?.current?.paused) {
      videoRef.current.play()
      return
    }
    videoRef?.current?.pause()
  }

  async function loop(video, workerSync) {
    const img = getVideoFrame(video)

    const rightBlink = await workerSync.getRightBlink(img)
    const leftBlink = await workerSync.getLeftBlink(img)
    const bothBlink = await workerSync.getBothBlink(img)

    if (bothBlink) {
      tooglePlayVideo()
      setBothBlink((state) => state + 1)
    }

    if (rightBlink) {
      setRightBlink((state) => state + 1)
    }

    if (leftBlink) {
      setLeftBlink((state) => state + 1)
    }
  }

  return (
    <>
      <div
        id="main-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          className="button-container"
        >
          <div>
            <button
              onClick={() => {
                getStarted()
              }}
              ref={buttonRef}
              type="button"
              id="init"
            >
              {buttonText}
            </button>
            <output
              style={{
                marginLeft: 10,
              }}
              id="status"
            >
              {logs}
            </output>
          </div>

          <p>Left Blink = {leftBlink}</p>
          <p>Right Blink = {rightBlink}</p>
          <p>Both Blink = {bothBlink}</p>
        </div>

        <canvas />
        <video
          ref={videoRef}
          id="video"
          src="/assets/video.mp4"
          style={{
            width: '500px',
          }}
        ></video>
      </div>
    </>
  )
}
