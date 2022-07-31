(function(vc) {

    vc.extends({
        data: {
            printPayFeeInfo: {
                communityName: '',
                receiptId: '',
                receiptIds: '',
                roomName: '',
                amount: 0.00,
                fees: [],
                feeTime: '',
                wechatName: '',
                content: '',
                qrImg: '',
                payObjName: '',
                feeReceipt: [],
                apply: 'N',
                userName: vc.getData('/nav/getUserInfo').name,
                carName: ''
            },
            printFlag: '0'
        },
        _initMethod: function() {
            //vc.component._initPrintPurchaseApplyDateInfo();

            $that.printPayFeeInfo.receiptId = vc.getParam('receiptId');
            $that.printPayFeeInfo.receiptIds = vc.getParam('receiptIds');
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
                        $that.printPayFeeInfo.receiptNum = _feeReceipt[0].receiptId;
                        $that.printPayFeeInfo.payObjName = _feeReceipt[0].payObjName;
                        $that.printPayFeeInfo.feeReceipt = _feeReceipt;

                        $that._loadReceiptDetail();

                        if (_feeReceipt[0].objType == '6666') {
                            $that.printPayFeeInfo.carName = _feeReceipt[0].objName;
                            //查询车位对应房屋
                            $that._listOwnerCar(_feeReceipt[0].objId);
                        }

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadReceiptDetail: function() {

                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        receiptId: $that.printPayFeeInfo.receiptId,
                        receiptIds: $that.printPayFeeInfo.receiptIds,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeReceipt/queryFeeReceiptDetail',
                    param,
                    function(json, res) {
                        var _feeReceiptManageInfo = JSON.parse(json);
                        let _feeReceiptDetails = _feeReceiptManageInfo.data;
                        _feeReceiptDetails.forEach(item => {
                            $that.printPayFeeInfo.feeReceipt.forEach(im => {
                                if (item.receiptId == im.receiptId) {
                                    item.objName = im.objName;
                                    item.feeTypeCd = im.feeTypeCd;
                                }
                            });

                            $that._queryFeeDetailDiscount(item.detailId, item);
                        })
                        $that.printPayFeeInfo.fees = _feeReceiptDetails;

                        setTimeout(function() {
                            $that.$forceUpdate();
                        }, 2000)
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryFeeDetailDiscount: function(_detailId, _item) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        detailId: _detailId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeDiscount/queryFeeDetailDiscount',
                    param,
                    function(json, res) {
                        let _feeReceiptManageInfo = JSON.parse(json);
                        let _feeReceiptDetails = _feeReceiptManageInfo.data;
                        _feeReceiptDetails.forEach(data => {
                            if (data.discountType == '2002') {
                                _item.discountPrice = parseFloat(data.discountPrice) * -1;
                            }
                        })
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
            },
            _listOwnerCar: function(_carId) {
                let param = {
                        params: {
                            page: 1,
                            row: 1,
                            communityId: vc.getCurrentCommunity().communityId,
                            carId: _carId
                        }
                    }
                    //发送get请求
                vc.http.apiGet('owner.queryOwnerCars',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        let ownerCar = _json.data[0];
                        let _roomName = ownerCar.roomName.replace('栋', '-').replace("单元", '-').replace('室', '');
                        $that.printPayFeeInfo.feeReceipt[0].objName = _roomName;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);