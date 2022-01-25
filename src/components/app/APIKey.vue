<template>
    <div>
        <div>
            <div class="flex items-start justify-between">
                <label class="form-label">API Key</label>
                <div>
                    <a class="btn btn-primary btn-link btn-clipboard" data-clipboard-target="#apiKey" data-clipboard-action="copy"><i class="rc rc-ln-copy"></i><span>Copy</span></a>
                    <a class="btn btn-primary btn-link" :class="{ 'disabled' : working }" v-tooltip.top="'Regenerate API Key'" @click="regenerate('apiKey')">
                        <template v-if="!working"><i class="rc rc-ln-loop"></i><span>Regenerate</span></template>
                        <template v-else>
                            <loader class="mr-3 align-text-bottom"></loader><span>Generating</span>
                        </template>
                    </a>
                </div>
            </div>
            <code-block id="apiKey" :code="apiKey"></code-block>
        </div>

        <br>

        <div>
            <div class="flex items-start justify-between">
                <label class="form-label">API Secret</label>

                <div>
                    <a class="btn btn-primary btn-link btn-clipboard" data-clipboard-target="#apiSecret" data-clipboard-action="copy"><i class="rc rc-ln-copy"></i><span>Copy</span></a>
                    <a class="btn btn-primary btn-link" :class="{ 'disabled' : working }" v-tooltip.top="'Regenerate API Secret'" @click="regenerate('apiSecret')">
                        <template v-if="!working"><i class="rc rc-ln-loop"></i><span>Regenerate</span></template>
                        <template v-else>
                            <loader class="mr-3 align-text-bottom"></loader><span>Generating</span>
                        </template>
                    </a>
                </div>
            </div>
            <code-block id="apiSecret" :code="apiSecret"></code-block>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        url: { required: true },
        originalApiKey: { required: true },
        originalApiSecret: { required: true }
    },

    data () {
        return {
            apiKey: '',
            apiSecret: '',
            working: false
        }
    },

    created () {
        this.apiKey = this.originalApiKey
        this.apiSecret = this.originalApiSecret
    },

    methods: {
        regenerate (type) {
            let data = {
                type: type
            }

            this.analyticEvent('API Key', 'Regenerate', 'Regenerate ' + type)

            let self = this
            window.swal.fire({
                title: `Renegerate ${this.rename(type)}`,
                html: `
                    <div class="alert alert-warning"> Beware that the existing ${this.rename(type)} will be lost and no longer be usable </div>
                    <div> Confirm that you want to continue to generate a new ${this.rename(type)}?</div>
                    `,
                customClass: {
                    container: 'rc-swal'
                },
                showCloseButton: true,
                closeButtonHtml: '<i class="rc rc-ln-cross rc-ln-semibold text-misc-700"></i>',
                input: self.requireInput ? 'text' : null,
                showLoaderOnConfirm: true,
                showCancelButton: true,
                confirmButtonText: 'Regenerate',
                preConfirm (value) {
                    return new Promise((resolve, reject) => {
                        window.enterPage(self.url, data, { method: 'post' }).then(({ data }) => {
                            self.apiKey = data.apiKey
                            self.apiSecret = data.apiSecret
                            resolve(data)
                        }).catch(error => {
                            if (error.response.status === 429) { window.swal.close() }
                        })
                    })
                }
            }).then(data => {
                self[type] = data.value[type]
                self.$forceUpdate()

                window.swal.fire({
                    title: `New ${this.rename(type)}`,
                    html: `
                            <div class="flex space-x-4 justify-between align-baseline"> 
                                <p>Here is your new ${this.rename(type)}:</p>
                                <button class="btn btn-primary btn-link btn-clipboard" v-tooltip.top="'Copy'" data-clipboard-target="#newData" data-clipboard-action="copy">
                                    <i class="rc rc-ln-copy"></i><span>Copy</span>
                                </button>
                            </div>
                            <br />
                            <pre class="whitespace-pre-wrap break-all" id="newData"><code>${data.value[type]}</code></pre>
                            `,
                    customClass: {
                        container: 'rc-swal'
                    },
                    showCancelButton: false,
                    confirmButtonText: 'Close'
                })
            }).catch(window.swal.noop)
        },

        rename (type) {
            return type.replace(/api/g, 'API&nbsp;')
        }
    }
}
</script>
