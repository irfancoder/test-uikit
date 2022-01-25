<template>
    <div>
        <form-card-selection
            label="Select an Instance"
            name="plan"
            :selection="filteredPlans"
            cols="md:grid-cols-4 xl:grid-cols-6 xxl:grid-cols-6"
            card-height="h-auto"
            value="id"
            align="justify-center"
            :horizontal-scroll="true"
            :model="model" v-if="!fetching">

            <template v-slot:custom="prop">
                <div class="text-center">
                    <h3 class="mb-2 text-2xl font-semibold text-misc-300"><sup class="text-base font-normal text-misc-700">$</sup>{{ prop.obj.price_monthly }}<small class="text-base font-normal text-misc-700">/mo</small></h3>
                    <hr class="absolute inset-x-0">
                    <table class="mt-4">
                        <tbody>
                            <tr class="py-1">
                                <td class="pr-2 mr-1 font-medium text-right text-misc-300">{{ prop.obj.memory }}</td>
                                <td class="text-misc-700">Memory</td>
                            </tr>
                            <tr class="py-1">
                                <td class="pr-2 mr-1 font-medium text-right text-misc-300">{{ prop.obj.vcpus }}</td>
                                <td class="text-misc-700">{{ prop.obj.vcpus>1?'VCPUS':'VCPU' }}</td>
                            </tr>
                            <tr class="py-1">
                                <td class="pr-2 mr-1 font-medium text-right text-misc-300">{{ prop.obj.disk }}</td>
                                <td class="text-misc-700">Storage</td>
                            </tr>
                            <tr class="py-1">
                                <td class="pr-2 mr-1 font-medium text-right text-misc-300">{{ prop.obj.transfer }}</td>
                                <td class="text-misc-700">Transfer</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </form-card-selection>

        <template v-else>
            <span class="font-medium">Select an instance</span>
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

        data () {
            return {
                working: false,
                fetching: false,
                plans: {},
                filteredPlans: {},
                category: null
            }
        },

        created () {
            this.fetch()

            window.bus.$on('refetchPlan', data => {
                this.fetch(data)
            })

            window.bus.$on('selectedCategory', category => {
                this.category = category
                this.filteredPlans = this.plans.filter(plan => { return plan.category === this.category })

                // get all available region on all plans
                const allRegions = window._.uniq(_.flatMap(this.filteredPlans, 'available_regions'))
                if (allRegions.length > 0) {
                    window.bus.$emit('filterRegions', allRegions)
                }
            })

            window.bus.$on('reFilterPlan', region => {
                this.filteredPlans = this.plans.filter(plan => { return plan.available_regions.includes(region) && plan.category === this.category })
            })
        },

        methods: {
            fetch (region = null) {
                this.fetching = true
                this.plans = this.filteredPlans = {}
                var url = this.url
                if (region) url = `${this.url}/${region}`
                window.enterPage(url).then(({ data }) => {
                    this.plans = this.filteredPlans = data
                    this.fetching = false
                    if (region == null) {
                        window.bus.$emit('instancesFetched')
                    }
                })
            },

            handleEmit (event) {
                this.$emit('input', event.target.checked)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @keyframes shine {
		to {
			background-position:
				100% 0, /* hightlight */
                0 0,
                220px 0,
                440px 0px,
                660px 0px,
                880px 0px,
                1100px 0px,
                1320px 0px,
                1540px 0px;
		}
	}

    .skeleton-loading {
        height: 124px;

        background-image:
            linear-gradient( 100deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 80% ),
            linear-gradient(theme('colors.misc.500') 196px, transparent 0),
			linear-gradient(theme('colors.misc.500') 196px, transparent 0),
			linear-gradient(theme('colors.misc.500') 196px, transparent 0),
			linear-gradient(theme('colors.misc.500') 196px, transparent 0),
			linear-gradient(theme('colors.misc.500') 196px, transparent 0),
			linear-gradient(theme('colors.misc.500') 196px, transparent 0),
			linear-gradient(theme('colors.misc.500') 196px, transparent 0),
			linear-gradient(theme('colors.misc.500') 196px, transparent 0);

		background-repeat: repeat-y;

        background-size:
            150px 2000px, /* highlight */
			196px 196px,
			196px 196px,
			196px 196px,
			196px 196px,
			196px 196px,
			196px 196px,
			196px 196px,
			196px 196px;

		background-position:
			0 0, /* highlight */
			0 0,
			220px 0,
			440px 0px,
			660px 0px,
			880px 0px,
            1100px 0px,
            1320px 0px,
            1540px 0px;

		animation: shine 1s infinite;
    }
</style>
