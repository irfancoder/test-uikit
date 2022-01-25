<template>
    <div>
        <div class="relative py-4">
            <div class="flex items-center justify-between w-full px-4">
                <div class="flex mr-8 space-x-4">
                    <vps-icon :provider="item.provider" class="self-start"></vps-icon>
                    <div>
                        <div>{{ item.name }}</div>
                        <div class="text-gray-700">{{ item.ipAddress }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['item']
    }
</script>
