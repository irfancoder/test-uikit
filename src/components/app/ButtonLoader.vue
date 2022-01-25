<template>
    <span class="relative">
        <template v-if="working && !disabled">
            <span class="opacity-0" v-if="text">{{ text }}</span>
            <div class="la-ball-beat absolute">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </template>
        <template v-else>
            {{ text }}
        </template>
    </span>
</template>

<script>
    export default {
        props: {
            text: { default: 'Do Something' },
            loadingText: { default: 'Loading...' },
            working: { required: true, type: Boolean },
            disabled: { type: Boolean }
        }
    }
</script>

<style lang="scss" scoped>
    .la-ball-beat,
    .la-ball-beat > div {
        position: relative;
        box-sizing: border-box;
    }

    .la-ball-beat.la-dark {
        color: #333;
    }

    .la-ball-beat {
        display: block;
        font-size: 0;
        color: #fff;
        width: 32px;
        height: 12px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;

        > div {
            display: inline-block;
            float: none;
            background-color: currentColor;
            border: 0 solid currentColor;
            width: 6px;
            height: 6px;
            margin: 2px;
            border-radius: 100%;
            animation: ball-beat 0.7s -0.15s infinite linear;

            &:nth-child(2n-1) {
                animation-delay: -0.5s;
            }
        }
    }

    @keyframes ball-beat {
        50% {
            opacity: 0.2;
            transform: scale(0.75);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
