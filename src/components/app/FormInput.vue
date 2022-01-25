<template>
    <div class="form-group" :class="[ {'has-error': model.errors.has(name)}, formClass]">
        <label :class="[labelClass]" v-if="label" v-html="label"></label><i v-if="tooltip" class="rc rc-ln-info ml-2" v-tooltip.top="tooltip"></i>
        <div class="float-right" v-if="type === 'passwordGenerator'">
            <a class="btn btn-primary btn-link" @click="generatePassword()">
                <i class="rc rc-ln-loop"></i><span>Generate Password</span>
            </a>
        </div>

        <input v-if="type == 'text'" type="text" :class="[inputClass]" :name="name" v-bind:value="value" @input="handleEmit($event)" :placeholder="placeholder" :disabled="disabled" @focus="focus = true" @blur="focus = false" autocomplete="off" ref="inputField">

        <input v-else-if="type == 'password'" type="password" :class="[inputClass]" :name="name" v-bind:value="value" @input="handleEmit($event)" :placeholder="placeholder" :disabled="disabled" @focus="focus = true" @blur="focus = false" autocomplete="off" ref="inputField">

        <input v-else-if="type == 'number'" type="number" :class="[inputClass]" :name="name" v-bind:value="value" @input="handleEmit($event)" :placeholder="placeholder" :disabled="disabled" @focus="focus = true" @blur="focus = false" autocomplete="off" ref="inputField">

        <input v-else-if="type == 'email'" type="email" :class="[inputClass]" :name="name" v-bind:value="value" @input="handleEmit($event)" :placeholder="placeholder" :disabled="disabled" @focus="focus = true" @blur="focus = false" autocomplete="off" ref="inputField">

        <input v-else-if="type == 'file'" type="file" :name="name" v-bind:value="value" @input="handleEmit($event)" :disabled="disabled" @focus="focus = true" @blur="focus = false" autocomplete="off" ref="inputField">

        <input v-else-if="type == 'passwordGenerator'" type="password" :class="[inputClass]" :name="name" v-bind:value="value" @input="handleEmit($event)" :placeholder="placeholder" :disabled="disabled" @focus="focus = true" @blur="focus = false" autocomplete="off" ref="inputField">

        <!-- <div class="input-group" v-else-if="type == 'passwordGenerator'">
            <input type="password" :class="[inputClass]" :name="name" v-bind:value="value" @input="handleEmit($event)" :placeholder="placeholder" :disabled="disabled" @focus="focus = true" @blur="focus = false" autocomplete="off">

            <span class="input-group-btn">
                <button class="btn" :class="[model.errors.has(name) ? 'btn-danger' : 'btn-success']" type="button" @click="generatePassword()">
                    <span v-if="!passwordGeneratorIcon">{{ passwordGeneratorText }}</span>
                    <span v-else>
                        <span class="rc rc-line-lock"></span>
                    </span>
                </button>
            </span>
        </div> -->

        <transition name="fade" mode="out-in">
            <p class="form-input-description" v-html="description" v-show="description && focus && !model.errors.has(name)"></p>
        </transition>

        <span v-if="model.errors.has(name)" v-text="model.errors.get(name)" class="help-block"></span>
    </div>
</template>

<script>
    export default {
        props: {
            label: { required: false },
            labelClass: { default: 'form-label' },
            inputClass: { default: 'form-control' },
            description: {},
            tooltip: { required: false, type: String, default: null },
            name: { required: true },
            model: { required: true },
            value: {},
            placeholder: { default: 'Placeholder for the model' },
            type: { default: 'text' },
            formClass: {},
            disabled: { default: false },
            autocomplete: {},
            passwordGeneratorText: { default: 'Generate Password' },
            passwordGeneratorIcon: { default: false, type: Boolean },
            focusOnLoad: { default: false }
        },

        mounted() {
            if (this.focusOnLoad) {
                this.$refs.inputField.focus()
            }
        },

        data: () => ({
            focus: false
        }),

        methods: {
            generatePassword () {
                this.$emit('generate-password', this.model)
            },

            handleEmit (event) {
                this.$emit('input', event.target.value)
                this.model.errors.clear(this.name)
            }
        }
    }
</script>
