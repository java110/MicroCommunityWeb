(function (vc, vm) {

    vc.extends({
        data: {
            deleteMainCategoryProductInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteMainCategoryProduct', 'openDeleteMainCategoryProductModal', function (_params) {

                vc.component.deleteMainCategoryProductInfo = _params;
                $('#deleteMainCategoryProductModel').modal('show');

            });
        },
        methods: {
            deleteMainCategoryProduct: function () {
                vc.component.deleteMainCategoryProductInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/productCategory/deleteMainCategoryProduct',
                    JSON.stringify(vc.component.deleteMainCategoryProductInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMainCategoryProductModel').modal('hide');
                            vc.emit('mainCategoryProductManage', 'listMainCategoryProduct', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteMainCategoryProductModel: function () {
                $('#deleteMainCategoryProductModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
