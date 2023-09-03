(function (vc) {
    vc.extends({
        data: {
            addParkingSpaceApplyInfo: {
                paName: '',
                paId: '',
                psId: '',
                psName: '',
                applyId: '',
                carNum: '',
                carBrand: '',
                carType: '',
                carColor: '',
                startTime: '',
                endTime: '',
                applyPersonName: '',
                applyPersonLink: '',
                applyPersonId: '',
                state: '1001',
                remark: ''
            }
        },
        _initMethod: function () {
            vc.initDateTime('addStartTime', function (_value) {
                $that.addParkingSpaceApplyInfo.startTime = _value;
            });
            vc.initDateTime('addEndTime', function (_value) {
                $that.addParkingSpaceApplyInfo.endTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('viewOwnerInfo', 'onIndex', function (_index) {
                /*if(_index == 2){
                   vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewOwnerInfo);
                }*/
            });
            vc.on('viewOwnerInfo', 'chooseOwner', function (_owner) {
                console.log("_owner", _owner);
                $that.addParkingSpaceApplyInfo.applyPersonName = _owner.name
                $that.addParkingSpaceApplyInfo.applyPersonLink = _owner.link
                $that.addParkingSpaceApplyInfo.applyPersonId = _owner.ownerId
            });
        },
        methods: {
            addParkingSpaceApplyValidate() {
                return vc.validate.validate({
                    addParkingSpaceApplyInfo: vc.component.addParkingSpaceApplyInfo
                }, {
                    'addParkingSpaceApplyInfo.carNum': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "车牌号不能为空"
                        },
                        {
                            limit: "carnumber",
                            param: "12",
                            errInfo: "车牌号有误"
                        }
                    ],
                    'addParkingSpaceApplyInfo.carBrand': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "汽车品牌不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "汽车品牌不能超过50位"
                        }
                    ],
                    'addParkingSpaceApplyInfo.carType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "车辆类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "车辆类型格式错误"
                        }
                    ],
                    'addParkingSpaceApplyInfo.carColor': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "颜色不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "颜色太长"
                        }
                    ],
                    'addParkingSpaceApplyInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "起租时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "起租时间格式错误"
                        }
                    ],
                    'addParkingSpaceApplyInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结租时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "结租时间格式错误"
                        }
                    ],
                    'addParkingSpaceApplyInfo.applyPersonName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "申请人名称太长"
                        }
                    ],
                    'addParkingSpaceApplyInfo.applyPersonLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请人电话不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "申请人电话长度超过11位"
                        }
                    ],
                    'addParkingSpaceApplyInfo.applyPersonId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请人ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "请填写申请人ID错误"
                        }
                    ],
                    'addParkingSpaceApplyInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "审核结果不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "车辆类型格式错误"
                        }
                    ],
                    'addParkingSpaceApplyInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "300",
                            errInfo: "请填写备注"
                        }
                    ]
                });
            },
            saveParkingSpaceApplyInfo: function () {
                if (!vc.component.addParkingSpaceApplyValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addParkingSpaceApplyInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'parkingSpaceApply.saveParkingSpaceApply',
                    JSON.stringify(vc.component.addParkingSpaceApplyInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('提交成功');
                            vc.component.clearAddParkingSpaceApplyInfo();
                            $that._goBack();
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddParkingSpaceApplyInfo: function () {
                vc.component.addParkingSpaceApplyInfo = {
                    paId: '',
                    psId: '',
                    carNum: '',
                    carBrand: '',
                    carType: '',
                    carColor: '',
                    startTime: '',
                    endTime: '',
                    applyPersonName: '',
                    applyPersonLink: '',
                    applyPersonId: '',
                    state: '1001',
                    remark: ''
                };
            },
            _goBack: function () {
                vc.goBack();
            },
            _openChooseOwner: function () {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            }
        }
    });
})(window.vc);
