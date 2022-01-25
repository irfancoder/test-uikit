<template>
    <div class="md:flex md:items-center md:content-between form-group form-search">
        <i v-if="leftIcon" :class="`left-0 opacity-75 ${leftIcon} rc-icon absolute left-icon transform top-1/2 -translate-y-1/2`"></i>
        <i v-if="rightIcon" :class="`left-0 opacity-75 ${rightIcon} rc-icon absolute right-icon transform top-1/2 -translate-y-1/2`"></i>
        <input
            ref="search"
            @input="search"
            type="text"
            class="form-control"
            v-model="searchValue"
            :placeholder="placeholder"
            @keyup="setWorking"/>
        <i class="rc rc-ln-spinner rc-spin" :working="true" v-if="working"></i>
        <i @click="clearSearch" class="absolute right-0 transform -translate-y-1/2 opacity-75 rc rc-ln-cross rc-icon right-icon top-1/2" v-if="!working && searchValue !== null && searchValue.length > 0"></i>
    </div>
</template>

<script>
    export default {
        props: {
            url: String,
            inputAddonClass: String,
            searchKey: { type: String, default: 'search' },
            placeholder: { default: 'Search...' },
            leftIcon: { type: String, required: false, default: 'rc rc-ln-search' },
            rightIcon: String
        },

        data () {
            return {
                working: false,
                searchValue: null,
                urlParams: new URLSearchParams(window.location.search)

            }
        },

        created () {
            let search = this.urlParams.get(this.searchKey)

            if (search !== null) {
                this.searchValue = search
            }
        },

        mounted () {
            if (this.searchValue !== null) {
                this.$refs.search.focus()
            }
        },

        methods: {
            search: window._.debounce(function () {
                let url = new URL(this.url)

                // append existing filter params
                for (let params of this.urlParams.entries()) {
                    url.searchParams.set(params[0], params[1])
                }

                // set the new query params
                url.searchParams.set('scroll', window.scrollY)
                url.searchParams.set(this.searchKey, this.searchValue)

                // remove page if exist
                url.searchParams.delete('page')

                if (window.location.hash) {
                    url = url + window.location.hash
                }
                // let url = window.sprintf('%s?%s=%s&scroll=%s', this.url, this.searchKey, this.searchValue, window.scrollY)
                window.handleRedirect(url)
            }, 500),

            setWorking () {
                if (this.searchValue.length === 0) {
                    this.working = false
                    return
                }

                this.working = true
            },

            clearSearch () {
                this.searchValue = ''
                this.search()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .form-group {
        @apply mb-0 relative;

        i {
            @apply text-gray-700 text-base z-1 pl-3 pr-1;

            &::before {
                @apply font-bold;
            }
        }

        .left-icon {
            & ~ input {
                @apply pl-8;
            }
        }

        .right-icon {
            & ~ input {
                @apply pr-8;
            }
        }

        .form-control {
            @apply w-full relative m-0 md:w-60;
        }

        .rc-ln-search {
            @apply absolute;
        }

        .rc-ln-cross,
        .rc-ln-spinner {
            @apply absolute right-0 cursor-pointer;
        }
    }
</style>
