<template>
    <div class="form-group" :class="[ {'has-error': model.errors.has(name)}, formClass]">
        <label :class="[labelClass]" v-if="label" v-html="label"></label>

        <div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <form-select 
                name="phoneNumber" 
                :selection="selection" 
                width="w-full md:w-36" 
                :model='model' 
                v-model="dial" 
                selectText="----" 
                :searchable="true">
                
                <template v-slot:custom="prop">
                    <country-flag-icon :shortcode="prop.obj.key" class="mr-3"></country-flag-icon>
                </template>
            </form-select>
            <input type="tel" maxlength="15" :class="[inputClass]" :name="name" v-model="value" @input="handleEmit($event)" :placeholder="placeholder" :disabled="disabled" @focus="focus = true" @blur="focus = false" autocomplete="off">
        </div>

        <transition name="fade" mode="out-in">
            <p class="form-input-description" v-html="description" v-show="description && focus && !model.errors.has(name)"></p>
        </transition>

        <span v-if="model.errors.has(name)" v-text="model.errors.get(name)" class="help-block"></span>
    </div>
</template>

<script>
    import parsePhoneNumber from 'libphonenumber-js'
    
    export default {
        props: {
            label: { required: false },
            labelClass: { default: 'form-label' },
            inputClass: { default: 'form-control -mt-2 md:m-0' },
            description: {},
            name: { required: true },
            model: { required: true },
            placeholder: { default: 'Placeholder for the model' },
            type: { default: 'text' },
            formClass: {},
            disabled: { default: false },
            selection: [],
            phoneNumber: ''
        },

        data: () => ({
            focus: false,
            dial: '',
            value: ''
        }),

        mounted () {
            if (this.phoneNumber) {
                [this.dial, this.value] = this.extractCountryCode(this.phoneNumber)
            }
        },

        methods: {
            handleEmit (event) {
                this.$emit('input', `${this.extractDialCode(this.selection[this.dial])}${this.value}`)
                this.model.errors.clear(this.name)
            },

            extractCountryCode(phoneNumber) {
                let pp = parsePhoneNumber(phoneNumber)
                return [pp.country, pp.nationalNumber]
            },

            extractDialCode (value) {
                let match = value.match(/\(([^)]+)\)/)
                return match[1].replace(/\s/g, '')
            }
        }
    }
</script>
