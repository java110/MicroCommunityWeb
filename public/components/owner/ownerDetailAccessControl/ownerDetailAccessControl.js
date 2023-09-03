/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailAccessControlInfo: {
                machineTranslates: [],
                ownerId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailAccessControl', 'switch', function (_data) {
                $that.ownerDetailAccessControlInfo.ownerId = _data.ownerId;
                $that._loadOwnerDetailAccessControlData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailAccessControl', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadOwnerDetailAccessControlData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadOwnerDetailAccessControlData: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        objId: $that.ownerDetailAccessControlInfo.ownerId,
                        typeCd: '8899'
                    }
                };

                //发送get请求
                vc.http.apiGet('/machineTranslate.listMachineTranslates',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailAccessControlInfo.machineTranslates = _roomInfo.machineTranslates;
                        vc.emit('ownerDetailAccessControl', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyOwnerDetailAccessControl: function () {
                $that._loadOwnerDetailAccessControlData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openEditMachineTranslateModel: function (_machineTranslate) {
                vc.emit('editMachineTranslate', 'openEditMachineTranslateModal', _machineTranslate);
            },
        }
    });
})(window.vc);