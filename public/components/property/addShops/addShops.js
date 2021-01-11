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
                communityId: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addShops', 'addShopsModel', function (_params) {
                vc.component.refreshAddShopsInfo();
                $('#addShopsModel').modal('show');
                vc.component.addShopsInfo.floorId = _params.floorId;
                vc.component.addShopsInfo.communityId = vc.getCurrentCommunity().communityId;
            });

            vc.on('addShops', 'notify', function (_param) {
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
                        },
                    ]

                });
            },
            addShops: function () {
                if (!vc.component.addShopsValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.post(
                    'addShops',
                    'save',
                    JSON.stringify(vc.component.addShopsInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addShopsModel').modal('hide');
                            vc.emit('room', 'loadData', {
                                floorId: vc.component.addShopsInfo.floorId
                            });
                            return;
                        }
                        vc.toast(json);
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
                    communityId: ''
                }
            }
        }
    });

})(window.vc, window.vc.component);