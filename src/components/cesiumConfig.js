const viewerConfig = {
  // disable UI
  animation: false,
  timeline: false,
  fullscreenButton: false,
  homeButton: false,
  geocoder: false,
  navigationHelpButton: false,
  sceneModePicker: false,
  baseLayerPicker: false,
  // disable satellite imagery
  imageryProvider: false,
  // disable globe, skybox, atmosphere, fog, shadows
  skyBox: false,
  skyAtmosphere: false,
  globe: false,
  fog: false,
  shadows: false,
  resolutionScale: 0.1,
  requestRenderMode: true,
  maximumRenderTimeChange: Infinity
}

export { viewerConfig }
