/**
 权限组
 **/
(function (vc) {
    vc.extends({
        data: {
            addVisitCase: {
                visitCase: "",
                reasonType: "",
                reasonTypes: [],
                videoPlaying: false,
                visitPhoto: "",
                visitPhotoUrl: ""
            }
        },
        watch: {
            addVisitCase: {
                deep: true,
                handler: function () {
                    if (!vc.component.addVisitCaseValidate()) {
                        vc.emit('addVisitSpace', 'visitCase', '');
                        return;
                    }
                    vc.emit('addVisitSpace', 'visitCase', vc.component.addVisitCase);
                }
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addVisitCase', 'onIndex', function (_index) {
                //与字典表关联
                if (_index != 2) {
                    return;
                }
                vc.getDict('s_visit_info', "reason_type", function (_data) {
                    vc.component.addVisitCase.reasonTypes = _data;
                });
                $that._initAddVisitMedia();
            });

            vc.on('addVisitCase', 'clearInfo', function () {
                vc.component._clearAddVisitCaseInfo();
            });
        },
        methods: {
            addVisitCaseValidate() {
                return vc.validate.validate({
                    addVisitCase: vc.component.addVisitCase
                }, {
                    'addVisitCase.visitCase': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "拜访事由不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "拜访事由过长"
                        }
                    ],
                    'addVisitCase.reasonType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "事由类型不能为空"
                        }
                    ]
                });
            },
            addCarValidate: function () {
            },
            saveAddCarInfo: function () {
                if (vc.component.addCarValidate()) {
                    //侦听回传
                    vc.emit($props.callBackComponent, $props.callBackFunction, vc.component.addCarInfo);
                    return;
                }
            },
            _addUserMedia: function () {
                return navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia || null;
            },
            _initAddVisitMedia: function () {
                if (vc.component._addUserMedia()) {
                    vc.component.addVisitCase.videoPlaying = false;
                    var constraints = {
                        video: true,
                        audio: false
                    };
                    var video = document.getElementById('visitPhoto');
                    var media = navigator.getUserMedia(constraints, function (stream) {
                        var url = window.URL || window.webkitURL;
                        //video.src = url ? url.createObjectURL(stream) : stream;
                        try {
                            video.src = url ? url.createObjectURL(stream) : stream;
                        } catch (error) {
                            video.srcObject = stream;
                        }
                        video.play();
                        vc.component.addVisitCase.videoPlaying = true;
                    }, function (error) {
                        console.log("ERROR");
                        console.log(error);
                    });
                } else {
                    console.log("初始化视频失败");
                }
            },
            _takePhoto: function () {
                if (vc.component.addVisitCase.videoPlaying) {
                    var canvas = document.getElementById('canvas');
                    var video = document.getElementById('visitPhoto');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0);
                    var data = canvas.toDataURL('image/jpeg', 1.0);
                    // 改为异步上传图片
                    this._doUploadImageAddVisitCase(data);
                    // vc.component.addVisitCase.visitPhoto = data;
                    //document.getElementById('photo').setAttribute('src', data);
                }
            },
            _uploadPhoto: function (event) {
                $("#uploadVisitPhoto").trigger("click")
            },
            _choosePhoto: function (event) {
                var photoFiles = event.target.files;
                if (photoFiles && photoFiles.length > 0) {
                    // 获取目前上传的文件
                    var file = photoFiles[0];// 文件大小校验的动作
                    if (file.size > 1024 * 1024 * 1) {
                        vc.toast("图片大小不能超过 2MB!")
                        return false;
                    }
                    // 改为异步上传图片
                    this._doUploadImageAddVisitCase(file);
                    // var reader = new FileReader(); //新建FileReader对象
                    // reader.readAsDataURL(file); //读取为base64
                    // reader.onloadend = function (e) {
                    //     vc.component.addVisitCase.visitPhoto = reader.result;
                    // }
                }
            },
            // 异步上传图片
            _doUploadImageAddVisitCase: function (_file) {
                var param = new FormData();
                param.append("uploadFile", _file);
                param.append('communityId', vc.getCurrentCommunity().communityId);
                //发送get请求
                vc.http.upload('uploadFile',
                    'uploadImage',
                    param, {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function (json, res) {
                        if (res.status != 200) {
                            vc.toast("上传文件失败");
                            return;
                        }
                        var data = JSON.parse(json);
                        vc.component.addVisitCase.visitPhoto = data.fileId;
                        vc.component.addVisitCase.visitPhotoUrl = data.url;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            _clearAddVisitCaseInfo: function () {
                vc.component.addVisitCase.visitCase = '';
                vc.component.addVisitCase.reasonType = '';
                // vc.component.addVisitCase.reasonTypes = [];
                vc.component.addVisitCase.videoPlaying = false;
                vc.component.addVisitCase.visitPhoto = '';
                vc.component.addVisitCase.visitPhotoUrl = '/img/defaultAvatar.png';
            }
        }
    });
})(window.vc);