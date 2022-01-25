<template>
    <div>
        <div class="panel-heading">
            <panel-header>
                <template #filter>
                    <div class="md:flex md:items-center md:content-between form-group form-search">
                        <i :class="`left-0 opacity-75 rc rc-ln-search rc-icon absolute left-icon transform top-1/2 -translate-y-1/2`"></i>
                        <input
                            ref="search"
                            type="text"
                            @input="fetchSearch"
                            class="form-control"
                            v-model="search"
                            placeholder="Search..."/>
                    </div>
                    <!-- <input type="text" class="form-control pull-left form-search" placeholder="Search file ..." v-model="search" @keyup="fetchSearch"> -->
                </template>

                <template #desc>
                    <div class="breadcrumb-path flex-grow-1">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <a role="button" @click="walk({ type: 'inode/directory', location: '/' })" class="align-baseline space-x-2">
                                    <i class="rc rc-gl-folder"></i>
                                    <span class="hover:underline">{{ webAppName }}</span>
                                </a>
                            </li>
                            <li v-for="(breadcrumb, index) of breadcrumbs" :key="index" class="breadcrumb-item hover:underline">
                                <a role="button" @click="walk(breadcrumb)" class="text-black">{{ breadcrumb.name }}</a>
                            </li>
                        </ol>
                    </div>
                </template>

                <template #action>
                    <div class="dropdown">
                        <button role="button"
                            class="dropdown-toggle btn btn-default"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false">
                            <i class="rc rc-ln-add-file"></i><span>New</span><i class="rc rc-gl-caret"></i>
                        </button>
                        <ul class="w-40 dropdown-menu dropdown-menu-right" role="menu">
                            <li><a role="button" class="btn btn-primary btn-act" @click="createFileDirectory('file')"><i class="rc rc-ln-file"></i><span>File</span></a></li>
                            <li><a role="button" class="btn btn-primary btn-act" @click="createFileDirectory('folder')"><i class="rc rc-ln-folder"></i><span>Folder</span></a></li>
                        </ul>
                    </div>
                </template>
            </panel-header>
        </div>

        <div class="panel-table table-responsive pt-0 min-h-full max-h-screen-7/10 overflow-y-auto">
            <skeleton-table :rows="10" v-if="working">
                <template #header>
                    <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Type</th>
                        <th>Last Modification</th>
                        <th>Permission</th>
                    </tr>
                </template>
            </skeleton-table>
            <empty-search v-if="!response" label="files or folders" :image="emptySearch"></empty-search>
            <div v-show="!working && response != false">
                <table class="table table-hover relative " id="fmTable">
                    <thead>
                        <tr v-if="selectedItems.length === 0" class="-mt-4">
                            <th>
                                <!-- <div class="checkbox checkbox-primary checkbox-sm" v-if="filterState === false"> -->
                                <div :class="`${filterState ? '':'checkbox checkbox-primary checkbox-sm'}`">
                                    <input
                                        v-if="!filterState"
                                        type="checkbox"
                                        id="selectAll"
                                        name="selectAll"
                                        @change="toggleSelected"
                                        :checked="selectAll"
                                        :indeterminate.prop="indeterminate">
                                    <label for="selectAll">Name</label>
                                </div>
                            </th>
                            <th>Size</th>
                            <th v-if="!filterState">Type</th>
                            <th>Last Modification</th>
                            <th class="text-right">Permission</th>
                        </tr>
                        <tr v-else>
                            <th colspan="5">
                                <table-multi-action-bar >
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-default btn-with-checkbox">
                                        <div class="checkbox checkbox-primary checkbox-sm">
                                            <input type="checkbox"
                                                id="selectAll"
                                                name="selectAll"
                                                @change="toggleSelected"
                                                :checked="selectAll"
                                                :indeterminate.prop="indeterminate">
                                            <label for="selectAll" class="text-blue-500">{{ `${selectedItems.length} items selected` }}</label>
                                        </div>
                                    </button>
                                    <button type="button" class="btn btn-default" @click="changePermission">Change permission</button>
                                    <button type="button" class="btn btn-default" @click="renameFile" :disabled="selectedItems.length > 1">Rename</button>
                                    <button type="button" class="btn btn-default" @click="deleteFile">Delete</button>
                                    <button type="button" class="btn btn-default" @click="zipFile">Zip</button>
                                    <button type="button" class="btn btn-default" @click="unzipFile" :disabled="!isZipFile">Unzip</button>
                                </div>
                            </table-multi-action-bar>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="structure.parent !== structure.currentLocation && !filterState">
                            <td @click.prevent="goToParent" colspan="6">
                                <a class=" text-misc-100"><i class="mr-2 rc rc-ln-turn-n"></i>...</a>
                            </td>
                        </tr>
                        <tr v-if="isError">
                            <td colspan="5">{{ structure.message }}</td>
                        </tr>
                        <template v-if="!working && !isError">
                            <tr class="item" v-for="(struct, index) in filteredItems()" @dblclick.prevent="walk(struct)" @click.shift="shiftSelect(struct, index)" :key="index" :id="`row-${index}`">
                                <td>
                                    <!-- <div class="checkbox checkbox-primary checkbox-sm" v-if="!filterState"> -->
                                    <div :class="`${filterState ? '':'checkbox checkbox-primary checkbox-sm'}`">
                                        <input
                                            v-if="!filterState"
                                            type="checkbox"
                                            :id="`select-${index}`"
                                            name="select"
                                            @change="select(struct, index)"
                                            :checked="selectedItems.includes(struct.location)">
                                        <label :for="`select-${index}`">
                                            <a role="button" @click="walk(struct)" class="font-normal text-black-500">
                                                <i class="rc rc-gl-folder text-misc-600" v-if="struct.type == 'inode/directory'"></i>
                                                <i class="rc rc-gl-zip text-misc-100" v-else-if="struct.type == 'application/zip'"></i>
                                                <i class="rc rc-ln-file text-misc-100" v-else></i>
                                                <span class="hover:underline">{{ clean(struct.name) }}</span>
                                            </a>
                                        </label>
                                    </div>
                                </td>
                                <td width="10%">{{ struct.size }}</td>
                                <td v-if="!filterState">{{ struct.type }}</td>
                                <td>{{ struct.lastModification }}</td>
                                <td class="text-right">{{ struct.permission }}</td>
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
            emptySearch: { required: true },
            searchUrl: { required: true },
            listUrl: { required: true },
            createUrl: { required: true },
            deleteUrl: { required: true },
            renameUrl: { required: true },
            permissionUrl: { required: true },
            editorUrl: { required: true },
            zipUrl: { required: true },
            unzipUrl: { required: true },
            owner: { required: true },
            webAppName: { required: true }
        },

        data () {
            return {
                working: false,
                selectedItems: [],
                isError: false,
                isZipFile: false,
                breadcrumb: null,
                breadcrumbs: [],
                selectAll: false,
                indeterminate: false,
                search: '',
                filterState: false,
                response: true,
                structure: {
                    success: false,
                    parent: '/',
                    currentLocation: '/',
                    message: null,
                    content: {}
                },
                disable: {
                    edit: true
                },
                rename: {
                    folder: null,
                    oldName: null,
                    newName: null
                },
                deletion: {
                    folder: null,
                    names: []
                },

                zip: {
                    folder: null,
                    names: [],
                    destination: null,
                    password: null
                },

                unzip: {
                    folder: null,
                    names: null,
                    destination: null,
                    password: null
                },

                permission: {
                    names: [],
                    user: {
                        read: false,
                        write: false,
                        execute: false
                    },
                    group: {
                        read: false,
                        write: false,
                        execute: false
                    },
                    world: {
                        read: false,
                        write: false,
                        execute: false
                    }
                }
            }
        },

        watch: {
            search: function (val) {
                if (val === '') this.filterState = false
            },
            selectedItems (items) {
                let processedItems = []
                let tableRow = document.getElementById('affected')

                for (let i = 0; i < items.length; i++) {
                    processedItems.push(items[i].replace(/\/$/, '').split('/').pop())
                }

                let totalItem = this.selectedItems.length

                // if (this.filterState === true) {
                //     console.log(items)
                // if (items[0].split('/').length > 2) {
                //     let path = items[0].split('/')
                //     path.pop()
                //     this.structure.currentLocation = path.join('/')
                // }

                // this.rename = {
                //     folder: this.structure.currentLocation,
                //     oldName: processedItems[0],
                //     newName: processedItems[0]
                // }
                // }

                this.deletion = {
                    folder: this.structure.currentLocation,
                    names: processedItems
                }

                this.zip = {
                    folder: this.structure.currentLocation,
                    names: processedItems,
                    destination: '',
                    password: ''
                }

                this.unzip = {
                    folder: this.structure.currentLocation,
                    zipFolder: processedItems[0],
                    destination: '',
                    password: ''
                }

                this.permission.names = processedItems

                this.zip = {
                    folder: this.structure.currentLocation,
                    names: processedItems,
                    destination: ''
                }

                this.unzip = {
                    folder: this.structure.currentLocation,
                    zipFolder: processedItems[0],
                    destination: ''
                }

                if (totalItem === 0) {
                    this.disable.edit = true
                    if (tableRow != null) {
                        tableRow.style.opacity = 0
                        tableRow.style.marginBottom = '-500px'
                    }
                } else if (totalItem === 1) {
                    this.rename = {
                        folder: this.structure.currentLocation,
                        oldName: processedItems[0],
                        newName: processedItems[0]
                    }
                } else if (totalItem > 1) {
                    this.disable.edit = true
                }

                if (totalItem > 0) {
                    let tableRow = document.getElementById('affected')
                    if (tableRow != null) {
                        tableRow.style.opacity = 1
                        tableRow.style.marginBottom = 'unset'
                    }
                }
            }
        },

        created () {
            let self = this

            document.addEventListener('keydown', e => {
                if (e.keyCode === 27) {
                    self.deselectAll()
                }

                if ((e.ctrlKey || e.metaKey) && e.which === 65) {
                    self.toggleSelected()
                }
            })
        },

        mounted () {
            this.fetchList('/')
            this.setWidth()
        },

        methods: {
            clean (filename) {
                if (this.filterState === true) {
                    return filename.split('/').join(' / ')
                }
                return filename
            },

            filteredItems () {
                if (this.structure.content != null) {
                    this.response = true
                    let fileList = Object.values(this.structure.content)
                    if (this.filterState === true) {
                        return fileList.filter(item => {
                            return item.name.indexOf(this.search) > -1
                        }).slice(0, 15)
                    }
                    return fileList
                } else {
                    this.response = false
                }
            },
            fetchList (folder) {
                this.working = true
                this.selectedItems = []

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
                    this.breadcrumbs = this.makeBreadcrumb(this.structure.currentLocation)
                }).catch((e) => {
                    this.filterState = false
                    this.isError = true

                    let status = e.response.status

                    if (status === 500) {
                        window.swal.fire({
                            title: 'Warning',
                            customClass: {
                                container: 'rc-swal'
                            },
                            text: 'Sorry, this directory contains too many files that can not be handled by File Manager',
                            width: 400,
                            confirmButtonText: 'Close'
                        })
                    }
                })
                this.filterState = false
                this.search = ''
            },

            fetchSearch: window._.debounce(function () {
                this.working = true
                this.filterState = true
                this.selectedItems = []

                let data = {
                    folder: '/',
                    queries: this.search
                }
                window.enterPage(this.searchUrl, data).then(response => {
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
            }, 500),

            zipFile() {
                let _self = this
                let data = _self.zip

                window.swal.fire({
                    title: `Zip File / Folder`,
                    html: `
                        <div class="form-group">
                            <label class="form-label text-black-900">Password (Optional)</label>
                            <input type="password" id="password" class="input-lg form-control">
                            <p class="form-input-description">The compressed file(s) will be protected by the given password</p>
                        </div>

                    <div class="form-group">
                        <label class="form-label text-black-900">Export to</label>
                        <div class="md:flex md:items-center md:content-between form-group">
                            <input id="destination" type="text" class="form-control" placeholder="Compressed file name"/>
                            <span class="right-8 opacity-75 rc-icon absolute right-icon transform top-2/2 -translate-y-2/2">.zip</span>
                        </div>
                    </div>
                    `,
                    showCancelButton: true,
                    customClass: {
                        container: 'rc-swal'
                    },
                    confirmButtonText: 'Zip',
                    showLoaderOnConfirm: true,
                    preConfirm (value) {
                        return new Promise((resolve, reject) => {
                            if (!value || value === '') {
                                reject(new Error(`You should write output folder name that you want to create`))
                                return
                            }

                            data.destination = document.getElementById('destination').value
                            data.password = document.getElementById('password').value

                            window.enterPage(_self.zipUrl, data, { method: 'post' }).then(response => {
                                if (response.data.success === false) {
                                    reject(response.data.message)
                                    return
                                }
                                _self.logAnalytics('Update', 'Zip file/folder')
                                resolve()
                            }).catch((e) => {
                                if (e.response.status === 422) {
                                    window.swal.hideLoading()
                                    window.swal.showValidationMessage(
                                        'The zip name format is invalid.'
                                    )
                                }
                            })
                        })
                    }
                }).then(() => {
                    _self.fetchList(_self.structure.currentLocation)
                }).catch(window.swal.noop)
            },

            unzipFile() {
                let _self = this
                let data = _self.unzip

                window.swal.fire({
                    title: 'Unzip File / Folder',
                    html: `
                        <div class="form-group ">
                            <label class="form-label text-black-900">Password (Optional)</label>
                            <input type="password" id="password" class="input-lg form-control">
                            <p class="form-input-description">For password protected zip files. Leave empty if there is none.</p>
                        </div>

                        <div class="form-group">
                            <label class="form-label text-black-900">Export to</label>
                            <input id="destination" type="text" class="form-control"  placeholder="Extracted folder name"/>
                        </div>
                    `,
                    showCancelButton: true,
                    customClass: {
                        container: 'rc-swal'
                    },
                    confirmButtonText: 'Unzip',
                    showLoaderOnConfirm: true,
                    preConfirm (value) {
                        return new Promise((resolve, reject) => {
                            if (!value || value === '') {
                                reject(new Error(`You should write output folder name that you want to create`))
                                return
                            }

                            data.destination = document.getElementById('destination').value
                            data.password = document.getElementById('password').value

                            window.enterPage(_self.unzipUrl, data, { method: 'post' }).then(response => {
                                if (response.data.success === false) {
                                    reject(response.data.message)
                                    return
                                }
                                _self.logAnalytics('Update', 'Unzip file/folder')
                                resolve()
                            }).catch((e) => {
                                if (e.response.status === 422) {
                                    window.swal.hideLoading()
                                    let message = 'The unzip name format is invalid.'

                                    if (e.response.data.errors.hasOwnProperty('destination')) {
                                        message = e.response.data.errors.destination[0]
                                    }

                                    window.swal.showValidationMessage(message)
                                }
                            })
                        })
                    }
                }).then(() => {
                    _self.fetchList(_self.structure.currentLocation)
                }).catch(window.swal.noop)
            },

            walk: function (item) {
                if (item.location === this.structure.currentLocation) {
                    return
                }
                if (item.type === 'inode/directory') {
                    this.fetchList(this.parseFilePath(item))
                } else {
                    this.selectedItems.push(item.location)

                    this.edit(item)
                }

                this.deselectAll()
            },

            goToParent: function () {
                this.fetchList(this.structure.parent)
            },

            createFileDirectory (type) {
                let _self = this

                let data = {
                    type: type,
                    name: null,
                    folder: this.structure.currentLocation
                }

                window.swal.fire({
                    title: `Add new ${type}`,
                    'text': `Type the name of ${type} that you want to create`,
                    input: 'text',
                    showCancelButton: true,
                    customClass: {
                        container: 'rc-swal'
                    },
                    confirmButtonText: 'Create',
                    showLoaderOnConfirm: true,
                    inputPlaceholder: `${type} name`,
                    preConfirm (value) {
                        return new Promise((resolve, reject) => {
                            if (!value || value === '') {
                                reject(new Error(`You should write ${type} name that you want to create`))
                                return
                            }

                            data.name = value

                            window.enterPage(_self.createUrl, data, { method: 'post' }).then(response => {
                                if (response.data.success === false) {
                                    reject(response.data.message)
                                    return
                                }
                                _self.logAnalytics('Add', type === 'file' ? 'Add new file' : 'Add new folder')
                                resolve()
                            }).catch((e) => {
                                if (e.response.status === 403) window.swal.showValidationMessage(e.response.data.message)
                                window.swal.hideLoading()
                            })
                        })
                    }
                }).then(() => {
                    _self.fetchList(_self.structure.currentLocation)
                }).catch(window.swal.noop)
            },

            select (struct, i) {
                let row = document.getElementById(`row-${i}`)

                if (row === null) {
                    return
                }

                row.classList.toggle('selected')

                const index = this.selectedItems.indexOf(struct.location)

                if (index === -1) {
                    this.selectedItems.push(struct.location)
                } else {
                    this.selectedItems = this.selectedItems.filter(item => item !== struct.location)
                }

                if (struct.type !== 'application/zip' || this.selectedItems.length > 1) {
                    this.isZipFile = false
                } else {
                    this.isZipFile = true
                }

                if (this.selectedItems.length === 1 && struct.type !== 'inode/directory' && (struct.type.indexOf('text/') !== -1 || struct.type.indexOf('inode/x-empty') !== -1)) {
                    this.disable.edit = false
                }

                if (this.selectedItems.length === this.structure.content.length) {
                    this.selectAll = true
                    this.indeterminate = false
                } else {
                    this.selectAll = false
                    this.indeterminate = true
                }
            },

            shiftSelect (struct, i) {
                this.select(struct, i)
                this.recursiveSelectMultiple(0, 0, struct.location)
            },

            recursiveSelectMultiple (i, push, index) {
                let tmpPush, tmpIndex

                if (push === 0) {
                    if (this.structure.content[i].location === this.selectedItems[0]) { // select from top to bottom
                        tmpPush = 1
                        tmpIndex = index
                    } else if (this.structure.content[i].location === index) { // select from bottom to top
                        tmpPush = 1
                        tmpIndex = this.selectedItems[0]
                    } else if (index === this.selectedItems[0]) { // return if only 1 selected
                        return 1
                    } else { // don't remember why
                        tmpPush = 0
                        tmpIndex = index
                    }

                    this.recursiveSelectMultiple(i + 1, tmpPush, tmpIndex)
                } else {
                    if (this.structure.content[i].location === index) {
                        return 1 // stop if target reached
                    } else {
                        let row = document.getElementById(`row-${i}`)
                        row.classList.add('selected')
                        this.selectedItems.push(this.structure.content[i].location)
                        this.recursiveSelectMultiple(i + 1, 1, index)
                    }
                }
            },

            changePermission () {
                let _self = this
                let pmsn = []

                pmsn = [...this.getItemDetails(this.selectedItems[0]).permission.substr(1)]
                pmsn = pmsn.map(item => {
                    if (item === '-') {
                        item = false
                    } else {
                        item = true
                    }

                    return item
                })

                window.swal.fire({
                    title: 'Change permission',
                    customClass: {
                        container: 'rc-swal'
                    },
                    showCancelButton: true,
                    closeButtonHtml: '<i class="rc rc-ln-cross rc-ln-semibold text-misc-700"></i>',
                    confirmButtonText: 'Change Permission',
                    showLoaderOnConfirm: true,
                    html: `
                        <p>You are about to change permission for <span class="text-black-500 font-medium">${this.selectedItems.length} selected item${this.selectedItems.length > 1 ? 's' : ''}</span>. You can't change permission for files/folder that is tracked by Git.</p>
                        <div class="form-group mt-4">
                            <label class="form-label">User</label>
                            <div class="flex justify-between">
                                <div class="checkbox checkbox-inline checkbox-primary">
                                    <input type="checkbox" id="permissionUserRead" ${pmsn[0] ? 'checked' : ''}>
                                    <label style="margin-left: 16px" for="permissionUserRead">Read</label>
                                </div>
                                <div class="checkbox checkbox-inline checkbox-primary">
                                    <input type="checkbox" id="permissionUserWrite" ${pmsn[1] ? 'checked' : ''}>
                                    <label style="margin-left: 16px" for="permissionUserWrite">Write</label>
                                </div>
                                <div class="checkbox checkbox-inline checkbox-primary">
                                    <input type="checkbox" id="permissionUserExecute" ${pmsn[2] ? 'checked' : ''}>
                                    <label style="margin-left: 16px" for="permissionUserExecute">Execute</label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Group</label>
                            <div class="flex justify-between">
                                <div class="checkbox checkbox-inline checkbox-primary">
                                    <input type="checkbox" id="permissionGroupRead" ${pmsn[3] ? 'checked' : ''}>
                                    <label style="margin-left: 16px" for="permissionGroupRead">Read</label>
                                </div>
                                <div class="checkbox checkbox-inline checkbox-primary">
                                    <input type="checkbox" id="permissionGroupWrite" ${pmsn[4] ? 'checked' : ''}>
                                    <label style="margin-left: 16px" for="permissionGroupWrite">Write</label>
                                </div>
                                <div class="checkbox checkbox-inline checkbox-primary">
                                    <input type="checkbox" id="permissionGroupExecute" ${pmsn[5] ? 'checked' : ''}>
                                    <label style="margin-left: 16px" for="permissionGroupExecute">Execute</label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="form-label">World</label>
                            <div class="flex justify-between">
                                <div class="checkbox checkbox-inline checkbox-primary">
                                    <input type="checkbox" id="permissionWorldRead" ${pmsn[6] ? 'checked' : ''}>
                                    <label style="margin-left: 16px" for="permissionWorldRead">Read</label>
                                </div>
                                <div class="checkbox checkbox-inline checkbox-primary">
                                    <input type="checkbox" id="permissionWorldWrite" ${pmsn[7] ? 'checked' : ''}>
                                    <label style="margin-left: 16px" for="permissionWorldWrite">Write</label>
                                </div>
                                <div class="checkbox checkbox-inline checkbox-primary">
                                    <input type="checkbox" id="permissionWorldExecute" ${pmsn[8] ? 'checked' : ''}>
                                    <label style="margin-left: 16px" for="permissionWorldExecute">Execute</label>
                                </div>
                            </div>
                        </div>
                    `,

                    preConfirm () {
                        return new Promise((resolve, reject) => {
                            const role = ['user', 'group', 'world']
                            const action = ['read', 'write', 'execute']

                            role.map(r => {
                                action.map(a => {
                                    _self.permission[r][a] = document.getElementById(`permission${_.capitalize(r)}${_.capitalize(a)}`).checked
                                })
                            })

                            let data = {
                                folder: _self.structure.currentLocation,
                                permission: _self.permission
                            }

                            window.enterPage(_self.permissionUrl, data, { method: 'post' }).then(response => {
                                if (response.data.success === false) {
                                    reject(response.data.message)
                                    return
                                }
                                _self.logAnalytics('Update', 'Change File/Folder Permissions')
                                resolve()
                            }).catch((e) => {
                                if (e.response.status === 403) window.swal.showValidationMessage(e.response.data.message)
                                window.swal.hideLoading()
                            })
                        })
                    }
                }).then(() => {
                    _self.fetchList(this.structure.currentLocation)
                    this.deselectAll()
                }).catch(window.swal.noop)
            },

            toggleSelected () {
                if (this.structure.content !== null && !this.selectAll) {
                    this.selectedItems = []

                    this.structure.content.forEach((val, i) => {
                        this.selectedItems.push(val.location)
                    })
                    document.querySelectorAll('tr.item').forEach(el => { el.classList.add('selected') })
                    this.selectAll = true
                    this.indeterminate = false
                } else {
                    this.deselectAll()
                }
            },

            deselectAll () {
                this.selectedItems = []
                this.selectAll = false
                this.indeterminate = false
                document.querySelectorAll('tr.item').forEach(el => { el.classList.remove('selected') })
            },

            // Action
            renameFile () {
                let _self = this
                let type = this.getType(this.selectedItems[0])
                let name = this.getItemDetails(this.selectedItems[0]).name

                if (this.getItemDetails(this.selectedItems[0]).name.split('/').length > 2) {
                    name = name.split('/').pop()
                }

                window.swal.fire({
                    title: `Rename ${type}`,
                    html: `Add the new name of this ${type}. File/folder tracked by Git can't be rename.`,
                    customClass: {
                        container: 'rc-swal'
                    },
                    inputValue: name,
                    input: 'text',
                    showCancelButton: true,
                    confirmButtonText: 'Rename',
                    showLoaderOnConfirm: true,
                    preConfirm (value) {
                        return new Promise((resolve, reject) => {
                            if (!value || value === '') {
                                reject(new Error('You should write new name of the file/folder'))
                                return
                            }

                            _self.rename.newName = value

                            window.enterPage(_self.renameUrl, _self.rename, { method: 'post' }).then(response => {
                                if (response.data.success === false) {
                                    reject(response.data.message)
                                    return
                                }
                                _self.logAnalytics('Update', 'Rename file/folder')
                                resolve()
                            }).catch((e) => {
                                if (e.response.status === 422) window.swal.showValidationMessage(e.response.data.errors.newName)
                                window.swal.hideLoading()
                            })
                        })
                    }
                }).then(() => {
                    _self.fetchList(_self.structure.currentLocation)
                    this.deselectAll()
                }).catch(window.swal.noop)
            },

            edit (item) {
                let folder = this.parseFilePath(item)
                let filename = item.location

                if (this.filterState === true) {
                    folder = this.parseFilePath(item)
                }

                if (this.getItemDetails(filename).type !== 'application/zip') {
                    window.open(`${this.editorUrl}?folder=${folder}&filename=${filename.split('/').pop()}`, '_blank')
                }
            },

            deleteFile () {
                let _self = this

                window.swal.fire({
                    title: `Delete ${this.selectedItems.length} selected item${this.selectedItems.length > 1 ? 's' : ''}`,
                    html: `Any files or folders tracked by Git will not be deleted. Are you sure you want to delete the selected item${this.selectedItems.length > 1 ? 's' : ''}?`,
                    customClass: {
                        container: 'rc-swal',
                        confirmButton: 'swal2-delete'
                    },
                    showCancelButton: true,
                    confirmButtonColor: '#CF000F',
                    confirmButtonText: 'Delete forever',
                    showLoaderOnConfirm: true,
                    preConfirm () {
                        return new Promise((resolve, reject) => {
                            let deleteData = _self.deletion

                            window.enterPage(_self.deleteUrl, deleteData, { method: 'post' }).then(response => {
                                if (response.data.success === false) {
                                    reject(response.data.message)
                                    return
                                }
                                _self.logAnalytics('Delete', 'Delete file/folder')
                                resolve()
                            }).catch((e) => {
                                if (e.response.status === 403) window.swal.showValidationMessage(e.response.data.message)
                                window.swal.hideLoading()
                            })
                        })
                    }
                }).then(() => {
                    _self.fetchList(_self.structure.currentLocation)
                    this.deselectAll()
                }).catch(window.swal.noop)
            },
            // others
            makeBreadcrumb (path) {
                let pathArray = path.split('/')
                let breadcrumbs = []
                let previousLocation = '/'

                pathArray.forEach(function (fileName) {
                    if (fileName !== '') {
                        let breadcrumb = {
                            name: fileName,
                            type: 'inode/directory',
                            location: previousLocation + fileName
                        }
                        previousLocation += fileName + '/'
                        breadcrumbs.push(breadcrumb)
                    }
                })
                return breadcrumbs
            },

            setWidth () {
                let table = document.getElementById('fmTable')
                let width = table.offsetWidth

                let tableRow = document.getElementById('affected')

                if (tableRow != null) {
                    tableRow.style.width = `${width}px`
                }
            },

            getItemDetails (location) {
                return this.structure.content.find(item => item.location === location)
            },

            getType (item) {
                let type = ''
                if (this.getItemDetails(item).type === 'inode/directory') {
                    type = 'directory'
                } else {
                    type = 'file'
                }

                return type
            },

            logAnalytics(action, label, metadata) {
                this.analyticEvent('File Manager', action, label, null, metadata)
            },

            parseFilePath(item) {
                let subPaths = item.location.split('/')
                if (item.type === 'inode/directory') return item.location
                else {
                    subPaths.pop()
                    return subPaths.join('/')
                }
            }

        }
    }
</script>

<style lang="scss" scoped>
    .table {
        th {
            @apply sticky bg-gray-100 z-40 top-0;
        }
        td i {
            @apply text-xl leading-normal;
        }

        td i + span {
            @apply align-text-bottom;
        }
    }
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
    }
</style>
