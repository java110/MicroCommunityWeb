/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportCustomComponentFooterManageInfo: {
                reportCustomComponentFooters: [],
                total: 0,
                records: 1,
                moreCondition: false,
                footerId: '',
                componentName: '',
                conditions: {
                    componentId: '',
                    name: '',
                    queryModel: '',
                }
            }
        },
        _initMethod: function () {
            $that.reportCustomComponentFooterManageInfo.conditions.componentId = vc.getParam('componentId');
            $that.reportCustomComponentFooterManageInfo.componentName = vc.getParam('componentName');
            vc.component._listReportCustomComponentFooters(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('reportCustomComponentFooterManage', 'listReportCustomComponentFooter', function (_param) {
                vc.component._listReportCustomComponentFooters(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listReportCustomComponentFooters(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReportCustomComponentFooters: function (_page, _rows) {

                vc.component.reportCustomComponentFooterManageInfo.conditions.page = _page;
                vc.component.reportCustomComponentFooterManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reportCustomComponentFooterManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reportCustomComponentFooter.listReportCustomComponentFooter',
                    param,
                    function (json, res) {
                        var _reportCustomComponentFooterManageInfo = JSON.parse(json);
                        vc.component.reportCustomComponentFooterManageInfo.total = _reportCustomComponentFooterManageInfo.total;
                        vc.component.reportCustomComponentFooterManageInfo.records = _reportCustomComponentFooterManageInfo.records;
                        vc.component.reportCustomComponentFooterManageInfo.reportCustomComponentFooters = _reportCustomComponentFooterManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportCustomComponentFooterManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddReportCustomComponentFooterModal: function () {
                vc.emit('addReportCustomComponentFooter', 'openAddReportCustomComponentFooterModal', {
                    componentId: $that.reportCustomComponentFooterManageInfo.conditions.componentId
                });
            },
            _openEditReportCustomComponentFooterModel: function (_reportCustomComponentFooter) {
                vc.emit('editReportCustomComponentFooter', 'openEditReportCustomComponentFooterModal', _reportCustomComponentFooter);
            },
            _openDeleteReportCustomComponentFooterModel: function (_reportCustomComponentFooter) {
                vc.emit('deleteReportCustomComponentFooter', 'openDeleteReportCustomComponentFooterModal', _reportCustomComponentFooter);
            },
            _queryReportCustomComponentFooterMethod: function () {
                vc.component._listReportCustomComponentFooters(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.reportCustomComponentFooterManageInfo.moreCondition) {
                    vc.component.reportCustomComponentFooterManageInfo.moreCondition = false;
                } else {
                    vc.component.reportCustomComponentFooterManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
