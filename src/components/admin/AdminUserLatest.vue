<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>Latest Users</h4>
        </div>
        <div class="panel-table">
            <loader v-if="working"></loader>
            <table v-else class="table table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in users.latest">
                        <td>{{ user.name }}</td>
                        <td><a href="">{{ user.email }}</a></td>
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
            users: {}
        }
    },

    created () {
        this.fetch()
    },

    methods: {
        fetch () {
            window.enterPage(this.url).then(({data}) => {
                this.users = data
                this.working = false
            })
        }
    }
}
</script>
