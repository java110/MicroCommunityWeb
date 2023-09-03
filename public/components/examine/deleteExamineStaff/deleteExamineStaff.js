(function(vc, vm) {

    vc.extends({
        data: {
            deleteExamineStaffInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteExamineStaff', 'openDeleteExamineStaffModal', function(_params) {

                vc.component.deleteExamineStaffInfo = _params;
                $('#deleteExamineStaffModel').modal('show');

            });
        },
        methods: {
            deleteExamineStaff: function() {
                vc.component.deleteExamineStaffInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/examine.deleteExamineStaff',
                    JSON.stringify(vc.component.deleteExamineStaffInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteExamineStaffModel').modal('hide');
                            vc.emit('examineStaffManage', 'listExamineStaff', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteExamineStaffModel: function() {
                $('#deleteExamineStaffModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);