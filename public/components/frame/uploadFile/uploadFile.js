(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            uploadFileInfo: {
                vedio: {},
                fileName: '',
                realFileName: '',
                progress: 0
            }
        },
        watch: {
            uploadFileInfo: {
                deep: true,
                handler: function() {
                    vc.emit($props.callBackListener, $props.callBackFunction, this.uploadFileInfo);
                }
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('uploadFile', 'clearVedio', function() {
                this.uploadFileInfo = {
                    vedio: {},
                    fileName: '',
                    realFileName: '',
                    progress: 0
                }
            });
            vc.on('uploadFile', 'notifyVedio', function(_fileName) {
                this.uploadFileInfo.fileName = _fileName;
                this.uploadFileInfo.realFileName = _fileName;
                this.uploadFileInfo.progress = 100;
            });

        },
        methods: {
            _uploadFile: function(event) {
                $("#uploadFile").trigger("click")
            },
            _chooseFile: function(event) {
                var photoFiles = event.target.files;
                if (photoFiles && photoFiles.length > 0) {
                    // 获取目前上传的文件
                    var file = photoFiles[0]; // 文件大小校验的动作
                    if (file.size > 1024 * 1024 * 20) {
                        vc.toast("文件大小不能超过 20MB!")
                        return false;
                    }
                    this.uploadFileInfo.fileName = file.name;
                    this._doUploadFile(file);
                }
            },
            _doUploadFile: function(_file) {
                var param = new FormData();
                param.append("uploadFile", _file);

                //发送get请求
                vc.http.upload('uploadVedio',
                    'upload',
                    param, {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        },
                        progress: function(event) {
                            //console.log(event);
                            //vc.toast("视频上传中，请稍后");
                            var rate = event.loaded / event.total; //已上传的比例
                            if (rate < 0.9) {
                                //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
                                //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
                                //等响应回来时，再将进度设为100%
                                this.uploadFileInfo.progress = (rate * 100).toFixed(2);
                            }
                        }
                    },
                    function(json, res) {
                        if (res.status != 200) {
                            vc.toast("上传文件失败");
                            return;
                        }
                        var _json = JSON.parse(json);
                        this.uploadFileInfo.progress = 100.00;
                        vc.toast("文件上传成功");

                        this.uploadFileInfo.fileName = _json.fileName;
                        this.uploadFileInfo.realFileName = _json.realFileName;
                        vc.emit($props.callBackListener, $props.callBackFunction, _json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理', error);
                        vc.toast("上传文件失败");
                    });
            },
        }
    });

})(window.vc);