(function (vc, vm) {
    vc.extends({
        data: {
            finishFeeRuleInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('finishFeeRule', 'openFinishFeeRuleModal', function (_params) {
                $that.finishFeeRuleInfo = _params;
                $('#finishFeeRuleModel').modal('show');
            });
        },
        methods: {
            finishFeeRule: function () {
                let _data = {
                    ruleId:$that.finishFeeRuleInfo.ruleId,
                    state:'2009001',
                    communityId:vc.getCurrentCommunity().communityId,
                }
                vc.http.apiPost(
                    '/payFeeRule.updatePayFeeRule',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#finishFeeRuleModel').modal('hide');
                            vc.emit('feeDetailFeeRule', 'notify', {});
                           
                            vc.toast("结束成功");
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
            closeFinishFeeRuleModel: function () {
                $('#finishFeeRuleModel').modal('hide');
            }
        }
    });
})(window.vc, window.$that);