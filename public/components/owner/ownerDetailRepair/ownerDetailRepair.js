/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailRepairInfo: {
                repairs: [],
                ownerId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailRepair', 'switch', function (_data) {
                $that.ownerDetailRepairInfo.ownerId = _data.ownerId;
                $that._loadOwnerDetailRepairData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailRepair', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadOwnerDetailRepairData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadOwnerDetailRepairData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.ownerDetailRepairInfo.ownerId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/ownerRepair.listOwnerRepairs',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailRepairInfo.repairs = _roomInfo.data;
                        vc.emit('ownerDetailRepair', 'paginationPlus', 'init', {
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
            _qureyOwnerDetailRepair: function () {
                $that._loadOwnerDetailRepairData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openRepairDetail: function (_repairPool) {
                vc.jumpToPage('/#/pages/property/ownerRepairDetail?repairId=' + _repairPool.repairId)
            },
        }
    });
})(window.vc);