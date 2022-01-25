<template>
    <div class="form-group" :class="{ 'has-error': model.errors.has(name) }">
        <label v-if="label" class="form-label">{{ label }}</label> <i class="rc rc-ln-info ml-2" v-if="tooltip" v-tooltip.top="tooltip"></i>
        <p class="form-input-description" v-html="description" v-if="description"></p>

        <div v-if="notice != null" :class="noticeClass">
            <p v-html="notice"></p>
        </div>
        
        <div class="checkbox checkbox-primary">
            <template v-if="$scopedSlots['custom']">
                <input type="checkbox" class="styled" :id="name" :name="name" v-bind:checked="value" :disabled="disabled" @change="handleEmit($event)"> 
                <label :for="name"><slot name="custom"></slot></label>
            </template>
            <template v-else>
                <input type="checkbox" class="styled" :id="name" :name="name" v-bind:checked="value" :disabled="disabled" @change="handleEmit($event)"> 
                <label :for="name" v-html="labelAlternative != null ? labelAlternative : label" ></label>
            </template>

            <slot></slot>

            <span v-if="model.errors.has(name)" v-text="model.errors.get(name)" class="help-block"></span>
        </div>
    </div>
</template>


<script>
    export default {
        props: {
            label: { required: false },
            labelAlternative: { default: null },
            name: { required: true },
            description: {},
            model: { required: true },
            value: { type: Boolean },
            disabled: { default: false },
            tooltip: { type: String, required: false },
            notice: { type: String, default: null },
            noticeClass: { default: 'alert alert-warning' }
        },

        methods: {
            handleEmit (event) {
                this.$emit('input', event.target.checked)
                this.model.errors.clear(this.name)
            }
        }
    }
</script>
