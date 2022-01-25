<template>
    <div>
        <span :class="`badge badge-${severity.class}`">{{ severity.label }}</span>
    </div>
</template>

<script>
    export default {
        props: {
            severity: { required: true, type: Object }
        }
    }
</script>
