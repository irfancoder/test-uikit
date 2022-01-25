<template>
    <i class="rc rc-" :class="[icon, classIcon]"></i>
</template>

<script>
    export default {
        props: {
            browser: { required: true, type: String },
            classIcon: { default: 'rc-tb-icon' }
        },

        computed: {
            icon () {
                let b = _.kebabCase(this.browser)

                switch (b) {
                case 'safari':
                    return 'rc-ln-safari'
                case 'chrome':
                    return 'rc-ln-chrome'
                case 'firefox':
                    return 'rc-ln-firefox'
                case 'internet-explorer':
                    return 'rc-ln-internet-explorer'
                case 'microsoft-edge':
                    return 'rc-ln-edge'
                case 'opera':
                    return 'rc-ln-opera-mini'
                default:
                    return 'rc-ln-globe'
                }
            }
        }
    }
</script>
