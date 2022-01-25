<template>
    <div class="group relative">
        <slot name="content"></slot>
        <a class="overflow-visible btn-clipboard cursor-pointer text-sm mt-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-100" :data-clipboard-target="`#${id}`" data-clipboard-action="copy" @click.prevent="toCopied()">{{ label }}</a>
    </div>
</template>

<script>
    export default {
        props: {
            id: { type: String, required: true }
        },
        data() {
            return {
                label: 'Copy'
            }
        },
        methods: {
            toCopied() {
                const self = this
                this.label = 'Copied!'
                setTimeout(function() {
                    self.label = 'Copy'
                }, 1500)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
