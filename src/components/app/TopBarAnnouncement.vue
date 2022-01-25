<template>
    <div class="announce-bar" v-if="toShow">
        <div class="d-flex flow-row w-100 justify-content-center" style="flex-grow: 1;">
            <slot></slot>
            <a class="readmore" :href="buttonUrl" target="_blank" rel="noreferrer"> {{ buttonText }} </a>
        </div>
        <i type="button" class="rc rc-ln-cross" data-dismiss="modal" aria-label="Close" @click="dismiss()"></i>
    </div>
</template>

<script>
export default {
    props: {
        text: String,
        buttonText: { required: true, type: String, default: 'Learn more' },
        buttonUrl: String
    },
    data() {
        return { toShow: this.checkCookie() }
    },
    methods: {
        checkCookie() {
            return !window.$cookies.isKey('dismiss-rc-announce')
        },
        dismiss() {
            this.toShow = !this.toShow
            window.$cookies.set('dismiss-rc-announce', true, '30d') // possible values for cookie expiry duration/date --> 60s, 7d, new Date(2021, 03, 12), -1 (never expires)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~sass/variables";

.announce-bar {
    background-color: $base-color-900;
    color: $white;
    display: flex;
    flex-direction: row;
    width: 100vw;
    align-items: center;
    padding: 12px 16px;
    transition: all 0.3s ease-in;

    --tw-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.4);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
        var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

    p {
        margin-bottom: 0;
        flex: 1 1 0%;
        @media (min-width: 768px) {
            text-align: center;
        }
    }

    i {
        margin-left: auto;
        margin-right: 8px;
        background-color: transparent;
        cursor: pointer;
    }

    @media print {
        display: none !important;
    }
}

.readmore {
    color: $warning-color;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 16px;
}
</style>
