(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addChargeMonthCardInfo: {
                cardId: '',
                cardName: '',
                cardMonth: '',
                cardPrice: '',
                dayHours: '',
                remark: '',
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addChargeMonthCard', 'openAddChargeMonthCardModal', function() {
                $('#addChargeMonthCardModel').modal('show');
            });
        },
        methods: {
            addChargeMonthCardValidate() {
                return vc.validate.validate({
                    addChargeMonthCardInfo: $that.addChargeMonthCardInfo
                }, {
                    'addChargeMonthCardInfo.cardName': [{
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "名称不能超过200"
                        },
                    ],
                    'addChargeMonthCardInfo.cardMonth': [{
                        limit: "required",
                        param: "",
                        errInfo: "月不能为空"
                    }],
                    'addChargeMonthCardInfo.cardPrice': [{
                        limit: "required",
                        param: "",
                        errInfo: "月价不能为空"
                    }],
                    'addChargeMonthCardInfo.dayHours': [{
                        limit: "required",
                        param: "",
                        errInfo: "每日充电小时不能为空"
                    }],
                    'addChargeMonthCardInfo.remark': [{
                        limit: "maxLength",
                        param: "512",
                        errInfo: "备注不能超过512"
                    }, ],
                });
            },
            saveChargeMonthCardInfo: function() {
                if (!$that.addChargeMonthCardValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                $that.addChargeMonthCardInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/chargeCard.saveChargeMonthCard',
                    JSON.stringify($that.addChargeMonthCardInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addChargeMonthCardModel').modal('hide');
                            $that.clearAddChargeMonthCardInfo();
                            vc.emit('chargeMonthCardManage', 'listChargeMonthCard', {});
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddChargeMonthCardInfo: function() {
                $that.addChargeMonthCardInfo = {
                    cardName: '',
                    cardMonth: '',
                    cardPrice: '',
                    dayHours: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);