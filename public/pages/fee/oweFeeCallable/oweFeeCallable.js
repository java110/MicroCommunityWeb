/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            oweFeeCallableInfo: {
                oweFeeCallables: [],
                total: 0,
                records: 1,
                moreCondition: false,
                ofcId: '',
                roomId: '',
                roomName: '',
                conditions: {
                    ownerName: '',
                    payerObjName: '',
                    payerObjId: '',
                    feeName: '',
                    callableWay: '',
                    staffName: '',
                    state: '',
                }
            }
        },
        _initMethod: function() {
            vc.emit('roomTreeDiv', 'initRoomTreeDiv', {
                callName: 'oweFeeCallable'
            });
            $that._listOweFeeCallables(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('oweFeeCallable', 'selectRoom', function(_param) {
                $that.oweFeeCallableInfo.conditions.payerObjId = _param.roomId;
                $that.oweFeeCallableInfo.roomId = _param.roomId;
                $that.oweFeeCallableInfo.roomName = _param.roomName;
                $that._listOweFeeCallables(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('oweFeeCallable', 'listOweFeeCallable', function(_param) {
                $that._listOweFeeCallables(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listOweFeeCallables(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOweFeeCallables: function(_page, _rows) {

                $that.oweFeeCallableInfo.conditions.page = _page;
                $that.oweFeeCallableInfo.conditions.row = _rows;
                $that.oweFeeCallableInfo.conditions.communityId = vc.getCurrentCommunity().communityId;

                let param = {
                    params: $that.oweFeeCallableInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/oweFeeCallable.listOweFeeCallable',
                    param,
                    function(json, res) {
                        var _oweFeeCallableInfo = JSON.parse(json);
                        $that.oweFeeCallableInfo.total = _oweFeeCallableInfo.total;
                        $that.oweFeeCallableInfo.records = _oweFeeCallableInfo.records;
                        $that.oweFeeCallableInfo.oweFeeCallables = _oweFeeCallableInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.oweFeeCallableInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddOweFeeCallableModal: function() {
                vc.jumpToPage('/#/pages/fee/addOweFeeCallable')
            },

            _openWritePrintOweFeeCallableModal: function() {
                let _roomId = $that.oweFeeCallableInfo.roomId;
                let _roomName = $that.oweFeeCallableInfo.roomName;

                if (!_roomId) {
                    vc.toast('未选择房屋');
                    return;
                }

                vc.emit('writeOweFeeCallable', 'openWriteOweFeeCallableModal', {
                    roomId: _roomId,
                    roomName: _roomName
                })


            },
            _openDeleteOweFeeCallableModel: function(_oweFeeCallable) {
                vc.emit('deleteOweFeeCallable', 'openDeleteOweFeeCallableModal', _oweFeeCallable);
            },
            _queryOweFeeCallableMethod: function() {
                $that._listOweFeeCallables(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if ($that.oweFeeCallableInfo.moreCondition) {
                    $that.oweFeeCallableInfo.moreCondition = false;
                } else {
                    $that.oweFeeCallableInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);