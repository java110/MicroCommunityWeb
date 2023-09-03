/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailAccessControlRecordInfo: {
                machineRecords: [],
                ownerId: '',
                link: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailAccessControlRecord', 'switch', function (_data) {
                $that.ownerDetailAccessControlRecordInfo.ownerId = _data.ownerId;
                $that.ownerDetailAccessControlRecordInfo.link = _data.link;
                $that._loadOwnerDetailAccessControlRecordData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailAccessControlRecord', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadOwnerDetailAccessControlRecordData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadOwnerDetailAccessControlRecordData: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        tel: $that.ownerDetailAccessControlRecordInfo.link,
                    }
                };

                //发送get请求
                vc.http.apiGet('/machineRecord.listMachineRecords',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailAccessControlRecordInfo.machineRecords = _roomInfo.machineRecords;
                        vc.emit('ownerDetailAccessControlRecord', 'paginationPlus', 'init', {
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
            _qureyOwnerDetailAccessControlRecord: function () {
                $that._loadOwnerDetailAccessControlRecordData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _viewOwnerFace: function(_url) {
                vc.emit('viewImage', 'showImage', {
                    url: _url
                });
            },
        }
    });
})(window.vc);