<template>
    <div class="py-4 panel-body table-responsive">
        <table class="table table-hover">
            <tbody v-if="apis.length">
                <tr v-for="(api, index) in apis" :key="index">
                <td class="items-start space-x-4 with-image">
                    <img class="w-8 h-8 rounded bg-gray-50" loading="lazy" :src=api.metadata.avatar_url>
                    <div>
                        <a :href="`${repositoryBaseUrl}/${api.metadata.username}`" class="font-medium">{{ api.metadata.username }}</a>
                    </div>
                </td>
                <td>
                    <div class="flex items-center justify-end space-x-4">
                        <a role="button" class="text-red-500">Remove</a>
                    </div>
                </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                <td colspan="2">No integrations</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        props: {
            apiList: Array,
            apiService: String,
            repositoryBaseUrl: String
        },
        data() {
            return {
                apis: []
            }
        },
        mounted () {
            this.apis = this.apiList

            window.Echo.private(`integrations.${this.apiService}.${window.RunCloud.user}`).listen('.NewIntegration', data => {
                this.apis.push(data)
            })
        }
    }
</script>
