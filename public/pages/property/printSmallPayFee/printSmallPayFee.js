(function (vc) {

    vc.extends({
        data: {
            printSmallPayFeeInfo: {
                communityName: '',
                receiptId: '',
                receiptIds: '',
                roomName: '',
                amount: 0.00,
                fees: [],
                feeTime: '',
                wechatName: '',
                content: '',
                qrImg: ''
            },
            printFlag: '0'
        },
        _initMethod: function () {
            //vc.component._initPrintPurchaseApplyDateInfo();

            $that.printSmallPayFeeInfo.receiptId = vc.getParam('receiptId');
            $that.printSmallPayFeeInfo.receiptIds = vc.getParam('receiptIds');
            //$that.printSmallPayFeeInfo.feeTime = vc.dateTimeFormat(new Date());

            $that.printSmallPayFeeInfo.communityName = vc.getCurrentCommunity().name;

            $that._loadReceipt();

            $that._loadPrintSpec();
        },
        _initEvent: function () {


        },
        methods: {
            _initPayFee: function () {

            },
            _loadReceipt: function () {

                var param = {
                    params: {
                        page: 1,
                        row: 30,
                        receiptId: $that.printSmallPayFeeInfo.receiptId,
                        receiptIds: $that.printSmallPayFeeInfo.receiptIds,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/feeReceipt/queryFeeReceipt',
                    param,
                    function (json, res) {
                        var _feeReceiptManageInfo = JSON.parse(json);
                        let _feeReceipt = _feeReceiptManageInfo.data;
                        let _amount = 0;
                        _feeReceipt.forEach(item => {
                            _amount += parseFloat(item.amount)
                        });

                        $that.printSmallPayFeeInfo.amount = _amount;
                        $that.printSmallPayFeeInfo.roomName = _feeReceipt[0].objName;
                        $that.printSmallPayFeeInfo.feeTime = _feeReceipt[0].createTime;
                        $that.printSmallPayFeeInfo.receiptNum = _feeReceipt[0].receiptId;

                        $that._loadReceiptDetail();

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadReceiptDetail: function () {

                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        receiptId: $that.printSmallPayFeeInfo.receiptId,
                        receiptIds: $that.printSmallPayFeeInfo.receiptIds,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/feeReceipt/queryFeeReceiptDetail',
                    param,
                    function (json, res) {
                        var _feeReceiptManageInfo = JSON.parse(json);
                        let _feeReceiptDetails = _feeReceiptManageInfo.data;
                        $that.printSmallPayFeeInfo.fees = _feeReceiptDetails;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadPrintSpec: function () {
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
                    function (json, res) {
                        var _json = JSON.parse(json);
                        var _data = _json.data;
                        if (_data.length > 0) {
                            $that.printSmallPayFeeInfo.content = _data[0].content;
                            $that.printSmallPayFeeInfo.qrImg = _data[0].qrImg;
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },

            _printPurchaseApplyDiv: function () {

        
                let bdhtml=window.document.body.innerHTML;   
                let sprnstr="<startprint></startprint>";   
                let eprnstr="<endprint></endprint>";   
                let prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+sprnstr.length);   
                prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));   
                window.document.body.innerHTML=prnhtml;
                console.log(window.document.body.innerHTML)
                window.print();   
                // window.print();
                // //$that.printFlag = false;
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
