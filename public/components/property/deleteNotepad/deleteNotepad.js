(function(vc, vm) {

    vc.extends({
        data: {
            deleteNotepadInfo: {

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('deleteNotepad', 'openDeleteNotepadModal', function(_params) {

                vc.component.deleteNotepadInfo = _params;
                $('#deleteNotepadModel').modal('show');

            });
        },
        methods: {
            deleteNotepad: function() {
                vc.component.deleteNotepadInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'notepad.deleteNotepad',
                    JSON.stringify(vc.component.deleteNotepadInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteNotepadModel').modal('hide');
                            vc.emit('notepadManage', 'listNotepad', {});
                            vc.emit('simplifyNotepadManage', 'listNotepad', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeDeleteNotepadModel: function() {
                $('#deleteNotepadModel').modal('hide');
            }
        }
    });

})(window.vc, window.vc.component);