import { WebuumElement } from 'webuum'

export class Header extends WebuumElement {
  connectedCallback() {
    window.addEventListener('scroll', this.notTop.bind(this), { signal: this.$signal })
  }

  notTop() {
    this.toggleAttribute(
      'data-not-top',
      scrollY > 1 + this.getBoundingClientRect().top,
    )
  }
}
