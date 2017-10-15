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
  render (h) {
    const { errors, touched } = this.simpleForm

    if (errors(this.name) && touched(this.name)) {
      return h(this.tag, errors(this.name))
    }

    return null
  }
}
