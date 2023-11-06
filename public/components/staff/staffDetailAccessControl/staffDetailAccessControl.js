/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailAccessControlInfo: {
                machineTranslates: [],
                staffId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('staffDetailAccessControl', 'switch', function (_data) {
                $that.staffDetailAccessControlInfo.staffId = _data.staffId;
                $that._loadStaffDetailAccessControlData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('staffDetailAccessControl', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadStaffDetailAccessControlData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadStaffDetailAccessControlData: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        objId: $that.staffDetailAccessControlInfo.staffId,
                        typeCd: '8899'
                    }
                };
                //发送get请求
                vc.http.apiGet('/machineTranslate.listMachineTranslates',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.staffDetailAccessControlInfo.machineTranslates = _roomInfo.machineTranslates;
                        vc.emit('staffDetailAccessControl', 'paginationPlus', 'init', {
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
            _qureyStaffDetailAccessControl: function () {
                $that._loadStaffDetailAccessControlData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openEditMachineTranslateModel: function (_machineTranslate) {
                vc.emit('editMachineTranslate', 'openEditMachineTranslateModal', _machineTranslate);
            },
        }
    });
})(window.vc);