(function (vc, vm) {

    vc.extends({
        data: {
            deleteMarketRuleInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteMarketRule', 'openDeleteMarketRuleModal', function (_params) {

                vc.component.deleteMarketRuleInfo = _params;
                $('#deleteMarketRuleModel').modal('show');

            });
        },
        methods: {
            deleteMarketRule: function () {
                vc.http.apiPost(
                    '/marketRule.deleteMarketRule',
                    JSON.stringify(vc.component.deleteMarketRuleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMarketRuleModel').modal('hide');
                            vc.emit('marketRuleManage', 'listMarketRule', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteMarketRuleModel: function () {
                $('#deleteMarketRuleModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
