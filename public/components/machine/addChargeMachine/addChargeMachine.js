(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addChargeMachineInfo: {
                machineId: '',
                machineName: '',
                machineCode: '',
                implBean: '',
                ruleId: '',
                energyPrice: '1',
                factorys:[],
                specs: [],
                rules:[],
                portCount:'',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addChargeMachine', 'openAddChargeMachineModal', function () {
                $that._listFactorys();
                $that._listAddChargeRules();
                $('#addChargeMachineModel').modal('show');
            });
        },
        methods: {
            addChargeMachineValidate() {
                return vc.validate.validate({
                    addChargeMachineInfo: vc.component.addChargeMachineInfo
                }, {
                    'addChargeMachineInfo.machineName': [
                        {
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
                    'addChargeMachineInfo.machineCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "设备编号不能超过30"
                        },
                    ],
                    'addChargeMachineInfo.implBean': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "厂家不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "厂家不能超过30"
                        },
                    ],
                    'addChargeMachineInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "小时电价不能为空"
                        }
                    ],
                    'addChargeMachineInfo.energyPrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "用量电价不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "用量电价不能超过12"
                        },
                    ],

                });
            },
            saveChargeMachineInfo: function () {
                if (!vc.component.addChargeMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.component.addChargeMachineInfo.communityId = vc.getCurrentCommunity().communityId;
            
                vc.http.apiPost(
                    '/chargeMachine.saveChargeMachine',
                    JSON.stringify(vc.component.addChargeMachineInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addChargeMachineModel').modal('hide');
                            vc.component.clearAddChargeMachineInfo();
                            vc.emit('chargeMachineManage', 'listChargeMachine', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddChargeMachineInfo: function () {
                vc.component.addChargeMachineInfo = {
                    machineName: '',
                    machineCode: '',
                    implBean: '',
                    ruleId: '',
                    energyPrice: '1',
                    factorys:[],
                    specs: [],
                    rules:[],
                    portCount:'',
                };
            },
            _listFactorys: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                    }
                };
                //发送get请求
                vc.http.apiGet('/chargeMachine.listChargeMachineFactory', param,
                    function(json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        $that.addChargeMachineInfo.factorys = _feeConfigManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeFactory: function() {
                let _factorys = $that.addChargeMachineInfo.factorys;
                _factorys.forEach(item => {
                    if (item.factoryId == $that.addChargeMachineInfo.implBean) {
                        item.specs.forEach(specItem => {
                            specItem.specValue = "";
                        })
                        $that.addChargeMachineInfo.specs = item.specs;
                    }
                });
            },
            _listAddChargeRules: function () {
                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/chargeRule.listChargeRule',
                    param,
                    function (json, res) {
                        let _chargeRuleManageInfo = JSON.parse(json);
                        $that.addChargeMachineInfo.rules = _chargeRuleManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
