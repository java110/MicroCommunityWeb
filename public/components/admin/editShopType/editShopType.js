<<<<<<< HEAD
(function(vc, vm) {
=======
(function (vc, vm) {
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68

    vc.extends({
        data: {
            editShopTypeInfo: {
                shopTypeId: '',
                shopTypeId: '',
                typeName: '',
                isShow: '',
                isDefault: '',
                seq: '',
                remark: '',

            }
        },
<<<<<<< HEAD
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editShopType', 'openEditShopTypeModal', function(_params) {
=======
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editShopType', 'openEditShopTypeModal', function (_params) {
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68
                vc.component.refreshEditShopTypeInfo();
                $('#editShopTypeModel').modal('show');
                vc.copyObject(_params, vc.component.editShopTypeInfo);
            });
        },
        methods: {
<<<<<<< HEAD
            editShopTypeValidate: function() {
                return vc.validate.validate({
                    editShopTypeInfo: vc.component.editShopTypeInfo
                }, {
                    'editShopTypeInfo.typeName': [{
=======
            editShopTypeValidate: function () {
                return vc.validate.validate({
                    editShopTypeInfo: vc.component.editShopTypeInfo
                }, {
                    'editShopTypeInfo.typeName': [
                        {
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68
                            limit: "required",
                            param: "",
                            errInfo: "店铺类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "店铺类型太长"
                        },
                    ],
<<<<<<< HEAD
                    'editShopTypeInfo.isShow': [{
                        limit: "required",
                        param: "",
                        errInfo: "是否展示不能为空"
                    }, ],
                    'editShopTypeInfo.isDefault': [{
                        limit: "required",
                        param: "",
                        errInfo: "是否默认不能为空"
                    }, ],
                    'editShopTypeInfo.seq': [{
=======
                    'editShopTypeInfo.isShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否展示不能为空"
                        },],
                    'editShopTypeInfo.isDefault': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否默认不能为空"
                        },],
                    'editShopTypeInfo.seq': [
                        {
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68
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
<<<<<<< HEAD
                    'editShopTypeInfo.remark': [{
                        limit: "maxLength",
                        param: "120",
                        errInfo: "描述太长"
                    }, ],
                    'editShopTypeInfo.shopTypeId': [{
                        limit: "required",
                        param: "",
                        errInfo: "店铺类型id不能为空"
                    }]

                });
            },
            editShopType: function() {
=======
                    'editShopTypeInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "120",
                            errInfo: "描述太长"
                        },
                    ],
                    'editShopTypeInfo.shopTypeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "店铺类型id不能为空"
                        }]

                });
            },
            editShopType: function () {
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68
                if (!vc.component.editShopTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/shopType/updateShopType',
<<<<<<< HEAD
                    JSON.stringify(vc.component.editShopTypeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
=======
                    JSON.stringify(vc.component.editShopTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editShopTypeModel').modal('hide');
                            vc.emit('shopTypeManage', 'listShopType', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
<<<<<<< HEAD
                    function(errInfo, error) {
=======
                    function (errInfo, error) {
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
<<<<<<< HEAD
            refreshEditShopTypeInfo: function() {
=======
            refreshEditShopTypeInfo: function () {
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68
                vc.component.editShopTypeInfo = {
                    shopTypeId: '',
                    shopTypeId: '',
                    typeName: '',
                    isShow: '',
                    isDefault: '',
                    seq: '',
                    remark: '',

                }
            }
        }
    });

<<<<<<< HEAD
})(window.vc, window.vc.component);
=======
})(window.vc, window.vc.component);
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68
