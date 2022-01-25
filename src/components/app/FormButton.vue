<template>
    <!-- <button type="submit" :class="[buttonClass]" :disabled="model.errors.any()">
        <slot></slot>
    </button> -->
    <button type="submit" :form="formId" :class="[buttonClass]" :disabled="model.disableButton()" :value=value>
        <slot></slot>
    </button>
</template>


<script>
    export default {
        props: {
            buttonClass: { default: 'btn btn-primary flex-shrink-0' },
            model: { required: true },
            formId: { type: String },
            value: { default: null }
        }
    }
</script>

<style lang="scss" scoped>
    button[type='submit'] {
        @apply relative;
    }
</style>
