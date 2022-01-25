<template>
    <carousel :autoplay="true" :perPage="1" :loop="true" :paginationColor="'#C5C5C5'" :speed="1000" :paginationActiveColor="'#171933'" :paginationPadding="5">
        <slide>
            <Tweet id="1385108558027579392" error-message="This tweet could not be loaded" :options="{ conversation: 'none', align: 'center', dnt: true, width: '100%'}"><p class="text-center"><i class="rc rc-ring rc-spin text-blue-pigeon"></i></p></Tweet>
        </slide>
        <slide>
            <Tweet id="998577158980358144" error-message="This tweet could not be loaded" :options="{ conversation: 'none', align: 'center', dnt: true, width: '100%'}"><p class="text-center"><i class="rc rc-ring rc-spin text-blue-pigeon"></i></p></Tweet>
        </slide>
        <slide>
            <Tweet id="983070272273113093" error-message="This tweet could not be loaded" :options="{ conversation: 'none', align: 'center', dnt: true, width: '100%'}"><p class="text-center"><i class="rc rc-ring rc-spin text-blue-pigeon"></i></p></Tweet>
        </slide>
        <slide>
            <Tweet id="1249263456470962176" error-message="This tweet could not be loaded" :options="{ conversation: 'none', align: 'center', dnt: true, width: '100%'}"><p class="text-center"><i class="rc rc-ring rc-spin text-blue-pigeon"></i></p></Tweet>
        </slide>
    </carousel>
</template>

<script>
    import { Tweet } from 'vue-tweet-embed'
    import { Carousel, Slide } from 'vue-carousel'

    export default {
        components: {
            Carousel,
            Slide,
            Tweet
        }
    }
</script>
