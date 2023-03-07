import { useEffect, useRef, useState } from 'react'
import { worker, camera } from './video/src/factory'

export default function Home() {
  const [logs, setLogs] = useState<string>('Waiting for service...')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [blik, setBlik] = useState(0)

  const videoFrameCanvas = document.createElement('canvas')
  const canvasContext = videoFrameCanvas?.getContext('2d', {
    willReadFrequently: true,
  })

  function getStarted() {
    setInterval(async () => {
      await loop(camera?.video, worker)
    }, 300)
  }

  function log(text: string) {
    setLogs(text)
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

  async function loop(video, worker) {
    const img = getVideoFrame(video)

    const blink = await worker.getBlinked(img)

    if (blink) {
      tooglePlayVideo()
    }

    if (blink) {
      setBlik((state) => state + 1)
    }
  }

  return (
    <>
      <div>
        <div
          style={{
            padding: 20,
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
              {/* Initialize Blink Recognition */}
              how many times i blinked {blik}
            </button>
            <output id="status">{logs}</output>
          </div>
        </div>

        <canvas />
        <video
          ref={videoRef}
          id="video"
          src="/assets/video.mp4"
          controls
        ></video>
      </div>
    </>
  )
}
