(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addShopRangeInfo: {
                shopRangeId: '',
                shopRangeId: '',
                shopTypeId: '',
                rangeName: '',
                isShow: '',
                isDefault: '',
                seq: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addShopRange', 'openAddShopRangeModal', function () {
                $('#addShopRangeModel').modal('show');
            });
        },
        methods: {
            addShopRangeValidate() {
                return vc.validate.validate({
                    addShopRangeInfo: vc.component.addShopRangeInfo
                }, {

                    'addShopRangeInfo.shopTypeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "店铺类型id不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "店铺类型ID太长"
                        },
                    ],
                    'addShopRangeInfo.rangeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "范围名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "范围名称太长"
                        },
                    ],
                    'addShopRangeInfo.isShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否展示不能为空"
                        },],
                    'addShopRangeInfo.isDefault': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否默认不能为空"
                        },],
                    'addShopRangeInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "显示序号不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "显示序号不是有效数字"
                        },
                    ],
                    'addShopRangeInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "120",
                            errInfo: "描述太长"
                        },
                    ],




                });
            },
            saveShopRangeInfo: function () {
                if (!vc.component.addShopRangeValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addShopRangeInfo);
                    $('#addShopRangeModel').modal('hide');
                    return;
                }

                vc.http.apiPost('/shopRange/saveShopRange',
                    JSON.stringify(vc.component.addShopRangeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addShopRangeModel').modal('hide');
                            vc.component.clearAddShopRangeInfo();
                            vc.emit('shopRangeManage', 'listShopRange', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddShopRangeInfo: function () {
                vc.component.addShopRangeInfo = {
                    shopRangeId: '',
                    shopTypeId: '',
                    rangeName: '',
                    isShow: '',
                    isDefault: '',
                    seq: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
