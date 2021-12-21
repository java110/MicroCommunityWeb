(function (vc, vm) {

    vc.extends({
        data: {
            deleteReportCustomGroupInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteReportCustomGroup', 'openDeleteReportCustomGroupModal', function (_params) {
                vc.component.deleteReportCustomGroupInfo = _params;
                $('#deleteReportCustomGroupModel').modal('show');
            });
        },
        methods: {
            deleteReportCustomGroup: function () {
                vc.http.apiPost(
                    '/reportCustomGroup.deleteReportCustomGroup',
                    JSON.stringify(vc.component.deleteReportCustomGroupInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteReportCustomGroupModel').modal('hide');
                            vc.emit('reportCustomGroupManage', 'listReportCustomGroup', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteReportCustomGroupModel: function () {
                $('#deleteReportCustomGroupModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
