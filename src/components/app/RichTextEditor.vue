<template>
    <div>
        <div class="quill-editor" ref="quillEditor"></div>
        <!-- <div id="counter">0</div> -->
    </div>
</template>

<script>
    import Quill from 'quill'

    export default {
        props: {
            placeholder: { default: '' }
        },

        data () {
            return {
                editor: null
            }
        },

        mounted () {
            Quill.register('modules/counter', function (quill, options) {
                // var container = document.querySelector('#counter')
                // quill.on('text-change', function () {
                //     var text = quill.getText()
                //     container.innerText = text.length
                // })
            })

            var container = this.$refs.quillEditor
            this.editor = new Quill(container, {
                debug: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'font': [] }],
                        [{ 'align': [] }]
                    ],
                    counter: true
                },
                placeholder: this.placeholder,
                readOnly: false,
                theme: 'snow'
            })

            this.editor.on('text-change', (delta, oldDelta, source) => {
                this.write()
            })
        },

        methods: {
            write: window._.debounce(function () {
                this.$emit('change', this.editor.container.firstChild.innerHTML)
            }, 100)
        }
    }
</script>

<style lang="scss">
    @import '~quill/dist/quill.snow.css';
    @import '~quill/dist/quill.bubble.css';

    .ql-toolbar,
    .ql-container {
        @apply border-gray-500 #{!important};
    }

    .ql-snow .ql-editor pre.ql-syntax {
        @apply text-misc-700 #{!important};
    }
    
    pre.ql-syntax {
        @apply text-misc-700 #{!important};
    }

    .ql-toolbar {
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        padding: 16px 8px !important;
    }

    .ql-container {
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
    }
</style>
