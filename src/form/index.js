import { Form as FormComponent } from 'winduum-elements/components/form/index.js'
import { importScript } from '@newlogic-digital/utils-js'

export class Form extends FormComponent {
  $recaptchaUrl = 'https://www.google.com/recaptcha/enterprise.js?render={apikey}'

  static props = {
    $recaptchaApikey: null,
    $recaptchaAction: null,
  }

  connectedCallback() {
    super.connectedCallback()

    if (this.$recaptchaApikey) {
      importScript(this.$recaptchaUrl.replace('{apikey}', this.$recaptchaApikey))

      this.addEventListener('submit', (event) => {
        event.preventDefault()
        this.recaptchaExecute(event)
      }, { signal: this.$controller.signal })
    }
  }

  recaptchaExecute(event) {
    if (event?.detail?.recaptchaExecuted) return

    window.grecaptcha.enterprise.ready(async () => {
      this.element.gtoken.value = await window.grecaptcha.enterprise.execute(this.$recaptchaApikey, { action: this.$recaptchaAction ?? 'form' })
      this.element.dispatchEvent(new CustomEvent('submit', { cancelable: true, detail: { recaptchaExecuted: true } }))
    })
  }
}
