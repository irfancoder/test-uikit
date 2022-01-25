<template>
    <div>
        <h1>{{ formMeta['form' + currentPage].title }}</h1>
        <p v-html="formMeta['form' + currentPage].subtitle"></p>
        <div class="flex gap-1 mt-4">
            <div class="flex-1" :class="currentPage == item.pageNo ? 'activeForm' : 'inactiveForm'" v-for="item in formMeta">
                <hr class="titleHr" :class="{ 'titleHrStart': item.pageNo == 1, 'titleHrEnd': item.pageNo == Object.keys(formMeta).length }">
                <div class="flex">
                    <p class="py-2 inline" :class="{ 'font-semibold': currentPage == item.pageNo }">{{ item.pageNo }}. {{ item.formTitle}}</p>
                    <div v-if="currentPage > item.pageNo" class="tickCircle inline-block ml-2 text-center relative place-self-center"><i class="rc rc-ln-tick-circle text-green-500 text-lg absolute" style="left: 6px;top: 2px;"></i></div>
                </div>
            </div>
        </div>
        <slot :name="index" v-for="(item, index) in formMeta"></slot>

        <form-action :show-cancel-button="false" :no-offset-left="true">
            <button type="button" class="btn btn-default w-full md:w-auto inline-block" @click="goBack()" v-show="currentPage != 1" v-if="!formMeta['form' + currentPage].hideBackBtn">
                Back
            </button>
            <button type="button" class="btn btn-primary" @click="submitMultiStepForm()" v-if="currentPage == Object.keys(formMeta).length">
                Done
            </button>
            <button type="button" class="btn btn-primary" @click="doCustom()" v-else-if="formMeta['form' + currentPage].nextBtnTitle">
                <button-loader :text="formMeta['form' + currentPage].nextBtnTitle" :working="working"></button-loader>
            </button>
            <button type="button" class="btn btn-primary relative" @click="goToNext()" :disabled="working" v-else>
                <button-loader text="Continue" :working="working"></button-loader>
            </button>
        </form-action>
    </div>
</template>

<script>
export default {
    props: {
        formMeta: Object,
        working: { required: true, type: Boolean }
    },

    data () {
        return {
            currentPage: 1
        }
    },

    methods: {
        goToNext () {
            window.bus.$emit('multiStepFormNext')
        },

        goBack () {
            window.bus.$emit('multiStepFormBack')
        },

        submitMultiStepForm() {
            window.bus.$emit('multiStepFormSubmit')
        },

        doCustom() {
            window.bus.$emit('multiStepFormCustom')
        }
    }
}
</script>

<style lang="scss" scoped>
    .activeForm {
        p {
            @apply text-blue-500;
        }

        .titleHr {
            @apply border-blue-500;
        }
    }

    .inactiveForm.titleHr {
        @apply border-gray-500;
    }

    .tickCircle {
        @apply bg-green-100;
        width: 28px;
        height: 28px;
        border-radius: 50%;
    }

    .titleHr {
        @apply border-2;

        &.titleHrStart {
            border-radius: 5px 0 0 5px;
        }

        &.titleHrEnd {
            border-radius: 0 5px 5px 0;
        }
    }
</style>
