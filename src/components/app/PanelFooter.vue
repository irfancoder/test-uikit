<template>
    <div :class="`${footerClass} ${justify} ${ border ? 'border-t rounded-tl-none rounded-tr-none rounded' : ''}`">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            justify: { type: String, default: 'justify-end' },
            footerClass: { type: String, default: 'pt-4 flex bg-white items-center justify-end ' },
            border: { type: Boolean, required: false, default: true }
        }
    }
</script>
