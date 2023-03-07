/* eslint-disable no-unsafe-finally */
/* eslint-disable no-new */
function supportsWorkerType() {
  let supports = false
  const tester: any = {
    get type() {
      supports = true
      return true
    },
  }
  try {
    new Worker('blob://', tester).terminate()
  } finally {
    return supports
  }
}

export { supportsWorkerType }

export function prepareRunChecker({ timerDelay }) {
  let lastEvent = Date.now()
  return {
    shouldRun() {
      const result = Date.now() - lastEvent > timerDelay
      if (result) lastEvent = Date.now()

      return result
    },
  }
}
