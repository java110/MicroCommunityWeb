(function (vc) {
    vc.extends({
        data: {
            payFeeOrderResultInfo: {
                printUrl: '/print.html#/pages/property/printPayFee',
                receiptId: ''
            }
        },
        _initMethod: function () {
            $that._listFeePrintPages();
        },
        _initEvent: function () {
            vc.on('payFeeOrderResult', '_loadReceipt', function (_data) {
                setTimeout(function () {
                    $that._queryPayFeeReceiptId(_data);
                }, 1000);
            })
        },
        methods: {
            _queryPayFeeReceiptId: function (_data) {
                if (!_data) {
                    $("#payFeeResult").modal({
                        backdrop: "static", //点击空白处不关闭对话框
                        show: true
                    });
                    return;
                }
                let _param = {
                    params: {
                        detailIds: _data.detailId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 1
                    }
                }
                vc.http.apiGet(
                    '/feeReceipt/queryFeeReceipt',
                    _param,
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0 && _json.data && _json.data.length > 0) {
                            $that.payFeeOrderResultInfo.receiptId = _json.data[0].receiptId;
                        }
                        $("#payFeeResult").modal({
                            backdrop: "static", //点击空白处不关闭对话框
                            show: true
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            _printAndBack: function () {
                //$('#payFeeResult').modal("hide");
                window.open($that.payFeeOrderResultInfo.printUrl + "?receiptId=" + $that.payFeeOrderResultInfo.receiptId)
            },
            _printSmallAndBack: function () {
                //$('#payFeeResult').modal("hide");
                window.open("/smallPrint.html#/pages/property/printSmallPayFee?receiptId=" + $that.payFeeOrderResultInfo.receiptId)
            },
            _listFeePrintPages: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        state: 'T',
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feePrintPage.listFeePrintPage',
                    param,
                    function (json, res) {
                        var _feePrintPageManageInfo = JSON.parse(json);
                        let feePrintPages = _feePrintPageManageInfo.data;
                        if (feePrintPages && feePrintPages.length > 0) {
                            $that.payFeeOrderResultInfo.printUrl = feePrintPages[0].url;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _back: function () {
                $('#payFeeResult').modal("hide");
                vc.getBack();
            },
        }
    });
})(window.vc);