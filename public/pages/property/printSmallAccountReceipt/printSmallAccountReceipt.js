(function (vc) {
    vc.extends({
        data: {
            printSmallAccountReceiptInfo: {
                communityName: '',
                arIds: '',
                amount: 0.00,
                feeReceipts: [],
                content: '',
                qrImg: '',
                apply: 'N',
                receiptNum:'',
                feeTime:'',
                machineId:'',
                quantity:'1',
                machines:[]
            },
            printFlag: '0'
        },
        _initMethod: function () {
            $that.printSmallAccountReceiptInfo.arIds = vc.getParam('arIds');
            $that.printSmallAccountReceiptInfo.communityName = vc.getCurrentCommunity().name;

            $that._loadReceipt();
            $that._loadPrintSpec();
        },
        _initEvent: function () {
        },
        methods: {
            _initPayFee: function () {
            },
            _loadReceipt: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 30,
                        arIds: $that.printSmallAccountReceiptInfo.arIds,
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
                        $that.printSmallAccountReceiptInfo.amount = _amount.toFixed(2);
                        $that.printSmallAccountReceiptInfo.feeReceipts = _feeReceipt;
                        if(_feeReceipt && _feeReceipt.length > 0){
                            $that.printSmallAccountReceiptInfo.receiptNum= _feeReceipt[0].arId;
                            $that.printSmallAccountReceiptInfo.feeTime= _feeReceipt[0].createTime;
                        }
                       
                    },
                    function(errInfo, error) {
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
                            $that.printSmallAccountReceiptInfo.content = _data[0].content;
                            $that.printSmallAccountReceiptInfo.qrImg = _data[0].qrImg;
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _printPurchaseApplyDiv: function () {
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
            _closePage: function () {
                window.opener = null;
                window.close();
            },
            _openCloudPrint:function(){
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
                        vc.component.printSmallAccountReceiptInfo.machines = _couponPropertyPoolManageInfo.data;

                        if($that.printSmallAccountReceiptInfo.machines && $that.printSmallAccountReceiptInfo.machines.length > 0){
                            $that.printSmallAccountReceiptInfo.machineId = $that.printSmallAccountReceiptInfo.machines[0].machineId;
                        }

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _cloudPrintPayFeeDetail:function(){
                let _arIds = [];
                $that.printSmallAccountReceiptInfo.feeReceipts.forEach(_data=>{
                    _arIds.push(_data.arId);
                })
                if(_arIds.length < 1){
                    vc.toast('未包含费用');
                    return ;
                }
                let _data = {
                    communityId:vc.getCurrentCommunity().communityId,
                    machineId:$that.printSmallAccountReceiptInfo.machineId,
                    quantity:$that.printSmallAccountReceiptInfo.quantity,
                    arIds:_arIds.join(',')
                }
                vc.http.apiPost(
                    '/print.printAccountReceipt',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function (json, res) {
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
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.addFloorInfo.errorInfo = errInfo;
                        vc.toast(errInfo)
                    });
            }
        }
    });
})(window.vc);
