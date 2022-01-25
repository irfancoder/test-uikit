<template>
    <div v-if="author !== null" :class="`chat ${getChatClass()}`">
        <div class="flex mb-7">
            <img class="rounded-full" src="~img/icon-on-black.svg" loading="lazy" alt="RunCloud Logo" v-if="getChatClass() === 'chat-support'">
            <div v-else class="short-text-wrapper">
                <short-text :text="author.name" class="short-text"></short-text>
            </div>
            <div>
                <h6 class="author">{{ author.name }}</h6>
                <moment :time="comment.created_at" type="fromnow"></moment> - <moment :time="comment.created_at" type="datetime"></moment>
            </div>
        </div>
        <div class="body" v-html="comment.body"></div>

        <div class="flex flex-wrap attachment-block" v-if="comment.attachments.length > 0">
            <div v-for="(attachment, index) in comment.attachments" :key="index" class="flex items-center attachment" @click="openAttachmentInBrowser(attachment.attachment_url)">
                <svg class="mr-4" width="32px" height="32px" viewBox="0 0 46 46" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Ticket" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="formatIcon">
                            <polygon id="Path" fill="#4E5A65" fill-rule="nonzero" points="43 26 3 26 0 22 4 18 42 18 46 22"></polygon>
                            <path d="M40,46 L6,46 C4.895,46 4,45.105 4,44 L4,2 C4,0.895 4.895,0 6,0 L30,0 L42,12 L42,44 C42,45.105 41.105,46 40,46 Z" id="Path" fill="#E9EAEC" fill-rule="nonzero"></path>
                            <path d="M30,0 L30,10 C30,11.105 30.895,12 32,12 L42,12 L30,0 Z" id="Path" fill="#BDC1C5" fill-rule="nonzero"></path>
                            <path d="M44,40 L2,40 C0.895,40 0,39.105 0,38 L0,22 L46,22 L46,38 C46,39.105 45.105,40 44,40 Z" id="Path" fill="#22313F" fill-rule="nonzero"></path>
                            <text id="PHP" font-family="Inter-Bold, Inter" font-size="12" font-weight="bold" fill="#FFFFFF">
                                <tspan x="11.2507102" y="36">{{ getFileFormat(attachment.content_type) }}</tspan>
                            </text>
                        </g>
                    </g>
                </svg>

                <span>
                    <h6 class="font-medium">{{ attachment.name | truncate(24) }}</h6>
                    <p>{{ attachment.size }}KB</p>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        props: {
            comment: { required: true, type: Object }
        },

        data () {
            return {
                author: null
            }
        },

        filters: {
            formatDate: function (value) {
                if (value) {
                    return moment(String(value)).format('MMM D kk:mm')
                } else {
                    return 'Error capturing date'
                }
            },

            truncate: function (text, length, clamp) {
                return (text.slice(0, length) + (length < text.length ? clamp || '...' : ''))
            }
        },

        created () {
            this.author = this.comment.user
        },

        updated () {
            this.author = this.comment.user
        },

        methods: {
            isImage (attachment) {
                let re = new RegExp(/^image\/[a-zA-Z0-9]*$/)
                return re.test(attachment.content_type)
            },

            getChatClass () {
                return this.author.agent === true ? 'chat-support' : 'chat-author'
            },

            getFileFormat (format) {
                let fmt = format.split('/')[1].substring(0, 3).toUpperCase()

                return fmt
            },

            openAttachmentInBrowser (url) {
                window.open(url, '_blank')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .chat {
        @apply mb-7 p-4 rounded w-full border bg-misc-500 md:p-7;

        .short-text-wrapper,
        img {
            @apply h-10 w-10 mr-4;
        }

        .short-text {
            @apply h-10 w-10 text-lg text-center uppercase rounded-full bg-misc-200 text-gray-200;
            line-height: 40px;
        }

        &.chat-author {
            @apply bg-blue-100 border-blue-300;

            .body,
            .attachment-block {
                @apply border-blue-300;
            }

            ::v-deep .body {
                hr {
                    @apply border-blue-300 my-4;
                }
            }
        }

        .body {
            @apply border-t leading-normal pt-7;

            ::v-deep p {
                @apply m-0 tracking-normal leading-normal opacity-100 text-black-500;
            }

            ::v-deep .signature {
                @apply mt-4 italic;
            }
        }

        .attachment-block {
            @apply pt-7 mt-7 border-t;

            .attachment {
                @apply rounded border border-transparent bg-white py-2 px-4 transition-all duration-300 cursor-pointer outline-none;

                &:hover {
                    @apply ring ring-opacity-20;
                }
            }

            .attachment ~ .attachment {
                @apply mt-4 md:ml-4 md:mt-0;
            }
        }
    }
</style>
