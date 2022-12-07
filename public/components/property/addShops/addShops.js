(function (vc, vm) {
    vc.extends({
        data: {
            addShopsInfo: {
                floorId: '',
                roomNum: '',
                layer: '',
                builtUpArea: '',
                feeCoefficient: '1.00',
                remark: '',
                communityId: '',
                roomRent: '',
                roomArea: '',
                roomSubType: '120'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addShops', 'addShopsModel', function (_params) {
                vc.component.refreshAddShopsInfo();
                $('#addShopsModel').modal('show');
                vc.component.addShopsInfo.communityId = vc.getCurrentCommunity().communityId;
            });
            vc.on('addShops', 'addShops', 'notify', function (_param) {
                if (_param.hasOwnProperty('floorId')) {
                    $that.addShopsInfo.floorId = _param.floorId;
                }
            });
        },
        methods: {
            addShopsValidate: function () {
                return vc.validate.validate({
                    addShopsInfo: vc.component.addShopsInfo
                }, {
                    'addShopsInfo.roomNum': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商铺编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "商铺编号长度不能超过12位"
                        },
                    ],
                    'addShopsInfo.layer': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商铺楼层不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "商铺楼层必须为数字"
                        }
                    ],
                    'addShopsInfo.floorId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "楼栋不能为空"
                        }
                    ],
                    'addShopsInfo.builtUpArea': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "建筑面积不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "建筑面积错误，如 300.00"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "建筑面积数字长度不能超过12位"
                        }
                    ],
                    'addShopsInfo.roomArea': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "室内面积不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "室内面积错误，如 300.00"
                        }
                    ],
                    'addShopsInfo.roomRent': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "租金不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "租金错误，如 300.00"
                        }
                    ],
                    'addShopsInfo.feeCoefficient': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "算费系数不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "算费系数错误 如 1.00"
                        }
                    ],
                    'addShopsInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注长度不能超过200位"
                        }
                    ]
                });
            },
            addShops: function () {
                if (!vc.component.addShopsValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'room.saveShops',
                    JSON.stringify(vc.component.addShopsInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addShopsModel').modal('hide');
                            vc.emit('shops', 'loadData', {});
                            vc.toast("添加成功");
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
            refreshAddShopsInfo: function () {
                vc.component.addShopsInfo = {
                    floorId: '',
                    roomNum: '',
                    layer: '',
                    builtUpArea: '',
                    feeCoefficient: '1.00',
                    remark: '',
                    communityId: '',
                    roomRent: '',
                    roomArea: '',
                    roomSubType: '120'
                }
            }
        }
    });
})(window.vc, window.vc.component);