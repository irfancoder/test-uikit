<template>
    <div class="btn-group inline-flex">
        <button @click="toggleListGrid(false)" class="btn btn-default btn-max" :class="!isListView ? 'opacity-40' : ''">
            <i class="rc rc-ln-grid-2" style="color: #111111"></i>
        </button>
        <button @click="toggleListGrid(true)" class="btn btn-default" :class="isListView ? 'opacity-40' : ''">
            <i class="rc rc-ln-list-2" style="color: #111111"></i>
        </button>
    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            isListView: true
        }
    },
    mounted () {
        this.isListView = window.$cookies.get('rc_server_view') !== 'grid'
    },
    methods: {
        toggleListGrid(val) {
            if (val !== this.isListView) {
                this.isListView = !this.isListView
                window.$cookies.set('rc_server_view', this.isListView ? 'list' : 'grid', -1)
                window.bus.$emit('toggleServerView', this.isListView)
            }
        }
    }
}
</script>
