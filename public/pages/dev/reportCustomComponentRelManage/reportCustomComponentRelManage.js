/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportCustomComponentRelManageInfo: {
                reportCustomComponentRels: [],
                total: 0,
                records: 1,
                moreCondition: false,
                curComponent: 'reportCustomComponentRel',
                relId: '',
                title: '',
                conditions: {
                    relId: '',
                    customId: '',
                }
            }
        },
        _initMethod: function () {
            $that.reportCustomComponentRelManageInfo.conditions.customId = vc.getParam('customId');
            $that.reportCustomComponentRelManageInfo.title = vc.getParam('title');
            vc.component._listReportCustomComponentRels(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('reportCustomComponentRelManage', 'listReportCustomComponentRel', function (_param) {
                $that.reportCustomComponentRelManageInfo.curComponent = 'reportCustomComponentRel';
                vc.component._listReportCustomComponentRels(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listReportCustomComponentRels(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReportCustomComponentRels: function (_page, _rows) {

                vc.component.reportCustomComponentRelManageInfo.conditions.page = _page;
                vc.component.reportCustomComponentRelManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reportCustomComponentRelManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reportCustomComponentRel.listReportCustomComponentRel',
                    param,
                    function (json, res) {
                        var _reportCustomComponentRelManageInfo = JSON.parse(json);
                        vc.component.reportCustomComponentRelManageInfo.total = _reportCustomComponentRelManageInfo.total;
                        vc.component.reportCustomComponentRelManageInfo.records = _reportCustomComponentRelManageInfo.records;
                        vc.component.reportCustomComponentRelManageInfo.reportCustomComponentRels = _reportCustomComponentRelManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportCustomComponentRelManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddReportCustomComponentRelModal: function () {
                vc.emit('addReportCustomComponentRel', 'openAddReportCustomComponentRelModal', {
                    customId: $that.reportCustomComponentRelManageInfo.conditions.customId
                });
                $that.reportCustomComponentRelManageInfo.curComponent = 'addReportCustomComponentRel';
            },
            _openDeleteReportCustomComponentRelModel: function (_reportCustomComponentRel) {
                vc.emit('deleteReportCustomComponentRel', 'openDeleteReportCustomComponentRelModal', _reportCustomComponentRel);
            },
            _queryReportCustomComponentRelMethod: function () {
                vc.component._listReportCustomComponentRels(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.reportCustomComponentRelManageInfo.moreCondition) {
                    vc.component.reportCustomComponentRelManageInfo.moreCondition = false;
                } else {
                    vc.component.reportCustomComponentRelManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
