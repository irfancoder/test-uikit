<template>
    <div class="dropdown" v-if="!enableMobile" >
        <a href="#" data-toggle="dropdown" class="dropdown-toggle" v-tooltip.bottom="['Mac OS X', 'Mac OS 9'].includes(os) ? '&#8984; + U' : 'Alt + U'">
            <i class="rc rc-ln-flag rc-icon-navbar"></i>
        </a> 
        <ul class="dropdown-menu">
            <a @click="logTicket">
            <li class="flex py-2 px-3 cursor-pointer"> 
                <i class="rc rc-ln-upload text-2xl mr-2 text-blue-500"></i>
                <span>
                    <h6>Report Bug</h6>
                    <p class="text-gray-700">Find anything odd? Let us know!</p>
                </span>
            </li>
            </a>
        </ul>
    </div>
    <div v-else>
        <a class="btn btn-primary btn-act justify-start -mb-1" @click="logTicket" rel="noopener noreferrer" role="button">
            <i class="rc rc-ln-flag"></i>    
            <span>Report Bug</span>
        </a>
    </div>

</template>

<script>
    export default {
        props: {
            os: { type: String, default: '' },
            enableMobile: { type: Boolean, default: false }
        },
        methods: {
            logTicket() {
                window.Marker ? window.Marker.capture() : window.toastr.error('Unable to create ticket session. Please refresh &amp; try again')
            }
        }
    }
</script>

<style lang="scss" scoped>
.dropdown-menu {
        @apply mt-4 min-w-76;

        a {
            @apply text-misc-300 py-2 flex rounded;

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