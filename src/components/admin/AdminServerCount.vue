<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>Servers</h4>
        </div>
        <div class="panel-body">
            <loader v-if="working"></loader>
            <div v-else>
                <p>Total: {{ servers.total }}</p>
                <p>Connected: {{ servers.connected }}</p>
                <p>Online: {{ servers.online }}</p>
                <p>Not Connected: {{ servers.notConnected }}</p>
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
            servers: {}
        }
    },

    created () {
        this.fetch()
    },

    methods: {
        fetch () {
            window.enterPage(this.url).then(({data}) => {
                this.servers = data
                this.working = false
            })
        }
    }
}
</script>