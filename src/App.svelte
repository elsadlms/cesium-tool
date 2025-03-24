<script>
  import CesiumContainer from './components/CesiumContainer.svelte'

  const shatiTilesetUrl = 'https://assets-decodeurs.lemonde.fr/redacweb/2503-gaza-3d-tilesets/shati/tileset.json'
  const jabaliaTilesetUrl = 'https://assets-decodeurs.lemonde.fr/redacweb/2503-gaza-3d-tilesets/jabalia/tileset.json'

  let selectedTilesetUrl = $state(jabaliaTilesetUrl)
  let cameraViewValue = $state(null)
  let cameraViewInput = $state(null)
  let coordsValue = $state(null)
  let coordsInput = $state(null)

  const handleCameraViewInputKeyEvent = (event) => {
    if (event.key === 'Enter') {
      cameraViewValue = ''
      cameraViewValue = event.target.value
    }
  }

  const handleCoordsInputKeyEvent = (event) => {
    if (event.key === 'Enter') {
      coordsValue = ''
      coordsValue = event.target.value
    }
  }

  $effect(() => {
    if (selectedTilesetUrl) {
      cameraViewValue = null
      cameraViewInput.value = ''
      coordsValue = null
      coordsInput.value = ''
    }
  })
</script>

<main>
  <CesiumContainer 
    tilesetUrl={selectedTilesetUrl} 
    zoomToCameraView={cameraViewValue} 
    zoomToCoords={coordsValue} 
  />
  <div class="settings">
    <div class="settings__tileset">
      <select bind:value={selectedTilesetUrl}>
        <option value={jabaliaTilesetUrl}>Jabalia</option>
        <option value={shatiTilesetUrl}>Shati</option>
      </select>
    </div>
    <div class="settings__coords">
      <input 
        bind:this={coordsInput}
        type="text" 
        placeholder="latitude, longitude"
        onkeyup={handleCoordsInputKeyEvent} 
      />
    </div>
    <div class="settings__camera-view">
      <input 
        bind:this={cameraViewInput}
        type="text" 
        placeholder="camera settings"
        onkeyup={handleCameraViewInputKeyEvent} 
      />
    </div>
  </div>
</main>

<style lang="scss">
  .settings {
    // background-color: rgba(0, 0, 0, 1);
    position: absolute;
    top: 12px;
    left: 12px;
  }

  .settings__tileset select {
    font-size: 16px;
    padding: 0.2em 0.4em;
  }

  .settings input {
    font-family: monospace;
    padding: 0.2em 0.4em;
    margin-top: 0.2em;
  }
</style>