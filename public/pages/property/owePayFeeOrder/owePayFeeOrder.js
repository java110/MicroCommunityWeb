
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            owePayFeeOrderInfo: {
                oweFees: [],              
                feePrices: 0.00,
                communityId: vc.getCurrentCommunity().communityId,
                payObjId:'',
                payObjType:''
            }
        },
        _initMethod: function () {
            let _payObjId = vc.getParam('payObjId');
            let _payObjType = vc.getParam('payObjType');
            if(!vc.notNull(_payObjId)){
                vc.toast('非法操作');
                vc.getBack();
                return ;
            }
            $that.owePayFeeOrderInfo.payObjId = _payObjId;
            $that.owePayFeeOrderInfo.payObjType = _payObjType;
            $that._loadOweFees();
        },
        _initEvent: function () {

        },
        methods: {

            _loadOweFees:function(){
                var param = {
                    params:{
                        page:1,
                        row:50,
                        communityId:vc.getCurrentCommunity().communityId,
                        payObjId:$that.owePayFeeOrderInfo.payObjId,
                        payObjType:$that.owePayFeeOrderInfo.payObjType,
                    }
                };
                //发送get请求
               vc.http.apiGet('/feeApi/listOweFees',
                             param,
                             function(json){
                                var _json = JSON.parse(json);
                                let _fees = _json.data;
                                if(_fees.length < 1){
                                    vc.toast('当前没有欠费数据');
                                    return ;
                                }
                                $that.owePayFeeOrderInfo.oweFees = _fees;
                                let totalFee = 0.00;
                                $that.owePayFeeOrderInfo.oweFees.forEach(item => {
                                    totalFee += item.feePrice;
                                });
                                $that.owePayFeeOrderInfo.feePrices = Math.round(totalFee*100,2)/100;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            _payFee: function (_page, _row) {

                vc.toast('缴费暂不开放');
                return ;
                vc.http.post(
                    'propertyPay',
                    'payFee',
                    JSON.stringify(vc.component.payFeeOrderInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $("#payFeeResult").modal({
                                backdrop: "static",//点击空白处不关闭对话框
                                show: true
                            });
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _back: function () {
                $('#payFeeResult').modal("hide");
                vc.getBack();
            },
            _printAndBack: function () {
                $('#payFeeResult').modal("hide");
                vc.getBack();
            }
        }

    });
})(window.vc);
