<template>
    <div class="border-b">
        <div class="bg-gray-100 my-3 border rounded">
            <ul class="divide-y">
                <li class="flex py-3 px-2" v-for="status in statuses" :key="status.id">
                    <div class="relative flex mr-7 mt-1">
                            <i class="rc text-xl font-bold rounded-full flex flex-shrink-0 justify-center items-center bg-blue-400 bg-opacity-20 h-10 w-10"
                                :class="`rc-ln-server text-blue-500`"></i>
                    </div>
                    <div class="w-full">
                        <div class="flex justify-between">
                            <h6 class="font-semibold">{{ status.server.name  }}</h6>
                            <span class="text-misc-700">{{ status.percentage }}%</span>
                        </div>
                        <progress-bar :percentage="status.percentage"></progress-bar>
                        <p v-html="status.status" class="whitespace-normal"></p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            icon: { type: String, required: true },
            statuses: { type: Array, required: true }
        }
    }
</script>
