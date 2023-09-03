(function(vc) {
    vc.extends({
        data: {
            printSmallPayFeeInfo: {
                communityName: '',
                receiptId: '',
                receiptIds: '',
                receiptNum: '',
                payOrderId: '',
                roomName: '',
                amount: 0.00,
                fees: [],
                feeTime: '',
                wechatName: '',
                content: '',
                qrImg: '',
                payObjName: '',
                machineId: '',
                quantity: '1',
                machines: []
            },
            printFlag: '0'
        },
        _initMethod: function() {
            //vc.component._initPrintPurchaseApplyDateInfo();
            $that.printSmallPayFeeInfo.receiptId = vc.getParam('receiptId');
            $that.printSmallPayFeeInfo.receiptIds = vc.getParam('receiptIds');
            //$that.printSmallPayFeeInfo.feeTime = vc.dateTimeFormat(new Date());
            $that.printSmallPayFeeInfo.communityName = vc.getCurrentCommunity().name;
            $that._loadReceipt();
            $that._loadPrintSpec();
        },
        _initEvent: function() {},
        methods: {
            _initPayFee: function() {},
            _loadReceipt: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 30,
                        receiptId: $that.printSmallPayFeeInfo.receiptId,
                        receiptIds: $that.printSmallPayFeeInfo.receiptIds,
                        communityId: vc.getCurrentCommunity().communityId,

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
                        $that.printSmallPayFeeInfo.amount = _amount.toFixed(2);
                        $that.printSmallPayFeeInfo.roomName = _feeReceipt[0].objName;
                        $that.printSmallPayFeeInfo.feeTime = _feeReceipt[0].createTime;
                        $that.printSmallPayFeeInfo.payObjName = _feeReceipt[0].payObjName;
                        $that.printSmallPayFeeInfo.receiptNum = _feeReceipt[0].receiptCode;
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
                        receiptId: $that.printSmallPayFeeInfo.receiptId,
                        receiptIds: $that.printSmallPayFeeInfo.receiptIds,
                        communityId: vc.getCurrentCommunity().communityId,
                        orderBy: 'start_time'
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeReceipt/queryFeeReceiptDetail',
                    param,
                    function(json, res) {
                        var _feeReceiptManageInfo = JSON.parse(json);
                        let _feeReceiptDetails = _feeReceiptManageInfo.data;
                        //$that.printSmallPayFeeInfo.receiptNum = _feeReceiptDetails[0].receiptId;
                        $that.printSmallPayFeeInfo.payOrderId = _feeReceiptDetails[0].payOrderId;
                        $that.printSmallPayFeeInfo.fees = _feeReceiptDetails;
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
                            $that.printSmallPayFeeInfo.content = _data[0].content;
                            $that.printSmallPayFeeInfo.qrImg = _data[0].qrImg;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _printPurchaseApplyDiv: function() {
                let bdhtml = window.document.body.innerHTML;
                let sprnstr = "<startprint></startprint>";
                let eprnstr = "<endprint></endprint>";
                let prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + sprnstr.length);
                prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
                window.document.body.innerHTML = prnhtml;
                console.log(window.document.body.innerHTML)
                window.print();
                // window.print();
                // //$that.printFlag = false;
                window.opener = null;
                window.close();
            },
            _closePage: function() {
                window.opener = null;
                window.close();
            },
            _openCloudPrint: function() {
                $('#cloudPrintModel').modal('show');
                $that._listMachinePrinter();
            },
            _listMachinePrinter: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/printer.listMachinePrinter',
                    param,
                    function(json, res) {
                        var _couponPropertyPoolManageInfo = JSON.parse(json);
                        vc.component.printSmallPayFeeInfo.machines = _couponPropertyPoolManageInfo.data;

                        if ($that.printSmallPayFeeInfo.machines && $that.printSmallPayFeeInfo.machines.length > 0) {
                            $that.printSmallPayFeeInfo.machineId = $that.printSmallPayFeeInfo.machines[0].machineId;
                        }

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _cloudPrintPayFeeDetail: function() {
                let _detailIds = [];
                $that.printSmallPayFeeInfo.fees.forEach(_data => {
                    _detailIds.push(_data.detailId);
                })
                if (_detailIds.length < 1) {
                    vc.toast('未包含费用');
                    return;
                }
                let _data = {
                    communityId: vc.getCurrentCommunity().communityId,
                    machineId: $that.printSmallPayFeeInfo.machineId,
                    quantity: $that.printSmallPayFeeInfo.quantity,
                    detailId: _detailIds.join(',')
                }
                vc.http.apiPost(
                    '/print.printPayFeeDetail',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#cloudPrintModel').modal('hide');
                            vc.toast("提交成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.addFloorInfo.errorInfo = errInfo;
                        vc.toast(errInfo)
                    });
            }
        }
    });
})(window.vc);