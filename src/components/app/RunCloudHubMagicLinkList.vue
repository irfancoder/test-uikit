<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>Magic Link Login</h4>
            <p>You can use the RunCloud Hub magic link to log in directly to your WordPress dashboard as a user listed below with Administrator, Editor, or Author role.</p>
        </div>
        <div class="panel-table table-responsive">
            <loader v-if="fetchingList"></loader>
            <table v-else class="table table-hover">
                <thead>
                    <tr>
                        <th>Site URL</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Login <span v-tooltip.left="'Login as the selected user using magic link'"><i class="rc rc-ln-info rc-ln-semibold ml-2"></i></span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(userDetail, index) in users" v-bind:key="index">
                        <td><a :href="userDetail.url.toString()" target="_blank" rel="noreferrer"> {{ userDetail.domain }} </a></td>
                        <td>{{ userDetail.user_login }}</td>
                        <td>{{ userDetail.user_email }}</td>
                        <td>{{ userDetail.user_role }}</td>
                        <td>
                            <div class="flex items-center space-x-4 justify-end" v-if="fetchingLink">
                                <loader></loader>
                                <span>Redirecting...</span>
                            </div>
                            <button role="button" type="button" @click="logInNow(userDetail.blog_id, userDetail.user_id)" class="text-blue-500" v-else>Login as</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url: String,
            loginUrl: String
        },

        data () {
            return {
                users: {},
                fetchingList: true,
                fetchingLink: false
            }
        },

        created () {
            this.fetch()
        },

        methods: {
            fetch () {
                window.enterPage(this.url).then(response => {
                    this.users = response.data
                    this.fetchingList = false
                }).catch(e => {
                    if (e.response.status === 403) {
                        window
                            .swal.fire({
                                title: 'Warning',
                                text: e.response.data.message,
                                icon: 'error'
                            })
                            .catch(window.swal.noop)
                    }
                    this.fetchingList = false
                })
            },

            logInNow (blogId, userId) {
                this.fetchingLink = true
                let loginUrl = `${this.loginUrl}?blogId=${blogId}&userId=${userId}`
                window.enterPage(loginUrl, {}, { method: 'get', showAlert: false }).then(response => {
                    window.open(response.data.url, '_blank')
                    // eslint-disable-next-line handle-callback-err
                }).catch(error => {
                    this.fetchingLink = false
                }).finally(() => {
                    this.fetchingLink = false
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    a {
        cursor: pointer;
    }
</style>
