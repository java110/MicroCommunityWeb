(function(vc) {

    vc.extends({
        data: {
            editMeterMachineInfo: {
                machineId: '',
                machineName: '',
                address: '',
                meterType: '',
                machineModel: '',
                roomId: '',
                roomName: '',
                feeConfigId: '',
                implBean: '',
                readDay: '',
                readHours: '',
                meterTypes: [],
                feeConfigs: [],
                factorys: [],
                specs: []
            }
        },
        _initMethod: function() {
            $that.editMeterMachineInfo.machineId = vc.getParam('machineId');
            $that._listMeterMachines();
            $that._listMeterType();
            $that._listFeeConfigs();
            $that._listFactorys();

        },
        _initEvent: function() {
            vc.on('editMeterMachine', 'selectRoom', function(param) {
                vc.copyObject(param, $that.editMeterMachineInfo);
            })
        },
        methods: {
            editMeterMachineValidate() {
                return vc.validate.validate({
                    editMeterMachineInfo: vc.component.editMeterMachineInfo
                }, {
                    'editMeterMachineInfo.machineName': [{
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "名称不能超过200"
                        },
                    ],
                    'editMeterMachineInfo.address': [{
                            limit: "required",
                            param: "",
                            errInfo: "表号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "表号不能超过30"
                        },
                    ],
                    'editMeterMachineInfo.meterType': [{
                            limit: "required",
                            param: "",
                            errInfo: "表类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "表类型不能超过30"
                        },
                    ],
                    'editMeterMachineInfo.machineModel': [{
                            limit: "required",
                            param: "",
                            errInfo: "模式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "模式不能超过12"
                        },
                    ],
                    'editMeterMachineInfo.roomId': [{
                            limit: "required",
                            param: "",
                            errInfo: "房屋不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "房屋不能超过30"
                        },
                    ],
                    'editMeterMachineInfo.feeConfigId': [{
                            limit: "required",
                            param: "",
                            errInfo: "费用项不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "费用项ID,充值模式时不能超过30"
                        },
                    ],
                    'editMeterMachineInfo.implBean': [{
                            limit: "required",
                            param: "",
                            errInfo: "门禁厂家不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "门禁厂家不能超过30"
                        },
                    ],
                });
            },
            saveMeterMachineInfo: function() {
                if (!vc.component.editMeterMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.component.editMeterMachineInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/meterMachine.updateMeterMachine',
                    JSON.stringify(vc.component.editMeterMachineInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _goBack: function() {
                vc.goBack();
            },
            _listMeterType: function(_page, _rows) {
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
                    function(json, res) {
                        let _accessControlMachineManageInfo = JSON.parse(json);
                        $that.editMeterMachineInfo.meterTypes = _accessControlMachineManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listFeeConfigs: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function(json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        $that.editMeterMachineInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listFactorys: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                    }
                };
                //发送get请求
                vc.http.apiGet('/meterMachine.listMeterMachineFactory', param,
                    function(json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        $that.editMeterMachineInfo.factorys = _feeConfigManageInfo.data;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeFactory: function() {
                let _factorys = $that.editMeterMachineInfo.factorys;
                _factorys.forEach(item => {
                    if (item.factoryId == $that.editMeterMachineInfo.implBean) {
                        item.specs.forEach(specItem => {
                            specItem.specValue = "";
                        })
                        $that.editMeterMachineInfo.specs = item.specs;
                    }
                });
            },
            _selectRoom: function() {
                vc.emit('roomTree', 'openRoomTree', {
                    callName: 'editMeterMachine'
                })
            },
            _listMeterMachines: function(_page, _rows) {

                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        machineId: $that.editMeterMachineInfo.machineId
                    }
                };

                //发送get请求
                vc.http.apiGet('/meterMachine.listMeterMachine',
                    param,
                    function(json, res) {
                        let _meterMachineManageInfo = JSON.parse(json);
                        vc.copyObject(_meterMachineManageInfo.data[0], $that.editMeterMachineInfo);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);