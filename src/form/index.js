import { importScript } from '@newlogic-digital/utils-js'
import { validateForm } from 'winduum/src/components/form'
import { WebuumLazyElement } from 'webuum/elements'

export class Form extends WebuumLazyElement(HTMLFormElement) {
  $recaptchaUrl = 'https://www.google.com/recaptcha/enterprise.js?render={apikey}'

  /**
   * @type {import('winduum/src/components/form/index.d.ts').ValidateFormOptions}
   */
  $validateFormOptions

  static props = {
    $recaptchaApikey: null,
    $recaptchaAction: null,
    $lazy: true,
  }

  reset(event) {
    super.reset()

    validateForm(event, this.$validateFormOptions)
  }

  lazyCallback() {
    this.noValidate = true
    this.addEventListener('submit', this.validateForm, { signal: this.$signal })

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
      }, { signal: this.$signal })
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

  validateForm(event) {
    validateForm(event, this.$validateFormOptions)
  }
}
