import { WebuumElement } from 'webuum'
import { getId } from '@newlogic-digital/utils-js'

export class GoogleMaps extends WebuumElement {
  static parts = {
    $map: null,
  }

  static values = {
    $options: {},
    $key: null,
  }

  markerContent = `<svg class="size-16 text-accent"><use href="#heroicons-solid/map-pin"></use></svg>`

  async connectedCallback() {
    const { setOptions, importLibrary } = await import('@googlemaps/js-api-loader')

    setOptions({
      key: this.$key,
    })

    const { Map } = await importLibrary('maps')

    this.map = new Map(this.$map, {
      zoom: 13,
      mapId: getId(),
      mapTypeControl: false,
      streetViewControl: false,
      ...this.$options,
    })
  }

  async renderMarker() {
    if (this.$options.center?.lat == null || this.$options.center?.lng == null) {
      return
    }

    const { importLibrary } = await import('@googlemaps/js-api-loader')
    const { AdvancedMarkerElement } = await importLibrary('marker')
    const content = new DOMParser().parseFromString(this.markerContent, 'text/html').body.firstChild

    this.marker = new AdvancedMarkerElement({
      map: this.map,
      position: this.$options.center,
      content,
    })
  }
}
