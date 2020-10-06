(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addProductCategoryInfo: {
                categoryId: '',
                categoryName: '',
                seq: '',
                isShow: '',
                categoryLevel:'1'

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addProductCategory', 'openAddProductCategoryModal', function () {
                $('#addProductCategoryModel').modal('show');
            });
        },
        methods: {
            addProductCategoryValidate() {
                return vc.validate.validate({
                    addProductCategoryInfo: vc.component.addProductCategoryInfo
                }, {
                    'addProductCategoryInfo.categoryName': [
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
                    'addProductCategoryInfo.seq': [
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
                    'addProductCategoryInfo.isShow': [
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




                });
            },
            saveProductCategoryInfo: function () {
                if (!vc.component.addProductCategoryValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addProductCategoryInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addProductCategoryInfo);
                    $('#addProductCategoryModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'productCategory.saveProductCategory',
                    JSON.stringify(vc.component.addProductCategoryInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addProductCategoryModel').modal('hide');
                            vc.component.clearAddProductCategoryInfo();
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
            clearAddProductCategoryInfo: function () {
                vc.component.addProductCategoryInfo = {
                    categoryName: '',
                    seq: '',
                    isShow: '',

                };
            }
        }
    });

})(window.vc);
