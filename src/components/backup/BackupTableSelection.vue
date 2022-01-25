<template>
    <div class="selectTable table-responsive">
        <div class="alert alert-warning">
            <p>Make sure you know what you are doing.</p>
        </div>
        <label class="font-semibold">Select table you want to migrate</label>
        <loader v-if="working"></loader>
        <table class="table table-hover table-scrollable" v-else>
            <thead>
                <tr>
                    <th class="flex justify-content-between">
                        <div class="checkbox checkbox-primary">
                            <input type="checkbox" id="selectAllTable" name="selectAllTable" @change="toggleSelectedAllTable($event)" :checked="selectAllTable" :indeterminate.prop="inderTable">
                            <label for="selectAllTable">
                                <span v-if="!inderTable && !selectAllTable">Table</span>
                                <span v-else>Select all tables</span>
                            </label>
                        </div>
                        <!-- <div v-if="form.selectedTable.length > 0">You have selected {{ form.selectedTable.length }} table{{ form.selectedTable.length > 1 ? 's' : '' }}</div> -->
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="item tablelist" v-for="(table, index) in tableList" :id="`row-${index}`" :key="index" @click="selectTable(table.Name, index)">
                    <td>
                        <div class="checkbox checkbox-primary">
                            <input type="checkbox" :id="`select-${index}`" name="selectTable" @click="selectTable(table.Name, index)" :checked="selectedTable.includes(table.Name)">
                            <label :for="`select-${index}`">{{ table.Name }} ({{ table.Size }})</label>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
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
                selectedTable: [],
                inderTable: false,
                selectAllTable: false,
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
            selectedTable: function (items) {
                this.$emit('selection', items)
            },

            listUrl: function () {
                this.selectedItems = []
                this.fetchList('/')
            }
        },

        created () {
            this.fetchTable()

            if (this.defaultSelection != null) {
                this.selectedItems = this.defaultSelection
            }
        },

        methods: {
            fetchTable () {
                let tableURL = this.listUrl

                this.working = true
                window.enterPage(tableURL).then(response => {
                    this.tableList = response.data
                    this.working = false
                    const regex = /(_posts)\b/g
                    this.tableList.forEach(item => {
                        if (item.Name.match(regex)) this.postTableName = item.Name
                    })
                })
            },

            selectTable (table, index) {
                if (this.selectedTable.indexOf(table) === -1) {
                    this.selectedTable.push(table)
                    let row = document.getElementById(`row-${index}`)
                    row.classList.add('selected')
                } else {
                    let row = document.getElementById(`row-${index}`)
                    row.classList.remove('selected')
                    this.selectedTable = this.selectedTable.filter(item => item !== table)
                }

                if (this.selectedTable.length === this.tableList.length) {
                    this.selectAllTable = true
                    this.inderTable = false
                } else {
                    this.selectAllTable = false
                    this.inderTable = true
                }
            },

            toggleSelectedAllTable (event) {
                if (event.target.checked) {
                    this.selectedTable = this.tableList.map((item) => {
                        return item.Name
                    })
                    window.$('tr.tablelist').addClass('selected')
                    this.selectAllTable = true
                    this.inderTable = false
                } else {
                    window.$('tr.tablelist').removeClass('selected')
                    this.selectedTable = []
                }
            }
        }
    }
</script>
