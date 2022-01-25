<template>
    <div class="modal fade"
        tabindex="-1"
        id="modalHelp"
        role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">
                            <i class="rc rc-ln-cross"></i>
                        </span>
                    </button>
                    <div>
                        <h4 class="modal-title">Replacer</h4>
                        <p class="modal-description">Replacer is where you can tell the deployment script to run specific php version.</p>
                    </div>
                </div>

                <div class="modal-body pt-0 table-responsive">
                    <table class="table table-hover">
                        <tbody>
                            <tr v-for="(version, index) in versions" :key="index">
                                <td><code><span v-html="`{${index}}`"></span></code></td>
                                <td>/RunCloud/Packages/{{ index }}/bin/php</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><code>{branch}</code></td>
                                <td>{{ branch }}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            versions: { required: true },
            branch: { required: true }
        }
    }
</script>
