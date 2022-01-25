<template>
    <div class="form-group" :class="{ 'has-error': model.errors.has(name) }">
        <div class="checkbox checkbox-primary">
            <input type="checkbox"
                :id="name"
                :name="name" 
                v-bind:checked="value" 
                :disabled="disabled" 
                @change="handleEmit($event)">
            <label :for="name">
                <div class="flex flex-col">
                    <h6 class="mb-1">{{ label }}</h6>
                    <p>{{ labelAlternative }}</p>
                </div>
            </label>

            <span v-if="model.errors.has(name)" v-text="model.errors.get(name)" class="help-block"></span>
        </div>
    </div>
</template>


<script>
    export default {
        props: {
            label: { required: true },
            labelAlternative: { default: null },
            name: { required: true },
            model: { required: true },
            value: { type: Boolean },
            showMainLabel: { default: true },
            disabled: { default: false }
        },

        methods: {
            handleEmit (event) {
                this.$emit('input', event.target.checked)
                this.model.errors.clear(this.name)
            }
        }
    }
</script>
