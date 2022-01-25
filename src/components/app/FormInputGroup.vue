<template>
    <div class="form-group" :class="[ {'has-error': model && model.errors.has(name)}, formClass]">
        <label :class="[labelClass]" v-if="label" :for="name">{{ label }} </label>
        <i :class="[labelIcon]"  v-tooltip:top="tooltipDescription" v-if="tooltipDescription"></i>

        <div class="input-group">
            <div v-if="prependValue != null" class="input-group-prepend">
                <span class="input-group-text">{{ prependValue }}</span>
            </div>
            <input v-if="type == 'text'" type="text" class="form-control" :name="name" v-bind:value="value" @input="handleEmit($event)" :placeholder="placeholder" :disabled="disabled" @focus="focus = true" @blur="focus = false" >
            <input v-else-if="type == 'password'" type="password" class="form-control" :name="name" v-bind:value="value" @input="handleEmit($event)" :placeholder="placeholder" :disabled="disabled" @focus="focus = true" @blur="focus = false" >
            <input v-else-if="type == 'number'" type="number" class="form-control" :name="name" v-bind:value="value" @input="handleEmit($event)" :placeholder="placeholder" :disabled="disabled" @focus="focus = true" @blur="focus = false" >
            <input v-else-if="type == 'time'" type="time" class="form-control" :name="name" v-bind:value="value" @input="handleEmit($event)" :placeholder="placeholder" :disabled="disabled" @focus="focus = true" @blur="focus = false" >
            <div v-if="appendValue != null" class="input-group-append">
                <span class="input-group-text">{{ appendValue }}</span>
            </div>
        </div>

        <transition name="fade" mode="out-in">
            <p class="form-input-description" v-html="description" v-show="description && focus && !model.errors.has(name)"></p>
        </transition>
        
        <span v-if="model && model.errors.has(name)" v-text="model.errors.get(name)" class="help-block"></span>
    </div>
</template>

<script>
    export default {
        props: {
            label: { required: false },
            labelClass: { default: 'form-label' },
            name: { required: true },
            description: {},
            model: { required: true },
            value: {},
            placeholder: { default: 'Placeholder for the model' },
            type: { default: 'text' },
            formClass: {},
            prependValue: { default: null },
            appendValue: { default: null },
            disabled: { type: Boolean, default: false },
            min: Number,
            labelIcon: { },
            tooltipDescription: String
        },

        data: () => ({
            focus: false
        }),

        methods: {
            handleEmit (event) {
                this.$emit('input', event.target.value)

                if (this.model) this.model.errors.clear(this.name)
            }
        }
    }
</script>

<style lang="scss">
    .form-control[type="time"] {
        line-height: unset !important;
    }
</style>
