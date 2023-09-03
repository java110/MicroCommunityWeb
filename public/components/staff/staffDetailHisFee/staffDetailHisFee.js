/**
 入驻小区
 **/
 (function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailHisFeeInfo: {
                feeDetails: [],
                staffId:'',
                state:'',
            }
        },
        _initMethod: function () {
            vc.getDict('return_pay_fee', "state", function(_data) {
                vc.component.staffDetailHisFeeInfo.returnPayFeeStates = _data;
            });
        },
        _initEvent: function () {
            vc.on('staffDetailHisFee', 'switch', function (_data) {
                $that.staffDetailHisFeeInfo.staffId = _data.staffId;
                $that._loadStaffDetailHisFeeData(DEFAULT_PAGE,DEFAULT_ROWS)
            });
            vc.on('staffDetailHisFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadStaffDetailHisFeeData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('staffDetailHisFee', 'notify', function (_data) {
                $that._loadStaffDetailHisFeeData(DEFAULT_PAGE,DEFAULT_ROWS);
            })
        },
        methods: {
            _loadStaffDetailHisFeeData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        cashierId:$that.staffDetailHisFeeInfo.staffId,
                        page:_page,
                        row:_row
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/fee.queryFeeDetail',
                    param,
                    function (json) {
                        let _returnPayFeeManageInfo = JSON.parse(json);
                        vc.component.staffDetailHisFeeInfo.feeDetails = _returnPayFeeManageInfo.feeDetails;
                        vc.emit('staffDetailHisFee', 'paginationPlus', 'init', {
                            total: _returnPayFeeManageInfo.records,
                            dataCount: _returnPayFeeManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyStaffDetailHisFee: function () {
                $that._loadStaffDetailHisFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toRefundFee: function (_detail) {
                vc.jumpToPage('/#/pages/property/propertyFee?feeId=' + _detail.feeId);
            }
           
        }
    });
})(window.vc);