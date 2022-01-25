<template>
    <panel-footer class="py-7 space-y-2 md:space-y-0 justify-between px-7 flex-col md:flex-row rounded-b-md" :footer-class="footerClass" :border="border">
        <p v-show="!_.isEmpty(this.items)">Showing
            <span class="font-medium text-black-500">{{ items.current_page * items.per_page - (items.per_page - 1) }}</span> to
            <span class="font-medium text-black-500">{{ items.current_page === items.last_page ? items.total : items.per_page * items.current_page }}</span> of
            <span class="font-medium text-black-500">{{ items.total }}</span> {{ title}}
        </p>

        <pagination :data="items" show-disabled="true" @pagination-change-page="url ? queryWithParams($event) : getResults($event)">
            <span slot="prev-nav"><i class="rc rc-ln-chevron-left rc-ln-semibold"></i></span>
	        <span slot="next-nav"><i class="rc rc-ln-chevron-right rc-ln-semibold"></i></span>
        </pagination>
    </panel-footer>
</template>

<script>
export default {
    props: {
        items: Object,
        title: String,
        url: { type: String, required: false },
        border: { type: Boolean, required: false, default: false },
        footerClass: { type: String, required: false }
    },

    data() {
        return {
            urlParams: new URLSearchParams(window.location.search)
        }
    },

    methods: {
        getResults(page) {
            this.$emit('change-page', page)
        },
        queryWithParams(page) {
            let url = new URL(this.url)

            // append existing filter params
            for (let params of this.urlParams.entries()) {
                url.searchParams.set(params[0], params[1])
            }
            url.searchParams.set('page', page)

            if (window.location.hash) {
                url = url + window.location.hash
            }
            window.handleRedirect(url)
        }
    }
}
</script>
