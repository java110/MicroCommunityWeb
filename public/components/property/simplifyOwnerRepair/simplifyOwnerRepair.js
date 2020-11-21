(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyOwnerRepairInfo: {
                repairs: [],
                ownerId: '',
                roomId: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyOwnerRepair', 'switch', function (_param) {
                $that.clearSimplifyOwnerRepairInfo();
                vc.copyObject(_param, $that.simplifyOwnerRepairInfo)
                $that._listSimplifyOwnerRepair(DEFAULT_PAGE, DEFAULT_ROWS);
            });
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
                vc.http.get('ownerRepairManage',
                    'list',
                    param,
                    function (json, res) {
                        var _repairPoolManageInfo = JSON.parse(json);
                        vc.component.simplifyOwnerRepairInfo.total = _repairPoolManageInfo.total;
                        vc.component.simplifyOwnerRepairInfo.records = _repairPoolManageInfo.records;
                        vc.component.simplifyOwnerRepairInfo.repairs = _repairPoolManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.simplifyOwnerRepairInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            _openRepairDetail: function (_repairPool) {
                vc.jumpToPage('/admin.html#/pages/property/ownerRepairDetail?repairId=' + _repairPool.repairId)
            },
            clearSimplifyOwnerRepairInfo: function () {
                $that.simplifyOwnerRepairInfo = {
                    repairs: [],
                    ownerId: '',
                    roomId: ''
                }
            }

        }

    });
})(window.vc);
