(function (vc, vm) {
    vc.extends({
        data: {
            deleteReportCustomInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteReportCustom', 'openDeleteReportCustomModal', function (_params) {
                vc.component.deleteReportCustomInfo = _params;
                $('#deleteReportCustomModel').modal('show');
            });
        },
        methods: {
            deleteReportCustom: function () {
                vc.http.apiPost(
                    'reportCustom.deleteReportCustom',
                    JSON.stringify(vc.component.deleteReportCustomInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteReportCustomModel').modal('hide');
                            vc.emit('reportCustomManage', 'listReportCustom', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeleteReportCustomModel: function () {
                $('#deleteReportCustomModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
