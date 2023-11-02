(function (vc) {
    vc.extends({
        data: {
            addMeterMachineInfo: {
                machineId: '',
                machineName: '',
                address: '',
                meterType: '',
                machineModel: '',
                roomId: '',
                roomName: '',
                feeConfigId: '',
                implBean: '',
                meterTypes: [],
                feeConfigs: [],
                factorys: [],
                specs: [],
                readDay: '1',
                readHours: '1'
            }
        },
        _initMethod: function () {
            $that._listMeterType();
            $that._listFeeConfigs();
            $that._listFactorys();
        },
        _initEvent: function () {
            vc.on('addMeterMachine', 'openAddMeterMachineModal', function () {
                $('#addMeterMachineModel').modal('show');
            });
            vc.on('addMeterMachine', 'selectRoom', function (param) {
                vc.copyObject(param, $that.addMeterMachineInfo);
            })
        },
        methods: {
            addMeterMachineValidate() {
                return vc.validate.validate({
                    addMeterMachineInfo: vc.component.addMeterMachineInfo
                }, {
                    'addMeterMachineInfo.machineName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "名称不能超过200"
                        }
                    ],
                    'addMeterMachineInfo.address': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "表号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "表号不能超过30"
                        }
                    ],
                    'addMeterMachineInfo.meterType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "表类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "表类型不能超过30"
                        }
                    ],
                    'addMeterMachineInfo.machineModel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "模式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "模式不能超过12"
                        }
                    ],
                    'addMeterMachineInfo.roomId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "房屋不能超过30"
                        }
                    ],
                    'addMeterMachineInfo.feeConfigId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用项不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "费用项ID,充值模式时不能超过30"
                        }
                    ],
                    'addMeterMachineInfo.implBean': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "门禁厂家不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "门禁厂家不能超过30"
                        }
                    ]
                });
            },
            saveMeterMachineInfo: function () {
                if (!vc.component.addMeterMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addMeterMachineInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/meterMachine.saveMeterMachine',
                    JSON.stringify(vc.component.addMeterMachineInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
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
            _goBack: function () {
                vc.goBack();
            },
            _listMeterType: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/meterType.listMeterType',
                    param,
                    function (json, res) {
                        let _accessControlMachineManageInfo = JSON.parse(json);
                        $that.addMeterMachineInfo.meterTypes = _accessControlMachineManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listFeeConfigs: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        $that.addMeterMachineInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listFactorys: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                    }
                };
                //发送get请求
                vc.http.apiGet('/meterMachine.listMeterMachineFactory', param,
                    function (json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        console.log("测试123")
                        console.log(_feeConfigManageInfo)
                        $that.addMeterMachineInfo.factorys = _feeConfigManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeFactory: function () {
                let _factorys = $that.addMeterMachineInfo.factorys;
                _factorys.forEach(item => {
                    if (item.factoryId == $that.addMeterMachineInfo.implBean) {
                        item.specs.forEach(specItem => {
                            specItem.specValue = "";
                        })
                        $that.addMeterMachineInfo.specs = item.specs;
                    }
                });
            },
            _selectRoom: function () {
                vc.emit('roomTree', 'openRoomTree', {
                    callName: 'addMeterMachine'
                })
            },
        }
    });
})(window.vc);