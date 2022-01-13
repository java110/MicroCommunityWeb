<<<<<<< HEAD
(function(vc) {
=======
(function (vc) {
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addShopTypeInfo: {
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
            vc.on('addShopType', 'openAddShopTypeModal', function() {
=======
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addShopType', 'openAddShopTypeModal', function () {
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68
                $('#addShopTypeModel').modal('show');
            });
        },
        methods: {
            addShopTypeValidate() {
                return vc.validate.validate({
                    addShopTypeInfo: vc.component.addShopTypeInfo
                }, {

<<<<<<< HEAD
                    'addShopTypeInfo.typeName': [{
=======
                    'addShopTypeInfo.typeName': [
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
                    'addShopTypeInfo.isShow': [{
                        limit: "required",
                        param: "",
                        errInfo: "是否展示不能为空"
                    }, ],
                    'addShopTypeInfo.isDefault': [{
                        limit: "required",
                        param: "",
                        errInfo: "是否默认不能为空"
                    }, ],
                    'addShopTypeInfo.seq': [{
=======
                    'addShopTypeInfo.isShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否展示不能为空"
                        },],
                    'addShopTypeInfo.isDefault': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否默认不能为空"
                        },],
                    'addShopTypeInfo.seq': [
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
<<<<<<< HEAD
=======
                        },
                    ],
                    'addShopTypeInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "120",
                            errInfo: "描述太长"
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68
                        },
                    ],
                    'addShopTypeInfo.remark': [{
                        limit: "maxLength",
                        param: "120",
                        errInfo: "描述太长"
                    }, ],




                });
            },
<<<<<<< HEAD
            saveShopTypeInfo: function() {
=======
            saveShopTypeInfo: function () {
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68
                if (!vc.component.addShopTypeValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addShopTypeInfo);
                    $('#addShopTypeModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/shopType/saveShopType',
<<<<<<< HEAD
                    JSON.stringify(vc.component.addShopTypeInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
=======
                    JSON.stringify(vc.component.addShopTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addShopTypeModel').modal('hide');
                            vc.component.clearAddShopTypeInfo();
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
            clearAddShopTypeInfo: function() {
=======
            clearAddShopTypeInfo: function () {
>>>>>>> c6f99a4136d2a6450c08d47bb328ee07cf4bdb68
                vc.component.addShopTypeInfo = {
                    shopTypeId: '',
                    typeName: '',
                    isShow: '',
                    isDefault: '',
                    seq: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);