<template>
    <div>
        <div class="progress my-2">
            <div :class="`progress-bar progress-bar-primary active ${ animate ? 'progress-animate' : ''}`" role="progressbar" aria-valuemin="0" aria-valuemax="100" :style="{ width: `${percentage}%` }"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            percentage: { type: Number, required: true },
            animate: { type: Boolean, default: false }
        }
    }
</script>