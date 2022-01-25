<template>
    <div>
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
                <br>
                <a href="#fileList" data-toggle="collapse" aria-expanded="false" aria-controls="collapseExample">View backup item <i class="rc rc-ln-chevron-down"></i><i class="rc rc-ln-chevron-up"></i></a>
            </div>
        </div>
        <div class="row collapse" id="fileList" aria-expanded="false">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <table class="table table-hover animated slideIn" id="fmTable">
                    <thead>
                        <tr>
                            <th>File/Folder Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(file, index) in files" :key="index">
                            <td><i class="rc rc-ln-file text-black rc-tb-icon" style="padding-right: 5px;"></i> {{ file }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            files: Array
        }
    }
</script>
