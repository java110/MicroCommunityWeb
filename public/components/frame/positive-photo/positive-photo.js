(function (vc) {
    vc.extends({
        data: {
            positivePhotoInfo: {
                chooseFlag: 0,// 1表示选择了照片,0表示未选择照片
                imgInfo: "",
                errorInfo: "",
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            //              vc.component.$on('errorInfoEvent',function(_errorInfo){
            //                     vc.component.registerInfo.errorInfo = _errorInfo;
            //                     console.log('errorInfoEvent 事件被监听',_errorInfo)
            //                 });

        },
        watch: {
            positivePhotoInfo: {
                deep: true,
                handler: function () {
                    vc.component.$emit('positivePhotoEvent', vc.component.positivePhotoInfo);
                }
            }
        },
        methods: {

            choosePositivePhoto: function (event) {
                var photoFiles = event.target.files;
                if (photoFiles && photoFiles.length > 0) {
                    // 获取目前上传的文件
                    var file = photoFiles[0];// 文件大小校验的动作
                    if (file.size > 1024 * 1024 * 1) {
                        vc.toast('图片大小不能超过 1MB!');
                        return false;
                    }
                    var reader = new FileReader(); //新建FileReader对象
                    reader.readAsDataURL(file); //读取为base64
                    console.log('render obj:', reader);
                    reader.onloadend = function (e) {
                        vc.component.positivePhotoInfo.imgInfo = reader.result;
                        vc.component.positivePhotoInfo.chooseFlag = 1;
                    }
                }
            },
            validatePositivePhoto: function () {
                return vc.validate.validate({
                    positivePhotoInfo: vc.component.positivePhotoInfo
                }, {
                    'positivePhotoInfo.imgInfo': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "未上传证件照"
                        }
                    ],

                });
            }
        }

    });

})(window.vc);