<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>Latest Connected Servers</h4>
        </div>
        <div class="panel-table table-responsive">
            <loader v-if="working"></loader>
            <table v-else class="table table-hover">
                <thead>
                    <tr>
                        <th>Server Name</th>
                        <th>IP Address</th>
                        <th>Owner Name</th>
                        <th>Owner Email</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(server, index) in servers" :key="index">
                        <td><a :href="server.url" target="_blank">{{ server.name }}</a></td>
                        <td>{{ server.ipAddress }}</td>
                        <td>{{ server.user.name }}</td>
                        <td><a href="">{{ server.user.email }}</a></td>
                    </tr>
                </tbody>
            </table>
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
