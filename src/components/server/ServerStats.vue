<template>
    <div class="border border-t-0 rounded-b-md flex flex-col md:flex-row justify-between divide-y md:divide-y-0 bg-white">
        <div class="w-full md:w-3/12 py-4 px-7">
            <div class="flex items-center">
                <i class="rc rc-ln-app rc-ln-semibold text-lg text-blue-500 mr-3"></i>
                <h6 class="font-normal">Web Application: </h6>
                <p class="text-black-500 ml-auto">{{ stats.webApplication }}</p>
            </div>
            <!-- <a :href="webApplicationUrl">View all</a> -->
        </div>

        <div class="w-full md:w-3/12 py-4 px-7">
            <div class="flex items-center">
                <i class="rc rc-ln-database rc-ln-semibold text-lg text-blue-500 mr-3"></i>
                <h6 class="font-normal">Database: </h6>
                <p class="text-black-500 ml-auto">{{ stats.database }}</p>
            </div>
            <!-- <a :href="databaseUrl">View all</a> -->
        </div>

        <div class="w-full md:w-3/12 py-4 px-7">
            <div class="flex items-center">
                <i class="rc rc-ln-loop rc-ln-semibold text-lg text-blue-500 mr-3"></i>
                <h6 class="font-normal">Cronjob: </h6>
                <p class="text-black-500 ml-auto">{{ stats.cronJob }}</p>
            </div>
            <!-- <a :href="cronJobUrl">View all</a> -->
        </div>

        <div class="w-full md:w-3/12 py-4 px-7">
            <div class="flex items-center">
                <i class="rc rc-ln-tool rc-ln-semibold text-lg text-blue-500 mr-3"></i>
                <h6 class="font-normal">Supervisor: </h6>
                <p class="text-black-500 ml-auto">{{ stats.supervisor }}</p>
            </div>
            <!-- <a :href="supervisorUrl">View all</a> -->
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            isPro: { required: true, type: Boolean },
            stats: Object,
            webApplicationUrl: String,
            databaseUrl: String,
            cronJobUrl: String,
            supervisorUrl: String
        }
    }
</script>
