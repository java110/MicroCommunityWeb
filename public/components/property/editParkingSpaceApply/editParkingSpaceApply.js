(function (vc, vm) {
    vc.extends({
        data: {
            editParkingSpaceApplyInfo: {
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
            $('.editStartTime').datetimepicker({
                language: 'zh-CN',
                fontAwesome: 'fa',
                format: 'yyyy-mm-dd hh:ii:ss',
                initTime: true,
                initialDate: new Date(),
                autoClose: 1,
                todayBtn: true
            });
            $('.editStartTime').datetimepicker()
                .on('changeDate', function (ev) {
                    var value = $(".editStartTime").val();
                    vc.component.editParkingSpaceApplyInfo.startTime = value;
                });
            $('.editEndTime').datetimepicker({
                language: 'zh-CN',
                fontAwesome: 'fa',
                format: 'yyyy-mm-dd hh:ii:ss',
                initTime: true,
                initialDate: new Date(),
                autoClose: 1,
                todayBtn: true
            });
            $('.editEndTime').datetimepicker()
                .on('changeDate', function (ev) {
                    var value = $(".editEndTime").val();
                    vc.component.editParkingSpaceApplyInfo.endTime = value;
                });
        },
        _initEvent: function () {
            vc.on('editParkingSpaceApply', 'openEditParkingSpaceApplyModal', function (_params) {
                vc.component.refreshEditParkingSpaceApplyInfo();
                $('#editParkingSpaceApplyModel').modal('show');
                vc.copyObject(_params, vc.component.editParkingSpaceApplyInfo);
                vc.component.editParkingSpaceApplyInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editParkingSpaceApplyValidate: function () {
                return vc.validate.validate({
                    editParkingSpaceApplyInfo: vc.component.editParkingSpaceApplyInfo
                }, {
                    'editParkingSpaceApplyInfo.carNum': [
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
                    'editParkingSpaceApplyInfo.carBrand': [
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
                    'editParkingSpaceApplyInfo.carType': [
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
                    'editParkingSpaceApplyInfo.carColor': [
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
                    'editParkingSpaceApplyInfo.startTime': [
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
                    'editParkingSpaceApplyInfo.endTime': [
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
                    'editParkingSpaceApplyInfo.applyPersonName': [
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
                    'editParkingSpaceApplyInfo.applyPersonLink': [
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
                    'editParkingSpaceApplyInfo.applyPersonId': [
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
                    'editParkingSpaceApplyInfo.state': [
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
                    'editParkingSpaceApplyInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "300",
                            errInfo: "请填写备注"
                        }
                    ],
                    'editParkingSpaceApplyInfo.applyId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请ID不能为空"
                        }
                    ]
                });
            },
            editParkingSpaceApply: function () {
                if (!vc.component.editParkingSpaceApplyValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'parkingSpaceApply.updateParkingSpaceApply',
                    JSON.stringify(vc.component.editParkingSpaceApplyInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editParkingSpaceApplyModel').modal('hide');
                            vc.emit('parkingSpaceApplyManage', 'listParkingSpaceApply', {});
                            vc.toast("修改成功");
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
            refreshEditParkingSpaceApplyInfo: function () {
                vc.component.editParkingSpaceApplyInfo = {
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
            }
        }
    });
})(window.vc, window.vc.component);
