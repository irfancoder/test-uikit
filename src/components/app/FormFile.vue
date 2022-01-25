<template>
    <div class="form-group" :class="{ 'has-error': model.errors.has(name) }">
        <label :class="[labelClass]">{{ label }}</label>
        <input label="Attachment" type="file" @change="handleEmit($event)" ref="file" :name="name" :disabled="disabled">
        <span v-if="model.errors.has(name)" v-text="model.errors.get(name)" class="help-block"></span>
    </div>
</template>

<script>
    export default {
        props: {
            label: { required: true },
            labelClass: { default: 'form-label' },
            name: { required: true },
            model: { required: true },
            placeholder: { default: 'Placeholder for the model' },
            disabled: { default: false }
        },

        methods: {
            handleEmit (event) {
                this.$emit('change', event.target.files[0])
                this.model.errors.clear()
            }
        }
    }
</script>
