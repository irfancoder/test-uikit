<template>
    <div>
        <form-card-selection
            label="Data Center Region"
            name="region"
            :selection="filteredRegions"
            cols="md:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-4"
            card-height="h-12"
            value="id"
            :model="model"
            v-if="!fetching">
                <template v-slot:custom="prop">
                    <country-flag-icon
                        :shortcode="prop.obj.country.toUpperCase()"
                        :location="prop.obj.name">
                    </country-flag-icon>
                </template>
        </form-card-selection>

        <template v-else>
            <span class="font-medium">Data center region</span>
            <div class="mt-1 skeleton-loading"></div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        url: String,
        model: { required: true }
    },

    data() {
        return {
            working: false,
            fetching: false,
            regions: {},
            filteredRegions: {}
        }
    },

    created() {
        this.fetching = true
        window.enterPage(this.url).then(({ data }) => {
            this.regions = this.filteredRegions = data
            this.fetching = false
            window.bus.$emit('regionsFetched')
        })

        window.bus.$on('filterRegions', regions => {
            this.filteredRegions = this.regions.filter(region => {
                return regions.includes(region.id)
            })
        })
    },

    methods: {
        handleEmit(event) {
            this.$emit('input', event.target.value)
        }
    }
}
</script>

<style lang="scss" scoped>
    @keyframes shine {
        to {
        background-position: 100% 0, /* hightlight */ 0 0, 220px 0, 440px 0px,
            660px 0px, 880px 0px, 1100px 0px, 1320px 0px, 1540px 0px;
        }
    }

    .skeleton-loading {
        height: 64px;

        background-image: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0) 80%
        ),
        linear-gradient(theme("colors.misc.500") 196px, transparent 0),
        linear-gradient(theme("colors.misc.500") 196px, transparent 0),
        linear-gradient(theme("colors.misc.500") 196px, transparent 0),
        linear-gradient(theme("colors.misc.500") 196px, transparent 0),
        linear-gradient(theme("colors.misc.500") 196px, transparent 0),
        linear-gradient(theme("colors.misc.500") 196px, transparent 0),
        linear-gradient(theme("colors.misc.500") 196px, transparent 0),
        linear-gradient(theme("colors.misc.500") 196px, transparent 0);

        background-repeat: repeat-y;

        background-size: 150px 2000px, /* highlight */ 196px 196px, 196px 196px,
        196px 196px, 196px 196px, 196px 196px, 196px 196px, 196px 196px, 196px 196px;

        background-position: 0 0, /* highlight */ 0 0, 220px 0, 440px 0px, 660px 0px,
        880px 0px, 1100px 0px, 1320px 0px, 1540px 0px;

        animation: shine 1s infinite;
  }
</style>
