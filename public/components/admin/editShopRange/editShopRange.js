(function (vc, vm) {

    vc.extends({
        data: {
            editShopRangeInfo: {
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
            vc.on('editShopRange', 'openEditShopRangeModal', function (_params) {
                vc.component.refreshEditShopRangeInfo();
                $('#editShopRangeModel').modal('show');
                vc.copyObject(_params, vc.component.editShopRangeInfo);
            });
        },
        methods: {
            editShopRangeValidate: function () {
                return vc.validate.validate({
                    editShopRangeInfo: vc.component.editShopRangeInfo
                }, {
                    'editShopRangeInfo.shopTypeId': [
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
                    'editShopRangeInfo.rangeName': [
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
                    'editShopRangeInfo.isShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否展示不能为空"
                        },],
                    'editShopRangeInfo.isDefault': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否默认不能为空"
                        },],
                    'editShopRangeInfo.seq': [
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
                    'editShopRangeInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "120",
                            errInfo: "描述太长"
                        },
                    ],
                    'editShopRangeInfo.shopRangeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "店铺经营范围id不能为空"
                        }]

                });
            },
            editShopRange: function () {
                if (!vc.component.editShopRangeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/shopRange/updateShopRange',
                    JSON.stringify(vc.component.editShopRangeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editShopRangeModel').modal('hide');
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
            refreshEditShopRangeInfo: function () {
                vc.component.editShopRangeInfo = {
                    shopRangeId: '',
                    shopRangeId: '',
                    shopTypeId: '',
                    rangeName: '',
                    isShow: '',
                    isDefault: '',
                    seq: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
