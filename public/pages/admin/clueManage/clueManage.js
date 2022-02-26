/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            clueManageInfo: {
                clues: [],
                total: 0,
                records: 1,
                moreCondition: false,
                projectName: '',
                conditions: {
                    clueId: '',
                    projectName: '',
                    investmentName: '',
                }
            }
        },
        _initMethod: function() {
            vc.component._listClues(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('clueManage', 'listClue', function(_param) {
                vc.component._listClues(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listClues(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listClues: function(_page, _rows) {

                vc.component.clueManageInfo.conditions.page = _page;
                vc.component.clueManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.clueManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/clue/queryClue',
                    param,
                    function(json, res) {
                        var _clueManageInfo = JSON.parse(json);
                        vc.component.clueManageInfo.total = _clueManageInfo.total;
                        vc.component.clueManageInfo.records = _clueManageInfo.records;
                        vc.component.clueManageInfo.clues = _clueManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.clueManageInfo.records,
                            dataCount: vc.component.clueManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddClueModal: function() {
                vc.emit('addClue', 'openAddClueModal', {});
            },
            _openEditClueModel: function(_clue) {
                vc.emit('editClue', 'openEditClueModal', _clue);
            },
            _openDeleteClueModel: function(_clue) {
                vc.emit('deleteClue', 'openDeleteClueModal', _clue);
            },
            _openViewClueAttrModel: function(_clue) {
                vc.jumpToPage("/#/pages/admin/viewClueInfo?clueId=" + _clue.clueId);
            },
            _queryClueMethod: function() {
                vc.component._listClues(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _openEditClueAttrModel: function(_clue) {
                vc.jumpToPage('/#/pages/admin/clueAttrManage?clueId=' + _clue.clueId);
            },
            _moreCondition: function() {
                if (vc.component.clueManageInfo.moreCondition) {
                    vc.component.clueManageInfo.moreCondition = false;
                } else {
                    vc.component.clueManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);