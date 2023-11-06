(function (vc) {
    vc.extends({
        data: {
            reportInfoSettingTitleValueInfo: {
                values: [],
                titleId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('reportInfoSettingTitleValue', 'openreportInfoSettingTitleValueModel', function (_param) {
                $that.reportInfoSettingTitleValueInfo.titleId = _param.titleId;
                $('#reportInfoSettingTitleValueModel').modal('show');
                vc.component._loadAllValueInfo(1, 10);
            });
            vc.on('reportInfoSettingTitleValue', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadAllValueInfo(_currentPage, 15);
            });
        },
        methods: {
            _loadAllValueInfo: function (_page, _row) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        titleId: $that.reportInfoSettingTitleValueInfo.titleId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/reportInfoSettingTitleValue/queryTitleValueResult',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.reportInfoSettingTitleValueInfo.values = _roomInfo.data;
                        vc.emit('reportInfoSettingTitleValue', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            reportInfoSettingTitleValues: function () {
                vc.component._loadAllRoomInfo(1, 15);
            }
        }
    });
})(window.vc);