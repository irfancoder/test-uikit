<template>
    <inline-svg 
        :src="`${path}/${icon}.svg`" 
        :height="height"
        :width="width"
        :aria-label="icon"
        :id="false"></inline-svg>
</template>

<script>
    import InlineSvg from 'vue-inline-svg'

    export default {
        props: {
            path: { default: '/assets/img/svgicon' },
            icon: { required: true, type: String },
            height: { default: '32', type: String },
            width: { default: '32', type: String }
        },

        components: {
            InlineSvg
        }
    }
</script>
