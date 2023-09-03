(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addIntegralRuleConfigInfo: {

                configId: '',
                ruleId:'',
                configs:[]
            }
        },
        _initMethod: function () {
            //100301 赠送一次  100302 每月赠送一次
        },
        _initEvent: function () {
            vc.on('addIntegralRuleConfig', 'openAddIntegralRuleConfigModal', function (_rule) {
                vc.copyObject(_rule,$that.addIntegralRuleConfigInfo);
                $that._listAddIntegralPropertyPools();
                $('#addIntegralRuleConfigModel').modal('show');
            });
        },
        methods: {
            addIntegralRuleConfigValidate() {
                return vc.validate.validate({
                    addIntegralRuleConfigInfo: vc.component.addIntegralRuleConfigInfo
                }, {
                    'addIntegralRuleConfigInfo.configId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "标准不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "标准不能超过64"
                        },
                    ],
                });
            },
            saveIntegralRuleConfigInfo: function () {
                if (!vc.component.addIntegralRuleConfigValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addIntegralRuleConfigInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/integral.saveIntegralRuleConfig',
                    JSON.stringify(vc.component.addIntegralRuleConfigInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addIntegralRuleConfigModel').modal('hide');
                            vc.component.clearAddIntegralRuleConfigInfo();
                            vc.emit('integralRuleConfigManage', 'listIntegralRuleConfig', {});
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            _listAddIntegralPropertyPools: function (_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/integral.listIntegralConfig',
                    param,
                    function (json, res) {
                        var _integralPropertyPoolManageInfo = JSON.parse(json);
                        vc.component.addIntegralRuleConfigInfo.configs = _integralPropertyPoolManageInfo.data;
                       
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearAddIntegralRuleConfigInfo: function () {
                vc.component.addIntegralRuleConfigInfo = {
                    configId: '',
                    ruleId:'',
                    configs:[]

                };
            }
        }
    });

})(window.vc);
