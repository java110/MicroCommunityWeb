/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            billManageInfo: {
                bills: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                conditions: {
                    title: '',
                    curBill: '',
                    billName: '',
                    billId: '',

                }
            }
        },
        _initMethod: function () {
           $that._listbills(DEFAULT_PAGE,DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('billManage', 'listbill', function (_param) {
                vc.component.billManageInfo.componentShow = 'billList';
                vc.component._listbills(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listbills(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listbills: function (_page, _rows) {

                vc.component.billManageInfo.conditions.page = _page;
                vc.component.billManageInfo.conditions.row = _rows;
                vc.component.billManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.billManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('fee.listBill',
                    param,
                    function (json, res) {
                        var _billManageInfo = JSON.parse(json);
                        vc.component.billManageInfo.total = _billManageInfo.total;
                        vc.component.billManageInfo.records = _billManageInfo.records;
                        vc.component.billManageInfo.bills = _billManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.billManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openBillDetail: function () {
                

            },
            _querybillMethod: function () {
                vc.component._listbills(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.billManageInfo.moreCondition) {
                    vc.component.billManageInfo.moreCondition = false;
                } else {
                    vc.component.billManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
