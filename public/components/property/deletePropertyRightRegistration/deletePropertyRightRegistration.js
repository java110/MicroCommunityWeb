(function (vc, vm) {
    vc.extends({
        data: {
            deletePropertyRightRegistrationInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deletePropertyRightRegistration', 'openDeletePropertyRightRegistrationModal', function (_params) {
                vc.component.deletePropertyRightRegistrationInfo = _params;
                $('#deletePropertyRightRegistrationModel').modal('show');
            });
        },
        methods: {
            deletePropertyRightRegistration: function () {
                vc.component.deletePropertyRightRegistrationInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'propertyRightRegistration.deletePropertyRightRegistration',
                    JSON.stringify(vc.component.deletePropertyRightRegistrationInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePropertyRightRegistrationModel').modal('hide');
                            vc.emit('propertyRightRegistrationManage', 'listPropertyRightRegistration', {});
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
            closeDeletePropertyRightRegistrationModel: function () {
                $('#deletePropertyRightRegistrationModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);
