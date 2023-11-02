(function (vc) {
    //var _fileUrl = 'https://hc.demo.winqi.cn/callComponent/download/getFile/fileByObjId';
    var _fileUrl = '/callComponent/download/getFile/fileByObjId';
    vc.extends({
        propTypes: {
            notifyLoadDataComponentName: vc.propTypes.string,
            componentTitle: vc.propTypes.string // 组件名称
        },
        data: {
            editOwnerInfo: {
                componentTitle: $props.componentTitle,
                ownerId: '',
                memberId: '',
                ownerTypeCd: '',
                name: '',
                age: '',
                link: '',
                address: '',
                sex: '',
                remark: '',
                ownerPhoto: '',
                ownerPhotoUrl: '',
                idCard: '',
                card: '',
                videoPlaying: true,
                mediaStreamTrack: null,
                flag: '',
                attrs: []
            }
        },
        _initMethod: function () {
            $that._loadEditOwnerAttrSpec();
        },
        _initEvent: function () {
            vc.on('editOwner', 'openEditOwnerModal', function (_owner) {
                if (_owner.address == null || _owner.address == undefined || _owner.address == '') {
                    $that.editOwnerInfo.address = "";
                }
                //清理 上次数据
                $that.clearEditOwnerInfo();
                vc.copyObject(_owner, $that.editOwnerInfo);
                //根据memberId 查询 照片信息
                $that.editOwnerInfo.ownerPhoto = _owner.urls && _owner.urls.length > 0 ? _owner.urls[0] : '';
                $that.editOwnerInfo.ownerPhotoUrl = _fileUrl + "?objId=" +
                    $that.editOwnerInfo.memberId + "&communityId=" + vc.getCurrentCommunity().communityId + "&fileTypeCd=10000&time=" + new Date();
                $('#editOwnerModel').modal('show');
                $that._initAddOwnerMediaForEdit();
                if (_owner.hasOwnProperty('ownerAttrDtos')) {
                    let _ownerAttrDtos = _owner.ownerAttrDtos;
                    _ownerAttrDtos.forEach(item => {
                        $that.editOwnerInfo.attrs.forEach(attrItem => {
                            if (item.specCd == attrItem.specCd) {
                                attrItem.attrId = item.attrId;
                                attrItem.value = item.value;
                            }
                        })
                    })
                }
            });
        },
        methods: {
            editOwnerValidate: function () {
                return vc.validate.validate({
                    editOwnerInfo: $that.editOwnerInfo
                }, {
                    'editOwnerInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,64",
                            errInfo: "名称长度必须在2位至64位"
                        }
                    ],
                    'editOwnerInfo.sex': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "性别不能为空"
                        }
                    ],
                    'editOwnerInfo.link': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机号不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "手机号格式错误"
                        }
                    ],
                    'editOwnerInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注长度不能超过200位"
                        }
                    ]
                });
            },
            editOwnerMethod: function() {
                if (!$that.editOwnerValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.editOwnerInfo.communityId = vc.getCurrentCommunity().communityId;
                //编辑时 ownerPhoto 中内容不是照片内容，则清空
                if ($that.editOwnerInfo.ownerPhotoUrl.indexOf(_fileUrl) != -1) {
                    $that.editOwnerInfo.ownerPhotoUrl = "";
                }
                vc.http.apiPost(
                    '/owner.editOwner',
                    JSON.stringify($that.editOwnerInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editOwnerModel').modal('hide');
                            vc.emit($props.notifyLoadDataComponentName, 'listOwnerData', vc.component.editOwnerInfo);
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearEditOwnerInfo: function () {
                let _componentTitle = $that.editOwnerInfo.componentTitle;
                let _attrs = $that.editOwnerInfo.attrs;
                _attrs.forEach(item => {
                    item.value = '';
                })
                $that.editOwnerInfo = {
                    componentTitle: _componentTitle,
                    ownerId: '',
                    memberId: '',
                    ownerTypeCd: '',
                    name: '',
                    age: '',
                    link: '',
                    address: '',
                    sex: '',
                    remark: '',
                    ownerPhoto: '',
                    ownerPhotoUrl: '',
                    idCard: '',
                    videoPlaying: true,
                    mediaStreamTrack: null,
                    attrs: _attrs
                };
            },
            _editUserMedia: function () {
                return navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia || null;
            },
            _initAddOwnerMediaForEdit: function() {
                if ($that._editUserMedia()) {
                    $that.editOwnerInfo.videoPlaying = false;
                    var constraints = {
                        video: {
                            width: 208,
                            height: 208
                        },
                        audio: false
                    };
                    var video = document.getElementById('ownerPhotoForEdit');
                    var media = navigator.getUserMedia(constraints, function (stream) {
                        var url = window.URL || window.webkitURL;
                        //video.src = url ? url.createObjectURL(stream) : stream;
                        $that.editOwnerInfo.mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
                        try {
                            video.src = url ? url.createObjectURL(stream) : stream;
                        } catch (error) {
                            video.srcObject = stream;
                        }
                        video.play();
                        $that.editOwnerInfo.videoPlaying = true;
                    }, function(error) {
                        $that.editOwnerInfo.videoPlaying = false;
                    });
                } else {
                    $that.editOwnerInfo.videoPlaying = false;
                    console.log("初始化视频失败");
                }
            },
            _takePhotoForEdit: function() {
                if ($that.editOwnerInfo.videoPlaying) {
                    var canvas = document.getElementById('canvasForEdit');
                    var video = document.getElementById('ownerPhotoForEdit');
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
                    canvas.getContext('2d').drawImage(video, 0, 0, w, h);
                    var data = canvas.toDataURL('image/jpeg', 0.3);
                    // 改为异步上传图片
                    this._doUploadImageEditOwner(vc.dataURLtoFile(data, $that.editOwnerInfo.name));
                    // $that.editOwnerInfo.ownerPhoto = data;
                    //document.getElementById('photo').setAttribute('src', data);
                } else {
                    vc.toast('未检测到摄像头');
                }
            },
            _uploadEditPhoto: function (event) {
                $("#uploadEditOwnerPhoto").trigger("click")
            },
            _chooseEditPhoto: function (event) {
                var photoFiles = event.target.files;
                if (photoFiles && photoFiles.length > 0) {
                    // 获取目前上传的文件
                    var file = photoFiles[0]; // 文件大小校验的动作
                    if (file.size > 1024 * 1024 * 1) {
                        vc.toast("图片大小不能超过 2MB!")
                        return false;
                    }
                    // 改为异步上传图片
                    this._doUploadImageEditOwner(file);
                }
            },
            // 异步上传图片
            _doUploadImageEditOwner: function (_file) {
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
                        $that.editOwnerInfo.ownerPhoto = data.fileId;
                        $that.editOwnerInfo.ownerPhotoUrl = data.url;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            _reOpenVedioForEdit: function() {
                $that.editOwnerInfo.ownerPhoto = "";
                $that.editOwnerInfo.ownerPhotoUrl = "";
                $that._initAddOwnerMediaForEdit();
            },
            _closeVedioForEdit: function() {
                if ($that.editOwnerInfo.mediaStreamTrack != null) {
                    $that.editOwnerInfo.mediaStreamTrack.stop();
                }
            },
            _loadEditOwnerAttrSpec: function () {
                $that.editOwnerInfo.attrs = [];
                vc.getAttrSpec('building_owner_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        item.values = [];
                        $that._loadEditAttrValue(item.specCd, item.values);
                        if (item.specShow == 'Y') {
                            $that.editOwnerInfo.attrs.push(item);
                        }
                    });
                });
            },
            _loadEditAttrValue: function (_specCd, _values) {
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if (item.valueShow == 'Y') {
                            _values.push(item);
                        }
                    });
                });
            },
            _closeEditOwnerModal: function () {
                $that._closeVedioForEdit();
                $('#editOwnerModel').modal('hide');
            },
            // obtainEditAge: function() {
            //     // $that.checkIdCard($that.editOwnerInfo.idCard);
            //     // let param = {
            //     //     idCard: $that.editOwnerInfo.idCard,
            //     //     communityId: vc.getCurrentCommunity().communityId
            //     // };
            //     // //发送get请求
            //     // vc.http.apiPost('/owner.obtainAge',
            //     //     JSON.stringify(param), {
            //     //         emulateJSON: true
            //     //     },
            //     //     function (json, res) {
            //     //         //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
            //     //         let _json = JSON.parse(json);
            //     //         if (res.status == 200) {
            //     //             $that.editOwnerInfo.age = _json.age;
            //     //         } else {
            //     //             vc.toast(_json.msg);
            //     //         }
            //     //     },
            //     //     function (errInfo, error) {
            //     //         console.log('请求失败处理');
            //     //     }
            //     // );
            //     let idCard = $that.editOwnerInfo.idCard;
            //     // 1 "验证通过!", 0 //校验不通过
            //     var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
            //     //号码规则校验
            //     if (!format.test(idCard)) {
            //         vc.toast('身份证号码不合规');
            //         $that.editOwnerInfo.idCard = "";
            //         return;
            //     }
            //     //区位码校验
            //     //出生年月日校验   前正则限制起始年份为1900;
            //     var year = idCard.substr(6, 4), //身份证年
            //         month = idCard.substr(10, 2), //身份证月
            //         date = idCard.substr(12, 2), //身份证日
            //         time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
            //         now_time = Date.parse(new Date()), //当前时间戳
            //         dates = (new Date(year, month, 0)).getDate(); //身份证当月天数
            //     if (time > now_time || date > dates) {
            //         vc.toast("身份证号码不合规");
            //         $that.editOwnerInfo.idCard = "";
            //         return;
            //     }
            //     //校验码判断
            //     var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //系数
            //     var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); //校验码对照表
            //     var id_array = idCard.split("");
            //     var sum = 0;
            //     for (var k = 0; k < 17; k++) {
            //         sum += parseInt(id_array[k]) * parseInt(c[k]);
            //     }
            //     if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
            //         vc.toast('身份证校验码不合规');
            //         $that.editOwnerInfo.idCard = "";
            //         return;
            //     }
            //     $that.editOwnerInfo.sex = vc.idCardInfoExt(idCard, 2) + "";
            //     $that.editOwnerInfo.age = vc.idCardInfoExt(idCard, 3) + "";
            // },
            // checkIdCard: function(idCard) {
            //     // 1 "验证通过!", 0 //校验不通过
            //     var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
            //     //号码规则校验
            //     if (!format.test(idCard)) {
            //         vc.toast('身份证号码不合规');
            //         $that.editOwnerInfo.card = $that.editOwnerInfo.idCard;
            //         $that.editOwnerInfo.idCard = "";
            //         $that.editOwnerInfo.flag = 1;
            //         return;
            //     }
            //     //区位码校验
            //     //出生年月日校验   前正则限制起始年份为1900;
            //     var year = idCard.substr(6, 4), //身份证年
            //         month = idCard.substr(10, 2), //身份证月
            //         date = idCard.substr(12, 2), //身份证日
            //         time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
            //         now_time = Date.parse(new Date()), //当前时间戳
            //         dates = (new Date(year, month, 0)).getDate(); //身份证当月天数
            //     if (time > now_time || date > dates) {
            //         vc.toast("身份证号码不合规");
            //         $that.editOwnerInfo.card = $that.editOwnerInfo.idCard;
            //         $that.editOwnerInfo.idCard = "";
            //         $that.editOwnerInfo.flag = 1;
            //         return;
            //     }
            //     //校验码判断
            //     var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //系数
            //     var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); //校验码对照表
            //     var id_array = idCard.split("");
            //     var sum = 0;
            //     for (var k = 0; k < 17; k++) {
            //         sum += parseInt(id_array[k]) * parseInt(c[k]);
            //     }
            //     if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
            //         vc.toast('身份证校验码不合规');
            //         $that.editOwnerInfo.card = $that.editOwnerInfo.idCard;
            //         $that.editOwnerInfo.idCard = "";
            //         $that.editOwnerInfo.flag = 1;
            //         return;
            //     }
            // }
        }
    });
})(window.vc);