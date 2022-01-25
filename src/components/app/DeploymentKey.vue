<template>
    <a role="button" @click="view">View</a>
</template>


<script>
    export default {
        props: {
            user: { required: true },
            originalKey: { required: true },
            url: { required: true }
        },

        data: () => ({
            deploymentKey: ''
        }),

        created () {
            this.deploymentKey = this.originalKey
        },

        methods: {
            view () {
                if (this.deploymentKey === '') {
                    return this.noDeploymentKey()
                }

                let _self = this

                window.swal.fire({
                    title: `Deployment Key for User ${this.user}`,
                    html: `
                    <div class="flex space-x-4 justify-between align-baseline">
                        <p>Insert this key inside GitHub, GitLab, Bitbucket or custom Git Server repository to enable Git deployment for your web application.</p><br>
                        <button class="btn btn-primary btn-link btn-clipboard" v-tooltip.top="'Copy'" data-clipboard-target="#gitKey" data-copied-message="Copied! You can now use this key for Git Deployment for user ${this.user}">
                            <i class="rc rc-ln-copy"></i><span>Copy</span>
                        </button>
                    </div>
                    <br />
                    <pre class="whitespace-pre-wrap break-all" id="gitKey">${this.deploymentKey}</pre>
                    `,
                    customClass: {
                        container: 'rc-swal'
                    },
                    showCancelButton: true,
                    closeButtonHtml: '<i class="rc rc-ln-cross rc-ln-semibold text-misc-700"></i>',
                    confirmButtonText: 'Generate New Deployment Key'
                }).then((data) => {
                    if (data.isDismissed) return window.swal.close()
                    window.swal.fire({
                        title: 'Warning',
                        html: `
                            <div class="alert alert-warning"> Generating new deployment key will remove the current key from your server. </div>
                            <p>Be sure to update your Git repository with your newly created deployment key. Continue generating deployment key for user: <strong>${_self.user} </strong>?</p>`,
                        customClass: {
                            container: 'rc-swal'
                        },
                        showCancelButton: true,
                        closeButtonHtml: '<i class="rc rc-ln-cross rc-ln-semibold text-misc-700"></i>',
                        cancelButtonText: 'Cancel',
                        showLoaderOnConfirm: true,
                        confirmButtonText: 'Generate',
                        preConfirm () {
                            return new Promise((resolve, reject) => {
                                _self.generate(response => {
                                    resolve(response.data.deploymentKey)
                                }, error => {
                                    reject(error)
                                })
                            })
                        }
                    }).then((data) => {
                        if (data.isDismissed) return window.swal.close()
                        _self.deploymentKey = data.value
                        return this.view()
                    }).catch(window.swal.noop)
                }).catch(window.swal.noop)
            },

            noDeploymentKey () {
                let _self = this

                window.swal.fire({
                    title: 'Oops!',
                    text: `You have no deployment key for ${this.user} . Generate one now?`,
                    customClass: {
                        container: 'rc-swal'
                    },
                    showCancelButton: true,
                    showLoaderOnConfirm: true,
                    preConfirm () {
                        return new Promise((resolve, reject) => {
                            _self.generate(response => {
                                resolve(response.data.deploymentKey)
                            }, error => {
                                window.swal.close()
                                reject(error)
                            })
                        })
                    }
                }).then((data) => {
                    if (data.isDismissed) return window.swal.close()
                    _self.deploymentKey = data.value
                    return _self.view()
                }).catch(window.swal.noop)
            },

            generate (resolve, reject) {
                window.enterPage(this.url, {}, { method: 'post' }).then(response => {
                    resolve(response)
                    // window.notie.alert({ type: 'success', text: `New deployment key generated for ${this.user}`, time: 2 })
                    window.toastr.success(`New deployment key generated for ${this.user}`)
                    this.analyticEvent('Deployment Key', 'Click', 'Generate Key')
                }).catch(error => {
                    if (error.response.status === 429) {
                        reject('You can only generate 10 keys per minute')
                        return
                    }
                    reject(error)
                })
            }
        }
    }
</script>
