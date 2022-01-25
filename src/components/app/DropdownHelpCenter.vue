<template>
    <div class="dropdown">
        <a href="#" class="dropdown-toggle d-none d-md-block" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="rc rc-ln-help rc-icon-navbar"></i>
        </a>

        <ul class="dropdown-menu">
            <li v-for="(menu, index) in menus" :key="index">
                <a :href="menu.url" :target="!menu.intenal ? '_blank' : ''" class="p-4" rel="noopener noreferrer">
                    <div class="flex">
                        <i :class="menu.icon" class="mr-6 -mt-1 text-3xl text-blue-500"></i>
                        <span>
                            <h6>{{ menu.title }}</h6>
                            <p class="text-gray-700">{{ menu.description }}</p>
                        </span>
                    </div>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data: () => ({
            menus: [
                {
                    icon: 'rc rc-ln-archive',
                    title: 'Knowledgebase',
                    description: 'Guide on how to use our products.',
                    url: 'https://runcloud.io/knowledgebase'
                },
                {
                    icon: 'rc rc-ln-book',
                    title: 'Documentation',
                    description: 'More advanced and in-depth explanation about our products.',
                    url: 'https://runcloud.io/docs'
                },
                {
                    icon: 'rc rc-ln-support',
                    title: 'Support',
                    description: 'Have a problem? Let us assist you.',
                    url: '/support/tickets',
                    intenal: true
                },
                {
                    icon: 'rc rc-ln-feature-request',
                    title: 'Feature Request',
                    description: 'Suggestions or feedback on improving your RunCloud experience? Let us know!',
                    url: 'https://features.runcloud.io/'
                }
            ]
        })
    }
</script>

<style lang="scss" scoped>
    .dropdown-menu {
        @apply min-w-210 p-3 grid-cols-2 gap-y-2 gap-x-7 mt-4;

        &:after {
            content: '';
            @apply absolute mx-auto inset-y-6 inset-x-0 bg-gray-500 w-px;
        }

        a {
            @apply text-misc-300 font-normal py-2 flex items-baseline rounded;

            &:hover,
            &:focus {
                @apply bg-blue-50;
            }

            i + span {
                @apply ml-3;
            }
        }

        &.show {
            @apply grid;
        }
    }
</style>
