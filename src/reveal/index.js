import { dataset } from '@newlogic-digital/utils-js'
import { WebuumElement } from 'webuum'

export class Reveal extends WebuumElement {
  static parts = {
    $item: null,
  }

  intersectionObserver() {
    this.$observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0.1 && !entry.target.hasAttribute('data-in')) {
          entry.target.setAttribute('data-in', '')

          if (entry.target.dataset.lazyController) {
            dataset(entry.target, 'controller').add(entry.target.dataset.lazyController)
          }
        }
      })
    }, {
      threshold: 0.1,
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
