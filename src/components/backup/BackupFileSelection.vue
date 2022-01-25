<template>
    <div class="rc-filemanager">
        <div v-if="selectedItems.length > 0">
            <h5>Marked files and folders for backup. <a href="#fileList" data-toggle="collapse" aria-expanded="false" aria-controls="collapseExample">View selected item(s) <i class="rc rc-ln-chevron-down"></i><i class="rc rc-ln-chevron-up"></i></a></h5>
            <p>Total selection(s): {{ selectedItems.length }}</p>
            <div class="row collapse" id="fileList" aria-expanded="false">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <table class="table table-hover animated slideIn" id="fmTable">
                        <thead>
                            <tr>
                                <th>File/Folder Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in selectedItems" :key="index">
                                <td><i class="text-black rc rc-ln-file"></i> {{ item }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <loader v-show="working"></loader>
            </div>
            <div v-show="!working" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <table class="table table-hover" id="fmTable">
                    <thead>
                        <tr>
                            <th>File/Folder Name</th>
                            <th>Size</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="structure.parent != structure.currentLocation" @dblclick.prevent="goToParent">
                            <td><i class="text-black rc rc-ln-arrow-turn-left-up"></i>..</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-if="isError">
                            <td colspan="4">{{ structure.message }}</td>
                        </tr>
                        <template v-if="!working && !isError">
                            <tr v-for="(struct, index) in structure.content" @dblclick.prevent="walk(struct)" class="directory" :key="index">
                                <td>
                                    <div class="checkbox checkbox-primary">
                                        <input type="checkbox" 
                                            :id="struct.name" 
                                            @change="select($event, struct)" 
                                            :checked="selectedItems.indexOf(struct.location) !== -1" 
                                            :disabled="selectedItems.length >= 20 && selectedItems.indexOf(struct.location) === -1">
                                        <label :for="struct.name"></label>
                                    </div>
                                    <a role="button" @click="walk(struct)" class="text-black">
                                        <i class="rc rc-gl-folder" style="color: #A6B5C2" v-if="struct.type == 'inode/directory'"></i>
                                        <i class="text-black rc rc-ln-file" v-else></i>
                                        <span>{{ struct.name }}</span>
                                    </a>
                                </td>
                                <td>{{ struct.size }}</td>
                                <td>{{ struct.type }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            listUrl: { required: true },
            defaultSelection: { type: Array }
        },

        data () {
            return {
                working: false,
                selectedItems: [],
                isError: false,
                structure: {
                    success: false,
                    parent: '/',
                    currentLocation: '/',
                    message: null,
                    content: {}
                }
            }
        },

        watch: {
            selectedItems: function (items) {
                this.$emit('selection', items)
            },

            listUrl: function () {
                this.selectedItems = []
                this.fetchList('/')
            }
        },

        created () {
            this.fetchList('/')

            if (this.defaultSelection != null) {
                this.selectedItems = this.defaultSelection
            }
        },

        methods: {
            fetchList (folder) {
                this.working = true

                let data = {
                    folder: folder
                }

                window.enterPage(this.listUrl, data).then(response => {
                    this.working = false
                    if (response.data.success === false) {
                        this.isError = true
                    } else {
                        this.isError = false
                    }
                    this.structure = response.data
                }).catch(() => {
                    this.working = false
                    this.isError = true
                })
            },

            walk: function (item) {
                if (item.type === 'inode/directory') {
                    this.fetchList(item.location)
                }
            },

            goToParent: function () {
                this.fetchList(this.structure.parent)
            },

            select (e, struct) {
                let index = this.selectedItems.indexOf(struct.location)

                if (index === -1) {
                    this.selectedItems.push(struct.location)
                } else {
                    this.selectedItems = window._.without(
                        this.selectedItems,
                        struct.location
                    )
                }
            }
        }
    }
</script>
