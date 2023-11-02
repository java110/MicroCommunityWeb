/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailHisInfo: {
                owners: [],
                ownerId: '',
                ownerName: '',
                carNum: '',
                listColumns: [],
                logStartTime: '',
                logEndTime: '',
                ownerNameLike: '',
                staffNameLike: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailHis', 'switch', function (_data) {
                $that.ownerDetailHisInfo.ownerId = _data.ownerId;
                $that.ownerDetailHisInfo.ownerName = _data.ownerName;
                $that.ownerDetailHisInfo.ownerNameLike = _data.ownerNameLike;
                $that.ownerDetailHisInfo.logStartTime = _data.logStartTime;
                $that.ownerDetailHisInfo.logEndTime = _data.logEndTime;
                $that.ownerDetailHisInfo.staffNameLike = _data.staffNameLike;
                $that._getColumns(function () {
                    $that._loadOwnerDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            });
            vc.on('ownerDetailHis', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadOwnerDetailHisData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('ownerDetailHis', 'notify', function (_data) {
                $that._loadOwnerDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadOwnerDetailHisData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        memberId: $that.ownerDetailHisInfo.ownerId,
                        ownerNameLike: $that.ownerDetailHisInfo.ownerNameLike,
                        logStartTime: $that.ownerDetailHisInfo.logStartTime,
                        logEndTime: $that.ownerDetailHisInfo.logEndTime,
                        staffNameLike: $that.ownerDetailHisInfo.staffNameLike,
                        page: _page,
                        row: _row
                    }
                };
                //发送get请求
                vc.http.apiGet('/owner.queryHisOwner',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        $that.ownerDetailHisInfo.owners = _roomInfo.data;
                        $that.dealOwnerAttr(_roomInfo.data);
                        vc.emit('ownerDetailHis', 'paginationPlus', 'init', {
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
            _qureyOwnerDetailHis: function () {
                $that._loadOwnerDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            dealOwnerAttr: function (owners) {
                if (!owners) {
                    return;
                }
                owners.forEach(item => {
                    $that._getColumnsValue(item);
                });
            },
            _getColumnsValue: function (_owner) {
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
            _getColumns: function (_call) {
                $that.ownerDetailHisInfo.listColumns = [];
                vc.getAttrSpec('building_owner_attr', function (data) {
                    $that.ownerDetailHisInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.ownerDetailHisInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                });
            },
            _getHisOwnerOperate: function (_owner) {
                let _ownerCount = 0;
                $that.ownerDetailHisInfo.owners.forEach(item => {
                    if (_owner.bId == item.bId) {
                        _ownerCount += 1;
                    }
                });
                if (_ownerCount <= 1) {
                    if (_owner.operate == 'ADD') {
                        return '添加';
                    }
                    if (_owner.operate == 'DEL') {
                        return '删除';
                    }
                    return "-"
                }
                if (_owner.operate == 'ADD') {
                    return '修改(新)';
                }
                if (_owner.operate == 'DEL') {
                    return '修改(旧)';
                }
                return "-"
            }
        }
    });
})(window.vc);