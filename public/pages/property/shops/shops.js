/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    vc.extends({
        data: {
            shopsUnits: [],
            shopsInfo: {
                shopss: [],
                total: 0,
                records: 1,
                floorId: '',
                unitId: '',
                state: '',
                roomNum: '',
                moreCondition: false,
                conditions: {
                    floorId: '',
                    floorName: '',
                    unitId: '',
                    roomNum: '',
                    roomId: '',
                    state: '',
                    section: '',
                    roomType: '2020602'
                },
                listColumns: []
            }
        },
        _initMethod: function () {
            vc.component.shopsInfo.conditions.floorId = vc.getParam("floorId");
            vc.component.shopsInfo.conditions.floorName = vc.getParam("floorName");
            vc.component.listShops(DEFAULT_PAGE, DEFAULT_ROW);
            //根据 参数查询相应数据
            //vc.component._loadDataByParam();
        },
        _initEvent: function () {
            vc.on('shops', 'chooseFloor', function (_param) {
                vc.component.shopsInfo.conditions.floorId = _param.floorId;
                vc.component.shopsInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);

            });
            vc.on('shops', 'listShops', function (_param) {
                vc.component.listShops(DEFAULT_PAGE, DEFAULT_ROW);
            });
            vc.on('shops', 'loadData', function (_param) {
                vc.component.listShops(DEFAULT_PAGE, DEFAULT_ROW);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component.listShops(_currentPage, DEFAULT_ROW);
            });
        },
        methods: {
            listShops: function (_page, _row) {
                vc.component.shopsInfo.conditions.page = _page;
                vc.component.shopsInfo.conditions.row = _row;
                vc.component.shopsInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: JSON.parse(JSON.stringify(vc.component.shopsInfo.conditions))
                };
                let _allNum = $that.shopsInfo.conditions.roomId;
                if (_allNum.split('-').length == 2) {
                    let _allNums = _allNum.split('-')
                    param.params.floorNum = _allNums[0].trim();
                    param.params.roomNum = _allNums[2].trim();
                    param.params.roomId = '';
                }
                //发送get请求
                vc.http.get('room',
                    'listRoom',
                    param,
                    function (json, res) {
                        var listShopsData = JSON.parse(json);

                        vc.component.shopsInfo.total = listShopsData.total;
                        vc.component.shopsInfo.records = listShopsData.records;
                        vc.component.shopsInfo.shopss = listShopsData.rooms;

                        $that.dealShopsAttr(listShopsData.shopss);

                        vc.emit('pagination', 'init', {
                            total: vc.component.shopsInfo.records,
                            dataCount: vc.component.shopsInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddShops: function () {
                vc.emit('addShops', 'addShopsModel',{});
            },
            _openEditShopsModel: function (_shops) {
                //_shops.floorId = vc.component.shopsInfo.conditions.floorId;
                vc.emit('editShops', 'openEditShopsModal', _shops);
            },
            _openDelShopsModel: function (_shops) {
                //_shops.floorId = vc.component.shopsInfo.conditions.floorId;
                vc.emit('deleteShops', 'openShopsModel', _shops);
            },
            /**
                根据楼ID加载房屋
            **/
            loadUnits: function (_floorId) {
                vc.component.addShopsUnits = [];
                var param = {
                    params: {
                        floorId: _floorId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.get(
                    'shops',
                    'loadUnits',
                    param,
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            var tmpUnits = JSON.parse(json);
                            vc.component.shopsUnits = tmpUnits;

                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            _queryShopsMethod: function () {
                vc.component.listShops(DEFAULT_PAGE, DEFAULT_ROW);
            },
            showState: function (_state) {
                if (_state == '2001') {
                    return "已入住";
                } else if (_state == '2002') {
                    return "未入住";
                } else if (_state == '2003') {
                    return "已交定金";
                }
                else if (_state == '2004') {
                    return "已出租";
                } else {
                    return "未知";
                }
            },
            _loadDataByParam: function () {
                vc.component.shopsInfo.conditions.floorId = vc.getParam("floorId");
                vc.component.shopsInfo.conditions.floorId = vc.getParam("floorName");
                //如果 floodId 没有传 则，直接结束
                /* if(!vc.notNull(vc.component.shopsInfo.conditions.floorId)){
                     return ;
                 }*/

                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        floorId: vc.component.shopsInfo.conditions.floorId
                    }
                }

                vc.http.get(
                    'shops',
                    'loadFloor',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            var _floorInfo = JSON.parse(json);
                            var _tmpFloor = _floorInfo.apiFloorDataVoList[0];
                            /*vc.emit('shopsSelectFloor','chooseFloor', _tmpFloor);
                            */

                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });

            },
            _moreCondition: function () {
                if (vc.component.shopsInfo.moreCondition) {
                    vc.component.shopsInfo.moreCondition = false;
                } else {
                    vc.component.shopsInfo.moreCondition = true;
                }
            },
            _openChooseFloorMethod: function () {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },
            dealShopsAttr: function (shopss) {
                $that._getColumns(shopss, function () {
                    shopss.forEach(item => {
                        $that._getColumnsValue(item);
                    });
                });

            },
            _getColumnsValue: function (_shops) {
                _shops.listValues = [];
                if (!_shops.hasOwnProperty('shopsAttrDto') || _shops.shopsAttrDto.length < 1) {
                    $that.shopsInfo.listColumns.forEach(_value => {
                        _shops.listValues.push('');
                    })
                    return;
                }

                let _shopsAttrDtos = _shops.shopsAttrDto;

                $that.shopsInfo.listColumns.forEach(_value => {
                    let _tmpValue = '';
                    _shopsAttrDtos.forEach(_attrItem => {
                        if (_value == _attrItem.specName) {
                            _tmpValue = _attrItem.valueName;
                        }
                    })
                    _shops.listValues.push(_tmpValue);
                })

            },
            _getColumns: function (_shopss, _call) {
                $that.shopsInfo.listColumns = [];
                vc.getAttrSpec('building_shops_attr', function (data) {
                    $that.shopsInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.shopsInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                });
                // 循环所有房屋信息
                // for (let _shopsIndex = 0; _shopsIndex < _shopss.length; _shopsIndex++) {
                //     let _shops = _shopss[_shopsIndex];

                //     if (!_shops.hasOwnProperty('shopsAttrDto')) {
                //         break;
                //     }
                //     let _shopsAttrDtos = _shops.shopsAttrDto;
                //     if (_shopsAttrDtos.length < 1) {
                //         break;
                //     }
                //     //获取房屋信息中 任意属性作为 列
                //     for (let _shopsAttrIndex = 0; _shopsAttrIndex < _shopsAttrDtos.length; _shopsAttrIndex++) {
                //         let attrItem = _shopsAttrDtos[_shopsAttrIndex];
                //         if (attrItem.listShow == 'Y') {
                //             $that.shopsInfo.listColumns.push(attrItem.specName);
                //         }
                //     }

                //     if ($that.shopsInfo.listColumns.length > 0) {
                //         break;
                //     }
                // }
            }
        }
    });
})(window.vc);