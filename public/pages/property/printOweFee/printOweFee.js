(function (vc) {

    vc.extends({
        data: {
            printPayFeeInfo: {
                communityName: '',
                roomName: '',
                feePrices: 0.00,
                fees: [],
                feeTime: '',
                wechatName: '',
                content:'',
                qrImg:''
            },
            printFlag: '0'
        },
        _initMethod: function () {
            //vc.component._initPrintPurchaseApplyDateInfo();

            let _fees = vc.getData('java110_printFee');
            $that.printPayFeeInfo.fees = _fees
            $that.printPayFeeInfo.feeTime = vc.dateTimeFormat(new Date());

            $that.printPayFeeInfo.communityName = vc.getCurrentCommunity().name;

            let _totalAmount = 0.0;
            _fees.forEach(item => {
                _totalAmount += item.feePrice;
            });
            _totalAmount = Math.round(_totalAmount * 100) / 100;
            $that.printPayFeeInfo.feePrices = _totalAmount;

             $that._loadPrintSpec();
        },
        _initEvent: function () {


        },
        methods: {
            _initPayFee: function () {

            },
            _loadPrintSpec: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        specCd: 1010,
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
                            $that.printPayFeeInfo.content = _data[0].content;
                            $that.printPayFeeInfo.qrImg = _data[0].qrImg;
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },

            _printPurchaseApplyDiv: function () {

                $that.printFlag = '1';
                console.log('console.log($that.printFlag);', $that.printFlag);
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
