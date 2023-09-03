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
                curBills: [],
                conditions: {
                    title: '',
                    curBill: '',
                    billName: '',
                    billId: ''
                }
            }
        },
        _initMethod: function () {
            vc.getDict('bill', "cur_bill", function (_data) {
                vc.component.billManageInfo.curBills = _data;
            });
            $that._listbills(DEFAULT_PAGE, DEFAULT_ROWS);
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
                param.params.billId = param.params.billId.trim();
                param.params.billName = param.params.billName.trim();
                //发送get请求
                vc.http.apiGet('/fee.listBill',
                    param,
                    function (json, res) {
                        var _billManageInfo = JSON.parse(json);
                        vc.component.billManageInfo.total = _billManageInfo.total;
                        vc.component.billManageInfo.records = _billManageInfo.records;
                        vc.component.billManageInfo.bills = _billManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.billManageInfo.records,
                            dataCount: vc.component.billManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openBillDetail: function (_bill) {
                vc.jumpToPage('/#/pages/property/billOweManage?' + vc.objToGetParam(_bill));
            },
            //查询
            _querybillMethod: function () {
                vc.component._listbills(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetbillMethod: function () {
                vc.component.billManageInfo.conditions.billId = "";
                vc.component.billManageInfo.conditions.curBill = "";
                vc.component.billManageInfo.conditions.billName = "";
                // vc.component.billManageInfo.conditions.activitiesId = "";
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