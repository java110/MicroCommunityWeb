(function (vc, vm) {

    vc.extends({
        data: {
            deleteReportInfoBackCityInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteReportInfoBackCity', 'openDeleteReportInfoBackCityModal', function (_params) {

                vc.component.deleteReportInfoBackCityInfo = _params;
                $('#deleteReportInfoBackCityModel').modal('show');

            });
        },
        methods: {
            deleteReportInfoBackCity: function () {
                vc.component.deleteReportInfoBackCityInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/reportInfoBackCity/deleteReportInfoBackCity',
                    JSON.stringify(vc.component.deleteReportInfoBackCityInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteReportInfoBackCityModel').modal('hide');
                            vc.emit('reportInfoBackCityManage', 'listReportInfoBackCity', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteReportInfoBackCityModel: function () {
                $('#deleteReportInfoBackCityModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
