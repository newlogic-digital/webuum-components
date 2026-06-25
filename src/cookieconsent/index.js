import { setCookieConsent, initCookieConsent } from '@newlogic-digital/cookieconsent-js'
import { initializeController } from 'webuum'

export const CookieConsentCommon = Base => class extends Base {
  $cookieConsentItemKey = 'cookieconsent-js'
  $cookieConsentExpireItemKey = 'cookieconsent-js-expire'

  constructor() {
    super()

    initializeController(/** @type HTMLElement */ this)
  }

  getCookieConsentItem() {
    return localStorage.getItem(this.$cookieConsentItemKey)
  }

  getCookieConsentExpireItem() {
    return localStorage.getItem(this.$cookieConsentExpireItemKey)
  }
}

export class CookieConsentDialog extends CookieConsentCommon(HTMLDialogElement) {
  async connectedCallback() {
    initCookieConsent(document, this.getCookieConsentItem() ?? [])

    if (document.querySelector('.x-cookieconsent-form')) {
      return
    }

    if (!this.getCookieConsentItem() || parseInt(this.getCookieConsentExpireItem()) < Date.now()) {
      this.showModal()
    }
    else {
      this.remove()
    }
  }

  close({ source }) {
    super.close()

    if (!source) return

    const type = source.value === 'approve' ? ['performance', 'marketing'] : []

    setCookieConsent(type)
    initCookieConsent(document, type.toString())
  }
}

export class CookieConsentForm extends CookieConsentCommon(HTMLFormElement) {
  connectedCallback() {
    this.$dialog = document.querySelector('.x-cookieconsent-dialog')
    this.$inputs = this.querySelectorAll('input:not([disabled])')
    this.$controller = new AbortController()
    const { signal } = this.$controller

    this.$dialog?.close()

    this.$inputs.forEach((input) => {
      input.checked = false
    })

    JSON.parse(this.getCookieConsentItem())?.forEach((type) => {
      const element = this.querySelector(`input[value="${type}"]`)

      if (element !== null) {
        element.checked = true
      }
    })

    this.addEventListener('submit', (event) => {
      event.preventDefault()

      const type = []

      this.$inputs.forEach((input) => {
        input.checked && type.push(input.value)
      })

      setCookieConsent(type)
      location.reload()
    }, { signal })
  }

  disconnectedCallback() {
    this.$controller.abort()

    if ((!this.getCookieConsentItem() || parseInt(this.getCookieConsentExpireItem()) < Date.now())) {
      this.$dialog?.showModal()
    }
  }
}
