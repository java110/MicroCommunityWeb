(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyCallableInfo: {
                callables: [],
                ownerId: '',
                roomId: '',
                roomName: '',
                total: 0,
                records: 0
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyCallable', 'switch', function (_param) {
                if (!_param.roomId) {
                    return;
                }
                $that.clearSimplifyCallableInfo();
                vc.copyObject(_param, $that.simplifyCallableInfo)
                $that._listSimplifyCallable(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyCallable', 'listOwnerData', function (_param) {
                $that._listSimplifyCallable(DEFAULT_PAGE, DEFAULT_ROWS);
            });

            vc.on('simplifyCallable', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._listSimplifyCallable(_currentPage, DEFAULT_ROWS);
                }
            );
        },
        methods: {
            _listSimplifyCallable: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        payerObjId: $that.simplifyCallableInfo.roomId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oweFeeCallable.listOweFeeCallable',
                    param,
                    function (json) {
                        let _data = JSON.parse(json);
                        $that.simplifyCallableInfo.total = _data.total;
                        $that.simplifyCallableInfo.records = _data.records;
                        $that.simplifyCallableInfo.callables = _data.data;
                        vc.emit('simplifyOwnerRepair', 'paginationPlus', 'init', {
                            total: $that.simplifyCallableInfo.records,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            clearSimplifyCallableInfo: function () {
                $that.simplifyCallableInfo = {
                    callables: [],
                    ownerId: '',
                    roomId: '',
                    roomName: '',
                    total: 0,
                    records: 0
                }
            },
            _printOwnOrder: function () {
                //打印催交单
                window.open('/print.html#/pages/property/printOweFee?payObjId=' + $that.simplifyCallableInfo.roomId + "&payObjType=3333&payObjName=" + $that.simplifyCallableInfo.roomName)
            },
            _openWritePrintOweFeeCallableModal: function () {
                let _roomId = $that.simplifyCallableInfo.roomId;
                let _roomName = $that.simplifyCallableInfo.roomName;

                if (!_roomId) {
                    vc.toast('未选择房屋');
                    return;
                }

                vc.emit('writeOweFeeCallable', 'openWriteOweFeeCallableModal', {
                    roomId: _roomId,
                    roomName: _roomName
                })
            },

            _openAddOweFeeCallableModal: function() {
                vc.jumpToPage('/#/pages/fee/roomOweFeeCallable?roomId='+$that.simplifyCallableInfo.roomId)
            },
            _openDeleteOweFeeCallableModel: function (_oweFeeCallable) {
                vc.emit('deleteOweFeeCallable', 'openDeleteOweFeeCallableModal', _oweFeeCallable);
            },

        }
    });
})(window.vc);