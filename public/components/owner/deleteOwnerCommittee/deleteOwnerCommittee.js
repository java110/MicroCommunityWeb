(function (vc, vm) {
    vc.extends({
        data: {
            deleteOwnerCommitteeInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteOwnerCommittee', 'openDeleteOwnerCommitteeModal', function (_params) {
                vc.component.deleteOwnerCommitteeInfo = _params;
                $('#deleteOwnerCommitteeModel').modal('show');
            });
        },
        methods: {
            deleteOwnerCommittee: function () {
                vc.component.deleteOwnerCommitteeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/ownerCommittee.deleteOwnerCommittee',
                    JSON.stringify(vc.component.deleteOwnerCommitteeInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteOwnerCommitteeModel').modal('hide');
                            vc.emit('ownerCommitteeManage', 'listOwnerCommittee', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            closeDeleteOwnerCommitteeModel: function () {
                $('#deleteOwnerCommitteeModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);