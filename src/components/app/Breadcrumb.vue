<template>
    <nav v-if="!_.isEmpty(navs)" aria-label="breadcrumb" class="pb-2 overflow-auto whitespace-nowrap w-full no-scrollbar">
        <ol class="breadcrumb">
            <li
                v-for="(nav, idx) in breadcrumbItems"
                :key="idx"
                class="breadcrumb-item">
                <a :href="nav.link">{{ nav.name }}</a>
            </li>
        </ol>
    </nav>
</template>
<script>
    export default {
        props: {
            crumbs: Object,
            current: String
        },

        data: () => ({
            navs: []
        }),

        mounted() {
            if (!_.isEmpty(this.crumbs)) {
                Object.values(this.crumbs).forEach(crumb => {
                    crumb.uri ? this.navs.push({ name: crumb.title, link: `${window.location.origin}/${crumb.uri}` }) : this.navs.push({ name: crumb.title, link: '' })
                })
            }
            // if (this.crumbs.length) {
            //     this.navs.push({ name: this.current, link: '#' })
            // }
        },

        computed: {
            breadcrumbItems () {
                return this.navs
            },

            activeNav () {
                // TODO check if active or not
                return false
            }
        }
    }
</script>
