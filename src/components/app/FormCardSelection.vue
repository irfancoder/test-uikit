<template>
    <div class="form-group" :class="{ 'has-error': model.errors.has(name) }">
        <label class="form-label mb-6" v-if="label">{{ label }} <i class="rc rc-ln-info" v-if="tooltip" v-tooltip.top="tooltip"></i></label>
        <div class="grid grid-cols-1 gap-4" :class="cols">
            <div :class="[{ active: model[name] === (value ? item[value] : index)}, className]" v-for="(item, index) in selection" :key="index">
                <label :class="[cardHeight, align, { disabled: item.disabled }]" v-tooltip.top-start="item.tooltip">
                    <input class="invisible hidden" type="radio" role="radio" aria-checked="true" :name="name" v-bind:value="value ? item[value] : index" v-model="model[name]" @change="handleEmit($event)" :disabled="item.disabled" />
                    <slot :obj="item" name="custom" v-if="$scopedSlots['custom']"></slot>
                    <span v-else>{{ item }}</span>
                </label>
            </div>
        </div>
        <span v-if="model.errors.has(name)" v-text="model.errors.get(name)" class="help-block"></span>
    </div>
</template>

<script>
    export default {
        props: {
            selection: { required: true },
            label: { required: true },
            className: { type: String, default: 'card-selection' },
            tooltip: { required: false },
            name: { required: true },
            model: { required: true },
            cols: { required: true },
            cardHeight: { required: true },
            horizontalScroll: false,
            align: '',
            value: ''
        },
    
        methods: {
            handleEmit (event) {
                this.$emit('input', event.target.value)
                this.model.errors.clear(this.name)
            }
        }
    }
</script>
