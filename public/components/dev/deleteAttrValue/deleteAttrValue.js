(function (vc, vm) {
    vc.extends({
        data: {
            deleteAttrValueInfo: {
                communityId: ""
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteAttrValue', 'openDeleteAttrValueModal', function (_params) {
                vc.component.deleteAttrValueInfo = _params;
                vc.component.deleteAttrValueInfo.communityId = vc.getCurrentCommunity().communityId
                $('#deleteAttrValueModel').modal('show');
            });
        },
        methods: {
            deleteAttrValue: function () {
                vc.http.apiPost(
                    '/attrValue/deleteAttrValue',
                    JSON.stringify(vc.component.deleteAttrValueInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteAttrValueModel').modal('hide');
                            vc.emit('attrValueManage', 'listAttrValue', {});
                            vc.toast("删除成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            closeDeleteAttrValueModel: function () {
                $('#deleteAttrValueModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);