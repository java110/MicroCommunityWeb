(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyShopsHireLogInfo: {
                owners: [],
                ownerId: '',
                roomId: ''
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            //切换 至费用页面
            vc.on('simplifyShopsHireLog', 'switch', function(_param) {
                if (_param.roomId == '') {
                    return
                }
                $that.clearSimplifyShopsHireLogInfo();
                vc.copyObject(_param, $that.simplifyShopsHireLogInfo)
                $that._listSimplifyShopsHireLog(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyShopsHireLog', 'listMachineTranslate', function() {
                $that._listSimplifyShopsHireLog(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyShopsHireLog', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    $that._listSimplifyShopsHireLog(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listSimplifyShopsHireLog: function(_page, _row) {

                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        roomId: $that.simplifyShopsHireLogInfo.roomId
                    }
                }

                //发送get请求
                vc.http.apiGet('/ownerApi/queryShopsHireLog',
                    param,
                    function(json, res) {
                        var _ownerManageInfo = JSON.parse(json);
                        vc.component.simplifyShopsHireLogInfo.total = _ownerManageInfo.total;
                        vc.component.simplifyShopsHireLogInfo.records = _ownerManageInfo.records;
                        vc.component.simplifyShopsHireLogInfo.owners = _ownerManageInfo.data;
                        vc.emit('simplifyShopsHireLog', 'paginationPlus', 'init', {
                            total: vc.component.simplifyShopsHireLogInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            _openShopsOwnerFee: function(_owner) {
                //vc.emit('editMachineTranslate', 'openEditMachineTranslateModal', _owner);
                vc.jumpToPage('/#/pages/property/listRoomFee?roomId=' +
                    $that.simplifyShopsHireLogInfo.roomId +
                    "&ownerId=" + $that.simplifyShopsHireLogInfo.ownerId +
                    "&hireOwnerFee=1")
            },
            clearSimplifyShopsHireLogInfo: function() {
                $that.simplifyShopsHireLogInfo = {
                    owners: [],
                    ownerId: '',
                    roomId: ''
                }
            }

        }

    });
})(window.vc);