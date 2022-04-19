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
                visitPhoto: "/img/defaultAvatar.png"
            }
        },
        watch: {
            addVisitCase: {
                deep: true,
                handler: function () {
                    vc.emit('addVisitSpace', 'visitCase', vc.component.addVisitCase);
                }
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('s_visit_info', "reason_type", function (_data) {
                vc.component.addVisitCase.reasonTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('addVisitCase', 'onIndex', function (_index) {
                // console.log("侦听到addVisitCase的index为  "+_index);
                // vc.component.addCarInfo.index = _index;
                if (_index != 2) {
                    return;
                }
                $that._initAddVisitMedia();
                // vc.emit('addVisitSpace', 'notify', _index);
            });

            vc.on('addVisitCase', 'clearInfo', function () {
                vc.component._clearAddVisitCaseInfo();
            });
        },
        methods: {
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
                    vc.component.addVisitCase.visitPhoto = data;
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
                    var reader = new FileReader(); //新建FileReader对象
                    reader.readAsDataURL(file); //读取为base64
                    reader.onloadend = function (e) {
                        vc.component.addVisitCase.visitPhoto = reader.result;
                    }
                }
            },

            _clearAddVisitCaseInfo: function(){
                vc.component.addVisitCase.visitCase = '';
                vc.component.addVisitCase.reasonType = '';
                // vc.component.addVisitCase.reasonTypes = [];
                vc.component.addVisitCase.videoPlaying = false;
                vc.component.addVisitCase.visitPhoto = '/img/defaultAvatar.png';
            }
        }
    });
})(window.vc);