<template>
    <form-select @input="filterSelection" name="selectfilter" :model="form" v-model="form.selected" :selectText="selectText" width="w-auto" :span-class="spanClass" :selection="selection"></form-select>
</template>

<script>
import AjaxForm from '@/classes/AjaxForm'

export default {

    props: {
        url: { type: String, required: true },
        type: { type: String, required: true },
        selection: { type: Object, required: true },
        paramText: { type: String, required: true, default: 'filter' },
        defaultSelected: { type: String, required: false },
        selectText: { type: String, default: '--Please select--' },
        spanClass: {}
    },
    data() {
        return {
            form: new AjaxForm({
                selected: ''
            }),
            urlParams: new URLSearchParams(window.location.search)
        }
    },
    created () {
        this.form.selected = this.defaultSelected
    },
    methods: {
        filterSelection: window._.debounce(function () {
            let url
            try {
                url = new URL(this.url)
            } catch (err) {
                // quick fix for browserSync
                url = new URL(
                    this.url.replace(
                        '//localhost:3010',
                        'https://localhost:3010'
                    )
                )
            }
            // include other existing filter params
            for (let params of this.urlParams.entries()) {
                url.searchParams.set(params[0], params[1])
            }

            // set the new query params
            if (!_.isEmpty(this.form.selected)) url.searchParams.set(this.paramText, this.form.selected)
            else url.searchParams.delete(this.paramText)
            // remove page if exist
            url.searchParams.delete('page')

            if (window.location.hash) {
                url = url + window.location.hash
            }

            window.handleRedirect(url)
        }, 500)
    }
}
</script>
