(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addParkingSpaceApplyInfo: {
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
            vc.on('addParkingSpaceApply', 'openAddParkingSpaceApplyModal', function () {
                $('#addParkingSpaceApplyModel').modal('show');
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
                            limit: "maxLength",
                            param: "12",
                            errInfo: "车牌号不能超过12位"
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
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addParkingSpaceApplyInfo);
                    $('#addParkingSpaceApplyModel').modal('hide');
                    return;
                }
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
                            $('#addParkingSpaceApplyModel').modal('hide');
                            vc.component.clearAddParkingSpaceApplyInfo();
                            vc.emit('parkingSpaceApplyManage', 'listParkingSpaceApply', {});
                            vc.toast("添加成功");
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
            }
        }
    });
})(window.vc);
