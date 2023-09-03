(function (vc, vm) {
    vc.extends({
        data: {
            deleteReportCustomComponentFooterInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteReportCustomComponentFooter', 'openDeleteReportCustomComponentFooterModal', function (_params) {
                vc.component.deleteReportCustomComponentFooterInfo = _params;
                $('#deleteReportCustomComponentFooterModel').modal('show');
            });
        },
        methods: {
            deleteReportCustomComponentFooter: function () {
                vc.component.deleteReportCustomComponentFooterInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'reportCustomComponentFooter.deleteReportCustomComponentFooter',
                    JSON.stringify(vc.component.deleteReportCustomComponentFooterInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteReportCustomComponentFooterModel').modal('hide');
                            vc.emit('reportCustomComponentFooterManage', 'listReportCustomComponentFooter', {});
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
            closeDeleteReportCustomComponentFooterModel: function () {
                $('#deleteReportCustomComponentFooterModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
