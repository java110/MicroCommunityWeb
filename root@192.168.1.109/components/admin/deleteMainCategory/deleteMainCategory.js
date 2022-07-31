(function(vc, vm) {

    vc.extends({
        data: {
            deleteMainCategoryInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteMainCategory', 'openDeleteMainCategoryModal', function(_params) {
                vc.component.deleteMainCategoryInfo = _params;
                $('#deleteMainCategoryModel').modal('show');
            });
        },
        methods: {
            deleteMainCategory: function() {
                vc.http.apiPost(
                    '/productCategory/deleteMainCategory',
                    JSON.stringify(vc.component.deleteMainCategoryInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteMainCategoryModel').modal('hide');
                            vc.emit('mainCategoryManage', 'listMainCategory', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteMainCategoryModel: function() {
                $('#deleteMainCategoryModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);