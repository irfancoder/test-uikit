<template>
    <div class="flex items-center justify-between p-4 space-x-10 bg-gray-100 border rounded dns-record mb-7">
        <div class="flex-none w-16">
            <p>Type</p>
            <span>A</span>
        </div>
        <div class="flex-auto">
            <p>Content</p>
            <span>{{ url }}</span>
        </div>
        <div class="flex-auto">
            <p>IP Address</p>
            <span>{{ ipAddress }}</span>
        </div>
        <div>
            <a>How do I add this record to my DNS provider?</a>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url: String,
            ipAddress: String
        }
    }
</script>
