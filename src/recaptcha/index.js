import { importScript } from '@newlogic-digital/utils-js'
import { WebuumElement } from 'webuum'

export class ReCaptcha extends WebuumElement {
  static values = {
    $api: null,
    $action: null,
    $url: 'https://www.google.com/recaptcha/enterprise.js?render={apikey}',
  }

  connect() {
    importScript(this.$url.replace('{apikey}', this.$api))
  }

  execute(event) {
    if (event?.detail?.recaptchaExecuted) return

    window.grecaptcha.enterprise.ready(async () => {
      this.element.gtoken.value = await window.grecaptcha.enterprise.execute(this.$api, { action: this.$action ?? 'form' })
      this.element.dispatchEvent(new CustomEvent('submit', { cancelable: true, detail: { recaptchaExecuted: true } }))
    })
  }
}
