<template></template>

<script>
    export default {
        created () {
            let that = this

            if (window.RunCloud.server !== null) {
                window.Echo.private('servers.' + window.RunCloud.server).listen('.GitDeploymentError', log => {
                    that.swal.fire({
                        'title': 'Git Deployment Error',
                        'html': `<h4>STDOUT</h4><pre>${log.stdout}</pre><br><br><h4>STDERR</h4><pre>${log.stderr}</pre><br><br>`,
                        'type': 'error'
                    })
                })

                window.Echo.private('servers.' + window.RunCloud.server).listen('.ServerWorkError', data => {
                    // window.notie.force({
                    //     type: 'error',
                    //     text: data.log,
                    //     buttonText: 'Noted!'
                    // })
                    window.toastr.error(data.log)
                })

                window.Echo.private('servers.' + window.RunCloud.server).listen('.UpdateComponent', data => {
                    if (data.updateComponent && data.updateComponent.ref) {
                        this.updateComponent(data.updateComponent)
                    }
                })
            }

            if (window.RunCloud.backupsite !== null) {
                window.Echo.private('backupsite.' + window.RunCloud.backupsite).listen('.UpdateComponent', data => {
                    if (data.updateComponent && data.updateComponent.ref) {
                        this.updateComponent(data.updateComponent)
                    }
                })
            } else if (window.RunCloud.backupuser !== null) {
                window.Echo.private('backupuser.' + window.RunCloud.backupuser).listen('.UpdateComponent', data => {
                    if (data.updateComponent && data.updateComponent.ref) {
                        this.updateComponent(data.updateComponent)
                    }
                })
            }
        },

        methods: {
            swal (data) {
                window.swal(data).catch(window.swal.noop)
            },
            updateComponent (options) {
                let component = this.$root.$refs[options.ref]
                let componentData = options.data || {}

                if (!component) {
                    return
                }

                Object.keys(componentData).forEach((key) => {
                    component[key] = (typeof component[key] === 'object' && !Array.isArray(component[key]))
                        ? Object.assign({}, component[key], componentData[key])
                        : componentData[key]
                })
            }
        }
    }
</script>
