(function (vc, vm) {

    vc.extends({
        data: {
            editProductCategoryInfo: {
                categoryId: '',
                categoryName: '',
                seq: '',
                isShow: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editProductCategory', 'openEditProductCategoryModal', function (_params) {
                vc.component.refreshEditProductCategoryInfo();
                $('#editProductCategoryModel').modal('show');
                vc.copyObject(_params, vc.component.editProductCategoryInfo);
                vc.component.editProductCategoryInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editProductCategoryValidate: function () {
                return vc.validate.validate({
                    editProductCategoryInfo: vc.component.editProductCategoryInfo
                }, {
                    'editProductCategoryInfo.categoryName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "分类名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "分类名称不能超过100位"
                        },
                    ],
                    'editProductCategoryInfo.seq': [
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
                    'editProductCategoryInfo.isShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否显示不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "2",
                            errInfo: "是否显示格式错误"
                        },
                    ],
                    'editProductCategoryInfo.categoryId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "分类ID不能为空"
                        }]

                });
            },
            editProductCategory: function () {
                if (!vc.component.editProductCategoryValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'productCategory.updateProductCategory',
                    JSON.stringify(vc.component.editProductCategoryInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editProductCategoryModel').modal('hide');
                            vc.emit('productCategoryManage', 'listProductCategory', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditProductCategoryInfo: function () {
                vc.component.editProductCategoryInfo = {
                    categoryId: '',
                    categoryName: '',
                    seq: '',
                    isShow: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
