/* globals Event */

import omit from 'lodash/omit'
import set from 'lodash/set'
import { flatten } from 'flatulence'

function eventOrValue (e) {
  if (e instanceof Event) {
    if (e.target.options) {
      const selectedOption = e.target.options[e.target.selectedIndex]

      return selectedOption._value !== undefined ? selectedOption._value : selectedOption.value
    }

    if (e.target.type === 'checkbox') {
      return e.target.checked
    }

    return e.target.value
  }

  return e
}

export default {
  name: 'SimpleForm',
  props: ['validate', 'submitOnBlur', 'value'],
  data () {
    return {
      values: JSON.parse(JSON.stringify(this.value)),
      errors: {},
      touched: {},
      submitted: false,
      submitting: false
    }
  },
  async created () {
    this.errors = await this.validate(this.values)
  },
  provide () {
    return {
      simpleForm: {
        values: this.values,
        setValue: (field, value) => this.setValues({ [field]: value }),
        errors: (field) => this.errors && this.errors[field],
        touched: (field) => this.touched[field],
        setTouched: this.setTouched,
        input: this.handleInput,
        blur: this.handleBlur
      }
    }
  },
  methods: {
    async setValues (values) {
      Object.entries(values).forEach(([key, val]) => {
        set(this.values, key, val)
      })

      this.errors = await this.validate(this.values)
    },
    handleInput (e) {
      this.setValues({ [e.target.name]: eventOrValue(e) })
    },
    handleBlur (e) {
      this.setTouched(e.target.name)
    },
    handleFocus (e) {
      this.untouch(e.target.name)
    },
    setTouched (field) {
      this.touched = { ...this.touched, [field]: true }

      if (this.submitOnBlur) {
        this.handleSubmit()
      }
    },
    untouch (field) {
      this.touched = omit(this.touched, field)
    },
    async handleSubmit () {
      const errors = await this.validate(this.values)

      if (errors && Object.keys(errors).length > 0) {
        this.errors = errors

        this.$emit('submit', { values: null, errors: this.errors })

        return
      }

      this.$emit('submit', {
        values: this.values,
        setSubmitting: () => {
          this.submitting = true
          this.submitted = false
        },
        setSubmitted: () => {
          this.submitting = false
          this.submitted = true
        }
      })
    }
  },
  render (h) {
    const $vnodes = this.$scopedSlots.default({
      input: this.handleInput,
      blur: this.handleBlur,
      focus: this.handleFocus,
      setValue: (field, value) => this.setValues({ [field]: value }),
      setTouched: this.setTouched,
      untouch: this.untouch,
      values: this.values,
      errors: (field) => this.errors && this.errors[field],
      touched: (field) => this.touched[field],
      handleSubmit: () => {
        this.touched = Object.entries(flatten.keepEmpty(this.values))
          .reduce((touched, [key]) => ({ ...touched, [key]: true }), {})

        this.handleSubmit()
      },
      submitted: this.submitted,
      submitting: this.submitting
    })

    if ($vnodes.length === 0) return $vnodes[0]

    return h('div', $vnodes)
  }
}
