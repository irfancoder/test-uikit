<template>
    <a v-tooltip:left="'Download to your computer'" href="#" @click.prevent="download" role="button">
        {{ fileName }}
    </a>
</template>

<script>
    export default {
        props: {
            url: String,
            fileName: String
        },

        methods: {
            download () {
                let self = this
                window.swal.fire({
                    title: 'Download',
                    html: 'Click Download button below to request download URL and directly download to your device',
                    customClass: {
                        container: 'rc-swal'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Download',
                    showLoaderOnConfirm: true,
                    preConfirm (value) {
                        return new Promise((resolve, reject) => {
                            window.enterPage(self.url, {}, { method: 'get', showAlert: true }).then(response => {
                                self.analyticEvent('Backup', 'Click', 'download')

                                resolve(response)
                            }).catch(error => {
                                if (error.response.status === 422) {
                                    reject(error.response.data.errors[self.fieldName][0])
                                }
                            })
                        })
                    }
                }).then(response => {
                    if (response.data.url !== undefined) {
                        window.open(response.data.url, '_blank')
                    }
                }).catch(window.swal.noop)
            }
        }
    }
</script>