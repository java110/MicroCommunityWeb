(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addPrinterRuleRepairInfo: {
                prfId: '',
                ruleId: '',
                repairType: '',
                repairSettings: []

            }
        },
        _initMethod: function () {


        },
        _initEvent: function () {
            vc.on('addPrinterRuleRepair', 'openAddPrinterRuleRepairModal', function (_param) {
                vc.copyObject(_param, $that.addPrinterRuleRepairInfo);
                $that._listAddPrinterConfigRepairs();
                $('#addPrinterRuleRepairModel').modal('show');
            });
        },
        methods: {

            addPrinterRuleRepairValidate() {
                return vc.validate.validate({
                    addPrinterRuleRepairInfo: vc.component.addPrinterRuleRepairInfo
                }, {
                    'addPrinterRuleRepairInfo.ruleId': [{
                        limit: "required",
                        param: "",
                        errInfo: "规则ID不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "30",
                        errInfo: "规则ID不能超过30"
                    },
                    ],
                    'addPrinterRuleRepairInfo.repairType': [{
                        limit: "required",
                        param: "",
                        errInfo: "报修类型不能为空"
                    },
                    {
                        limit: "maxLength",
                        param: "64",
                        errInfo: "报修类型不能超过64"
                    },
                    ],
                });
            },
            savePrinterRuleRepairInfo: function () {
                if (!vc.component.addPrinterRuleRepairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addPrinterRuleRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/printer.savePrinterRuleRepair',
                    JSON.stringify(vc.component.addPrinterRuleRepairInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPrinterRuleRepairModel').modal('hide');
                            vc.component.clearAddPrinterRuleRepairInfo();
                            vc.emit('printerRuleRepairManage', 'listPrinterRuleRepair', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddPrinterRuleRepairInfo: function () {
                vc.component.addPrinterRuleRepairInfo = {
                    prfId: '',
                    ruleId: '',
                    repairType: '',
                    repairSettings: []
                };
            },
            _listAddPrinterConfigRepairs: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/repair.listRepairSettings',
                    param,
                    function (json, res) {
                        var _printerPropertyPoolManageInfo = JSON.parse(json);
                        vc.component.addPrinterRuleRepairInfo.repairSettings = _printerPropertyPoolManageInfo.data;

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);