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
                conditions: {
                    floorName: '',
                    configIds: '',
                    payObjType: '3333',
                    billType: '00123'
                },
                feeConfigs: [],
                feeConfigNames: [],
                floorId: '',
                unitId: '',
            }
        },
        watch: {
            'listOweFeeInfo.feeConfigs': function () {//'goodList'是我要渲染的对象，也就是我要等到它渲染完才能调用函数
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
                    }, function () {
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
            _queryOweFeeMethod: function () {
                vc.component._loadListOweFeeInfo(1, 10);
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
                vc.http.get('feeConfigManage', 'list', param,
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
            _getAllFeeOweAmount: function (_fee) {
                let _feeConfigNames = $that.listOweFeeInfo.feeConfigNames;
                if (_feeConfigNames.length < 1) {
                    return _fee.amountOwed;
                }

                let _amountOwed = 0.0;
                let _items = _fee.items;
                _feeConfigNames.forEach(_feeItem =>{
                    _items.forEach(_item=>{
                        if(_feeItem.configId == _item.configId){
                            _amountOwed += parseFloat(_item.amountOwed);
                        }
                    })
                })
                return _amountOwed;
            }

        }

    });
})(window.vc);
