<template>
    <div class="form-group" :class="{ 'has-error': model.errors.has(name) }">
        <label :class="[labelClass]" v-html="label" v-if="label">{{ label }}</label>
        <p class="form-input-description" v-html="description" v-if="description"></p>

        <div :class="[MediaQuery('up', 'md') ? radioStyle : '']">
            <div class="radio radio-primary" v-for="(val, index) in selection" :key="index">
                <template v-if="$scopedSlots['custom']">
                    <input type="radio" :id="`${name}${index}`" :name="name" v-bind:value="value ? val[value] : index" v-model="model[name]" @change="handleEmit($event)" :disabled="val.disabled">
                    <label :for="`${name}${index}`"><slot name="custom" :obj="val"></slot></label>
                </template>
                <template v-else>
                    <input type="radio" :id="`${name}${index}`" :name="name" v-bind:value="index" v-model="model[name]" @change="handleEmit($event)" :disabled="disableOption(index)">
                    <label :for="`${name}${index}`">{{ val }}</label>
                </template>
            </div>
        </div>
        <span v-if="model.errors.has(name)" v-text="model.errors.get(name)" class="help-block"></span>
    </div>
</template>

<script>
    export default {
        props: {
            label: { required: true },
            labelClass: { default: 'form-label' },
            model: { required: true },
            name: { required: true },
            radioStyle: { type: String },
            value: { default: null },
            selection: { required: true, type: Object },
            disableSelection: { required: false, type: Array, default: null },
            description: {},
            required: { default: false }
        },

        inject: ['MediaQuery', '$breakpoint'],

        methods: {
            handleEmit (event) {
                this.$emit('input', event.target.value)
                this.model.errors.clear(this.name)
            },
            disableOption (value) {
                if (this.disableSelection) return this.disableSelection.includes(value)
                return false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tooltip-radio {
        width:100px;
    }
</style>
