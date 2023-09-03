/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            deleteOwnerDataLogInfo: {
                fees: [],
                feeId: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('deleteOwnerDataLog', 'switch', function(_data) {
                $that.deleteOwnerDataLogInfo.feeId = _data.feeId;
                $that._loadDeleteOwnerDataLogData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('deleteOwnerDataLog', 'notify',
                function(_data) {
                    $that._loadDeleteOwnerDataLogData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('deleteOwnerDataLog', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._loadDeleteOwnerDataLogData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadDeleteOwnerDataLogData: function(_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        deleteFlag: 'DEL',
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/owner.queryHisOwner',
                    param,
                    function(json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailHisInfo.owners = _roomInfo.data;
                        $that.dealOwnerAttr(_roomInfo.data);
                        vc.emit('ownerDetailHis', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyDeleteOwnerDataLog: function() {
                $that._loadDeleteOwnerDataLogData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            dealOwnerAttr: function(owners) {
                if (!owners) {
                    return;
                }
                owners.forEach(item => {
                    $that._getColumnsValue(item);
                });
            },
            _getColumnsValue: function(_owner) {
                _owner.listValues = [];
                if (!_owner.hasOwnProperty('ownerAttrDtos') || _owner.ownerAttrDtos.length < 1) {
                    $that.ownerDetailHisInfo.listColumns.forEach(_value => {
                        _owner.listValues.push('');
                    })
                    return;
                }
                let _ownerAttrDtos = _owner.ownerAttrDtos;
                $that.ownerDetailHisInfo.listColumns.forEach(_value => {
                    let _tmpValue = '';
                    _ownerAttrDtos.forEach(_attrItem => {
                        if (_value == _attrItem.specName) {
                            _tmpValue = _attrItem.valueName;
                        }
                    })
                    _owner.listValues.push(_tmpValue);
                })
            },
            _getColumns: function(_call) {
                $that.ownerDetailHisInfo.listColumns = [];
                vc.getAttrSpec('building_owner_attr', function(data) {
                    $that.ownerDetailHisInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.ownerDetailHisInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                });
            },
        }
    });
})(window.vc);