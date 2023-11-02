(function (vc) {
    vc.extends({
        data: {
            printPurchaseOutApplyInfo: {},
            printFlag: '0'
        },
        _initMethod: function () {
            vc.component._initprintPurchaseOutApplyDateInfo();
        },
        _initEvent: function () {
            vc.on('printPurchaseOutApply', 'openprintPurchaseOutApplyModal', function (_purchaseApplyDetailInfo) {
                $that.printPurchaseOutApplyInfo = _purchaseApplyDetailInfo;
                $('#printPurchaseOutApplyModel').modal('show');
            });
        },
        methods: {
            _initprintPurchaseOutApplyDateInfo: function () {
                let _applyOrderId = vc.getParam('applyOrderId');
                let _resOrderType = vc.getParam("resOrderType")
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        applyOrderId: _applyOrderId,
                        resOrderType: _resOrderType
                    }
                };
                //发送get请求
                vc.http.apiGet('/purchaseApply.listPurchaseApplys',
                    param,
                    function (json, res) {
                        var _purchaseApplyDetailInfo = JSON.parse(json);
                        var _purchaseApply = _purchaseApplyDetailInfo.purchaseApplys;
                        vc.component.printPurchaseOutApplyInfo = _purchaseApply[0];
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _printPurchaseOutApplyDiv: function () {
                $that.printFlag = '1';
                document.getElementById("print-btn").style.display = "none";//隐藏
                window.print();
                //$that.printFlag = false;
                window.opener = null;
                window.close();
            },
            _closePage: function () {
                window.opener = null;
                window.close();
            }
        }
    });
})(window.vc);
