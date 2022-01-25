<template>
    <div>
        <div class="row">
            <div class="col-md-12">
                <a role="button" class="btn btn-block btn-default" @click="choose('server')" :disabled="isDisabled('server')">Server</a>
            </div>

            <div class="col-md-12">
                <a role="button" class="btn btn-block btn-default" @click="choose('backup')" :disabled="isDisabled('backup')">Backup</a>
            </div>

            <div class="col-md-12">
                <a role="button" class="btn btn-block btn-default" @click="choose('backup-storage')" :disabled="isDisabled('backup-storage')">Backup Storage</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        selectedItems: { type: Array, default: [] }
    },

    methods: {
        choose (type) {
            this.$emit('chosen', type)
        },

        isDisabled (scope) {
            let exist = window._.find(this.selectedItems, o => {
                return o.scope === scope
            })

            if (exist === undefined) {
                return false
            }

            return true
        }
    }
}
</script>
