<template>
    <div>
        <loader v-if="fetching"></loader>
        <template v-else>
            <runcloud-editor
                id="aceEditor"
                :content="log"
                height="400px"
                lang="ace/mode/apache_conf"
                :sync="true"
                editor-title="Log Content"
                :read-only="true">

                <template #right-col>
                    <button :disabled="fetching" type="button" class="btn btn-default" @click="fetch()"><i class="rc rc-ln-loop"></i><span class="hidden md:inline-block">Reload</span></button>
                </template>
            </runcloud-editor>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        url: String,
        view: String
    },

    data: () => ({
        fetching: true,
        log: null
    }),

    watch: {
        view () {
            this.fetch()
        },

        fetching: {
            immediate: true,
            handler(value) {
                this.$emit('fetching', value)
            }
        }
    },

    created() {
        this.fetch()
    },

    mounted() {
        window.bus.$on('reload-log', this.fetch)
    },

    methods: {
        fetch() {
            this.fetching = true

            window
                .enterPage(`${this.url}/?logItem=${this.view}`)
                .then(({ data }) => {
                    this.fetching = false

                    let log = data.log.split('\n')
                    let logReverse = []
                    for (var i = log.length - 1; i >= 0; i--) {
                        logReverse.push(log[i])
                    }

                    let filtered = logReverse.filter(el => {
                        return el !== ''
                    })

                    this.log = filtered.join('\n')
                })
                .catch(() => {})
        }
    }
}
</script>
