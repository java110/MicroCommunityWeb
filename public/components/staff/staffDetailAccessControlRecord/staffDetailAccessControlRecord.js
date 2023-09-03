/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailAccessControlRecordInfo: {
                machineRecords: [],
                staffId: '',
                link: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('staffDetailAccessControlRecord', 'switch', function (_data) {
                $that.staffDetailAccessControlRecordInfo.staffId = _data.staffId;
                $that.staffDetailAccessControlRecordInfo.link = _data.tel;
                $that._loadStaffDetailAccessControlRecordData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('staffDetailAccessControlRecord', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadStaffDetailAccessControlRecordData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadStaffDetailAccessControlRecordData: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        tel: $that.staffDetailAccessControlRecordInfo.link,
                    }
                };

                //发送get请求
                vc.http.apiGet('/machineRecord.listMachineRecords',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.staffDetailAccessControlRecordInfo.machineRecords = _roomInfo.machineRecords;
                        vc.emit('staffDetailAccessControlRecord', 'paginationPlus', 'init', {
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
            _qureyStaffDetailAccessControlRecord: function () {
                $that._loadStaffDetailAccessControlRecordData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _viewOwnerFace: function(_url) {
                vc.emit('viewImage', 'showImage', {
                    url: _url
                });
            },
        }
    });
})(window.vc);