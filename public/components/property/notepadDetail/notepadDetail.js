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
            }
        }
    });
})(window.vc, window.vc.component);