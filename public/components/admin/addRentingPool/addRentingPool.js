(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addRentingPoolInfo: {
                rentingId: '',
                rentingTitle: '',
                price: '',
                paymentType: '',
                checkInDate: '',
                rentingConfigId: '',
                rentingDesc: '',
                ownerName: '',
                ownerTel: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addRentingPool', 'openAddRentingPoolModal', function () {
                $('#addRentingPoolModel').modal('show');
            });
        },
        methods: {
            addRentingPoolValidate() {
                return vc.validate.validate({
                    addRentingPoolInfo: vc.component.addRentingPoolInfo
                }, {
                    'addRentingPoolInfo.rentingTitle': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "出租标题不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "标题太长 超过100位"
                        },
                    ],
                    'addRentingPoolInfo.price': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "租金不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "格式错误"
                        },
                    ],
                    'addRentingPoolInfo.paymentType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预付类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "格式错误"
                        },
                    ],
                    'addRentingPoolInfo.checkInDate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "入住时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "格式错误"
                        },
                    ],
                    'addRentingPoolInfo.rentingConfigId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "出租配置不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "显示格式错误"
                        },
                    ],
                    'addRentingPoolInfo.rentingDesc': [
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "备注格式错误"
                        },
                    ],
                    'addRentingPoolInfo.ownerName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "业主名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "业主名称太长"
                        },
                    ],
                    'addRentingPoolInfo.ownerTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "业主电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "业主电话格式错误"
                        },
                    ],
                });
            },
            saveRentingPoolInfo: function () {
                if (!vc.component.addRentingPoolValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addRentingPoolInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addRentingPoolInfo);
                    $('#addRentingPoolModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/renting/saveRentingPool',
                    JSON.stringify(vc.component.addRentingPoolInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addRentingPoolModel').modal('hide');
                            vc.component.clearAddRentingPoolInfo();
                            vc.emit('rentingPoolManage', 'listRentingPool', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddRentingPoolInfo: function () {
                vc.component.addRentingPoolInfo = {
                    rentingTitle: '',
                    price: '',
                    paymentType: '',
                    checkInDate: '',
                    rentingConfigId: '',
                    rentingDesc: '',
                    ownerName: '',
                    ownerTel: '',

                };
            }
        }
    });

})(window.vc);
