<template>
    <div class="panel panel-default py-0 px-7">
        <div class="panel-body py-8 px-2 md:px-8">
            <div class="md:flex md:items-center md:space-x-20 xl:space-x-32">
                <div class="md:w-2/4">
                    <h2 class="mb-2">{{ title }}</h2>
                    <p class="text-lg mb-7" v-html="subtitle"></p>

                    <slot name="content-intro"></slot>

                    <div class="flex space-x-2">
                        <a v-if="buttonText" class="btn btn-primary inline-block" role="button" :href="url" @click="analyticEvent('Upgrade Plan', 'Click', 'Upgrade Plan CTA', null, { title: title, action: buttonText })">{{ buttonText }}</a>
                        <slot name="button-secondary"></slot>
                    </div>
                    <slot name="content"></slot>
                </div>

                <div class="w-2/4 hidden md:block">
                    <img :src="image" loading="lazy" class="max-w-lg ml-auto" :alt="title"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        url: String,
        buttonText: String,
        image: String,
        title: String,
        subtitle: String
    }
}
</script>