(function(vc, vm) {

    vc.extends({
        data: {
            deleteInspectionItemInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteInspectionItem', 'openDeleteInspectionItemModal', function(_params) {

                vc.component.deleteInspectionItemInfo = _params;
                $('#deleteInspectionItemModel').modal('show');

            });
        },
        methods: {
            deleteInspectionItem: function() {
                vc.component.deleteInspectionItemInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/inspectionItem.deleteInspectionItem',
                    JSON.stringify(vc.component.deleteInspectionItemInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteInspectionItemModel').modal('hide');
                            vc.emit('inspectionItemManage', 'listInspectionItem', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteInspectionItemModel: function() {
                $('#deleteInspectionItemModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);