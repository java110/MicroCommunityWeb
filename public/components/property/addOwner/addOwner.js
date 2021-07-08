(function (vc) {

    vc.extends({
        propTypes: {
            notifyLoadDataComponentName: vc.propTypes.string,
            componentTitle: vc.propTypes.string // 组件名称
        },
        data: {
            addOwnerInfo: {
                componentTitle: $props.componentTitle,
                name: '',
                age: '',
                link: '',
                sex: '',
                ownerTypeCd: '-1',
                remark: '',
                ownerId: '',
                ownerPhoto: '',
                idCard: '',
                videoPlaying: true,
                mediaStreamTrack: null,
                attrs: []
            }
        },
        _initMethod: function () {
            $that._loadOwnerAttrSpec();
        },
        _initEvent: function () {
            vc.on('addOwner', 'openAddOwnerModal', function (_ownerId) {
                if (_ownerId != null || _ownerId != -1) {
                    vc.component.addOwnerInfo.ownerId = _ownerId;
                }
                $('#addOwnerModel').modal('show');
                vc.component._initAddOwnerMedia();
            });
        },
        methods: {
            addOwnerValidate: function () {
                return vc.validate.validate({
                    addOwnerInfo: vc.component.addOwnerInfo
                }, {
                    'addOwnerInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "姓名不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,10",
                            errInfo: "姓名长度必须在2位至10位"
                        },
                    ],
                    'addOwnerInfo.age': [

                        {
                            limit: "num",
                            param: "",
                            errInfo: "年龄不是有效的数字"
                        },
                    ],
                    'addOwnerInfo.sex': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "性别不能为空"
                        }
                    ],
                    'addOwnerInfo.link': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机号不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "不是有效的手机号"
                        }
                    ],
                    'addOwnerInfo.idCard': [
                        {
                            limit: "idCard",
                            param: "",
                            errInfo: "身份证格式错误"
                        }
                    ],
                    'addOwnerInfo.ownerTypeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "人员类型不能为空"
                        }
                    ],
                    'addOwnerInfo.remark': [

                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注长度不能超过200位"
                        }
                    ]

                });
            },
            saveOwnerInfo: function () {
                if (!vc.component.addOwnerValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addOwnerInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.post(
                    'addOwner',
                    'saveOwner',
                    JSON.stringify(vc.component.addOwnerInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addOwnerModel').modal('hide');
                            vc.component.clearAddOwnerInfo();
                            vc.emit($props.notifyLoadDataComponentName, 'listOwnerData', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddOwnerInfo: function () {
                let _componentTitle = $that.addOwnerInfo.componentTitle;
                vc.component.addOwnerInfo = {
                    componentTitle: _componentTitle,
                    name: '',
                    age: '',
                    link: '',
                    sex: '',
                    ownerTypeCd: '-1',
                    remark: '',
                    ownerId: '',
                    ownerPhoto: '',
                    idCard: '',
                    videoPlaying: true,
                    mediaStreamTrack: null,
                    attrs: []
                };
                this._loadOwnerAttrSpec();
            },
            _addUserMedia: function () {
                return navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia || null;
            },
            _initAddOwnerMedia: function () {
                if (vc.component._addUserMedia()) {
                    var constraints = {
                        video: true,
                        audio: false
                    };
                    var video = document.getElementById('ownerPhoto');
                    var media = navigator.getUserMedia(constraints, function (stream) {
                        var url = window.URL || window.webkitURL;
                        $that.addOwnerInfo.mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
                        try {
                            video.src = url ? url.createObjectURL(stream) : stream;
                        } catch (error) {
                            video.srcObject = stream;
                        }
                        video.play();
                        vc.component.addOwnerInfo.videoPlaying = true;
                    }, function (error) {
                        vc.component.addOwnerInfo.videoPlaying = false;
                        console.log("ERROR");
                        console.log(error);
                    });
                } else {
                    vc.component.addOwnerInfo.videoPlaying = false;
                    console.log("初始化视频失败");
                }
            },
            _takePhoto: function () {
                if (vc.component.addOwnerInfo.videoPlaying) {
                    var canvas = document.getElementById('canvas');
                    var video = document.getElementById('ownerPhoto');

                    let w = video.videoWidth;

                    // 默认按比例压缩
                    let h = video.videoHeight;

                    if (h > 1080 || w > 1080) {
                        let _rate = 0;
                        if (h > w) {
                            _rate = h / 1080;
                            h = 1080;
                            w = Math.floor(w / _rate);
                        } else {
                            _rate = w / 1080;
                            w = 1080;
                            h = Math.floor(h / _rate);
                        }
                    }
                    canvas.width = w;
                    canvas.height = h;
                    canvas.getContext('2d').drawImage(video, 0, 0,w,h);
                    var data = canvas.toDataURL('image/jpeg', 0.3);
                    vc.component.addOwnerInfo.ownerPhoto = data;
                    //document.getElementById('photo').setAttribute('src', data);
                    //关闭拍照摄像头
                    $that._closeVedio();
                } else {
                    vc.toast('未检测到摄像头');
                }
            },
            _uploadPhoto: function (event) {
                console.log('上传图片');
                //vc.component.addOwnerInfo.ownerPhoto = "";
                $("#uploadOwnerPhoto").trigger("click")
            },
            _choosePhoto: function (event) {
                var photoFiles = event.target.files;
                if (photoFiles && photoFiles.length > 0) {
                    // 获取目前上传的文件
                    var file = photoFiles[0];// 文件大小校验的动作
                    if (file.size > 1024 * 1024 * 1) {
                        vc.toast("图片大小不能超过 1MB!")
                        return false;
                    }
                    var reader = new FileReader(); //新建FileReader对象
                    reader.readAsDataURL(file); //读取为base64
                    reader.onloadend = function (e) {
                        vc.component.addOwnerInfo.ownerPhoto = reader.result;
                    }
                }
            },
            _reOpenVedio: function () {
                vc.component.addOwnerInfo.ownerPhoto = "";
                vc.component._initAddOwnerMedia();
            },
            _closeVedio: function () {
                if (vc.component.addOwnerInfo.mediaStreamTrack != null) {
                    vc.component.addOwnerInfo.mediaStreamTrack.stop();
                }
            },
            _loadOwnerAttrSpec: function () {
                $that.addOwnerInfo.attrs = [];
                vc.getAttrSpec('building_owner_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        if (item.specShow == 'Y') {
                            item.values = [];
                            $that._loadAttrValue(item.specCd, item.values);
                            $that.addOwnerInfo.attrs.push(item);
                        }
                    });

                });
            },
            _loadAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });

                });
            },
        }
    });

})(window.vc);