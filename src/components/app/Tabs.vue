<template>
    <ul class="nav nav-tabs" role="tablist">
        <li v-for="(item, key) in navs" class="nav-item" :key="key">
            <a class="nav-link" :class="{ active: isActive(item) }" :href="item.link">{{ item.label }}</a>
        </li>
    </ul>
</template>
<script>
    export default {
        props: {
            navs: Array,
            contentOnly: { type: Boolean, default: false }
        },

        methods: {
            isActive(item) {
                if (window._.get(item, 'link')) {
                    return item.link.includes(window.location.pathname)
                }
            }
        },
    
        mounted() {
            setTimeout(() => {
                if (this.contentOnly) {
                    const tabContent = document.querySelectorAll('.nav-link')

                    window._.forEach(tabContent, (item) => {
                        item.setAttribute('data-toggle', 'tab')
                    })
                }
            }, 10)
        }
    }
</script>
