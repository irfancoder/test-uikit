<template>
    <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h4>Export Data</h4>
                </div>
                <div class="panel-body">
                    <button v-if="exporting"
                        :show="true"
                        class="btn btn-sm btn-default">Exporting...</button>
                    <button v-else
                        class="btn btn-sm btn-info"
                        v-on:click="generateExportLink">Generate</button>
                    <span v-html="exportURL"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url: String,
            search: String,
            dateBefore: String,
            dateAfter: String,
            item: String
        },
        data () {
            return {
                exportURL: '',
                exporting: false,
                filter: {
                    search: this.search,
                    dateBefore: this.dateBefore,
                    dateAfter: this.dateAfter,
                    item: this.item
                }
            }
        },
        methods: {
            generateExportLink () {
                this.exporting = true
                let params = {}
                Object.assign(params, this.filter)

                window.enterPage(this.url, params).then(({ data }) => {
                    this.exporting = false
                    this.exportURL = `Generated Download Link: <a target="_blank" rel="noreferrer" href="${data.url}">${data.url}</a>`
                }).catch(e => {
                    this.exporting = false
                })
            }
        }
    }
</script>
