(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string,
            //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addStaffViewInfo: {
                flowComponent: 'addStaffView',
                username: '',
                sex: '',
                email: '',
                tel: '',
                address: '',
                relCd: '',
                relCds:[],
                videoPlaying:false,
                photo: ''
            }
        },
        watch: {
            addStaffViewInfo: {
                deep: true,
                handler: function() {
                    vc.component.saveAddStaffInfo();
                }
            }
        },
        _initMethod: function() {
            vc.getDict('u_org_staff_rel',"rel_cd",function(_data){
                vc.component.addStaffViewInfo.relCds = _data;
            });
},
        _initEvent: function() {

            vc.on('addStaffView', 'onIndex',
            function(_index) {
                vc.component.addStaffViewInfo.index = _index;

                if(_index == 2){
                    $that._initAddStaffMedia();
                }
            });
        },
        methods: {
            addStaffValidate() {
                return vc.validate.validate({
                    addStaffViewInfo: vc.component.addStaffViewInfo
                },
                {
                    'addStaffViewInfo.username': [{
                        limit: "required",
                        param: "",
                        errInfo: "员工名称不能为空"
                    },
                    {
                        limit: "maxin",
                        param: "2,10",
                        errInfo: "员工名称长度必须在2位至10位"
                    },
                    ],
                    'addStaffViewInfo.sex': [{
                        limit: "required",
                        param: "",
                        errInfo: "员工性别不能为空"
                    },
                    ],
                    'addStaffViewInfo.relCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "员工岗位不能为空"
                    },
                    {
                        limit: "num",
                        param: "",
                        errInfo: "员工岗位错误"
                    },
                    ],
                    'addStaffViewInfo.tel': [{
                        limit: "photo",
                        param: "",
                        errInfo: "联系方式不是有效手机"
                    },
                    ],
                    'addStaffViewInfo.address': [{
                        limit: "required",
                        param: "",
                        errInfo: "家庭住址不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "200",
                        errInfo: "家庭住址不能超过200位"
                    },
                    ],

                });
            },
            saveAddStaffInfo: function() {
                if (vc.component.addStaffValidate()) {
                    //侦听回传
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addStaffViewInfo);
                    return;
                }
            },
            _addUserMedia: function () {
                return navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia || null;
            },
            _initAddStaffMedia: function () {
                if (vc.component._addUserMedia()) {
                    vc.component.addStaffViewInfo.videoPlaying = false;
                    var constraints = {
                        video: true,
                        audio: false
                    };
                    var video = document.getElementById('staffPhoto');
                    var media = navigator.getUserMedia(constraints, function (stream) {
                        var url = window.URL || window.webkitURL;
                        //video.src = url ? url.createObjectURL(stream) : stream;
                        try {
                            video.src = url ? url.createObjectURL(stream) : stream;
                        } catch (error) {
                            video.srcObject = stream;
                        }
                        video.play();
                        vc.component.addStaffViewInfo.videoPlaying = true;
                    }, function (error) {
                        console.log("ERROR");
                        console.log(error);
                    });
                } else {
                    console.log("初始化视频失败");
                }
            },
            _takePhoto: function () {
                if (vc.component.addStaffViewInfo.videoPlaying) {
                    var canvas = document.getElementById('canvas');
                    var video = document.getElementById('staffPhoto');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0);
                    var data = canvas.toDataURL('image/jpeg',1.0);
                    vc.component.addStaffViewInfo.photo = data;
                    //document.getElementById('photo').setAttribute('src', data);
                }
            },
            _uploadPhoto: function (event) {
                $("#uploadStaffPhoto").trigger("click")
            },
            _choosePhoto: function (event) {
                var photoFiles = event.target.files;
                if (photoFiles && photoFiles.length > 0) {
                    // 获取目前上传的文件
                    var file = photoFiles[0];// 文件大小校验的动作
                    if (file.size > 1024 * 1024 * 2) {
                        vc.toast("图片大小不能超过 2MB!")
                        return false;
                    }
                    var reader = new FileReader(); //新建FileReader对象
                    reader.readAsDataURL(file); //读取为base64
                    reader.onloadend = function (e) {
                        vc.component.addStaffViewInfo.photo = reader.result;
                    }
                }
            },
        }
    });

})(window.vc);