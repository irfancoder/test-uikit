<template>
    <div>
        <ul class="nav nav-tabs -mt-4" role="tablist">
            <li v-for="(link, index) in links" v-if="(webApp.stack === 'hybrid' && link.hybrid === true) || link.hybrid === false" role="presentation" class="nav-item" :key="index">
                <a role="button" @click="setView(link)" class="nav-link" :class="{ active: link.key === view }">{{ link.name }}</a>
            </li>
        </ul>

        <div class="panel panel-default">
            <div class="panel-heading">
                <p>This is the log for your Web Application {{ webApp.name }}. This log viewer will only read the last <strong>500 lines</strong> of the actual log files.</p>
            </div>

            <div class="panel-body">
                <!-- Tab panes -->
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active">
                        <div v-if="view === 'nginx-access'" class="alert alert-default">
                            <p>Nginx Access log is buffered to make a faster request to the Nginx (except in Development Mode). It will only write to Nginx Access Log after the buffer has successfully filled up (~16k bytes).</p>
                        </div>
                        <webserver-log-view :url="url" :view="view" @fetching="loading"></webserver-log-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url: String,
            webApp: Object,
            webServer: String
        },

        data () {
            return {
                links: [
                    {
                        name: 'Nginx Access Log',
                        key: 'nginx-access',
                        hybrid: false
                    },
                    {
                        name: 'Nginx Error Log',
                        key: 'nginx-error',
                        hybrid: false
                    },
                    {
                        name: 'Apache Access Log',
                        key: 'apache-access',
                        hybrid: true
                    },
                    {
                        name: 'Apache Error Log',
                        key: 'apache-error',
                        hybrid: true
                    },
                    {
                        name: '*G-Firewall',
                        key: 'g-firewall',
                        hybrid: false
                    },
                    {
                        name: 'ModSec Audit Log',
                        key: 'modsec-audit',
                        hybrid: false
                    }
                ],
                view: 'nginx-access',
                fetching: true
            }
        },

        methods: {
            setView (link) {
                this.view = link.key
            },

            // reload () {
            //     window.bus.$emit('reload-log')
            // },

            loading (value) {
                this.fetching = value
            }
        },

        created() {
            if (this.webServer === 'ols') {
                this.links = [
                    {
                        name: 'LSWS Access',
                        key: 'lsws-access',
                        hybrid: false
                    },
                    {
                        name: 'LSWS Error',
                        key: 'lsws-error',
                        hybrid: false
                    },
                    {
                        name: 'ModSec Audit Log',
                        key: 'modsec-audit',
                        hybrid: false
                    }
                ]
                this.view = 'lsws-access'
            }
        }
    }
</script>
