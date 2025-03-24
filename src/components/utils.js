import { Math as CesiumMath } from 'cesium'

const disableCameraControls = (scene) => {
  if (!scene) { return }
  const controller = scene.screenSpaceCameraController
  controller.enableZoom = false
  controller.enableTranslate = false
  controller.enableRotate = false
  controller.enableTilt = false
  controller.enableLook = false
}

const interpolateArray = (array, t) => {
  const n = array.length;
  const i = Math.floor(t * (n - 1));
  const nextI = Math.min(i + 1, n - 1);
  const localT = (t * (n - 1)) - i;
  return CesiumMath.lerp(array[i], array[nextI], localT);
}

const isUsingiOS = () => {
  return navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')
}

const getCameraSettings = (camera) => {
  if (!camera) { return }

  const position = camera.positionCartographic
  const heading = camera.heading
  const pitch = camera.pitch
  const roll = camera.roll

  return {
    longitude: position.longitude,
    latitude: position.latitude,
    height: position.height,
    heading: heading,
    pitch: pitch,
    roll: roll,
  }
}

const logCameraSettings = (camera) => {
  if (!camera) { return }
  console.log(JSON.stringify(getCameraSettings(camera), null, 2))
}

const copyCameraSettings = (camera) => {
  if (!camera) { return }
  logCameraSettings(camera)
  navigator.clipboard.writeText(JSON.stringify(getCameraSettings(camera), null, 2))
  console.log('camera settings copied to clipboard!')
}

const throttle = (fn, ms) => {
  let lastCallTime = 0
  return (...args) => {
    const now = Date.now()
    if (now - lastCallTime >= ms) {
      lastCallTime = now
      fn(...args)
    }
  }
}

export { 
  disableCameraControls,
  interpolateArray,
  isUsingiOS,
  logCameraSettings,
  copyCameraSettings,
  throttle
}