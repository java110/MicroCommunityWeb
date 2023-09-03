/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportCustomGroupManageInfo: {
                reportCustomGroups: [],
                total: 0,
                records: 1,
                moreCondition: false,
                groupId: '',
                conditions: {
                    groupId: '',
                    name: '',
                    url: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listReportCustomGroups(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('reportCustomGroupManage', 'listReportCustomGroup', function (_param) {
                vc.component._listReportCustomGroups(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listReportCustomGroups(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReportCustomGroups: function (_page, _rows) {
                vc.component.reportCustomGroupManageInfo.conditions.page = _page;
                vc.component.reportCustomGroupManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reportCustomGroupManageInfo.conditions
                };
                param.params.groupId = param.params.groupId.trim();
                param.params.name = param.params.name.trim();
                param.params.url = param.params.url.trim();
                //发送get请求
                vc.http.apiGet('/reportCustomGroup.listReportCustomGroup',
                    param,
                    function (json, res) {
                        var _reportCustomGroupManageInfo = JSON.parse(json);
                        vc.component.reportCustomGroupManageInfo.total = _reportCustomGroupManageInfo.total;
                        vc.component.reportCustomGroupManageInfo.records = _reportCustomGroupManageInfo.records;
                        vc.component.reportCustomGroupManageInfo.reportCustomGroups = _reportCustomGroupManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportCustomGroupManageInfo.records,
                            dataCount: vc.component.reportCustomGroupManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddReportCustomGroupModal: function () {
                vc.emit('addReportCustomGroup', 'openAddReportCustomGroupModal', {});
            },
            _openEditReportCustomGroupModel: function (_reportCustomGroup) {
                vc.emit('editReportCustomGroup', 'openEditReportCustomGroupModal', _reportCustomGroup);
            },
            _openDeleteReportCustomGroupModel: function (_reportCustomGroup) {
                vc.emit('deleteReportCustomGroup', 'openDeleteReportCustomGroupModal', _reportCustomGroup);
            },
            //查询
            _queryReportCustomGroupMethod: function () {
                vc.component._listReportCustomGroups(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetReportCustomGroupMethod: function () {
                vc.component.reportCustomGroupManageInfo.conditions.groupId = "";
                vc.component.reportCustomGroupManageInfo.conditions.name = "";
                vc.component.reportCustomGroupManageInfo.conditions.url = "";
                vc.component._listReportCustomGroups(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.reportCustomGroupManageInfo.moreCondition) {
                    vc.component.reportCustomGroupManageInfo.moreCondition = false;
                } else {
                    vc.component.reportCustomGroupManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
