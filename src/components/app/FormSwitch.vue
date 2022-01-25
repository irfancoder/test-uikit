<template>
    <div class="space-x-3 inline-flex justify-between items-center">
        <span class="font-medium" v-if="labelType === 'outline'">{{ labels[false] }}</span>
        <label class="switch" :style="[ cssProps, { width: `${width}px` } ]">
            <input type="checkbox"
                :name="name"
                v-bind:checked="value"
                @change="handleEmit($event)">
            <div class="slider" :class="[ value ? 'justify-start' : 'justify-end']" :style="{ width: `${width}px`, height: `${height}px` }">
                <div :class="`label label-${value}`" v-if="labelType === 'inline'">{{ labels[value] }}</div>
            </div>
        </label>
        <span class="font-medium" v-if="labelType === 'outline'">{{ labels[true] }}</span>
    </div>
</template>

<script>
    export default {
        props: {
            name: { required: true },
            model: { required: true },
            value: { type: Boolean },
            labelType: {
                default: 'inline', // outline
                type: String
            },
            labels: {
                default: {
                    true: 'On',
                    false: 'Off'
                },
                type: Object
            },
            width: {
                default: 72,
                type: Number
            },
            height: String
        },

        computed: {
            cssProps () {
                return {
                    '--tw-translate-x': `${this.width - 32}px`
                }
            }
        },

        methods: {
            handleEmit (event) {
                this.$emit('input', event.target.checked)
                this.model.errors.clear(this.name)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .switch {
        input {
            &:checked {
                & + .slider {
                    &:before {
                        transform: translateX(var(--tw-translate-x));
                    }
                }
            }
        }
    }
</style>
