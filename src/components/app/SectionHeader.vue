<template>
    <section class="mb-6 section-header">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <template v-if="!$slots['custom-icon'] && icon">
                    <img :src="icon" :alt="title" v-if="iconType === 'png'" loading="lazy" class="w-8 h-8 rounded-full" />
                    <svg-icon :icon="`br-${icon}`" v-if="iconType === 'svg'"></svg-icon>
                </template>
                <template v-else>
                    <slot name="custom-icon"></slot>
                </template>

                <h1 class="whitespace-pre-wrap break-words" v-if="title">{{ title }}</h1>
                <slot name="title-header"></slot>
            </div>

            <div class="hidden" ref="actionHeader" v-if="$slots['action-header']" id="action-header">
                <ul ref="menu">
                    <slot name="action-header"></slot>
                </ul>
            </div>

            <div v-show="this.MediaQuery('up', 'md')" id="actionMdUp" class="action-header">
                <ul id="desktopMenu">
                    <li v-show="!isMoreEmpty">
                        <div class="dropdown">
                            <button class="dropdown-toggle btn btn-default icon-only" data-toggle="dropdown"><i class="rc rc-ln-more"></i></button>
                            <ul id="desktopMore" class="min-w-48 dropdown-menu dropdown-menu-right"></ul>
                        </div>
                    </li>
                </ul>
            </div>

            <div v-show="this.MediaQuery('down', 'md')" id="actionMdLow" class="action-header">
                <div v-show="allMenus.length > 0" class="dropdown">
                    <button class="dropdown-toggle btn btn-default icon-only" data-toggle="dropdown"><i class="rc rc-ln-more"></i></button>
                    <ul id="mobileMore" class="min-w-48 dropdown-menu dropdown-menu-right"></ul>
                </div>
            </div>
        </div>

        <div class="sub-header" v-if="$slots['sub-header']">
            <slot name="sub-header"></slot>
        </div>
    </section>
</template>
<script>
export default {
    props: {
        title: { type: String, required: true },
        icon: { type: String },
        iconType: { type: String, default: 'png' }
    },

    data: () => ({
        allMenus: [],
        shortMenus: null,
        moreMenus: null,
        isMoreEmpty: { default: true }
    }),

    inject: ['MediaQuery', '$breakpoint'],

    watch: {
        breakpoint () {
            this.prep()
        }
    },

    mounted () {
        this.initHeader()
    },

    computed: {
        breakpoint () {
            return this.$breakpoint()
        }
    },

    methods: {
        initHeader () {
            const menuList = this.$refs.menu
            if (menuList === undefined) return
            this.allMenus = menuList.querySelectorAll('li')
            this.moreMenus = menuList.querySelectorAll('li[data-type=more]')
            this.shortMenus = menuList.querySelectorAll('li:not([data-type=more])')
            this.shortMenus = Array.prototype.reverse.call(Array.from(this.shortMenus))
            this.isMoreEmpty = window._.isEmpty(Array.from(this.moreMenus))
            this.prep()
        },

        prep () {
            if (this.allMenus.length === 0) return
            const desktopMore = document.getElementById('desktopMore')
            const desktopMenu = document.getElementById('desktopMenu')
            const mobileMore = document.getElementById('mobileMore')

            if (this.MediaQuery('up', 'md')) {
                this.shortMenus.forEach(menu => desktopMenu.prepend(menu))
                if (!this.isMoreEmpty) this.moreMenus.forEach(menu => desktopMore.append(menu))
            } else {
                this.allMenus.forEach(menu => mobileMore.appendChild(menu))
            }
        }
    }
}
</script>

<style lang="scss">
    .section-header {
        .sub-header,
        .action-header {
            > ul {
                @apply flex;

                > li {
                    span + span {
                        &::before {
                            @apply relative mx-2;
                            content: "•";
                        }
                    }
                }
            }
        }

        .sub-header {
            > ul {
                @apply flex-wrap;

                li {
                    @apply text-misc-700 font-normal mr-7;
                    line-height: 32px;
                }

                i {
                    @apply hidden text-misc-100;

                    &::before {
                        @apply font-semibold;
                        line-height: 14px;
                    }
                }

                @screen lg {
                    @apply flex-row mt-2;

                    li {
                        @apply text-black-500 font-normal mr-0 leading-normal;
                    }

                    li + li {
                        @apply ml-10 border-0;
                    }

                    i {
                        @apply inline-block;

                        + span {
                            @apply ml-3;
                        }
                    }
                }
            }
        }

        .action-header {
            > ul > li + li {
                @apply ml-1;
            }
        }
    }
</style>

<style lang="scss">
    .action-header {
        li[data-type="icon"] {
            span {
                @apply md:hidden;
            }
        }
    }
</style>
