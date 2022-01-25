<template>
    <div class="avatar-wrapper" v-tooltip.bottom="teamHtml">
        <avatar
            v-for="member in teams.slice(0,3)"
            :key="member.id"
            size="13"
            class="avatar-icon rounded-full"
            :model="member"
            :type="member.avatarType">
        </avatar>
    </div>
</template>

<script>
    export default {
        props: {
            teams: Object,
            ownerId: Number
        },
        data () {
            return {
                teamHtml: ''
            }
        },
        created() {
            if (this.teams.length > 4) {
                _.map(this.teams.slice(0, 4), (member) => {
                    this.teamHtml += `<p class="text-white py-0.5">${member.name} ${member.id === this.ownerId ? '(Owner)' : ''}</p>`
                })
                this.teamHtml += `<p class="text-white py-0.5">and more...</p>`
            } else {
                _.map(this.teams, (member) => {
                    this.teamHtml += `<p class="text-white py-0.5">${member.name} ${member.id === this.ownerId ? '(Owner)' : ''}</p>`
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.avatar-wrapper {
    $maxAvatarCount: 3;
    @apply flex flex-row -space-x-1;
    @for $i from $maxAvatarCount through 1 {
        :nth-child(#{ $i }) {
            z-index: #{ $maxAvatarCount - ($i - 1) };
        }
    }
}
.avatar-icon {
    box-shadow: 0 0 0 1.5px #FFF;
}
</style>