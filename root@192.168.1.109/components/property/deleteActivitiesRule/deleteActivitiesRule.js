(function (vc, vm) {

    vc.extends({
        data: {
            deleteActivitiesRuleInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteActivitiesRule', 'openDeleteActivitiesRuleModal', function (_params) {

                vc.component.deleteActivitiesRuleInfo = _params;
                $('#deleteActivitiesRuleModel').modal('show');

            });
        },
        methods: {
            deleteActivitiesRule: function () {
                vc.component.deleteActivitiesRuleInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/activitiesRule/deleteActivitiesRule',
                    JSON.stringify(vc.component.deleteActivitiesRuleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteActivitiesRuleModel').modal('hide');
                            vc.emit('activitiesRuleManage', 'listActivitiesRule', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteActivitiesRuleModel: function () {
                $('#deleteActivitiesRuleModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
