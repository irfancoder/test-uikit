<template>
    <div class="transition-all duration-150 rc-editor" :class="[{ 'full-screen': fullScreen }, theme === 'dark' ? 'dark-mode' : 'light-mode' ]">
        <div class="flex items-center justify-between header">
            <slot name="left-col" v-if="!editorTitle"><p></p></slot>
            <p v-else class="font-medium text-black-500">{{ editorTitle }}</p>

            <div class="flex items-center space-x-4">
                <slot name="right-col"></slot>
                <div class="btn-group">
                    <button @click="toggleFullscreen($event)" class="btn btn-default" v-if="isFullscreenEnabled">
                        <i class="rc" :class="[ fullScreen ? 'rc-ln-minimize' : 'rc-ln-maximize' ]"></i>
                        <span class="hidden md:inline-block">{{ !fullScreen ? 'Maximize' : 'Minimize' }}</span>
                    </button>
                    <button @click="toggleTheme($event)" class="btn btn-default">
                        <i class="rc rc-ln-moon" v-if="theme === 'light'"></i>
                        <i class="rc rc-ln-sun" v-else></i>
                        <span class="hidden md:inline-block">{{ _.startCase(Object.keys(_.omit(themeSelection, theme))) }} Mode</span>
                    </button>
                </div>
                <slot name="more-col"></slot>
            </div>
        </div>

        <slot name="mobile-col"></slot>

        <div class="h-full overflow-scroll editor-wrapper">
            <div id="editor" :class="[editorClass]"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            content: { type: String, default: '' },
            lang: { type: String, default: 'ace/mode/javascript' },
            height: { type: String, default: '400px' },
            width: { type: String, default: '100%' },
            sync: { type: Boolean, default: false },
            gutter: { type: Boolean, default: true },
            editorClass: { type: String },
            editorTitle: { type: String },
            options: { type: Object, default: {} },
            readOnly: { type: Boolean, default: false },
            isFullscreenEnabled: { type: Boolean, default: true }
        },

        data () {
            return {
                editor: null,
                fullScreen: false,
                theme: window.$cookies.get('rc_editor_theme') || 'light',
                themeSelection: {
                    light: 'ace/theme/xcode',
                    dark: 'ace/theme/pastel_on_dark'
                }
            }
        },

        mounted () {
            let vm = this
            let lang = this.lang
            let theme = this.themeSelection[this.theme]

            window.ace.config.set('basePath', '/assets/js/ace')
            window.ace.config.set('fontSize', '14px')
            this.editor = window.ace.edit('editor')
            this.editor.$blockScrolling = Infinity
            this.editor.getSession().setMode(lang)
            this.editor.setTheme(theme)

            let newContent
            if (this.isJson(vm.content)) {
                newContent = JSON.stringify(vm.content, null, 4)
            } else {
                newContent = vm.content
            }

            this.editor.setValue(newContent, 1)
            this.editor.setOptions(this.options)
            this.editor.container.style.lineHeight = 1.8
            this.editor.renderer.setScrollMargin(8, 8)
            this.editor.renderer.setShowGutter(this.gutter)
            this.editor.setShowPrintMargin(false)
            this.editor.setHighlightActiveLine(true)
            this.editor.setReadOnly(this.readOnly)
            this.editor.gotoLine(1)

            // EVENTS
            this.editor.on('change', function () {
                vm.$emit('change', vm.editor.getValue())
            })

            this.editor.on('copy', function (str) {
                vm.$emit('copy', str)
            })

            this.editor.on('paste', function () {
                vm.$emit('paste')
            })
        },

        watch: {
            'content': function (newContent) {
                if (this.sync) {
                    if (this.isJson(newContent)) {
                        newContent = JSON.stringify(newContent, null, 4)
                    }
                    this.editor.setValue(newContent)
                    this.editor.session.selection.clearSelection()
                }
            },

            'readOnly': function (val) {
                this.editor.setReadOnly(val)
            },

            'lang': function () {
                this.editor.getSession().setMode(this.lang)
            }
        },

        methods: {
            toggleFullscreen (e) {
                e.preventDefault()
                let navbar = document.getElementsByClassName('navbar-default')[0]

                if (this.fullScreen) {
                    this.fullScreen = false
                    navbar.style.display = 'flex'
                    document.body.style.overflow = 'auto'
                    this.editor.renderer.setScrollMargin(8, 8)
                } else {
                    this.fullScreen = true
                    navbar.style.display = 'none'
                    document.body.style.overflow = 'hidden'
                    this.editor.renderer.setScrollMargin(16, 80)
                }
                this.editor.setOptions(this.editorOptions())
            },

            toggleTheme (e) {
                e.preventDefault()

                this.theme = this.theme === 'light' ? 'dark' : 'light'
                this.editor.setTheme(this.themeSelection[this.theme])
                window.$cookies.set('rc_editor_theme', this.theme, -1)
            },

            editorOptions () {
                return this.fullScreen ? { maxLines: Infinity, autoScrollEditorIntoView: false } : this.options
            },

            isJson(str) {
                if (typeof str === 'object') {
                    return true
                }

                return false
            }
        }
    }
</script>

<style lang="scss">
    .rc-editor {
        .ace_gutter {
            @apply bg-transparent #{!important};
        }

        #editor {
            min-height: 70vh;
        }
    }
</style>

<style lang="scss" scoped>
    .rc-editor {
        .editor-wrapper {
            @apply h-full border-t-0 #{!important};
        }

        &:not(.full-screen) {
            .editor-wrapper {
                @apply rounded-b h-full;
                max-height: 70vh !important;
            }

            .header {
                @apply py-2 px-7 border rounded-t bg-white;
            }
        }

        &.full-screen {
            @apply fixed inset-0 z-1050 h-screen;

            .header {
                @apply h-16 px-7 py-2 items-center bg-misc-500 border-b;
            }

            .ace_editor,
            .editor-wrapper {
                @apply border-0 #{!important};
            }
        }

        &.light-mode {
            .editor-wrapper {
                @apply border bg-white;
            }
        }

        &.dark-mode {
            @apply border-0;

            .ace_editor,
            .editor-wrapper {
                @apply border-black-900 bg-black-900;
            }

            .header {
                @apply bg-black-900 text-white text-opacity-75 border-black-900;
                border-bottom-color: rgba(#ffffff, 0.2);

                p,
                .breadcrumb i {
                    @apply text-white opacity-75 #{!important};
                }
            }
        }
    }
</style>
