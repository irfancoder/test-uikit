<template>
    <span class="loader"></span>
</template>

<style lang="scss" scoped>
    .loader,
    .loader:after {
        border-radius: 50%;
        width: 16px;
        height: 16px;
    }

    .loader {
        @apply inline-block;
        font-size: 2px;
        position: relative;
        text-indent: -9999em;
        border: 2px solid #cfd6e4;
        border-left: 2px solid #1654d1;
        transform: translateZ(0);
        animation: load8 300ms infinite linear;
    }

    @keyframes load8 {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
