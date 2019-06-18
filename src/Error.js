export default {
  inject: ['simpleForm'],
  props: {
    tag: {
      type: String,
      default: 'span'
    },
    name: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.$watch(() => [this.simpleForm.errors(this.name), this.simpleForm.touched(this.name)], async ([error, touched]) => {
      if (!touched || !error) return

      if (!this.simpleForm.scrolledToFirstError.value) {
        this.simpleForm.scrolledToFirstError.value = true

        await this.$nextTick()

        this.$refs.focuser.focus()
      }
    })
  },
  render (h) {
    const { errors, touched } = this.simpleForm

    if (errors(this.name) && touched(this.name)) {
      return h(this.tag, [errors(this.name),h('input', {
        style: {
          height: 0,
          opacity: 0
        },
        ref: 'focuser'
      })])
    }

    return null
  }
}
