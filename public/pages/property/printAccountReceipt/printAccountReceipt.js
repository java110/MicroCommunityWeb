(function(vc) {

    vc.extends({
        data: {
            printAccountReceiptInfo: {
                communityName: '',
                arIds: '',
                amount: 0.00,
                feeReceipts: [],
                content: '',
                qrImg: '',
                feeReceipt: [],
                apply: 'N',
                receiptNum:'',
                feeTime:''
            },
            printFlag: '0'
        },
        _initMethod: function() {
            $that.printAccountReceiptInfo.arIds = vc.getParam('arIds');
            $that.printAccountReceiptInfo.communityName = vc.getCurrentCommunity().name;

            $that._loadReceipt();

            $that._loadPrintSpec();
        },
        _initEvent: function() {


        },
        methods: {
            _initPayFee: function() {

            },
            _loadReceipt: function() {

                let param = {
                    params: {
                        page: 1,
                        row: 30,
                        arIds: $that.printAccountReceiptInfo.arIds,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/receipt.listAccountReceipt',
                    param,
                    function(json, res) {
                        var _feeReceiptManageInfo = JSON.parse(json);
                        let _feeReceipt = _feeReceiptManageInfo.data;
                        let _amount = 0;
                        _feeReceipt.forEach(item => {
                            _amount += parseFloat(item.receivedAmount)
                        });
                        $that.printAccountReceiptInfo.amount = _amount.toFixed(2);
                        $that.printAccountReceiptInfo.feeReceipts = _feeReceipt;
                        if(_feeReceipt && _feeReceipt.length > 0){
                            $that.printAccountReceiptInfo.receiptNum= _feeReceipt[0].arId;
                            $that.printAccountReceiptInfo.feeTime= _feeReceipt[0].createTime;
                        }
                       
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            
            _loadPrintSpec: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        specCd: 2020,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/feePrintSpec/queryFeePrintSpec',
                    param,
                    function(json, res) {
                        var _json = JSON.parse(json);
                        var _data = _json.data;
                        if (_data.length > 0) {
                            $that.printAccountReceiptInfo.content = _data[0].content;
                            $that.printAccountReceiptInfo.qrImg = _data[0].qrImg;
                            if (_data[0].printName) {
                                $that.printAccountReceiptInfo.communityName = _data[0].printName;
                            }
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },

            _printPurchaseApplyDiv: function() {

                $that.printFlag = '1';
                console.log('console.log($that.printFlag);', $that.printFlag);
                document.getElementById("print-btn").style.display = "none"; //隐藏

                window.print();
                //$that.printFlag = false;
                window.opener = null;
                window.close();
            },
            _closePage: function() {
                window.opener = null;
                window.close();
            }
        }
    });

})(window.vc);