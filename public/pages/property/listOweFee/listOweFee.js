(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            listOweFeeInfo: {
                fees: [],
                roomName: '',
                roomId: '',
                total: 0,
                records: 1,
                moreCondition: false,
                roomNum: '',
                payObjTypes: [],
                roomUnits: [],
                conditions: {
                    configIds: '',
                    payObjType: '',
                    num: '',
                    billType: '00123',
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    unitId: '',
                    roomSubType: '',
                    ownerName: ''
                },
                feeConfigs: [],
                feeConfigNames: [],
                floorId: '',
                unitId: '',
                roomSubTypes: []
            }
        },
        watch: {
            'listOweFeeInfo.feeConfigs': function () { //'goodList'是我要渲染的对象，也就是我要等到它渲染完才能调用函数
                this.$nextTick(function () {
                    $('#configIds').selectpicker({
                        title: '请选择费用项',
                        styleBase: 'form-control',
                        width: 'auto'
                    });
                })
            }
        },
        _initMethod: function () {
            vc.getDict('report_owe_fee', "payer_obj_type", function (_data) {
                vc.component.listOweFeeInfo.payObjTypes = _data;
            });
            //与字典表关联
            vc.getDict('building_room', "room_sub_type", function (_data) {
                vc.component.listOweFeeInfo.roomSubTypes = _data;
            });
            vc.component._loadListOweFeeInfo(1, 10);
            $that._listFeeConfigs();
        },
        _initEvent: function () {
            $('#configIds').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
                // do something...
                console.log(e, clickedIndex, isSelected, previousValue)
                if (isSelected) {
                    $that.listOweFeeInfo.feeConfigNames.push({
                        configId: $that.listOweFeeInfo.feeConfigs[clickedIndex].configId,
                        configName: $that.listOweFeeInfo.feeConfigs[clickedIndex].feeName
                    })
                } else {

                    let _feeConfigNames = [];
                    $that.listOweFeeInfo.feeConfigNames.forEach(item => {
                        if (item.configId != $that.listOweFeeInfo.feeConfigs[clickedIndex].configId) {
                            _feeConfigNames.push(item);
                        }
                    });
                    $that.listOweFeeInfo.feeConfigNames = _feeConfigNames;
                }
            });
            vc.on('pagination', 'page_event',
                function (_currentPage) {
                    vc.component._loadListOweFeeInfo(_currentPage, DEFAULT_ROWS);
                });
            vc.on('listOweFee', 'chooseFloor', function (_param) {
                vc.component.listOweFeeInfo.conditions.floorId = _param.floorId;
                vc.component.listOweFeeInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);
            });
        },
        methods: {
            _loadListOweFeeInfo: function (_page, _row) {
                vc.component.listOweFeeInfo.conditions.page = _page;
                vc.component.listOweFeeInfo.conditions.row = _row;
                vc.component.listOweFeeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let _configIds = "";
                $that.listOweFeeInfo.feeConfigNames.forEach(item => {
                    _configIds += (item.configId + ',')
                })
                if (_configIds.endsWith(',')) {
                    _configIds = _configIds.substring(0, _configIds.length - 1);
                }
                $that.listOweFeeInfo.conditions.configIds = _configIds;
                let param = {
                    params: vc.component.listOweFeeInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportOweFee/queryReportOweFee',
                    param,
                    function (json) {
                        var _feeConfigInfo = JSON.parse(json);
                        vc.component.listOweFeeInfo.total = _feeConfigInfo.total;
                        vc.component.listOweFeeInfo.records = _feeConfigInfo.records;
                        vc.component.listOweFeeInfo.fees = _feeConfigInfo.data;
                        vc.emit('pagination', 'init', {
                            total: _feeConfigInfo.records,
                            dataCount: _feeConfigInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack();
            },
            _moreCondition: function () {
                if (vc.component.listOweFeeInfo.moreCondition) {
                    vc.component.listOweFeeInfo.moreCondition = false;
                } else {
                    vc.component.listOweFeeInfo.moreCondition = true;
                }
            },
            //查询
            _queryOweFeeMethod: function () {
                vc.component._loadListOweFeeInfo(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetOweFeeMethod: function () {
                vc.resetObject($that.listOweFeeInfo.conditions);
                $that.listOweFeeInfo.feeConfigNames = [];
                $('#configIds').selectpicker('deselectAll');
                vc.component._loadListOweFeeInfo(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listFeeConfigs: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.listOweFeeInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _getFeeOweAmount: function (item, fee) {
                let _items = fee.items;
                if (!_items) {
                    return 0;
                }
                let _value = 0;
                _items.forEach(tmp => {
                    if (tmp.configId == item.configId) {
                        _value = tmp.amountOwed
                        return;
                    }
                })
                return _value;
            },
            _getFeeOweAllAmount: function (item) {
                let _fees = $that.listOweFeeInfo.fees;
                let _amountOwed = 0.0;
                _fees.forEach(_feeItem => {
                    let _items = _feeItem.items;
                    if (!_items) {
                        return 0;
                    }
                    _items.forEach(tmp => {
                        if (tmp.configId == item.configId) {
                            _amountOwed += parseFloat(tmp.amountOwed);
                        }
                    })
                });
                return _amountOwed.toFixed(2);
            },
            _getAllFeeOweAmount: function (_fee) {
                let _feeConfigNames = $that.listOweFeeInfo.feeConfigNames;
                if (_feeConfigNames.length < 1) {
                    return _fee.amountOwed;
                }
                let _amountOwed = 0.0;
                let _items = _fee.items;
                _feeConfigNames.forEach(_feeItem => {
                    _items.forEach(_item => {
                        if (_feeItem.configId == _item.configId) {
                            _amountOwed += parseFloat(_item.amountOwed);
                        }
                    })
                })
                return _amountOwed.toFixed(2);
            },
            _getFeeOweAllAmounts: function () {
                if (!window.$that) {
                    return;
                }

                if (!$that.listOweFeeInfo) {
                    return;
                }
                let _fees = $that.listOweFeeInfo.fees;
                let _amountOwed = 0.0;
                _fees.forEach(_feeItem => {
                    let _rowAmount = $that._getAllFeeOweAmount(_feeItem);
                    _amountOwed += parseFloat(_rowAmount);
                });
                return _amountOwed.toFixed(2);
            },
            _exportFee: function () {
                let _configIds = "";
                $that.listOweFeeInfo.feeConfigNames.forEach(item => {
                    _configIds += (item.configId + ',')
                })
                if (_configIds.endsWith(',')) {
                    _configIds = _configIds.substring(0, _configIds.length - 1);
                }
                vc.jumpToPage('/callComponent/exportReportFee/exportData?communityId=' + vc.getCurrentCommunity().communityId + "&pagePath=listOweFee&configIds=" + _configIds);
            },
            _toFeeCollectionOrderManage: function () {
                vc.jumpToPage('/#/pages/property/feeCollectionOrderManage');
            },
            loadUnits: function (_floorId) {
                var param = {
                    params: {
                        floorId: _floorId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.get(
                    'room',
                    'loadUnits',
                    param,
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            let tmpUnits = JSON.parse(json);
                            vc.component.listOweFeeInfo.roomUnits = tmpUnits;
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _openChooseFloorMethod: function () {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },
            _getFeeOweAllTotalAmount: function (_item) {
                let _value = 0;
                let _itemTotalOweAmounts = $that.listOweFeeInfo.fees[0].itemTotalOweAmounts;
                if (!$that.listOweFeeInfo.fees[0] || !$that.listOweFeeInfo.fees[0].itemTotalOweAmounts) {
                    return _value;
                }
                _itemTotalOweAmounts.forEach(item => {
                    if (_item.configName == item.configName) {
                        _value = item.totalOweAmount;
                    }
                })
                return _value;
            },
            _moreCondition: function() {
                if (vc.component.listOweFeeInfo.moreCondition) {
                    vc.component.listOweFeeInfo.moreCondition = false;
                } else {
                    vc.component.listOweFeeInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);