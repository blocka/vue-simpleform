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
       return h($vnode.componentOptions.Ctor, {
         ...$vnode.data,
         on: {
           ...($vnode.data.on || {}),
           input: val => setValue(this.name, val),
           blur: () => setTouched(this.name)
         },
         class: {
           ...($vnode.data.class || {}),
           [this.errorClass]: errors(this.name) && touched(this.name)
         },
         props: {
           ...($vnode.data.props || {}),
           value
           }
         }
       , $vnode.children)
      } else {
        const data = merge($vnode.data, {
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

        return h($vnode.tag, data, $vnode.children)

      }
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
