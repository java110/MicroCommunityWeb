/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            notepadManageInfo: {
                notepads: [],
                total: 0,
                records: 1,
                moreCondition: false,
                noteId: '',
                noteTypes: [],
                conditions: {
                    noteType: '',
                    roomName: '',
                    objName: '',
                    createUserName: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.getDict('notepad', 'note_type', function(_data) {
                $that.notepadManageInfo.noteTypes = _data;
            })
            vc.component._listNotepads(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('notepadManage', 'listNotepad', function(_param) {
                vc.component._listNotepads(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listNotepads(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listNotepads: function(_page, _rows) {

                vc.component.notepadManageInfo.conditions.page = _page;
                vc.component.notepadManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.notepadManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/notepad.listNotepad',
                    param,
                    function(json, res) {
                        var _notepadManageInfo = JSON.parse(json);
                        vc.component.notepadManageInfo.total = _notepadManageInfo.total;
                        vc.component.notepadManageInfo.records = _notepadManageInfo.records;
                        vc.component.notepadManageInfo.notepads = _notepadManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.notepadManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddNotepadModal: function() {
                vc.emit('addNotepad', 'openAddNotepadModal', {});
            },
            _openAddNotepadDetailModal: function(_notepad) {
                vc.emit('addNotepadDetail', 'openAddNotepadModal', _notepad);
            },
            _openListNotepadDetailModal: function(_notepad) {
                vc.emit('notepadDetail', 'openNotepadDetailModal', _notepad);
            },
            _openEditNotepadModel: function(_notepad) {
                vc.emit('editNotepad', 'openEditNotepadModal', _notepad);
            },
            _openDeleteNotepadModel: function(_notepad) {
                vc.emit('deleteNotepad', 'openDeleteNotepadModal', _notepad);
            },
            _queryNotepadMethod: function() {
                vc.component._listNotepads(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _openAddRepairModal: function(_notepad) {
                vc.emit('notepadOwnerRepair', 'openAddOwnerRepairModal', _notepad);
            },
            _toRepairDetail: function(_notepad) {
                vc.jumpToPage('/#/pages/property/ownerRepairDetail?repairId=' + _notepad.thridId)
            },
            _moreCondition: function() {
                if (vc.component.notepadManageInfo.moreCondition) {
                    vc.component.notepadManageInfo.moreCondition = false;
                } else {
                    vc.component.notepadManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);