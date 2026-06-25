import { WebuumElement } from 'webuum'

export class Header extends WebuumElement {
  connectedCallback() {
    this.$controller = new AbortController()
    const { signal } = this.$controller

    window.addEventListener('scroll', this.notTop.bind(this), { signal })
  }

  disconnectedCallback() {
    this.$controller.abort()
  }

  notTop() {
    this.toggleAttribute(
      'data-not-top',
      scrollY > 1 + this.getBoundingClientRect().top,
    )
  }
}
