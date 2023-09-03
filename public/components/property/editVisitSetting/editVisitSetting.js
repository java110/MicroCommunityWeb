(function (vc, vm) {
    vc.extends({
        data: {
            editVisitSettingInfo: {
                settingId: '',
                typeName: '',
                faceWay: '',
                carNumWay: '',
                auditWay: '',
                flowId: '',
                flowName: '',
                remark: '',
                paId: '',
                carFreeTime: '',
                visitNumber: '',
                isNeedReview: '',
                visitorCode: '',
                parkingAreas: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editVisitSetting', 'openEditVisitSettingModal', function (_params) {
                vc.component.refreshEditVisitSettingInfo();
                $('#editVisitSettingModel').modal('show');
                vc.copyObject(_params, vc.component.editVisitSettingInfo);
                vc.component.editVisitSettingInfo.communityId = vc.getCurrentCommunity().communityId;
                $that._loadEditParkings();
            });
        },
        methods: {
            editVisitSettingValidate: function () {
                return vc.validate.validate({
                    editVisitSettingInfo: vc.component.editVisitSettingInfo
                }, {
                    'editVisitSettingInfo.typeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "类型名称不能超过30"
                        }
                    ],
                    'editVisitSettingInfo.faceWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "人脸同步不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "人脸同步不能超过12"
                        }
                    ],
                    'editVisitSettingInfo.carNumWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "车辆同步不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "车辆同步不能超过12"
                        }
                    ],
                    'editVisitSettingInfo.auditWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物业审核不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "物业审核不能超过12"
                        }
                    ],
                    'editVisitSettingInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        }
                    ],
                    'editVisitSettingInfo.settingId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editVisitSetting: function () {
                if (!vc.component.editVisitSettingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/visit.updateVisitSetting',
                    JSON.stringify(vc.component.editVisitSettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editVisitSettingModel').modal('hide');
                            vc.toast("修改成功");
                            vc.emit('visitSettingManage', 'listVisitSetting', {});
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
            _loadEditParkings: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/parkingArea.listParkingAreas', param,
                    function (json, res) {
                        let _parkingAreaManageInfo = JSON.parse(json);
                        $that.editVisitSettingInfo.parkingAreas = _parkingAreaManageInfo.parkingAreas;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            refreshEditVisitSettingInfo: function () {
                vc.component.editVisitSettingInfo = {
                    settingId: '',
                    typeName: '',
                    faceWay: '',
                    carNumWay: '',
                    auditWay: '',
                    flowId: '',
                    flowName: '',
                    remark: '',
                    paId: '',
                    carFreeTime: '',
                    visitNumber: '',
                    isNeedReview: '',
                    visitorCode: '',
                    parkingAreas: []
                }
            }
        }
    });
})(window.vc, window.vc.component);
