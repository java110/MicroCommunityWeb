(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addVisitSettingInfo: {
                settingId: '',
                typeName: '访客设置',
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
            vc.on('addVisitSetting', 'openAddVisitSettingModal', function () {
                $('#addVisitSettingModel').modal('show');
                $that._loadAddParkings();
            });
        },
        methods: {
            addVisitSettingValidate() {
                return vc.validate.validate({
                    addVisitSettingInfo: vc.component.addVisitSettingInfo
                }, {
                    'addVisitSettingInfo.typeName': [
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
                    'addVisitSettingInfo.faceWay': [
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
                    'addVisitSettingInfo.carNumWay': [
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
                    'addVisitSettingInfo.auditWay': [
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
                    'addVisitSettingInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        }
                    ],
                });
            },
            saveVisitSettingInfo: function () {
                if (!vc.component.addVisitSettingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if ($that.addVisitSettingInfo.carNumWay == "Y") {
                    if ($that.addVisitSettingInfo.paId == null || $that.addVisitSettingInfo.paId == "" || $that.addVisitSettingInfo.paId == undefined) {
                        vc.toast("停车场不能为空");
                        return;
                    }
                }
                vc.component.addVisitSettingInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/visit.saveVisitSetting',
                    JSON.stringify(vc.component.addVisitSettingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addVisitSettingModel').modal('hide');
                            vc.component.clearAddVisitSettingInfo();
                            vc.toast("添加成功");
                            vc.emit('visitSettingManage', 'listVisitSetting', {});
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
            _loadAddParkings: function () {
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
                        $that.addVisitSettingInfo.parkingAreas = _parkingAreaManageInfo.parkingAreas;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            clearAddVisitSettingInfo: function () {
                vc.component.addVisitSettingInfo = {
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
                };
            }
        }
    });
})(window.vc);
