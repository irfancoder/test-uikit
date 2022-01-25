<template>
    <div class="panel-body flex flex-col items-center text-center pt-0 w-full">
        <img :src="image" loading="lazy" class="w-40 my-6 md:my-10 md:w-52" alt="Search not found" />
        <h3 class="font-semibold text-lg">We couldn't find any {{label}} that matched your filter</h3>
        <p class="my-2 md:max-w-sm"> Try adjusting your search or filter to find what you're looking for or add a new {{label}}</p>
        <!-- <a v-show="url" :href="url" role="button" type="button" class="btn btn-primary my-4">{{buttonText}}</a> -->
    </div>
</template>

<script>
export default {
    props: {
        url: String,
        buttonText: String,
        label: String,
        image: String
    }
}
</script>
