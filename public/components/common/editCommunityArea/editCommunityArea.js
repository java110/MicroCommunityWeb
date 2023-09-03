(function (vc, vm) {
    vc.extends({
        data: {
            editCommunityAreaInfo: {
                communityId: '',
                name: '',
                address: '',
                nearbyLandmarks: '',
                cityCode: '',
                mapX: '101.33',
                mapY: '101.33',
                tel: '',
                communityArea: '',
                qrCode:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editCommunityArea', 'openEditCommunityModal',
                function (_params) {
                    vc.component.refreshEditCommunityInfo();
                    $('#editCommunityAreaModel').modal('show');
                    vc.copyObject(_params, vc.component.editCommunityAreaInfo);
                    if(_params.qrCode){
                        let photos = [];
                        photos.push(_params.qrCode);
                        vc.emit('editCommunityArea', 'uploadImageUrl', 'notifyPhotos', photos);
                    }
                });
            vc.on("editCommunityArea", "notifyUploadImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.editCommunityAreaInfo.qrCode = _param[0].url;
                } else {
                    vc.component.editCommunityAreaInfo.qrCode = ''
                }
            });
        },
        methods: {
            editCommunityAreaValidate: function () {
                return vc.validate.validate({
                    editCommunityAreaInfo: vc.component.editCommunityAreaInfo
                }, {
                    'editCommunityAreaInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "小区名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "小区名称格式错误"
                        },
                    ],
                    'editCommunityAreaInfo.address': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "小区地址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "小区地址错误"
                        },
                    ],
                    'editCommunityAreaInfo.nearbyLandmarks': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "小区地标不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "小区地标错误"
                        },
                    ],
                    'editCommunityAreaInfo.cityCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "城市编码不能为空"
                        }
                    ],
                    'editCommunityAreaInfo.mapX': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "地区X坐标不能为空"
                        }
                    ],
                    'editCommunityAreaInfo.mapY': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "地区Y坐标不能为空"
                        }
                    ],
                    'editCommunityAreaInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系方式不能为空"
                        }
                    ],
                    'editCommunityAreaInfo.communityArea': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "小区面积不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "小区面积必须是3.00 格式"
                        },
                    ],
                    'editCommunityAreaInfo.communityId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "小区ID不能为空"
                        }
                    ]
                });
            },
            editCommunityArea: function () {
                if (!vc.component.editCommunityAreaValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost('/community.updateCommunity', JSON.stringify(vc.component.editCommunityAreaInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCommunityAreaModel').modal('hide');
                            vc.emit('enterCommunity', 'listMyCommunity', {});
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
            refreshEditCommunityInfo: function () {
                vc.component.editCommunityAreaInfo = {
                    communityId: '',
                    name: '',
                    address: '',
                    nearbyLandmarks: '',
                    cityCode: '',
                    mapX: '101.33',
                    mapY: '101.33',
                    tel: '',
                    state: '',
                    communityArea: '',
                    qrCode:''
                }
            }
        }
    });
})(window.vc, window.vc.component);