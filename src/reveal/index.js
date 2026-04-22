import { dataset } from '@newlogic-digital/utils-js'
import { WebuumElement } from 'webuum'

export class Reveal extends WebuumElement {
  static parts = {
    $item: null,
  }

  static props = {
    $threshold: 0.1,
    $intersectionRatio: 0.2,
    $clear: false,
  }

  intersectionObserver() {
    this.$observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > this.$intersectionRatio && !entry.target.hasAttribute('data-in')) {
          entry.target.setAttribute('data-in', '')

          if (entry.target.dataset.lazyController) {
            dataset(entry.target, 'controller').add(entry.target.dataset.lazyController)
          }
        }
        else if (this.$clear) {
          entry.target.removeAttribute('data-in')
        }
      })
    }, {
      threshold: this.$threshold,
    })
  }

  partConnectedCallback(name, element) {
    if (name !== '$item') return
    if (!this.$observer) this.intersectionObserver()

    this.$observer?.observe(element)
  }

  partDisconnectedCallback(name, element) {
    if (name !== '$item') return

    this.$observer?.unobserve(element)
  }
}
