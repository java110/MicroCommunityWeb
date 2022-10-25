(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMarketRuleInfo: {
                ruleId: '',
                name: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addMarketRule', 'openAddMarketRuleModal', function () {
                $('#addMarketRuleModel').modal('show');
            });
        },
        methods: {
            addMarketRuleValidate() {
                return vc.validate.validate({
                    addMarketRuleInfo: vc.component.addMarketRuleInfo
                }, {
                    'addMarketRuleInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "名称不能超过64"
                        },
                    ],
                    'addMarketRuleInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注'不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注'不能超过512"
                        },
                    ],

                });
            },
            saveMarketRuleInfo: function () {
                if (!vc.component.addMarketRuleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/marketRule.saveMarketRule',
                    JSON.stringify(vc.component.addMarketRuleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMarketRuleModel').modal('hide');
                            vc.component.clearAddMarketRuleInfo();
                            vc.emit('marketRuleManage', 'listMarketRule', {});
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddMarketRuleInfo: function () {
                vc.component.addMarketRuleInfo = {
                    name: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
