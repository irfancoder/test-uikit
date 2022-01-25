<template>
    <div class="p-7">
        <h4 class="font-medium mb-4">Server details</h4>

        <p class="whitespace-normal text-black-500 mb-4 font-medium">Linux-4.4.0-142-generic-x86_64-with-Ubuntu-16.04-xenial</p>

        <ul class="space-y-4">
            <li class="flex justify-between">
                <span class="text-misc-700">Provider</span>
                <span class="font-medium text-right">{{  _.startCase(_.toLower(server.provider)) }}</span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">Memory</span>
                <span class="font-medium text-right"> {{ server.memory }} </span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">Disk Space</span>
                <span class="font-medium text-right"> {{ server.disk }} </span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">CPU</span>
                <span class="font-medium text-right">{{ server.processorName }}</span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">ISP</span>
                <span class="font-medium text-right">{{ server.isp }}</span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">Location</span>
                <span class="font-medium text-right">{{ location }}</span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">Agent Version</span>
                <span class="font-medium text-right">{{ server.agentVersion }}</span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">Web Server</span>
                <span class="font-medium text-right">{{ server.webServerType === 'nginx' ? 'NGINX' : 'OpenLiteSpeed' }}</span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">IPV4</span>
                <span class="font-medium text-right">{{ server.ipAddress }}</span>
            </li>
            <li class="flex justify-between">
                <span class="text-misc-700">IPV6</span>
                <span class="font-medium text-right">2a01:4f8:1c17:4f79::1</span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            server: Object,
            location: String
        }
    }
</script>
