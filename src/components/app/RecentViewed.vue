<template>
    <div class="-mt-2">
        <div class="text-misc-200">Recently viewed {{ title }}</div>
        <div class="flex space-x-4 w-full overflow-x-auto mt-4 mb-7 flex-no-wrap no-scrollbar">
            <div class="bg-white border rounded-md p-4 w-64 flex-shrink-0" v-for="(item, idx) in data" :key="idx">
                <slot :obj="item" name="custom"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['data', 'title']
    }
</script>
