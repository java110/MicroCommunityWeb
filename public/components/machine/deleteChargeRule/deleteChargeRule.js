(function (vc, vm) {
    vc.extends({
        data: {
            deleteChargeRuleInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteChargeRule', 'openDeleteChargeRuleModal', function (_params) {
                vc.component.deleteChargeRuleInfo = _params;
                $('#deleteChargeRuleModel').modal('show');
            });
        },
        methods: {
            deleteChargeRule: function () {
                vc.component.deleteChargeRuleInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/chargeRule.deleteChargeRule',
                    JSON.stringify(vc.component.deleteChargeRuleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteChargeRuleModel').modal('hide');
                            vc.emit('chargeRuleManage', 'listChargeRule', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            closeDeleteChargeRuleModel: function () {
                $('#deleteChargeRuleModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
