<template>
    <div class="form-group" :class="{ 'has-error': model.errors.has(name) }">
        <label :class="[labelClass]" :for="name">{{ label }}</label>

        <multiselect 
            :options="postSelection"
            :value="selected"
            :close-on-select="!multiple"
            :placeholder="selectText"
            :multiple="mulitple"
            @select="handleEmit"
            group-values="child" 
            label="value"
            group-label="group"
            :disabled="disabled"
            track-by="key" 
            :group-select="false">
        </multiselect>

        <p class="form-input-description" v-html="description" v-show="description && focus && !model.errors.has(name)"></p>
        <span v-if="model.errors.has(name)" v-text="model.errors.get(name)" class="help-block"></span>
    </div>
</template>


<script>
    export default {
        props: {
            label: { required: true },
            labelClass: { default: 'form-label' },
            name: { required: true },
            description: {},
            model: { required: true },
            selection: { required: true, type: Object },
            multiple: { default: false },
            value: {},
            disabled: { default: false },
            selectText: { default: '---Please select one---' },
            options: { type: Object }
        },

        computed: {
            // convert object selection to array of objects
            postSelection() {
                function innerChild(arr) {
                    return Object.entries(arr).reduce(
                        (acc, [first, second]) => {
                            return [...acc, { key: first, value: second }]
                        }, [])
                }

                return Object.entries(this.selection).reduce(
                    (acc, [group, child]) => {
                        return [...acc, { group, child: innerChild(child) }]
                    }, [])
            },
    
            selected () {
                return this.postSelection
                    .flatMap(group => group.child)
                    .find(({ key }) => key === this.value?.toString())
            }
        },

        methods: {
            handleEmit (value) {
                this.$emit('input', value.key)
                this.model.errors.clear(this.name)
            },

            convertArrayToObject (arr) {
                let temp = []
    
                Object.entries(arr).map(item => {
                    temp.push({
                        'key': item[0],
                        'value': item[1]
                    })
                })

                return temp
            }
        }
    }
</script>
