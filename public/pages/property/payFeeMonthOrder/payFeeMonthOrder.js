(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            payFeeMonthOrderInfo: {
                payerObjId: '',
                payerObjType: '',
                payerObjName: '',
                name: '',
                link: '',
                builtUpArea: '',
                roomArea: '',
                paNum: '',
                psNum: '',
                monthFees: [],
                totalAmount: 0.0,
                selectMonthIds: [],
                payMonthDate:''
            }
        },
        watch: {
            'payFeeMonthOrderInfo.selectMonthIds': {
                deep: true,
                handler: function () {
                    $that._doComputeTotalFee();
                    let checkObj = document.querySelectorAll('.all-check'); // 获取所有checkbox项
                    if ($that.payFeeMonthOrderInfo.selectMonthIds.length < $that.payFeeMonthOrderInfo.monthFees.length) {
                        checkObj[0].checked = false;
                    } else {
                        checkObj[0].checked = true;
                    }
                }
            }
        },
        _initMethod: function () {
            $that.payFeeMonthOrderInfo.payerObjId = vc.getParam('payerObjId');
            $that.payFeeMonthOrderInfo.payerObjType = vc.getParam('payerObjType');
            vc.initDateMonth('payMonthDate', function (_value) {
                $that.payFeeMonthOrderInfo.payMonthDate = _value;
                $that._listOweMonthFee();

            });
            $that._loadFeeObjInfo();
            $that._listOweMonthFee();

        },
        _initEvent: function () {
            vc.on('payFeeMonthOrder','load',function(){
                $that._listOweMonthFee();
            })

        },
        methods: {
            
            _loadFeeObjInfo: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId: $that.payFeeMonthOrderInfo.payerObjId,
                        payerObjType: $that.payFeeMonthOrderInfo.payerObjType,
                        page: 1,
                        row: 1,
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFeePayerObj',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.copyObject(_json.data, $that.payFeeMonthOrderInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listOweMonthFee: function () {
                
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        objId: $that.payFeeMonthOrderInfo.payerObjId,
                        payerObjType: $that.payFeeMonthOrderInfo.payerObjType,
                        detailId: '-1'
                    }
                };

                if($that.payFeeMonthOrderInfo.payMonthDate){
                    let _yearMonth = $that.payFeeMonthOrderInfo.payMonthDate.split('-');
                    param.params.detailYear= _yearMonth[0];
                    param.params.detailMonth= parseInt(_yearMonth[1]);
                }
                $that.payFeeMonthOrderInfo.selectMonthIds = [];
                //发送get请求
                vc.http.apiGet('/fee.listMonthFee',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        let _totalAmount = 0.0;
                        _feeConfigInfo.data.forEach(item => {
                            _totalAmount += parseFloat(item.receivableAmount);
                            $that.payFeeMonthOrderInfo.selectMonthIds.push(item.monthId);
                        })
                        $that.payFeeMonthOrderInfo.totalAmount = _totalAmount.toFixed(2);
                        $that.payFeeMonthOrderInfo.monthFees = _feeConfigInfo.data;
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            checkAll: function (e) {
                let checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            $that.payFeeMonthOrderInfo.selectMonthIds.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.payFeeMonthOrderInfo.selectMonthIds = [];
                }
            },
            _doComputeTotalFee:function(){
                let _totalAmount = 0.0;
                $that.payFeeMonthOrderInfo.monthFees.forEach(item=>{
                    $that.payFeeMonthOrderInfo.selectMonthIds.forEach(monthId =>{
                        if(item.monthId == monthId){
                            _totalAmount += parseFloat(item.receivableAmount);
                        }
                    })
                });
                $that.payFeeMonthOrderInfo.totalAmount = _totalAmount;

            },
            _openPayFee: function () {
                if ($that.payFeeMonthOrderInfo.selectMonthIds.length <= 0) {
                    vc.toast('未选择费用');
                    return;
                }
                //打开model
                //打开model
                vc.emit('payFeeMonthOrderResult', 'openResultModal', {
                    totalAmount: $that.payFeeMonthOrderInfo.totalAmount,
                    selectMonthIds: $that.payFeeMonthOrderInfo.selectMonthIds,
                    payerObjId: $that.payFeeMonthOrderInfo.payerObjId,
                    payType:'qrCode'
                })
            },
            _payFee: function () {
                if ($that.payFeeMonthOrderInfo.selectMonthIds.length <= 0) {
                    vc.toast('未选择费用');
                    return;
                }
                //打开model
                vc.emit('payFeeMonthOrderResult', 'openResultModal', {
                    totalAmount: $that.payFeeMonthOrderInfo.totalAmount,
                    selectMonthIds: $that.payFeeMonthOrderInfo.selectMonthIds,
                    payerObjId: $that.payFeeMonthOrderInfo.payerObjId,
                    payType:'common'
                })
            },
            _queryMonthFeeAll:function(){
                $that.payFeeMonthOrderInfo.payMonthDate = "";
                $that._listOweMonthFee();
            },
        }
    });
})(window.vc);