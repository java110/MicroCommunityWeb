(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyOwnerAccessContolInfo: {
                machineTranslates: [],
                ownerId: '',
                roomId: ''
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            //切换 至费用页面
            vc.on('simplifyOwnerAccessContol', 'switch', function(_param) {
                if (_param.ownerId == '') {
                    return
                }
                $that.clearSimplifyOwnerAccessContolInfo();
                vc.copyObject(_param, $that.simplifyOwnerAccessContolInfo)
                $that._listSimplifyOwnerAccessContol(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyOwnerAccessContol', 'listMachineTranslate', function() {
                $that._listSimplifyOwnerAccessContol(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyOwnerAccessContol', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    $that._listSimplifyOwnerAccessContol(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listSimplifyOwnerAccessContol: function(_page, _row) {

                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        objId: $that.simplifyOwnerAccessContolInfo.ownerId,
                        typeCd: '8899'
                    }
                }

                //发送get请求
                vc.http.apiGet('/machineTranslate.listMachineTranslates',
                    param,
                    function(json, res) {
                        var _machineTranslateManageInfo = JSON.parse(json);
                        vc.component.simplifyOwnerAccessContolInfo.total = _machineTranslateManageInfo.total;
                        vc.component.simplifyOwnerAccessContolInfo.records = _machineTranslateManageInfo.records;
                        vc.component.simplifyOwnerAccessContolInfo.machineTranslates = _machineTranslateManageInfo.machineTranslates;
                        vc.emit('simplifyOwnerAccessContol', 'paginationPlus', 'init', {
                            total: vc.component.simplifyOwnerAccessContolInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            _openEditMachineTranslateModel: function(_machineTranslate) {
                vc.emit('editMachineTranslate', 'openEditMachineTranslateModal', _machineTranslate);
            },
            clearSimplifyOwnerAccessContolInfo: function() {
                $that.simplifyOwnerAccessContolInfo = {
                    machineTranslates: [],
                    ownerId: '',
                    roomId: ''
                }
            }

        }

    });
})(window.vc);