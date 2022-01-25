<template>
    <div class="form-group" :class="[{ 'has-error': model.errors.has(name) }, formClass]">
        <label :class="[labelClass]">{{ label }}</label>
        <textarea :name="name" class="form-control" :rows="rows || 5" v-bind:value="value" @input="handleEmit($event)" :placeholder="placeholder" autocomplete="off" @focus="focus = true" @blur="focus = false" :disabled="disabled"></textarea>

        <transition name="fade" mode="out-in">
            <p class="form-input-description" v-html="description" @focus="focus = true" v-show="description && focus && !model.errors.has(name)"></p>
        </transition>
        
        <span v-if="model.errors.has(name)" v-text="model.errors.get(name)" class="help-block"></span>
    </div>
</template>


<script>
    export default {
        props: {
            label: { required: true },
            description: {},
            labelClass: { default: 'form-label' },
            name: { required: true },
            model: { required: true },
            disabled: { type: Boolean, required: false, default: false },
            value: {},
            placeholder: { default: 'Placeholder for the model' },
            formClass: {},
            rows: { default: 5, type: Number }
        },

        data () {
            return {
                focus: false
            }
        },

        methods: {
            handleEmit (event) {
                this.$emit('input', event.target.value)
                this.model.errors.clear(this.name)
            }
        }
    }
</script>
