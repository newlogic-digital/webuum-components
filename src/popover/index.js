import { Popover as PopoverController } from 'winduum-elements/components/popover/index.js'
import { animationsFinished } from 'winduum/src/common.js'

export class Popover extends PopoverController {
  static parts = {
    $autocomplete: null,
    $content: null,
  }

  $minAutocompleteLength = 2

  async autocomplete({ currentTarget }) {
    if (currentTarget.value.length < this.$minAutocompleteLength) {
      currentTarget.ariaExpanded = 'false'
      await animationsFinished(this.$content)
      this.$content.replaceChildren()
    }
    else {
      currentTarget.ariaExpanded = 'true'
    }
  }

  selectDescendant({ currentTarget }) {
    this.$autocomplete.setAttribute('aria-activedescendant', currentTarget.id)
    this.$autocomplete.value = currentTarget.textContent.trim()
    currentTarget.blur()
  }
}
