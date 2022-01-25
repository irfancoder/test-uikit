<template>
    <div>
        <template v-if="previousStatuses.length === 0">
            <label class="form-label">Choose how would you like to connect your server</label>
            <ul class="nav nav-tabs" role="tablist">
                <li role="presentation" class="nav-item">
                    <a href="#directInstallation" role="tab" class="nav-link active" data-toggle="tab" aria-controls="direct" aria-selected="true">Direct Installation</a>
                </li>
                <li role="presentation" class="nav-item">
                    <a href="#manualInstallation" role="tab" class="nav-link" data-toggle="tab" aria-controls="manual" aria-selected="false">Manual Installation</a>
                </li>
            </ul>

            <div class="tab-content">
                <div role="tabpanel" class="tab-pane active" id="directInstallation" aria-labelledby="direct-installation-tab">
                    <div class="alert alert-warning">
                        <p>This direct installation only tested using <strong>DigitalOcean</strong>, <strong>Upcloud</strong>, <strong>Linode</strong> and <strong>Vultr</strong>.
                        Please note that you may need to fall back to manual installation if direct installation does not work. Direct installation <strong>may modify</strong> original <strong>root password</strong>. The new password will be given once the installation has started.</p>
                    </div>

                    <loader v-if="working"></loader>
                    <form v-else @submit.prevent="submitForm(form, $event, 'Server', 'Add', 'Direct Install')" :action="url" role="form">
                        <div class="form-group" :class="[{'has-error': form.errors.has('rootPassword')}]">
                            <label class="form-label">Current Root Password</label>
                            <input
                                type="password"
                                class="form-control"
                                name="rootPassword"
                                v-model="form.rootPassword"
                                @input="form.errors.clear()"
                                placeholder="Type your server's root password here">

                            <span v-if="form.errors.has('rootPassword')" v-text="form.errors.get('rootPassword')" class="help-block"></span>
                        </div>

                        <panel-footer class="justify-end">
                            <form-button :model="form">
                                <button-loader text="Start The Installation" :working="working"></button-loader>
                            </form-button>
                        </panel-footer>
                    </form>
                </div>

                <div role="tabpanel" class="tab-pane" id="manualInstallation" aria-labelledby="manual-installation-tab">
                    <ul class="space-y-8 list-number">
                        <li>
                            <div class="flex items-start justify-between">
                                <h6>Log into your server as <code>root</code> via SSH/Putty. And enter your root password</h6>
                                <a class="py-0 btn-clipboard btn btn-primary btn-link" data-clipboard-target="#copySSH" data-clipboard-action="copy"><i class="rc rc-ln-copy"></i><span>Copy</span></a>
                            </div>
                            <code-block id="copySSH"><template>ssh root@{{ ipAddress }}</template></code-block>
                        </li>
                        <li>
                            <div class="flex items-start justify-between">
                                <h6>Copy script below and paste in on your terminal.</h6>
                                <a class="py-0 btn-clipboard btn btn-primary btn-link" data-clipboard-target="#copyCode" data-clipboard-action="copy"><i class="rc rc-ln-copy"></i><span>Copy</span></a>
                            </div>
                            <code-block id="copyCode" :enable-scroll="true"><template>{{ script }}</template></code-block>
                        </li>
                        <li>
                            <h6>Run the script to start. And sit back enjoy your coffee</h6>
                            <p>Installation typically take around 15 minutes.</p>
                        </li>
                    </ul>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="alert alert-primary">
                <p>Almost there! You can close this page while waiting RunCloud agent successfully installed. Installation might take around 15 minutes. You can come back once we configure your server. We’ll send an email to you once your server is ready.</p>
            </div>
            <div class="progress">
                <div class="progress-bar progress-bar-primary active" role="progressbar" aria-valuemin="0" aria-valuemax="100" :style="{ width: `${currentStatus.percentage}%` }"></div>
            </div>
            <div class="flex justify-between">
                <p class="font-medium"></p>
                <p class="font-medium text-blue-500">{{ currentStatus.percentage }}%</p>
            </div>

            <div class="mb-7"></div>

            <runcloud-editor
                lang="ace/mode/text"
                :content="content"
                :sync="true"
                height="400px"
                :read-only="true"
                :is-fullscreen-enabled="false"
                editor-title="Installation Log">
            </runcloud-editor>

            <p class="mt-7">Stuck with the installation? <a :href="supportUrl">Contact our support team</a></p>
        </template>

        <server-set-to-online :redirect-url="installedUrl"></server-set-to-online>
    </div>
</template>

<script>
    import AjaxForm from '@/classes/AjaxForm'

    export default {
        props: {
            url: String,
            apiPort: Number,
            script: String,
            ipAddress: String,
            installedUrl: String,
            serverName: String,
            supportUrl: String,
            previousStatuses: Array
        },

        data () {
            return {
                working: false,
                form: new AjaxForm({
                    rootPassword: null
                })
            }
        },

        created () {
            window.Echo.private('servers.' + window.RunCloud.server).listen('.ServerIsInstalling', status => {
                if (status.server_id === window.RunCloud.server) {
                    this.previousStatuses = window._.concat(this.previousStatuses, status)
                }
            })

            // if dah submit form, pastikan working = tru
            window.bus.$on('submitted', data => {
                this.working = true
            })
        },

        computed: {
            content: function () {
                return this.previousStatuses.map(status => status.status).join('\n')
            },

            currentStatus: function () {
                return this.previousStatuses.length ? this.previousStatuses[this.previousStatuses.length - 1] : null
            }
        },

        methods: {
            a (val) {
                this.form.errors.clear()
            }
        }
    }
</script>
