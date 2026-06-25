import { Form as FormElement } from 'winduum-elements/components/form/index.js'
import { importScript } from '@newlogic-digital/utils-js'
import { validateForm } from 'winduum/src/components/form'

export class Form extends FormElement {
  $recaptchaUrl = 'https://www.google.com/recaptcha/enterprise.js?render={apikey}'

  static props = {
    $recaptchaApikey: null,
    $recaptchaAction: null,
  }

  reset(event) {
    super.reset()

    validateForm(event, { validateOptions: { validate: false } })
  }

  connectedCallback() {
    super.connectedCallback()

    if (this.$recaptchaApikey) {
      importScript(this.$recaptchaUrl.replace('{apikey}', this.$recaptchaApikey))

      this.addEventListener('submit', (event) => {
        if (!this.recaptchaExecuted) {
          event.preventDefault()
          this.recaptchaExecute(event)
        }
        else if (!this.hasAttribute('data-naja')) {
          this.submit()
        }
      }, { signal: this.$controller.signal })
    }
  }

  recaptchaExecute(event) {
    if (event?.detail?.recaptchaExecuted) return

    window.grecaptcha.enterprise.ready(async () => {
      this.gtoken.value = await window.grecaptcha.enterprise.execute(this.$recaptchaApikey, { action: this.$recaptchaAction ?? 'form' })
      this.recaptchaExecuted = true
      this.requestSubmit(event.submitter)
    })
  }
}
