import injectProps from './injectProps'
import get from 'lodash/get'

export default {
  name: 'SimpleFormFieldSet',
  props: {
    name: {
      required: true,
      type: String
    }
  },
  inject: ['simpleForm'],
  render (h) {
    const { values, errors, setValue, touched, setTouched } = this.simpleForm

    if (this.$slots.default.length !== 1 && !this.$scopedSlots.default) {
      // eslint-disable-next-line
      console.warn('FieldSet requires one element as a child, or a scoped slot')

      return null
    }

    const $props = {
      values: get(values, this.name),
      setValue: (field, value) => setValue(`${this.name}.${field}`, value),
      input: e => setValue(`${this.name}.${e.target.name}`, e.target.value),
      blur: e => setTouched(`${this.name}.${e.target.name}`),
      touched: field => touched(`${this.name}.${field}`),
      setTouched: field => setTouched(`${this.name}.${field}`),
      errors: field => errors(`${this.name}.${field}`)
    }

    if (this.$slots.default.length === 1) {
      const vnode = injectProps(this.$slots.default[0], $props)

      return vnode
    } else {
      const vnodes = this.$scopedSlots.default($props)

      return vnodes.length > 1 ? h('div', vnodes) : vnodes[0]
    }
  }
}
