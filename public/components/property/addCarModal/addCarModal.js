/**
 权限组
 **/
(function(vc) {
    vc.extends({
        data: {
            addCarModelInfo: {
                flowComponent: 'addCar',
                carNum: '',
                carBrand: '',
                carType: '',
                carColor: '',
                remark: "",
                carId: ''
            },
            carTypes: [{
                    key: '9901',
                    value: '家用小汽车'
                },
                {
                    key: '9902',
                    value: '客车'
                },
                {
                    key: '9903',
                    value: '货车'
                }
            ]
        },
        _initMethod: function() {
            var param = {
                    params: {
                        name: 'owner_car',
                        type: 'car_type'
                    }
                }
                //发送get请求
            vc.http.apiGet('/dict.queryDict',
                param,
                function(json, res) {
                    var carTypes = JSON.parse(json);
                    vc.component.carTypes = carTypes;
                },
                function(errInfo, error) {
                    console.log('请求失败处理');
                }
            );
        },
        _initEvent: function() {
            vc.on('addCarModal', 'openAddCarModel',
                function(_param) {
                    $that.addCarModelInfo.carId = _param.carId;
                    $('#addCarModal').modal('show');
                });
        },
        methods: {
            addCarValidate: function() {
                return vc.validate.validate({
                    addCarModelInfo: vc.component.addCarModelInfo
                }, {
                    'addCarModelInfo.carNum': [{
                            limit: "required",
                            param: "",
                            errInfo: "车牌号不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,12",
                            errInfo: "车牌号不正确"
                        }
                    ],
                    'addCarModelInfo.carBrand': [{
                            limit: "required",
                            param: "",
                            errInfo: "车品牌不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "车品牌超出限制"
                        }
                    ],
                    'addCarModelInfo.carType': [{
                        limit: "required",
                        param: "",
                        errInfo: "车类型不能为空"
                    }],
                    'addCarModelInfo.carColor': [{
                            limit: "required",
                            param: "",
                            errInfo: "车颜色不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "车颜色超出限制"
                        }
                    ]
                });
            },
            saveAddCarInfo: function() {
                let _carNumType = $that.addCarModelInfo.carNumType;
                if (!vc.component.addCarValidate()) {
                    //侦听回传
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addCarModelInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost('owner.saveOwnerCarMember', JSON.stringify(vc.component.addCarModelInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCarModal').modal('hide');
                            vc.component.clearAddCarModalInfo();
                            vc.emit('listOwnerCarMember', 'listOwnerCarData', {});
                            vc.emit('carDetailMember', 'notify',{});
                            vc.toast("添加成功");
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddCarModalInfo: function() {
                $that.addCarModelInfo = {
                    flowComponent: 'addCar',
                    carNum: '',
                    carBrand: '',
                    carType: '',
                    carColor: '',
                    remark: "",
                    carNumType: '',
                    carId: ''
                }
            }
        }
    });
})(window.vc);