(function (vc, vm) {
    vc.extends({
        data: {
            deleteExamineProjectInfo: {}
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('deleteExamineProject', 'openDeleteExamineProjectModal', function (_params) {
                vc.component.deleteExamineProjectInfo = _params;
                $('#deleteExamineProjectModel').modal('show');
            });
        },
        methods: {
            deleteExamineProject: function () {
                vc.component.deleteExamineProjectInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/examine.deleteExamineProject',
                    JSON.stringify(vc.component.deleteExamineProjectInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteExamineProjectModel').modal('hide');
                            vc.emit('examineProjectManage', 'listExamineProject', {});
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
            closeDeleteExamineProjectModel: function () {
                $('#deleteExamineProjectModel').modal('hide');
            }
        }
    });
})(window.vc, window.vc.component);