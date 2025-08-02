import { setCookieConsent, initCookieConsent } from '@newlogic-digital/cookieconsent-js'
import { WebuumElement } from 'webuum'

export class CookieConsentCommon extends WebuumElement {
  cookieConsentItemKey = 'cookieconsent-js'
  cookieConsentExpireItemKey = 'cookieconsent-js-expire'

  getCookieConsentItem() {
    return localStorage.getItem(this.cookieConsentItemKey)
  }

  getCookieConsentExpireItem() {
    return localStorage.getItem(this.cookieConsentExpireItemKey)
  }
}

export class CookieConsentDialog extends CookieConsentCommon {
  async connectedCallback() {
    initCookieConsent(document, this.getCookieConsentItem() ?? [])

    if (document.querySelector('.x-cookieconsent-form')) {
      return
    }

    if (!this.getCookieConsentItem() || parseInt(this.getCookieConsentExpireItem()) < Date.now()) {
      setTimeout(async () => {
        const { showDialog } = await import('winduum/src/components/dialog/index.js')

        await showDialog(this, { closable: false })
      }, 1500)
    }
    else {
      this.remove()
    }
  }

  async approve() {
    await this.hide(['performance', 'marketing'])
  }

  async decline() {
    await this.hide([])
  }

  async hide(type) {
    const { closeDialog } = await import('winduum/src/components/dialog/index.js')

    await setCookieConsent(type)
    initCookieConsent(document, type)
    await closeDialog(this, { remove: true })
  }
}

export class CookieConsentForm extends CookieConsentCommon {
  connectedCallback() {
    document.querySelector('.x-cookieconsent-dialog')?.close()

    this.querySelectorAll('input:not([disabled])').forEach((input) => {
      input.checked = false
    })

    JSON.parse(this.getCookieConsentItem())?.forEach((type) => {
      if (this.querySelector(`input[value="${type}"]`) !== null) {
        this.querySelector(`input[value="${type}"]`).checked = true
      }
    })
  }

  async update() {
    const type = []

    this.querySelectorAll('input:not([disabled])').forEach((input) => {
      input.checked && type.push(input.value)
    })

    await setCookieConsent(type)
    location.reload()
  }

  disconnectedCallback() {
    if ((!this.getCookieConsentItem() || parseInt(this.getCookieConsentExpireItem()) < Date.now())) {
      document.querySelector('.x-cookieconsent-dialog')?.showModal()
    }
  }
}
