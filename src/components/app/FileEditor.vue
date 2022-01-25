<template>
    <div>
        <skeleton-base v-if="working" width="1200" height="500">
            <template #default>
                <rect x="0" y="4" rx="2" ry="2" width="100%" :height="editorHeight" />
            </template>
        </skeleton-base>
        
        <runcloud-editor
            id="aceEditor"
            v-show="!working"
            :content="defaultContent"
            :lang="editorMode"
            :sync="true"
            :read-only="readOnly"
            :height="editorHeight"
            @change="setContent">

            <template #left-col>
                <ul class="mb-0 breadcrumb">
                    <li class="breadcrumb-item"><i class="mr-3 text-xl align-middle rc rc-ln-file text-black-500" style="line-height: 12px"></i><span>{{ webApp.name }}</span></li>
                    <li class="breadcrumb-item">{{ fileName }}</li>
                </ul>
            </template>

            <template #right-col>
                <p class="text-misc-300" v-if="readOnly">This file is currently read-only</p>
                <button class="btn btn-primary" @click="save()" v-if="!readOnly" v-tooltip.top="`<code>${hotKey} + S</code>`">Save</button>
                <button class="btn btn-primary" @click="readOnly = false" v-else>Edit</button>
            </template>

            <template #more-col>
                <div class="dropdown">
                    <button class="dropdown-toggle btn btn-default icon-only" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="rc rc-ln-more"></i>
                    </button>
                    <ul class="w-48 dropdown-menu dropdown-menu-right" role="menu">
                        <li>
                            <a :href="rawUrl" target="_blank" rel="noreferrer" class="btn btn-primary btn-act">
                                <i class="rc rc-ln-file-raw"></i>
                                <span>View raw</span>
                            </a>
                        </li>
                        <li>
                            <universal-ajax
                                :title="`Rename ${fileName}`"
                                :url="renameUrl"
                                method="post"
                                button-type="button"
                                button-text="Rename"
                                button-class="btn btn-primary btn-act"
                                button-icon="rc rc-ln-pencil"
                                text="Add the new name of this file. File tracked by Git can't be rename."
                                require-input="true"
                                input-type="text"
                                :input-value="fileName"
                                field-name="newName"
                                :post-data="{ 
                                    oldName: fileName, 
                                    folder: folderName 
                                }"
                                analytic-category="File Editor"
                                analytic-action="Rename File">
                            </universal-ajax>
                        </li>
                        <li>
                            <ajax-delete 
                                :title="`Delete ${fileName}`"
                                :url="deleteUrl"
                                button-class="btn btn-danger btn-act"
                                button-icon="rc rc-ln-trash"
                                button-type="button"
                                button-text="Delete"
                                :text="`<span>Continue to delete <span class='text-black-500 font-medium'>${fileName}</span>?</span>`"
                                :input-type="null"
                                :post-data="{
                                    folder:folderName,
                                    names:[fileName]
                                }"
                                analytic-category="File Editor"
                                analytic-action="Delete File">
                            </ajax-delete>
                        </li>
                    </ul>
                </div>
            </template>
        </runcloud-editor>
    </div>
</template>


<script>
    export default {
        props: {
            updateThemeUrl: String,
            readUrl: String,
            rawUrl: String,
            updateUrl: String,
            server: Object,
            webApp: Object,
            defaultTheme: String,
            deleteUrl: String,
            renameUrl: String,
            folderName: { required: true },
            fileName: { required: true }
        },

        metaInfo: {
            title: 'File Editor'
        },

        data () {
            return {
                working: true,
                defaultContent: '',
                content: '',
                editorMode: 'ace/mode/php',
                editorHeight: '',
                message: null,
                readOnly: false
            }
        },

        computed: {
            hotKey () {
                let os = window._.toLower(this.getOsName())

                if (os === 'macos') return 'Cmd'
                else return 'Ctrl'
            }
        },

        watch: {
            editorMode (newMode) {
                if (this.editor != null) {
                    this.editor.getSession().setMode(this.editorMode)
                }
            }
        },

        created () {
            let _self = this

            document.onkeydown = function(e) {
                e = e || window.event
                if ((e.ctrlKey || e.metaKey || e.superKey) && e.code === 'KeyS') {
                    e.preventDefault()
                    _self.save()
                }
            }

            window.ace.config.set('basePath', '/assets/js/ace')
            let modelist = require('ace-builds/src-noconflict/ext-modelist.js')
            this.editorMode = modelist.getModeForPath(this.fileName).mode

            this.fetchData()
        },

        mounted () {
            this.setHeight()
            window.addEventListener('resize', this.setHeight)
        },

        methods: {
            fetchData () {
                this.working = true

                window.enterPage(this.readUrl).then(({ data }) => {
                    this.working = false
                    this.content = this.defaultContent = data.data.join('\n')
                }).catch(() => { })
            },

            setContent (content) {
                this.content = content
            },

            setHeight () {
                this.editorHeight = (document.body.clientHeight - 256) + 'px'
            },

            save: window._.debounce(function () {
                if (this.content === this.defaultContent) {
                    window.toastr.error('Unable to save without any modification')
                    return
                }

                this.working = true

                let data = {
                    folder: `/${this.folderName}`,
                    filename: `/${this.fileName}`,
                    content: this.content
                }

                window.enterPage(this.updateUrl, data, { method: 'post' }).then(response => {
                    this.content = this.defaultContent
                    this.working = false

                    window.toastr.success(`Successfully saved ${this.fileName}`)
                }).catch(() => {
                    this.working = false
                })
            }, 1500, { leading: true, trailing: false })
        }
    }
</script>

<style lang="scss" scoped>
    .breadcrumb-item + .breadcrumb-item::before {
        content: '\f23a';
    }
</style>
