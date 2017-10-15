const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue')
const replace = require('rollup-plugin-replace')
const meta = require('../package.json')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const config = {
  input: 'src/index.js',
  output: {},
  plugins: [
    vue(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    resolve(),
    commonjs({
      namedExports: {
        'flatulence': ['flatten']
      }
    })
  ],
  name: 'Lib',
  banner: `/*!
 * ${meta.name} v${meta.version}
 * ${meta.homepage}
 *
 * @license
 * Copyright (c) 2017 ${meta.author}
 * Released under the MIT license
 * ${meta.homepage}/blob/master/LICENSE
 */`
}

switch (process.env.BUILD) {
  case 'cjs':
    config.output.format = 'cjs'
    config.output.file = `dist/${meta.name}.cjs.js`
    break
  case 'prod':
    config.output.format = 'umd'
    config.output.file = `dist/${meta.name}.js`
    config.plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    )
    break
  case 'dev':
  default:
    config.output.format = 'umd'
    config.output.file = `dist/${meta.name}.js`
    config.plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    )
}

module.exports = config
