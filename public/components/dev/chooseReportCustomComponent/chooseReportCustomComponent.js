(function (vc) {
    vc.extends({
        data: {
            chooseReportCustomComponentInfo: {
                reportCustomComponents: [],
                _currentReportCustomComponentName: '',
                _curParam: {}
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseReportCustomComponent', 'openChooseReportCustomComponentModel', function (_param) {
                $that.chooseReportCustomComponentInfo._curParam = _param;
                $('#chooseReportCustomComponentModel').modal('show');
                vc.component._refreshChooseReportCustomComponentInfo();
                vc.component._loadAllReportCustomComponentInfo(1, 10, '');
            });
            vc.on('chooseReportCustomComponent', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadAllReportCustomComponentInfo(_currentPage, 10, '');
            });
        },
        methods: {
            _loadAllReportCustomComponentInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        name: _name
                    }
                };

                //发送get请求
                vc.http.apiGet('/reportCustomComponent.listReportCustomComponent',
                    param,
                    function (json) {
                        var _reportCustomComponentInfo = JSON.parse(json);
                        vc.component.chooseReportCustomComponentInfo.reportCustomComponents = _reportCustomComponentInfo.data;
                        vc.emit('chooseReportCustomComponent', 'paginationPlus', 'init', {
                            total: _reportCustomComponentInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseReportCustomComponent: function (_reportCustomComponent) {
                vc.copyObject(_reportCustomComponent, $that.chooseReportCustomComponentInfo._curParam);
                $('#chooseReportCustomComponentModel').modal('hide');
            },
            queryReportCustomComponents: function () {
                vc.component._loadAllReportCustomComponentInfo(1, 10, vc.component.chooseReportCustomComponentInfo._currentReportCustomComponentName);
            },
            _refreshChooseReportCustomComponentInfo: function () {
                vc.component.chooseReportCustomComponentInfo._currentReportCustomComponentName = "";
            }
        }

    });
})(window.vc);
