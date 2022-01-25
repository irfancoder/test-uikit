<template>
    <div>
        <a v-if="downloadUrl" :href="downloadUrl" class="btn btn-primary btn-act" role="button"> <i class="rc rc-ln-turn-e text-primary"></i><span>Download</span></a>
        <a v-else-if="generating" class="btn btn-default btn-act cursor-not-allowed" role="button" v-tooltip:left="'Generating download link in progress'"> <i class="rc rc-ln-link text-primary" ></i><span class="text-misc-700">Download</span></a>
        <a v-else href="#" @click.prevent="download" class="btn btn-primary btn-act" role="button"> <i class="rc rc-ln-link text-primary"></i><span>Generate Backup File</span> </a>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                generatedDownloadUrl: '',
                generating: this.file.extraData && this.file.extraData.download && this.file.extraData.download.status === 'generating'
            }
        },

        props: {
            url: String,
            file: Object
        },

        computed: {
            downloadUrl () {
                if (this.generatedDownloadUrl) {
                    return this.generatedDownloadUrl
                }

                if (!this.file || !this.file.extraData || !this.file.extraData.download) {
                    return ''
                }

                const expires = this.file.extraData.download.expires
                if (window.moment().diff(window.moment.unix(expires), 'seconds') > 0) {
                    return ''
                }

                return this.file.extraData.download.url
            }
        },

        methods: {
            download () {
                this.generating = true

                window.enterPage(this.url, {}, {method: 'get', showAlert: true}).then(res => {
                    window.toastr['success']('Generating download link in progress.')
                }).catch(() => {
                    this.generating = false
                    window.toastr['error']('Error while generating download link.')
                })
            }
        }
    }
</script>