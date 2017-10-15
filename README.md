# vue-simpleform

A form library for vue, inspired by Formik for react
## Is it really simple?

I think it is, but really I couldn't think of a better name

## Basic Usage

```html
<template>
<SimpleForm :value="initialValues" :validate="validate" @submit="handleSubmit">
    <template scope="{values, errors, touched, input, blur, setValue, setTouched, handleSubmit, submitted, submitting}">
    <form>
        <input type="email" v-on="{input, blur}" name="email" :value="values.email" />
        <span class="error" v-if="touched('email') && errors('email')">{{errors('email')}}</span>
        
        <button @click.prevent="handleSubmit">Submit</button>
    </form>
    </template>
</SimpleForm>
</template>
<script>
    import SimpleForm from 'vue-simpleform'
    
    export default {
        data () {
            return {
                initialValues: {
                    email: null
                }
            }
        },
        methods: {
            handleSubmit ({ values, errors, setSubmitting, setSubmitted }) {
                // if form is valid, errors will be undefined
            },
            validate (values) {
                return {
                    email: 'Email is invalid'
                }
            }
        },
        components: { SimpleForm }
    }
</script>
```

The main component takes two props: 

1. `value`. This is used to set the initial form state, which will be a deep copy of what is passed in. 
2. `validate`. This is a function which is called to validate the form. This happens when any of the fields are updated, or the form is submitted. It can return a promise to do asynchronous validation

And `$emits` a `submit` event when the form is submitted. The callback for the submit event takes an object with following keys:

1. values
2. errors
3. setSubmitting
4. setSubmitted

If the form is valid, `errors` will be undefined

The scoped slot is passed the following props:

1. values. All the form values, but "flattened".
2. errors. A function taking a name of a field, and returning it's error message (if invalid.
3. touched. A function taking a name of a field, and returning if the field was touched
4. input. Input and blur are functions ready to be passed in as event handlers. They are only useful on a real form field (eg., and <input> element. The element needs a `name` attribute as well
5. blur
6. setValue. Manually set a field value. Useful for integrating a custom component
7. setTouched. Ditto, but for setting touched
8. handleSubmit. A callback that will initiate the submittion process
9. submitted
10. submitting
## Other components

There are two other components which are useful for encapsulating common patterns, or removing boilerplate. They are available as named exports.

1. `<SimpleFormFieldSet>`. This is used to make a set of fields which are prefixed. It can be used also to set up an array of fields
 ```html
 <template v-for="(item, i) of items">
   <SimpleFormFieldSet :name="`items[${i}]`" :value="item">
```

It can be passed a single component, or a scoped slot. The same props passed in from `SimpleForm` will be passed in (as props to the component, or as props of the scoped slot), but will all be namespaced.

2. `<Field>`
 This component removes some of the boilerplate in hooking up inputs

```html
<Field type="email" name="email" errorClass="error" />
```

Will render an <input type="email" for the field email. `errorClass` is an optional prop. The default value is error

It can also take an element or a custom component

```html
<Field name="favoriteColor">
   <select>
      <option value="red">Red</option>
      <option value="yellow">Yellow</option>
      <option value="green">Green</option>
    </select>
</Field>
```

```html
<Field name="customComponentValue">
  <CustomComponent />
</Field>
```
The custom component will have `value` and `class` (with the erroClass) injected as a props, and `input` and `blur` as listeners. So the custom component has to `$emit` `input` with the new value, and `blur`.

3. `<Error>`

```html
<Error name="email" class="error-label" tag="span">
```

Displays an error if the given field is touched and has an error to show.
By defaul will use a div, but the `tag` prop can be used to use a different element.

## License

MIT
