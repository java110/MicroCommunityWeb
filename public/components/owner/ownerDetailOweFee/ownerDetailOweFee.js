/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailOweFeeInfo: {
                fees: [],
                ownerId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailOweFee', 'switch', function (_data) {
                $that.ownerDetailOweFeeInfo.ownerId = _data.ownerId;
                $that._loadOwnerDetailOweFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailOweFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadOwnerDetailOweFeeData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadOwnerDetailOweFeeData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.ownerDetailOweFeeInfo.ownerId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/reportOweFee/queryReportOweFee',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailOweFeeInfo.fees = _roomInfo.data;
                        vc.emit('ownerDetailOweFee', 'paginationPlus', 'init', {
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
            _qureyOwnerDetailOweFee: function () {
                $that._loadOwnerDetailOweFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openBatchPayRoomFeeModal: function() {
                vc.jumpToPage('/#/pages/property/batchPayFeeOrder?ownerId=' + $that.ownerDetailOweFeeInfo.ownerId + "&payerObjType=3333")
            },
        }
    });
})(window.vc);