/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyNotepadManageInfo: {
                notepads: [],
                total: 0,
                records: 1,
                moreCondition: false,
                noteId: '',
                roomId: '',
                ownerId: '',
                conditions: {
                    noteType: '',
                    title: '',
                    objName: '',
                    createUserName: '',
                    state: '',
                    objId: ''

                }
            }
        },
        _initMethod: function() {
            let _roomId = vc.getParam('roomId');
            let _ownerId = vc.getParam('ownerId');
            $that.simplifyNotepadManageInfo.roomId = _roomId;
            $that.simplifyNotepadManageInfo.ownerId = _ownerId;
            $that.simplifyNotepadManageInfo.conditions.objId = _ownerId;
            vc.component._listNotepads(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('simplifyNotepadManage', 'listNotepad', function(_param) {
                vc.component._listNotepads(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listNotepads(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listNotepads: function(_page, _rows) {

                vc.component.simplifyNotepadManageInfo.conditions.page = _page;
                vc.component.simplifyNotepadManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.simplifyNotepadManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/notepad.listNotepad',
                    param,
                    function(json, res) {
                        var _simplifyNotepadManageInfo = JSON.parse(json);
                        vc.component.simplifyNotepadManageInfo.total = _simplifyNotepadManageInfo.total;
                        vc.component.simplifyNotepadManageInfo.records = _simplifyNotepadManageInfo.records;
                        vc.component.simplifyNotepadManageInfo.notepads = _simplifyNotepadManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.simplifyNotepadManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddNotepadModal: function() {
                vc.emit('addNotepad', 'openAddNotepadModal', {
                    roomId: $that.simplifyNotepadManageInfo.roomId,
                    ownerId: $that.simplifyNotepadManageInfo.ownerId
                });
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
            _moreCondition: function() {
                if (vc.component.simplifyNotepadManageInfo.moreCondition) {
                    vc.component.simplifyNotepadManageInfo.moreCondition = false;
                } else {
                    vc.component.simplifyNotepadManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);