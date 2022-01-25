<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>Users</h4>
        </div>
        <div class="panel-table">
            <loader v-if="working"></loader>

            <div v-else class="bg-white  rounded-t flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x justify-between">
                <div class="w-full md:w-3/12 py-4 px-7">
                    <div class="flex space-x-3 items-center justify-between">
                        <h6>Total Users</h6>
                        <i class="rc rc-ln-user text-blue-500 text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="text-2xl">{{ users.total }}</h3>
                    </div>
                </div>

                <div class="w-full md:w-3/12 py-4 px-7">
                    <div class="flex space-x-3 items-center justify-between">
                        <h6>Trial Users</h6>
                        <i class="rc rc-ln-eye text-blue-500 text-2xl"></i>
                    </div>

                    <div>
                        <h3 class="text-2xl">{{ users.totalTrial }}</h3>
                    </div>
                </div>

                <div class="w-full md:w-3/12 py-4 px-7">
                    <div class="flex space-x-3 items-center justify-between">
                        <h6>Business Users</h6>
                        <i class="rc rc-ln-coins text-blue-500 text-2xl"></i>
                    </div>

                    <div>
                        <h3 class="text-2xl">{{ users.totalBusiness }}</h3>
                    </div>
                </div>

                <div class="w-full md:w-3/12 py-4 px-7">
                    <div class="flex space-x-3 items-center justify-between">
                        <h6>Pro &amp; Biz Conversion</h6>
                        <i class="rc rc-ln-info text-blue-500 text-2xl"></i>
                    </div>

                    <div>
                        <h3 class="text-2xl">{{ parseFloat(parseInt(users.totalPro + users.totalBusiness) / parseInt(users.total) * 100).toFixed(2) }}%</h3>
                    </div>
                </div>
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
