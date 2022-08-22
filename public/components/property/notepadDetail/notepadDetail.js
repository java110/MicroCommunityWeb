(function(vc, vm) {
    vc.extends({
        data: {
            notepadDetailInfo: {
                noteId: '',
                details: []
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('notepadDetail', 'openNotepadDetailModal', function(_params) {
                vc.component.refreshnotepadDetailInfo();
                $('#notepadDetailModel').modal('show');
                vc.copyObject(_params, vc.component.notepadDetailInfo);
                $that._loadNotepadDetails();
            });


        },
        methods: {
            refreshnotepadDetailInfo: function() {
                vc.component.notepadDetailInfo = {
                    noteId: '',
                    details: []
                }
            },

            _loadNotepadDetails: function() {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        noteId: $that.notepadDetailInfo.noteId,
                        page: 1,
                        row: 50
                    }
                };
                //发送get请求
                vc.http.apiGet('/notepad.listNotepadDetail',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code != '0') {
                            return;
                        }
                        $that.notepadDetailInfo.details = _json.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _doDeleteNotepadDetail: function(_detail) {
                vc.component.deleteNotepadInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/notepad.deleteNotepadDetail',
                    JSON.stringify(_detail), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $that._loadNotepadDetails();
                            vc.emit('simplifyNotepadManage', 'listNotepad', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
        }
    });
})(window.vc, window.vc.component);