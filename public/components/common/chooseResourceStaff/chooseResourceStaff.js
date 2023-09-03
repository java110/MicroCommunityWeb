(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        propTypes: {
            emitChooseResourceStore: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseResourceStaffInfo: {
                resourceStores: [],
                selectResourceStores: [],
                _currentResourceStoreName: '',
                parentRstId: '',
                rstId: '',
                // shId: '',
                storehouses: [],
                resourceStoreTypes: [],
                resourceStoreSonTypes: [],
            }
        },
        watch: { // 监视双向绑定的数据数组
            chooseResourceStaffInfo: {
                handler() { // 数据数组有变化将触发此函数
                    if (vc.component.chooseResourceStaffInfo.selectResourceStores.length == vc.component.chooseResourceStaffInfo.resourceStores.length) {
                        document.querySelector('#quan').checked = true;
                    } else {
                        document.querySelector('#quan').checked = false;
                    }
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function() {
            $that._listStorehouses();
            $that._listResourceStoreTypes();
        },
        _initEvent: function() {
            vc.on('chooseResourceStaff', 'openChooseResourceStaffModel', function(_param) {
                $('#chooseResourceStaffModel').modal('show');
                vc.component.chooseResourceStaffInfo._currentResourceStoreName = "";
                vc.component._loadAllResourceStaffInfo(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._loadAllResourceStaffInfo(_currentPage, DEFAULT_ROWS);
            });
            // 监听移除选中项
            vc.on('chooseResourceStaff', 'removeSelectResourceStaffItem', function(_resId) {
                vc.component.chooseResourceStaffInfo.selectResourceStores.forEach((item, index) => {
                    if (item == _resId) {
                        vc.component.chooseResourceStaffInfo.selectResourceStores.splice(index, 1);
                    }
                })
            });
        },
        methods: {
            _loadAllResourceStaffInfo: function(_page, _row) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        resName: vc.component.chooseResourceStaffInfo._currentResourceStoreName,
                        parentRstId: vc.component.chooseResourceStaffInfo.parentRstId,
                        rstId: vc.component.chooseResourceStaffInfo.rstId,
                        giveType: 1
                            // shId: vc.component.chooseResourceStaffInfo.shId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listUserStorehouses',
                    param,
                    function(json) {
                        var _resourceStaffInfo = JSON.parse(json);
                        vc.component.chooseResourceStaffInfo.resourceStores = _resourceStaffInfo.data;
                        vc.component.chooseResourceStaffInfo.total = _resourceStaffInfo.total;
                        vc.component.chooseResourceStaffInfo.records = _resourceStaffInfo.records;
                        vc.emit('pagination', 'init', {
                            total: vc.component.chooseResourceStaffInfo.records,
                            dataCount: vc.component.chooseResourceStaffInfo.total,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseResourceStore: function(_resourceStore) {
                if (_resourceStore.hasOwnProperty('name')) {
                    _resourceStore.resourceStoreName = _resourceStore.name;
                }
                vc.emit($props.emitChooseResourceStore, 'chooseResourceStore', _resourceStore);
                vc.emit($props.emitLoadData, 'listResourceStoreData', {
                    resourceStoreId: _resourceStore.resourceStoreId
                });
                $('#chooseResourceStoreModel').modal('hide');
            },
            queryResourceStores: function() {
                vc.component._loadAllResourceStaffInfo(1, 10, vc.component.chooseResourceStaffInfo._currentResourceStoreName);
            },
            getSelectResourceStores: function() {
                var selectResourceStores = vc.component.chooseResourceStaffInfo.selectResourceStores;
                var resourceStores = vc.component.chooseResourceStaffInfo.resourceStores;
                if (selectResourceStores.length < 1) {
                    vc.toast("请选择需要转赠的物品");
                    return;
                }
                var _resourceStores = [];
                for (var i = 0; i < selectResourceStores.length; i++) {
                    for (j = 0; j < resourceStores.length; j++) {
                        if (selectResourceStores[i] == resourceStores[j].resId) {
                            _resourceStores.push({
                                resId: resourceStores[j].resId,
                                resName: resourceStores[j].resName,
                                resCode: resourceStores[j].resCode,
                                price: resourceStores[j].price,
                                stock: resourceStores[j].stock,
                                parentRstName: resourceStores[j].parentRstName,
                                rstName: resourceStores[j].rstName,
                                parentRstId: resourceStores[j].parentRstId,
                                rstId: resourceStores[j].rstId,
                                isFixed: resourceStores[j].isFixed,
                                isFixedName: resourceStores[j].isFixedName,
                                description: resourceStores[j].description,
                                unitCodeName: resourceStores[j].unitCodeName,
                                miniStock: resourceStores[j].miniStock,
                                miniUnitCodeName: resourceStores[j].miniUnitCodeName,
                                miniUnitStock: resourceStores[j].miniUnitStock,
                                timesId: resourceStores[j].timesId
                            })
                        }
                    }
                }
                //传参
                vc.emit($props.emitChooseResourceStore, "setSelectResourceStores", _resourceStores);
                $('#chooseResourceStaffModel').modal('hide');
            },
            _listStorehouses: function(_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function(json, res) {
                        var _storehouseManageInfo = JSON.parse(json);
                        vc.component.chooseResourceStaffInfo.storehouses = _storehouseManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreTypes: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId:'0'
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.chooseResourceStaffInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSonTypes: function() {
                vc.component.chooseResourceStaffInfo.rstId = '';
                vc.component.chooseResourceStaffInfo.resourceStoreSonTypes = [];
                if (vc.component.chooseResourceStaffInfo.parentRstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: vc.component.chooseResourceStaffInfo.parentRstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.chooseResourceStaffInfo.resourceStoreSonTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            checkAll: function(e) {
                var checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            vc.component.chooseResourceStaffInfo.selectResourceStores.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.chooseResourceStaffInfo.selectResourceStores = [];
                }
            }
        }
    });
})(window.vc);