(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyOwnerRepairInfo: {
                repairs: [],
                ownerId: '',
                roomId: '',
                total: 0,
                records: 1,
                roomName: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyOwnerRepair', 'switch', function (_param) {
                if (_param.roomId == '') {
                    return;
                }
                $that.clearSimplifyOwnerRepairInfo();
                vc.copyObject(_param, $that.simplifyOwnerRepairInfo)
                $that._listSimplifyOwnerRepair(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyOwnerRepair', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._listSimplifyOwnerRepair(_currentPage, DEFAULT_ROWS);
                }
            );
        },
        methods: {
            _listSimplifyOwnerRepair: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        repairObjId: $that.simplifyOwnerRepairInfo.roomId
                    }
                }
                //发送get请求
                vc.http.apiGet('/ownerRepair.listOwnerRepairs',
                    param,
                    function (json, res) {
                        var _repairPoolManageInfo = JSON.parse(json);
                        $that.simplifyOwnerRepairInfo.total = _repairPoolManageInfo.total;
                        $that.simplifyOwnerRepairInfo.records = _repairPoolManageInfo.records;
                        $that.simplifyOwnerRepairInfo.repairs = _repairPoolManageInfo.data;
                        vc.emit('simplifyOwnerRepair', 'paginationPlus', 'init', {
                            total: $that.simplifyOwnerRepairInfo.records,
                            dataCount: $that.simplifyOwnerRepairInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openRepairDetail: function (_repairPool) {
                vc.jumpToPage('/#/pages/property/ownerRepairDetail?repairId=' + _repairPool.repairId)
            },
            clearSimplifyOwnerRepairInfo: function () {
                $that.simplifyOwnerRepairInfo = {
                    repairs: [],
                    ownerId: '',
                    roomId: '',
                    total: 0,
                    records: 1,
                    roomName: ''
                }
            },
            _openAddOwnerRepairModal: function () {
                vc.jumpToPage("/#/pages/common/addRoomRepair?roomId=" + $that.simplifyOwnerRepairInfo.roomId + "&roomName=" + $that.simplifyOwnerRepairInfo.roomName)
            }
        }
    });
})(window.vc);