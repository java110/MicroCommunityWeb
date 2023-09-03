/**
 入驻小区
 **/
 (function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailRepairInfo: {
                ownerRepairs: [],
                staffId:'',
                undoOrder: 'undo',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('staffDetailRepair', 'switch', function (_data) {
                $that.staffDetailRepairInfo.staffId = _data.staffId;
                $that._loadStaffDetailRepairData(DEFAULT_PAGE,DEFAULT_ROWS)
            });
            vc.on('staffDetailRepair', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadStaffDetailRepairData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('staffDetailRepair', 'notify', function (_data) {
                $that._loadStaffDetailRepairData(DEFAULT_PAGE,DEFAULT_ROWS);
            })
        },
        methods: {
            _loadStaffDetailRepairData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        staffId:$that.staffDetailRepairInfo.staffId,
                        page:_page,
                        row:_row
                    }
                };

                let _url = "/ownerRepair.listUndoRepairsByStaff";
                if($that.staffDetailRepairInfo.undoOrder == 'do'){
                    _url = "/ownerRepair.listFinishRepairsByStaff";
                }
               
                //发送get请求
                vc.http.apiGet(_url,
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.staffDetailRepairInfo.ownerRepairs = _roomInfo.data;
                        vc.emit('staffDetailRepair', 'paginationPlus', 'init', {
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
            _qureyStaffDetailRepair: function () {
                $that._loadStaffDetailRepairData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _switchUndoOrder:function(_order){
                $that.staffDetailRepairInfo.undoOrder = _order;
                $that._loadStaffDetailRepairData(DEFAULT_PAGE,DEFAULT_ROWS);
            },
            _openRepairDetail: function (_repairPool) {
                vc.jumpToPage('/#/pages/property/ownerRepairDetail?repairId=' + _repairPool.repairId)
            },
           
        }
    });
})(window.vc);