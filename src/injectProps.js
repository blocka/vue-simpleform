export default function injectProps (vnode, props) {
  const options = vnode.componentOptions = vnode.componentOptions || {}
  const propsData = options.propsData = options.propsData || {}

  Object.assign(propsData, props)

  return vnode
}
