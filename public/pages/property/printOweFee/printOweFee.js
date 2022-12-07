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
                content: '',
                qrImg: '',
                payObjId: '',
                builtUpArea: '',
                payObjType:'',
                payObjName:'',
                ownerName:''
            },
            printFlag: '0'
        },
        _initMethod: function () {
            //vc.component._initPrintPurchaseApplyDateInfo();

            //$that.printPayFeeInfo.fees = _fees.fees

            $that.printPayFeeInfo.payObjId = vc.getParam('payObjId');
            $that.printPayFeeInfo.payObjType = vc.getParam('payObjType')
            $that.printPayFeeInfo.payObjName = vc.getParam('payObjName')

            $that._loadOweFees();
            $that._printOweRoom();

            $that.printPayFeeInfo.feeTime = vc.dateTimeFormat(new Date().getTime());

            $that.printPayFeeInfo.communityName = vc.getCurrentCommunity().name;

           

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
            },
            _printOweRoom: function () {
                if($that.printPayFeeInfo.payObjType != '3333'){
                    return ;
                }
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        roomId: $that.printPayFeeInfo.payObjId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listRoomsWhereFeeSet',
                    param,
                    function (json, res) {
                        var listRoomData = JSON.parse(json);
                        vc.copyObject(listRoomData.rooms[0], $that.printPayFeeInfo);
                        if (listRoomData.rooms[0].roomType == '2020602') {
                            $that.printPayFeeInfo.roomName = listRoomData.rooms[0].floorNum + '-' + listRoomData.rooms[0].roomNum;
                        } else {
                            $that.printPayFeeInfo.roomName = listRoomData.rooms[0].floorNum + '-' + listRoomData.rooms[0].unitNum + '-' + listRoomData.rooms[0].roomNum;
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            _loadOweFees: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        payObjId: $that.printPayFeeInfo.payObjId,
                        payObjType: $that.printPayFeeInfo.payObjType,
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeApi/listOweFees',
                    param,
                    function (json) {
                        var _json = JSON.parse(json);
                        let _fees = _json.data;
                        if (_fees.length < 1) {
                            $that.printPayFeeInfo.oweFees = [];
                            vc.toast('当前没有缴费通知数据');
                            return;
                        }
                        $that.printPayFeeInfo.fees = _fees;
                        let _totalAmount = 0.0;
                        $that.printPayFeeInfo.fees.forEach(item => {
                            //item.feePrice = $that._getFixedNum(item.feePrice);
                            item.receivableAmount = item.feePrice;
                            item.feePrice = item.feePrice;
                            _totalAmount += item.feePrice;
                        });
                        _totalAmount = Math.round(_totalAmount * 100) / 100;
                        $that.printPayFeeInfo.feePrices = _totalAmount;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _getDeadlineTime: function (_fee) {
                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                //return vc.dateSub(_fee.deadlineTime, _fee.feeFlag);
                return vc.dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag);
            },
        }
    });

})(window.vc);
