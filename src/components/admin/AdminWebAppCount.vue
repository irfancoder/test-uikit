<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>Web Applications</h4>
        </div>
        <div class="panel-body">
            <loader v-if="working"></loader>
            <div v-else>
                <p>Total: {{ webApps.total}}</p>
                <p>Using Git: {{ webApps.totalGIT }}</p>
                <p>Using Script Installer: {{ webApps.totalScriptInstaller }}</p>
                <p>Using SSL: {{ webApps.totalSSL }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        url: String
    },

    data () {
        return {
            working: true,
            webApps: {}
        }
    },

    created () {
        this.fetch()
    },

    methods: {
        fetch () {
            window.enterPage(this.url).then(({data}) => {
                this.webApps = data
                this.working = false
            })
        }
    }
}
</script>