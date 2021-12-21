(function (vc, vm) {

    vc.extends({
        data: {
            deleteComponentConditionInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteComponentCondition', 'openDeleteComponentConditionModal', function (_params) {

                vc.component.deleteComponentConditionInfo = _params;
                $('#deleteComponentConditionModel').modal('show');

            });
        },
        methods: {
            deleteComponentCondition: function () {
                vc.http.apiPost(
                    '/reportCustomComponentCondition.deleteReportCustomComponentCondition',
                    JSON.stringify(vc.component.deleteComponentConditionInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteComponentConditionModel').modal('hide');
                            vc.emit('componentConditionManage', 'listComponentCondition', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteComponentConditionModel: function () {
                $('#deleteComponentConditionModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
