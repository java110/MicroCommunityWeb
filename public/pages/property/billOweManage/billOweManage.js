/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            billOweManageInfo: {
                billOwes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                billName:'',
                conditions: {
                    ownerName: '',
                    state: '',
                    billName: '',
                    billId: '',

                }
            }
        },
        _initMethod: function () {
            $that.billOweManageInfo.conditions.billId = vc.getParam('billId');
            $that.billOweManageInfo.billName = vc.getParam('billName');

            $that._listOwebills(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('billOweManage', 'listbillOwe', function (_param) {
                vc.component.billOweManageInfo.componentShow = 'billOweList';
                vc.component._listOwebills(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listOwebills(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOwebills: function (_page, _rows) {

                vc.component.billOweManageInfo.conditions.page = _page;
                vc.component.billOweManageInfo.conditions.row = _rows;
                vc.component.billOweManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.billOweManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('fee.listBillOweFee',
                    param,
                    function (json, res) {
                        var _billOweManageInfo = JSON.parse(json);
                        vc.component.billOweManageInfo.total = _billOweManageInfo.total;
                        vc.component.billOweManageInfo.records = _billOweManageInfo.records;
                        vc.component.billOweManageInfo.billOwes = _billOweManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.billOweManageInfo.records,
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
                vc.component._listOwebills(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.billOweManageInfo.moreCondition) {
                    vc.component.billOweManageInfo.moreCondition = false;
                } else {
                    vc.component.billOweManageInfo.moreCondition = true;
                }
            },
            _goBack:function(){
                vc.goBack();
            }


        }
    });
})(window.vc);
