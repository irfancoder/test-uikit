<template>
     <div class="form-group" :class="{ 'has-error': form.errors.has('cacheSelection') }">
        <div class="flex radio-inline-group">
            <div class="radio radio-primary">
                <input type="radio"
                    id="nginxNativeCache"
                    name="nginxCacheType"
                    :value="'native'"
                    v-model="form.nginxCacheType"
                    @change="submit($event)"
                    ref="nginxNativeCache"
                    :disabled="working">
                <label for="nginxNativeCache"><span>Native Cache (FastCGI, Proxy)</span></label>
            </div>

            <div class="radio radio-primary">
                <input type="radio"
                    id="redisCache"
                    name="nginxCacheType"
                    :value="'sr'"
                    v-model="form.nginxCacheType"
                    @change="submit($event)"
                    ref="redisCache"
                    :disabled="working">
                <label for="redisCache"><span>Redis SRCache</span></label>
                <span class="badge badge-primary"><i class="rc rc-ln-info"></i> Recommended</span>
            </div>
        </div>
        <span v-if="form.errors.has('nginxCacheType')" v-text="form.errors.get('nginxCacheType')" class="help-block"></span>
    </div>
</template>

<script>
    import AjaxForm from '@/classes/AjaxForm'

    export default {
        props: {
            nginxCacheType: String,
            url: String
        },

        data () {
            return {
                working: false,
                form: new AjaxForm({
                    nginxCacheType: ''
                })
            }
        },

        mounted () {
            this.form.nginxCacheType = this.nginxCacheType
        },

        methods: {
            submit (evt) {
                this.form.submit('post', this.url)
                    .catch(() => {})
                    .then(() => {
                        this.working = false
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .form-group {
        margin: unset;

        .radio {
            margin-bottom: unset;
        }
    }
</style>
