<script>
  import { onMount } from 'svelte'
  
  import { 
    Cartesian3, 
    Cesium3DTileset,
    Color, 
    EllipsoidTerrainProvider, 
    HeadingPitchRoll,
    LinearSpline, 
    Math as CesiumMath, 
    Quaternion,
    QuaternionSpline,
    ShadowMode,
    Viewer,
    viewerCesiumInspectorMixin,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    defined
  } from 'cesium'
  
  import { 
    isUsingiOS,
    disableCameraControls, 
    logCameraSettings,   
    copyCameraSettings,
    throttle 
  } from './utils'

  import { viewerConfig } from './cesiumConfig'

  let { tilesetUrl, zoomToCameraView, zoomToCoords } = $props()

  $effect(() => {
    loadTileset(tilesetUrl)
  })

  $effect(() => {
    handleZoomToCoords(zoomToCoords)
  })

  $effect(() => {
    handleZoomToCameraView(zoomToCameraView)
  })



  let viewer = $state(null)
  let viewerContainer = $state(null)

  const destroyViewer = () => {
    if (!viewer) { return }
    viewer.destroy()
    viewer = null
  }

  const handleZoomToCameraView = (settings) => {
    if (!viewer || !viewer.camera) { return }

    const parsedSettings = JSON.parse(settings)
    const { longitude, latitude, height, heading, pitch, roll } = parsedSettings

    viewer.camera.flyTo({
      destination: Cartesian3.fromRadians(longitude, latitude, height),
      orientation: { 
        heading: heading, 
        pitch: pitch, 
        roll: roll
      },
      duration: 0,
    })  
  }

  const handleZoomToCoords = (latLong) => {
    if (!viewer || !viewer.camera) { return }
    if (!latLong) { return; }

    console.log('handleZoomToCoords')
    console.log(latLong)

    const [latitude, longitude] = latLong.trim().split(',').map(Number)

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(longitude, latitude, 100),
      orientation: { 
        heading: 6, 
        pitch: -1.5, 
        roll: 0
      },
      duration: 0,
    })  
  }

  const viewerFlyTo = (latLong, {duration = 0} = {}) => {
    if (!viewer || !viewer.camera) { return }

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(latLong[1], latLong[0], 100),
      orientation: { 
        heading: 6, 
        pitch: -1.5, 
        roll: 0
      },
      duration: duration,
    })
  }

  const initViewer = async () => {
    viewer = new Viewer(viewerContainer, viewerConfig)

    const backgroundColor = new Color(0, 0, 0, 1)
    viewer.scene.backgroundColor = backgroundColor

    viewer.camera.moveEnd.addEventListener(() => {
      logCameraSettings(viewer.camera)
    })

    loadTileset(tilesetUrl)
  }

  const loadTileset = async (url) => {
    viewer.scene.primitives.removeAll()

    const tileset = await Cesium3DTileset.fromUrl(url, {
      maximumScreenSpaceError: isUsingiOS() ? 10 : 16,
      dynamicScreenSpaceError: true,
      cullRequestsWhileMoving: false,
      skipLevelOfDetail: true,
      preloadAncestors: true,
      preloadWhenHidden: true,
      preloadSiblings: true,
      shadows: ShadowMode.DISABLED,
      foveatedScreenSpaceError: true,          
      foveatedConeSize: 0.1,                 
      foveatedMinimumScreenSpaceErrorRelaxation: 0.0, 
    })

    viewer.scene.primitives.add(tileset)
    viewer.zoomTo(tileset)

    // viewerFlyTo([31.5334, 34.4997])
  }

  const viewerOnClick = () => {
    copyCameraSettings(viewer.camera)
    cameraSettingsCopiedClassList = ['camera-settings-copied', 'camera-settings-copied_visible']

    setTimeout(() => {
      cameraSettingsCopiedClassList = ['camera-settings-copied', 'camera-settings-copied_hidden']
    }, 1000)
  }

  onMount(() => {
    initViewer()

    return () => {
      destroyViewer()
    }
  })

  let cameraSettingsCopiedClassList = $state([
    'camera-settings-copied',
    'camera-settings-copied_hidden',
  ])
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div>
  <div bind:this={viewerContainer} onclick={viewerOnClick} style="width: 100vw; height: 100vh;"></div>
  <p class={cameraSettingsCopiedClassList.join(' ')}>
    Les paramètres de la caméra ont été copiés !
  </p>
</div>

<style lang="scss">
  .camera-settings-copied {
    position: absolute;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    color: #188455;
    background: #d0e3db;
    border-radius: 4px;
    padding: 8px 12px;
    font-weight: 500;
    transition: opacity 400ms ease-out, top 400ms ease-out;
  }

  .camera-settings-copied.camera-settings-copied_hidden {
    opacity: 0;
    top: -12px;
  }
</style>
