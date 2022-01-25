<template>
    <div>
        <div class="hidden md:flex form-search-placeholder relative justify-content-between items-center">
            <i class="left-0 ml-3 text-blue-100 opacity-75 rc rc-ln-search rc-icon"></i>
            <i class="right-0 mr-3 text-blue-100 opacity-0 md:opacity-75 rc rc-ln-search-shortcut rc-icon" @click="toggleSearchBox" role="button"></i>
            <input ref="searchPlaceholder"
                type="text"
                class="form-control"
                :placeholder="placeholder" autocomplete="off" @click="toggleSearchBox">
        </div>
        <a role="button" class="flex md:hidden" @click="toggleSearchBox">
            <i class="rc rc-ln-search rc-icon-navbar"></i>
        </a>
            
        <div v-if="toggleSearch" class="fixed top-0 bottom-0 left-0 right-0 w-screen h-screen search-result-container">
            <div class="w-11/12 mx-auto md:w-84 lg:w-165">
                <div>
                    <div class="relative">
                        <i class="left-0 ml-3 text-gray-700 rc rc-ln-search rc-icon"></i>
                        <i class="right-0 mr-3 text-gray-700 cursor-pointer rc rc-ln-cross rc-icon hover:text-gray-900" @click="toggleSearchBox" role="button"></i>
                        <span v-if="searchText.length > 0" class="top-0 right-12 text-misc-200 absolute text-sm border mt-2 rounded px-2 py-0.5 cursor-pointer hover:text-gray-900 hover:border-gray-700 transition-all duration-100" @click.prevent="clearSearch">Clear</span>
                        <input
                            ref="search"
                            type="text"
                            class="my-3 form-control pr-28"
                            v-model="searchText" v-on:keyup="runSearch"
                            :placeholder="placeholder" autocomplete="off">
                    </div>
                    <div class="px-4 pt-4 bg-white rounded-t result-container relative">
                        <p class="text-sm">I'm looking for...</p>
                        <div tabindex="-1" class="flex space-x-2 py-3 overflow-auto no-scrollbar px-1">
                            <label :class="`search-tab cursor-pointer ${selectedCategory === category.key ? 'badge-primary' : 'badge-default'} ${category.disabled ? 'opacity-50 cursor-not-allowed' : '' }`" v-for="(category, index) in searchCategories" :for="index" :key="category.key" v-tooltip.top="category.disabled ? 'Available for Business Plan' : ''">
                                <input type="radio" name="category" :id="index" :value="category.key" v-model="selectedCategory" :disabled="category.disabled"> <span class="font-medium">{{ category.value }}</span>
                            </label>
                        </div>
                        <hr>
                        <div class="min-h-64 max-h-100 overflow-y-auto pt-4 pb-1">
                            <div class="w-full" v-if="working">
                                <skeleton-base :width="500" :height="32" class="pb-2">
                                    <template #default>                                    
                                        <rect x="4" y="2" rx="2" ry="2" width="100" height="20" />
                                    </template>
                                </skeleton-base>
                                <div class="space-y-4">
                                    <skeleton-base v-for="index in 3" :key="index" :width="500" :height="60">
                                        <template #default>
                                            <circle cx="20" cy="12" r="12" />
                                            <rect x="46" y="2" rx="2" ry="2" width="100" height="14" />
                                            <rect x="46" y="24" rx="2" ry="2" width="100%" height="12" />
                                            <rect x="46" y="38" rx="2" ry="2" width="100%" height="12" />
                                        </template>
                                    </skeleton-base>
                                </div>
                            </div>
                            <p v-if="searchNotFound && !working && searchText.length > 0" class="text-center">Cannot find any match!</p>
                            <div id="search-result" v-if="searchResults && !working">
                                <ul>
                                    <template v-for="cat in searchResults">
                                        <h5 :key="cat.title" class="font-semibold mb-2" :class="{ 'mt-4' : searchResults[0].title !== cat.title }">{{ cat.title }}</h5>
                                        <li :aria-selected="[ index === 0 && searchResults[0].title === cat.title ? 'true' : 'false' ]" role="option" tabindex="0" v-for="(item, index) in cat.items" :key="index" @mouseenter="setHover($event)" :url="item.url" @click="registerRecent">
                                            <a :href="item.url" class="flex px-2">
                                            <i class="rc text-xl mr-4 text-misc-700" :class="item.icon"></i>
                                                <div>
                                                    <h6 class="font-medium mb-0.5">{{ item.name }}</h6>
                                                    <p class="text-gray-700 text-sm">{{ item.desc }}</p>
                                                    <p class="text-gray-700 text-sm">{{ item.extra }}</p>
                                                </div>
                                            <i class="rc rc-ln-curved-arrow-left rc-ln-semibold text-misc-100 ml-auto"></i>
                                            </a>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                            <div v-if="searchResults.length === 0 && recentData.length === 0">
                                <p class="text-center"> You can search for Server, Web Application, Database and more</p>
                                <br>
                            </div>
                            <div id="search-recent" v-else>
                                <ul v-if="recentData.length > 0 && (searchResults.length === 0)">
                                    <h5 class="font-semibold mb-2">Recent</h5>
                                    <template v-for="(item, index) in recentData">
                                        <li :aria-selected="[ index === 0 && recentData[0].search === item.search ? 'true' : 'false' ]" role="option" tabindex="0" :key="index" class="flex px-2" @mouseenter="setHover($event)" v-on:click="goSearch(item.search)" :url="item.search">
                                            <div>
                                                <h6 class="font-medium mb-0.5">{{ item.search }}</h6>
                                            </div>
                                            <i class="rc rc-ln-curved-arrow-left rc-ln-semibold text-misc-100 ml-auto"></i>
                                        </li>
                                    </template>
                                </ul>
                            </div>

                            <div class="absolute w-full inset-x-0 bg-white h-14 bottom-0 -mb-14 rounded-b px-4 py-4 border-t">
                                <div class="space-x-4">
                                    <span class="text-misc-300 text-sm hidden md:inline-block">
                                        <kbd class="bg-misc-400 text-misc-300">Tab</kbd>
                                        <kbd class="bg-misc-400 text-misc-300">&larr;</kbd>
                                        <kbd class="bg-misc-400 text-misc-300">↕</kbd>
                                        <!-- <kbd class="bg-misc-400 text-misc-300">&darr;</kbd> -->
                                        <kbd class="bg-misc-400 text-misc-300">&rarr;</kbd>
                                        to navigate
                                    </span>
                                    <span class="text-misc-300 text-sm hidden md:inline-block">
                                        <kbd class="bg-misc-400 text-misc-300">↩</kbd>
                                        to select
                                    </span>
                                    <!-- <span class="text-misc-300 text-sm hidden md:inline-block">
                                        <kbd class="bg-misc-400 text-misc-300">Esc</kbd>
                                        to close
                                    </span> -->
                                    
                                    <universal-ajax 
                                        button-type="html"
                                        button-text="Reindex"
                                        button-icon=""
                                        v-if="!reindexing"
                                        method="get"
                                        button-class="float-right text-sm text-misc-300 hover:text-blue-500"
                                        confirm-button-text="Reindex"
                                        confirm-button-class="btn btn-primary"
                                        :url="reindexUrl"
                                        title="Reindex Global Search"
                                        text="We only recommend to reindex if you find the search results to be out of sync. Continue to reindex the global search?"
                                        alert-text="The system will reindex the connected servers and web applications once every week. Manual reindexing can only be made once every 6 hours"
                                        analytic-category="Global Search"
                                        width="540px"
                                        @init="reindexing = true"
                                        @completed="reindexing = false"
                                        analytic-action="Reindex">
                                    </universal-ajax>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url: String,
            recentUrl: String,
            reindexUrl: String,
            canManageAtomic: Boolean,
            canManageTeam: Boolean
        },
        data () {
            return {
                searchCategories: [{
                    key: 'all',
                    value: 'All',
                    disabled: false
                }, {
                    key: 'server',
                    value: 'Servers',
                    disabled: false
                }, {
                    key: 'webapp',
                    value: 'Web Applications',
                    disabled: false
                }, {
                    key: 'database',
                    value: 'Databases',
                    disabled: false
                }, {
                    key: 'atomic_project',
                    value: 'Atomic Deployments',
                    disabled: !this.canManageAtomic
                }, {
                    key: 'team',
                    value: 'Teams',
                    disabled: !this.canManageTeam
                }],
                modifiers: ['Shift', 'Control', 'Fn', 'Alt', 'Meta', 'Super', 'FnLock'],
                excludeTargets: ['textarea', 'input', 'ql-editor', 'ql-editor ql-blank'],
                toggleSearch: false,
                searchText: '',
                placeholder: 'Quick search for anything',
                searchResults: [],
                selectedCategory: 'all',
                recentData: [],
                searchNotFound: false,
                working: false,
                reindexing: false,
                selectedUrl: '',
                keysPressed: {}
            }
        },

        mounted () {
            document.addEventListener('keydown', this.keydownFunction)
            document.addEventListener('keyup', this.keyupFunction)
            document.addEventListener('click', this.handleClickOutside)
        },

        watch: {
            'selectedCategory': function () {
                this.runSearch()
            }
        },

        beforeDestroy () {
            document.removeEventListener('click', this.handleClickOutside)
            document.removeEventListener('keydown', this.keydownFunction)
            document.removeEventListener('keyup', this.keyupFunction)
        },

        methods: {
            toggleSearchBox () {
                // load recent
                window.enterPage(this.recentUrl)
                    .then(response => {
                        this.recentData = response.data
                    })
                    .catch(() => { })
                if (this.toggleSearch) {
                    this.toggleSearch = !this.toggleSearch
                    document.body.classList.remove('overflow-y-hidden')
                } else {
                    this.$refs.search = null
                    this.toggleSearch = !this.toggleSearch
                    this.$nextTick(() => this.$refs.search.focus())
                    document.body.classList.add('overflow-y-hidden')
                }
            },

            keydownFunction: function (e) {
                let resultWrapper = window._.isEmpty(this.searchResults) ? document.getElementById('search-recent') : document.getElementById('search-result')
                let isQuillFocused = this.excludeTargets.includes(document.activeElement.className)

                // Escape [esc]
                if (e.keyCode === 27) this.toggleSearch = false

                // Forward Slash [/]
                if (!this.toggleSearch && !this.excludeTargets.includes(window._.lowerCase(e.target.tagName))) {
                    this.keysPressed[e.key] = true

                    if (Object.keys(this.keysPressed).some(key => this.modifiers.includes(key)) && e.keyCode === 191) {
                        return
                    } else if (isQuillFocused && e.keyCode === 191) {
                        return
                    } else if (e.keyCode === 191) {
                        e.preventDefault()
                        this.toggleSearchBox()
                    }
                }
                // Up-Down Arrow [↑ / ↓]
                if (this.toggleSearch && resultWrapper && (e.keyCode === 38 || e.keyCode === 40)) {
                    e.preventDefault()
                    let current = resultWrapper.querySelector('li[aria-selected=true]')
                    this.selectedUrl = current.getAttribute('url')
                    let sibling = this.getSibling(e.keyCode === 38 ? 'previousElementSibling' : 'nextElementSibling', current, '[aria-selected]')
                    if (!sibling) return
    
                    sibling.setAttribute('aria-selected', true)
                    sibling.focus()
                    this.selectedUrl = sibling.getAttribute('url')
                    current.setAttribute('aria-selected', false)
                }

                // Enter [↵]
                if (this.toggleSearch && e.keyCode === 13) {
                    if (this.searchResults.length > 0) this.openPage(this.selectedUrl)
                    else this.goSearch(this.selectedUrl)
                }
            },

            keyupFunction: function(e) {
                delete this.keysPressed[e.key]
            },

            getSibling (location, current, selector) {
                let sibling = current[location]
                if (!selector) return sibling

                while (sibling) {
                    if (sibling.matches(selector)) { return sibling }
                    sibling = sibling[location]
                }
            },

            setHover (e) {
                let current = document.querySelector('li[aria-selected=true]')
                current.setAttribute('aria-selected', false)
                e.target.setAttribute('aria-selected', true)
                e.target.focus()
                this.selectedPath = e.target.getAttribute('path')
            },

            handleClickOutside (e) {
                if (this.toggleSearch && e.target.classList.contains('search-result-container')) {
                    this.toggleSearchBox()
                }
            },

            runSearch: window._.debounce(function () {
                if (this.searchText !== '' && this.working === false) {
                    this.working = true
                    window.enterPage(this.url, { 'text': this.searchText, 'type': this.selectedCategory })
                        .then(response => {
                            if (response.data.length === 0) {
                                this.searchNotFound = true
                            } else {
                                this.searchNotFound = false
                            }
                            this.searchResults = this.restructureData(response.data)
                            if (this.searchResults[0]) {
                                this.selectedUrl = this.searchResults[0].items[0].url
                            }
                            this.working = false
                        })
                        .catch(() => { })
                } else {
                    this.searchResults = []
                }
            }, 500),

            runReindex () {
                if (this.reindexing === false) {
                    this.reindexing = true
                    window.enterPage(this.reindexUrl)
                        .then(response => {
                            this.reindexing = false
                        })
                        .catch(() => { })
                }
            },

            registerRecent () {
                // save recent
                window.enterPage(this.recentUrl, { 'text': this.searchText }, {'method': 'put'})
                this.searchResults = []
            },

            openPage (url) {
                this.registerRecent()
                window.handleRedirect(url)
                this.searchResults = []
            },

            goSearch (text) {
                this.searchText = text
                this.searchResults = []
                this.runSearch()
            },

            clearSearch () {
                this.searchText = ''
                this.searchResults = []
            },

            restructureData (data) {
                return data.map((obj) => {
                    return {
                        title: obj.title,
                        items: obj.items.map((item) => {
                            var desc = ''
                            var extra = ''
                            var icon = ''

                            switch (item.object_type) {
                            case 'webapp':
                                var domain = item.domains.filter((domain) => domain.includes(this.searchText))
                                if (!domain[0]) {
                                    domain = item.domains
                                }
                                desc = `Domain: ${domain[0]}`
                                extra = `Server: ${item.server.name} / ${item.server.ipAddress}`
                                icon = 'rc-ln-globe-click'
                                break
                            case 'server':
                                desc = `${item.ipAddress}`
                                icon = 'rc-ln-server'
                                break
                            case 'database':
                                var databaseUser = item.databaseUsers.filter((databaseUser) => databaseUser.includes(this.searchText))
                                if (!databaseUser[0]) {
                                    databaseUser = item.databaseUsers
                                }
                                extra = `Database User: ${databaseUser[0]}`
                                desc = `Server: ${item.server.name} / ${item.server.ipAddress}`
                                icon = 'rc-ln-database'
                                break
                            case 'team':
                                icon = 'rc-ln-teams'
                                break
                            case 'atomic_project':
                                icon = 'rc-ln-globe-click'
                            }
                            let result = { name: item.name, desc: desc, extra: extra, url: item.url, icon: icon }
                            return result
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '~sass/var';

    .search-tab {
        @apply inline-block py-1 px-3 text-sm text-center whitespace-nowrap align-baseline rounded ring-1 ring-opacity-0 outline-none ring-offset-1 ring-blue-500 focus-within:ring-opacity-70;
        
        input {
            @apply appearance-none;
            &:focus-visible {
                @apply outline-none;
            }
        }
        &-disabled {
            @apply opacity-50 cursor-not-allowed;
        }
    }

    .rc-icon {
        @apply absolute text-xl;
        line-height: 40px;
    }

    .form-search-placeholder {
        .form-control {
            @apply text-black-300 bg-blue-850 border-blue-850 pl-10;

            &::placeholder {
                @apply text-white opacity-50;
            }
        }
    }

    .search-result-container {
        @apply #{$default-overlay};

        .form-control {
            @apply border-none pl-10;
        }

        .result-container {
            @apply text-black-500 shadow;
        }
    }

    .search-result > ul > li {
        @apply border-b;

        &:last-child {
            @apply border-transparent;
        }
    }

    li {
        @apply py-3 mx-1 outline-none rounded ring-1 ring-opacity-0 ring-blue-500 focus-within:ring-opacity-70;

        .rc-ln-curved-arrow-left {
            @apply hidden;
        }
        

        &[aria-selected="true"] {
            @apply bg-blue-100;

            .rc-ln-curved-arrow-left, h6 {
                @apply text-blue-500 block;
            }
        }

        &[aria-selected="false"] {
            // @apply bg-black-100;
        }
    }
</style>
