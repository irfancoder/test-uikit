<template>
    <div></div>
</template>

<script>
    export default {
        props: {
            message: { required: true }
        },

        created () {
            let type = this.message.split('|')[0]
            let message = this.message.replace(type + '|', '')

            this.notify(type, message)
        },

        methods: {
            notify (type, message) {
                if (type === 'error' || type === 'warning') {
                    let title = ''

                    if (type === 'error') {
                        title = 'Error'
                    } else if (type === 'warning') {
                        title = 'Warning'
                    }

                    window.swal[type](title, message)

                    // window.swal({
                    //     title: title,
                    //     html: message,
                    //     type: type,
                    //     confirmButtonText: 'Understood!'
                    // })
                } else {
                    setTimeout(() => {
                        // window.notie.alert({ type: type, text: message, time: 3 })
                        window.toastr.options.escapeHtml = false
                        window.toastr[type](message)
                    }, 700)
                }
            }
        }
    }
</script>
