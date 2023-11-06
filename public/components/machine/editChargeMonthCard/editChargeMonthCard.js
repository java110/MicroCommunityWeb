(function (vc, vm) {
    vc.extends({
        data: {
            editChargeMonthCardInfo: {
                cardId: '',
                cardName: '',
                cardMonth: '',
                cardPrice: '',
                dayHours: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editChargeMonthCard', 'openEditChargeMonthCardModal', function (_params) {
                vc.component.refreshEditChargeMonthCardInfo();
                $('#editChargeMonthCardModel').modal('show');
                vc.copyObject(_params, vc.component.editChargeMonthCardInfo);
                vc.component.editChargeMonthCardInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editChargeMonthCardValidate: function () {
                return vc.validate.validate({
                    editChargeMonthCardInfo: vc.component.editChargeMonthCardInfo
                }, {
                    'editChargeMonthCardInfo.cardName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "名称不能超过200"
                        }
                    ],
                    'editChargeMonthCardInfo.cardMonth': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "月不能为空"
                        }
                    ],
                    'editChargeMonthCardInfo.cardPrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "月价不能为空"
                        }
                    ],
                    'editChargeMonthCardInfo.dayHours': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "每日充电小时不能为空"
                        }
                    ],
                    'editChargeMonthCardInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        }
                    ],
                    'editChargeMonthCardInfo.cardId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editChargeMonthCard: function () {
                if (!vc.component.editChargeMonthCardValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/chargeCard.updateChargeMonthCard',
                    JSON.stringify(vc.component.editChargeMonthCardInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editChargeMonthCardModel').modal('hide');
                            vc.emit('chargeMonthCardManage', 'listChargeMonthCard', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditChargeMonthCardInfo: function () {
                vc.component.editChargeMonthCardInfo = {
                    cardId: '',
                    cardName: '',
                    cardMonth: '',
                    cardPrice: '',
                    dayHours: '',
                    remark: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);