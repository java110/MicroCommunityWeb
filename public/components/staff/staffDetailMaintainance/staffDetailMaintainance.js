/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailMaintainanceInfo: {
                maintainanceTasks: [],
                staffId: '',
                undoOrder: '20200405'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('staffDetailMaintainance', 'switch', function (_data) {
                $that.staffDetailMaintainanceInfo.staffId = _data.staffId;
                $that._loadStaffDetailMaintainanceData(DEFAULT_PAGE, DEFAULT_ROWS)
            });
            vc.on('staffDetailMaintainance', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadStaffDetailMaintainanceData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('staffDetailMaintainance', 'notify', function (_data) {
                $that._loadStaffDetailMaintainanceData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadStaffDetailMaintainanceData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        planUserId: $that.staffDetailMaintainanceInfo.staffId,
                        state: $that.staffDetailMaintainanceInfo.undoOrder,
                        page: _page,
                        row: _row
                    }
                };
                //发送get请求
                vc.http.apiGet('/maintainanceTask.listMaintainanceTaskDetail',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.staffDetailMaintainanceInfo.inspectionTasks = _roomInfo.inspectionTaskDetails;
                        vc.emit('staffDetailMaintainance', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyStaffDetailMaintainance: function () {
                $that._loadStaffDetailMaintainanceData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _switchUndoMaintainanceOrder: function (_order) {
                $that.staffDetailMaintainanceInfo.undoOrder = _order;
                $that._loadStaffDetailMaintainanceData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            openFile: function (_photo) {
                vc.emit('viewImage', 'showImage', {
                    url: _photo.url
                });
            }
        }
    });
})(window.vc);