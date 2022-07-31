(function(vc, vm) {

    vc.extends({
        data: {
            deletePropertyCompanyInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deletePropertyCompany', 'openDeletePropertyCompanyModal', function(_params) {

                vc.component.deletePropertyCompanyInfo = _params;
                $('#deletePropertyCompanyModel').modal('show');

            });
        },
        methods: {
            deletePropertyCompany: function() {
                vc.http.apiPost(
                    '/property.deleteProperty',
                    JSON.stringify(vc.component.deletePropertyCompanyInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePropertyCompanyModel').modal('hide');
                            vc.emit('propertyCompanyManage', 'listPropertyCompany', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeletePropertyCompanyModel: function() {
                $('#deletePropertyCompanyModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);