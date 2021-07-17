(function (vc, vm) {

    vc.extends({
        data: {
            deleteHousekeepingServInfo: {

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('deleteHousekeepingServ', 'openDeleteHousekeepingServModal', function (_params) {

                vc.component.deleteHousekeepingServInfo = _params;
                $('#deleteHousekeepingServModel').modal('show');

            });
        },
        methods: {
            deleteHousekeepingServ: function () {
                vc.component.deleteHousekeepingServInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/housekeepingServ/deleteHousekeepingServ',
                    JSON.stringify(vc.component.deleteHousekeepingServInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteHousekeepingServModel').modal('hide');
                            vc.emit('housekeepingServManage', 'listHousekeepingServ', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteHousekeepingServModel: function () {
                $('#deleteHousekeepingServModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);
