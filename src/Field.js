import merge from 'lodash/merge'
import get from 'lodash/get'

export default {
  name: 'SimpleFormField',
  inject: ['simpleForm'],
  props: {
    name: {
      type: String,
      required: true
    },
    errorClass: {
      type: String,
      default: 'error'
    }
  },
  render (h) {
    const { values, errors, touched, input, blur, setValue, setTouched } = this.simpleForm

    const value = get(values, this.name)

    if (this.$slots.default) {
      if (this.$slots.default.length > 1) {
        // eslint-disable-next-line
        console.warn('Only one root element is supported')
      }

      const $vnode = this.$slots.default[0]

      if ($vnode.componentOptions) {
        merge($vnode, {
          componentOptions: {
            listeners: {
              input: val => setValue(this.name, val),
              blur: () => setTouched(this.name)
            },
            propsData: {
              value,
              class: {
                [this.errorClass]: errors(this.name) && touched(this.name)
              }
            }
          }
        })
      } else {
        $vnode.data = merge($vnode.data, {
          domProps: {
            name: this.name,
            value
          },
          on: {
            input: e => setValue(this.name, e.target.value),
            blur: () => setTouched(this.name)
          },
          class: {
            [this.errorClass]: errors(this.name) && touched(this.name)
          }
        })
      }

      return $vnode
    }

    return h('input', {
      domProps: {
        name: this.name,
        value,
        checked: !!value
      },
      class: {
        [this.errorClass]: touched(this.name) && errors(this.name)
      },
      on: {
        input,
        change: input,
        blur
      }
    })
  }
}
