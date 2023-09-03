(function(vc) {

    vc.extends({
        data: {
            printPayFeeInfo: {
                communityName: '',
                receiptId: '',
                receiptIds: '',
                detailIds: '',
                roomName: '',
                amount: 0.00,
                fees: [],
                feeTime: '',
                wechatName: '',
                content: '',
                qrImg: '',
                payObjName: '',
                feeReceipt: [],
                apply: 'N'
            },
            printFlag: '0'
        },
        _initMethod: function() {
            //vc.component._initPrintPurchaseApplyDateInfo();

            $that.printPayFeeInfo.receiptId = vc.getParam('receiptId');
            $that.printPayFeeInfo.receiptIds = vc.getParam('receiptIds');
            $that.printPayFeeInfo.detailIds = vc.getParam('detailIds');
            $that.printPayFeeInfo.apply = vc.getParam('apply');

            //$that.printPayFeeInfo.feeTime = vc.dateTimeFormat(new Date());

            $that.printPayFeeInfo.communityName = vc.getCurrentCommunity().name;

            $that._loadReceipt();

            $that._loadPrintSpec();
        },
        _initEvent: function() {


        },
        methods: {
            _initPayFee: function() {

            },
            _loadReceipt: function() {

                var param = {
                    params: {
                        page: 1,
                        row: 30,
                        receiptId: $that.printPayFeeInfo.receiptId,
                        receiptIds: $that.printPayFeeInfo.receiptIds,
                        detailIds: $that.printPayFeeInfo.detailIds,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/feeReceipt/queryFeeReceipt',
                    param,
                    function(json, res) {
                        var _feeReceiptManageInfo = JSON.parse(json);
                        let _feeReceipt = _feeReceiptManageInfo.data;
                        let _amount = 0;
                        _feeReceipt.forEach(item => {
                            _amount += parseFloat(item.amount)
                        });

                        $that.printPayFeeInfo.amount = _amount.toFixed(2);
                        $that.printPayFeeInfo.roomName = _feeReceipt[0].objName;
                        $that.printPayFeeInfo.feeTime = _feeReceipt[0].createTime;
                        $that.printPayFeeInfo.payObjName = _feeReceipt[0].payObjName;
                        $that.printPayFeeInfo.feeReceipt = _feeReceipt;

                        $that._loadReceiptDetail();

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadReceiptDetail: function() {

                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        receiptId: $that.printPayFeeInfo.receiptId,
                        receiptIds: $that.printPayFeeInfo.receiptIds,
                        detailIds: $that.printPayFeeInfo.detailIds,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/feeReceipt/queryFeeReceiptDetail',
                    param,
                    function(json, res) {
                        var _feeReceiptManageInfo = JSON.parse(json);
                        let _feeReceiptDetails = _feeReceiptManageInfo.data;
                        $that.printPayFeeInfo.receiptNum = _feeReceiptDetails[0].payOrderId;
                        _feeReceiptDetails.forEach(item => {
                            $that.printPayFeeInfo.feeReceipt.forEach(im => {
                                if (item.receiptId == im.receiptId) {
                                    item.objName = im.objName;
                                    item.feeTypeCd = im.feeTypeCd;
                                }
                            })
                        })
                        $that.printPayFeeInfo.fees = _feeReceiptDetails;


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
                            $that.printPayFeeInfo.content = _data[0].content;
                            $that.printPayFeeInfo.qrImg = _data[0].qrImg;
                            if (_data[0].printName) {
                                $that.printPayFeeInfo.communityName = _data[0].printName;
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