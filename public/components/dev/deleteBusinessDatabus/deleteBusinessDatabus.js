(function(vc, vm) {

    vc.extends({
        data: {
            deleteBusinessDatabusInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteBusinessDatabus', 'openDeleteBusinessDatabusModal', function(_params) {

                vc.component.deleteBusinessDatabusInfo = _params;
                $('#deleteBusinessDatabusModel').modal('show');

            });
        },
        methods: {
            deleteBusinessDatabus: function() {
                vc.http.apiPost(
                    '/businessDatabus/deleteBusinessDatabus',
                    JSON.stringify(vc.component.deleteBusinessDatabusInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteBusinessDatabusModel').modal('hide');
                            vc.emit('businessDatabusManage', 'listBusinessDatabus', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteBusinessDatabusModel: function() {
                $('#deleteBusinessDatabusModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);