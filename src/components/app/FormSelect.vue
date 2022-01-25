<template>
    <div class="form-group" :class="[{ 'has-error': model.errors.has(name) }, width]">
        <label :class="[labelClass]" v-html="label" v-if="label" :for="name"></label><i v-if="tooltip" class="rc rc-ln-info ml-2" v-tooltip.top="tooltip"></i>
        <p class="form-input-description" v-html="description" v-if="description"></p>

        <multiselect
            :options="postSelection"
            :class="[width ? `${width}` : '', spanClass ? `${spanClass}` : '']"
            :value="selected"
            :close-on-select="!multiple"
            :placeholder="selectText"
            track-by="key"
            :name="name"
            :multiple="multiple"
            :taggable="taggable"
            @select="handleEmit"
            @remove="handleRemove"
            @tag="handleTag"
            label="value"
            select-label=""
            :disabled="disabled"
            :searchable="searchable">

            <template slot="option" slot-scope="{option}">
                <div class="flex">
                    <div class="pr-4" v-if="option.icon">
                        <i :class="option.icon"></i>
                    </div>
                    <slot name="custom" v-if="$scopedSlots['custom']" :obj="option"></slot>
                    <div class="whitespace-pre-wrap md:whitespace-nowrap pb-1 md:pb-0">{{ option.value }}</div>
                </div>
            </template>
        </multiselect>

        <p class="form-input-description" v-html="description" v-show="description && focus && !model.errors.has(name)"></p>
        <span v-if="model.errors.has(name) || errorMessage" v-text="model.errors.get(name) || errorMessage" class="mt-2 text-gray-700 block help-block"></span>
    </div>
</template>


<script>
export default {
    props: {
        label: { required: true },
        labelClass: { default: 'form-label' },
        name: { required: true },
        description: {},
        tooltip: { required: false, type: String, default: null },
        model: { required: true },
        defaultSelection: { type: Array },
        selection: { required: true, type: Object },
        multiple: { default: false },
        taggable: { default: false },
        value: {},
        width: {},
        spanClass: {},
        searchable: { default: true },
        disabled: { default: false },
        required: { default: false },
        dropdownAlignRight: { default: false },
        selectText: { default: '---Please select one---' },
        allowAdd: { default: false },
        customOption: { default: false }
    },

    data () {
        return {
            tempModel: this.defaultSelection ?? [],
            placement: 'bottom'
        }
    },

    computed: {
        selected () {
            return this.multiple ? this.tempModel : this.postSelection.find(e => e.key?.toString() === this.value?.toString())
        },
        postSelection () {
            let arr = []
            Object.keys(this.selection).map(key => {
                arr.push({
                    key: key,
                    value: this.selection[key]
                })
            })
            return arr
        }
    },

    methods: {
        handleEmit (value) {
            if (this.multiple && !this.taggable) {
                const gg = this.postSelection.find(e => e.key === value.key)
                this.tempModel.push(gg)
                this.$emit('input', this.tempModel.map(item => item?.key))
            } else if (this.multiple && this.taggable) {
                const gg = this.postSelection.find(e => e.value === value.value)
                this.tempModel.push(gg)
                this.$emit('input', this.tempModel.map(item => item?.value))
            } else {
                this.$emit('input', value.key)
            }
            this.model.errors.clear(this.name)
        },
        handleRemove ({key, value}) {
            if (this.taggable) {
                this.tempModel = this.tempModel.filter(item => item.value !== value)
                this.$emit('input', this.tempModel.map(item => item?.value))
            } else {
                this.tempModel = this.tempModel.filter(item => item.key !== key)
                this.$emit('input', this.tempModel.map(item => item?.key))
            }
        },
        handleTag (value) {
            if (!this.tempModel.some(e => e.value === value)) {
                let newTag = {
                    key: value,
                    value: value
                }
                this.tempModel.push(newTag)
                this.$emit('input', this.tempModel.map(item => item?.value))
            }
        }
    }
}
</script>

<style lang="scss">
.v-select {
    display: grid;
}

.v-select.drop-up.vs--open .vs__dropdown-toggle {
    border-radius: 0 0 4px 4px;
    border-top-color: transparent;
    border-bottom-color: rgba(60, 60, 60, 0.26);
}

[data-popper-placement="top"] {
    border-radius: 4px 4px 0 0;
    border-top-style: solid;
    border-bottom-style: none;
    box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.15);
}

 .multiselect-black {
     .multiselect__tags > .multiselect__placeholder {
         @apply text-black-500;
     }
}

</style>
