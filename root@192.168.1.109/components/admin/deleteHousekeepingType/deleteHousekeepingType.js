(function (vc, vm) {

    vc.extends({
        data: {
            deleteHousekeepingTypeInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteHousekeepingType', 'openDeleteHousekeepingTypeModal', function (_params) {

                vc.component.deleteHousekeepingTypeInfo = _params;
                $('#deleteHousekeepingTypeModel').modal('show');

            });
        },
        methods: {
            deleteHousekeepingType: function () {
                vc.http.apiPost(
                    '/housekeepingType/deleteHousekeepingType',
                    JSON.stringify(vc.component.deleteHousekeepingTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteHousekeepingTypeModel').modal('hide');
                            vc.emit('housekeepingTypeManage', 'listHousekeepingType', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteHousekeepingTypeModel: function () {
                $('#deleteHousekeepingTypeModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
