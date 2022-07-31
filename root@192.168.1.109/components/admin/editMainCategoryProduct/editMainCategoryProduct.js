(function (vc, vm) {
    vc.extends({
        data: {
            editMainCategoryProductInfo: {
                mcProductId: '',
                startTime: '',
                endTime: '',
                seq: ''
            }
        },
        _initMethod: function () {
            vc.initDateTime('editStartTime', function (_value) {
                $that.editMainCategoryProductInfo.startTime = _value;
            });

            vc.initDateTime('editEndTime', function (_value) {
                $that.editMainCategoryProductInfo.endTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('editMainCategoryProduct', 'openEditMainCategoryProductModal', function (_params) {
                vc.component.refreshEditMainCategoryProductInfo();
                $('#editMainCategoryProductModel').modal('show');
                vc.copyObject(_params, vc.component.editMainCategoryProductInfo);
            });
        },
        methods: {
            editMainCategoryProductValidate: function () {
                return vc.validate.validate({
                    editMainCategoryProductInfo: vc.component.editMainCategoryProductInfo
                }, {

                    'editMainCategoryProductInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "开始时间格式错误"
                        },
                    ],
                    'editMainCategoryProductInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "结束时间格式错误"
                        },
                    ],
                    'editMainCategoryProductInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "排序必须是整数"
                        },
                    ],
                    'editMainCategoryProductInfo.mcProductId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "主键不能为空"
                        }
                    ]
                });
            },
            editMainCategoryProduct: function () {
                if (!vc.component.editMainCategoryProductValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/productCategory/updateMainCategoryProduct',
                    JSON.stringify(vc.component.editMainCategoryProductInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMainCategoryProductModel').modal('hide');
                            vc.emit('mainCategoryProductManage', 'listMainCategoryProduct', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            refreshEditMainCategoryProductInfo: function () {
                vc.component.editMainCategoryProductInfo = {
                    mcProductId: '',
                    mainCategoryId: '',
                    productId: '',
                    startTime: '',
                    endTime: '',
                    seq: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
