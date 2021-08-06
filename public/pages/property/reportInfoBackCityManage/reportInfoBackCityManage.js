/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportInfoBackCityManageInfo: {
                reportInfoBackCitys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                backId: '',
                conditions: {
                    name: '',
                    idCard: '',
                    tel: '',
                    source: '',
                    communityId:vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listReportInfoBackCitys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('reportInfoBackCityManage', 'listReportInfoBackCity', function (_param) {
                vc.component._listReportInfoBackCitys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listReportInfoBackCitys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReportInfoBackCitys: function (_page, _rows) {

                vc.component.reportInfoBackCityManageInfo.conditions.page = _page;
                vc.component.reportInfoBackCityManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reportInfoBackCityManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reportInfoBackCity/queryReportInfoBackCity',
                    param,
                    function (json, res) {
                        var _reportInfoBackCityManageInfo = JSON.parse(json);
                        vc.component.reportInfoBackCityManageInfo.total = _reportInfoBackCityManageInfo.total;
                        vc.component.reportInfoBackCityManageInfo.records = _reportInfoBackCityManageInfo.records;
                        vc.component.reportInfoBackCityManageInfo.reportInfoBackCitys = _reportInfoBackCityManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportInfoBackCityManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddReportInfoBackCityModal: function () {
                vc.emit('addReportInfoBackCity', 'openAddReportInfoBackCityModal', {});
            },
            _openEditReportInfoBackCityModel: function (_reportInfoBackCity) {
                vc.emit('editReportInfoBackCity', 'openEditReportInfoBackCityModal', _reportInfoBackCity);
            },
            _openDeleteReportInfoBackCityModel: function (_reportInfoBackCity) {
                vc.emit('deleteReportInfoBackCity', 'openDeleteReportInfoBackCityModal', _reportInfoBackCity);
            },
            _queryReportInfoBackCityMethod: function () {
                vc.component._listReportInfoBackCitys(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.reportInfoBackCityManageInfo.moreCondition) {
                    vc.component.reportInfoBackCityManageInfo.moreCondition = false;
                } else {
                    vc.component.reportInfoBackCityManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
