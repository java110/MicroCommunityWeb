/**
 入驻小区
 **/
 (function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailInspectionInfo: {
                inspectionTasks: [],
                staffId:'',
                undoOrder: '20200405',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('staffDetailInspection', 'switch', function (_data) {
                $that.staffDetailInspectionInfo.staffId = _data.staffId;
                $that._loadStaffDetailInspectionData(DEFAULT_PAGE,DEFAULT_ROWS)
            });
            vc.on('staffDetailInspection', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadStaffDetailInspectionData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('staffDetailInspection', 'notify', function (_data) {
                $that._loadStaffDetailInspectionData(DEFAULT_PAGE,DEFAULT_ROWS);
            })
        },
        methods: {
            _loadStaffDetailInspectionData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        planUserId:$that.staffDetailInspectionInfo.staffId,
                        state:$that.staffDetailInspectionInfo.undoOrder,
                        page:_page,
                        row:_row
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/inspectionTaskDetail.listInspectionTaskDetails',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.staffDetailInspectionInfo.inspectionTasks = _roomInfo.inspectionTaskDetails;
                        vc.emit('staffDetailInspection', 'paginationPlus', 'init', {
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
            _qureyStaffDetailInspection: function () {
                $that._loadStaffDetailInspectionData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _switchUndoInspectionOrder:function(_order){
                $that.staffDetailInspectionInfo.undoOrder = _order;
                $that._loadStaffDetailInspectionData(DEFAULT_PAGE,DEFAULT_ROWS);
            },
            openFile: function (_photo) {
                vc.emit('viewImage', 'showImage', {
                    url: _photo.url
                });
            },
            openMap: function (lat, lng) {
                if (!lat || !lng) {
                    vc.toast('暂无位置信息');
                    return;
                }
                vc.emit('viewMap', 'showMap', {
                    lat: lat,
                    lng: lng
                });
            },
           
        }
    });
})(window.vc);