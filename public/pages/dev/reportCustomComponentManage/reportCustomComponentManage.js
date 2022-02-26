/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportCustomComponentManageInfo: {
                reportCustomComponents: [],
                total: 0,
                records: 1,
                moreCondition: false,
                componentId: '',
                conditions: {
                    componentId: '',
                    name: '',
                    componentType: '',

                }
            }
        },
        _initMethod: function() {
            vc.component._listReportCustomComponents(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('reportCustomComponentManage', 'listReportCustomComponent', function(_param) {
                vc.component._listReportCustomComponents(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listReportCustomComponents(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReportCustomComponents: function(_page, _rows) {

                vc.component.reportCustomComponentManageInfo.conditions.page = _page;
                vc.component.reportCustomComponentManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reportCustomComponentManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reportCustomComponent.listReportCustomComponent',
                    param,
                    function(json, res) {
                        var _reportCustomComponentManageInfo = JSON.parse(json);
                        vc.component.reportCustomComponentManageInfo.total = _reportCustomComponentManageInfo.total;
                        vc.component.reportCustomComponentManageInfo.records = _reportCustomComponentManageInfo.records;
                        vc.component.reportCustomComponentManageInfo.reportCustomComponents = _reportCustomComponentManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportCustomComponentManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddReportCustomComponentModal: function() {
                vc.emit('addReportCustomComponent', 'openAddReportCustomComponentModal', {});
            },
            _openEditReportCustomComponentModel: function(_reportCustomComponent) {
                vc.emit('editReportCustomComponent', 'openEditReportCustomComponentModal', _reportCustomComponent);
            },
            _openDeleteReportCustomComponentModel: function(_reportCustomComponent) {
                vc.emit('deleteReportCustomComponent', 'openDeleteReportCustomComponentModal', _reportCustomComponent);
            },
            _queryReportCustomComponentMethod: function() {
                vc.component._listReportCustomComponents(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _openComponentCondition: function(_reportCustomComponent) {
                vc.jumpToPage('/#/pages/dev/componentConditionManage?componentId=' + _reportCustomComponent.componentId + "&componentName=" + _reportCustomComponent.name);
            },
            _openComponentFooter: function(_reportCustomComponent) {
                vc.jumpToPage('/#/pages/dev/reportCustomComponentFooterManage?componentId=' + _reportCustomComponent.componentId + "&componentName=" + _reportCustomComponent.name);
            },
            _moreCondition: function() {
                if (vc.component.reportCustomComponentManageInfo.moreCondition) {
                    vc.component.reportCustomComponentManageInfo.moreCondition = false;
                } else {
                    vc.component.reportCustomComponentManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);