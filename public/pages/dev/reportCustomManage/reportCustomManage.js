/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportCustomManageInfo: {
                reportCustoms: [],
                total: 0,
                records: 1,
                moreCondition: false,
                customId: '',
                conditions: {
                    customId: '',
                    groupId: '',
                    title: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listReportCustoms(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('reportCustomManage', 'listReportCustom', function (_param) {
                vc.component._listReportCustoms(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listReportCustoms(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReportCustoms: function (_page, _rows) {
                vc.component.reportCustomManageInfo.conditions.page = _page;
                vc.component.reportCustomManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reportCustomManageInfo.conditions
                };
                param.params.customId = param.params.customId.trim();
                param.params.groupId = param.params.groupId.trim();
                param.params.title = param.params.title.trim();
                //发送get请求
                vc.http.apiGet('/reportCustom.listReportCustom',
                    param,
                    function (json, res) {
                        var _reportCustomManageInfo = JSON.parse(json);
                        vc.component.reportCustomManageInfo.total = _reportCustomManageInfo.total;
                        vc.component.reportCustomManageInfo.records = _reportCustomManageInfo.records;
                        vc.component.reportCustomManageInfo.reportCustoms = _reportCustomManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportCustomManageInfo.records,
                            dataCount: vc.component.reportCustomManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddReportCustomModal: function () {
                vc.emit('addReportCustom', 'openAddReportCustomModal', {});
            },
            _openEditReportCustomModel: function (_reportCustom) {
                vc.emit('editReportCustom', 'openEditReportCustomModal', _reportCustom);
            },
            _openDeleteReportCustomModel: function (_reportCustom) {
                vc.emit('deleteReportCustom', 'openDeleteReportCustomModal', _reportCustom);
            },
            //查询
            _queryReportCustomMethod: function () {
                vc.component._listReportCustoms(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetReportCustomMethod: function () {
                vc.component.reportCustomManageInfo.conditions.customId = "";
                vc.component.reportCustomManageInfo.conditions.groupId = "";
                vc.component.reportCustomManageInfo.conditions.title = "";
                vc.component._listReportCustoms(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openCustomComponentRel: function (_reportCustom) {
                vc.jumpToPage('/#/pages/dev/reportCustomComponentRelManage?customId=' + _reportCustom.customId + "&title=" + _reportCustom.title)
            },
            _moreCondition: function () {
                if (vc.component.reportCustomManageInfo.moreCondition) {
                    vc.component.reportCustomManageInfo.moreCondition = false;
                } else {
                    vc.component.reportCustomManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);