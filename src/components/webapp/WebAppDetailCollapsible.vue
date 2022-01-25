<template>
    <div class="p-7">
        <h4 class="font-medium mb-4">Web application details</h4>

        <!-- <p class="whitespace-normal text-black-500 mb-4 font-medium">Linux-4.4.0-142-generic-x86_64-with-Ubuntu-16.04-xenial</p> -->

        <ul class="space-y-4">
            <li class="flex justify-between">
                <span class="text-misc-700">PHP Version</span>
                <span class="font-medium text-right">{{  phpVersionHumanReadable(webapp.phpVersion) }}</span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">Root Path</span>
                <span class="font-medium text-right">{{  webapp.rootPath }}</span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">User</span>
                <span class="font-medium text-right">{{  webapp.server_user.username }}</span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">Deployed On</span>
                <span class="font-medium text-right"><moment type="datetime" format="Do MMM YYYY" :time="webapp.created_at"></moment></span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">Mode</span>
                <span class="font-medium text-right capitalize">{{ webapp.stackMode }}</span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">Stack</span>
                <span class="font-medium text-right">{{ webapp.stackName.replace(/ *\([^)]*\) */g, "") }}</span>
            </li>

            <template v-if="webapp.type === 'phpmyadmin'">
                <li class="flex justify-between">
                    <span class="text-misc-700">phpMyAdmin Version</span>
                    <span class="font-medium text-right"> {{ webapp.pma.version }} </span>
                </li>
            </template>

            <template v-if="webapp.type === 'wordpress'">
                <li class="flex justify-between">
                    <span class="text-misc-700">WordPress Version</span>
                    <span class="font-medium text-right">5.6</span>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            webapp: Object
        }
    }
</script>
