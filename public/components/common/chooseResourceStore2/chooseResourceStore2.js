(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        propTypes: {
            emitChooseResourceStore: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseResourceStoreInfo2: {
                resourceStores: [],
                selectResourceStores: [],
                _currentResourceStoreName: '',
                parentRstId: '',
                rstId: '',
                shId: '',
                resOrderType: '',
                storehouses: [],
                resourceStoreTypes: [],
                resourceStoreSonTypes: []
            }
        },
        watch: { // 监视双向绑定的数据数组
            chooseResourceStoreInfo2: {
                handler() { // 数据数组有变化将触发此函数
                    if (vc.component.chooseResourceStoreInfo2.selectResourceStores.length == vc.component.chooseResourceStoreInfo2.resourceStores.length) {
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
            vc.on('chooseResourceStore2', 'setResourcesOut', function(_resOrderType) {
                vc.component.chooseResourceStoreInfo2.resOrderType = _resOrderType;
            });
            vc.on('chooseResourceStore2', 'openChooseResourceStoreModel2', function(_param) {
                $('#chooseResourceStoreModel2').modal('show');
                vc.component.chooseResourceStoreInfo2._currentResourceStoreName = "";
                vc.component._loadAllResourceStoreInfo(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._loadAllResourceStoreInfo(_currentPage, DEFAULT_ROWS);
            });
            // 监听移除选中项
            vc.on('chooseResourceStore2', 'removeSelectResourceStoreItem', function(_resId) {
                vc.component.chooseResourceStoreInfo2.selectResourceStores.forEach((item, index) => {
                    if (item == _resId) {
                        vc.component.chooseResourceStoreInfo2.selectResourceStores.splice(index, 1);
                    }
                })
            });
        },
        methods: {
            _loadAllResourceStoreInfo: function(_page, _row) {
                let _resOrderType = vc.component.chooseResourceStoreInfo2.resOrderType;
                //let _shType = '2806';
                //这里根据客户需求 调整 为 可以从小区仓库采购
                let _shType = '';
                if (_resOrderType == '20000') {
                    _shType = '2807';
                }
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        resOrderType: _resOrderType,
                        shType: _shType,
                        isShow: true,
                        resName: vc.component.chooseResourceStoreInfo2._currentResourceStoreName,
                        parentRstId: vc.component.chooseResourceStoreInfo2.parentRstId,
                        rstId: vc.component.chooseResourceStoreInfo2.rstId,
                        shId: vc.component.chooseResourceStoreInfo2.shId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listResourceStores',
                    param,
                    function(json) {
                        var _resourceStoreInfo = JSON.parse(json);
                        vc.component.chooseResourceStoreInfo2.resourceStores = _resourceStoreInfo.resourceStores;
                        vc.component.chooseResourceStoreInfo2.total = _resourceStoreInfo.total;
                        vc.component.chooseResourceStoreInfo2.records = _resourceStoreInfo.records;
                        vc.emit('pagination', 'init', {
                            total: vc.component.chooseResourceStoreInfo2.records,
                            dataCount: vc.component.chooseResourceStoreInfo2.total,
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
                vc.component._loadAllResourceStoreInfo(1, 10, vc.component.chooseResourceStoreInfo2._currentResourceStoreName);
            },
            getSelectResourceStores: function() {
                var selectResourceStores = vc.component.chooseResourceStoreInfo2.selectResourceStores;
                var resourceStores = vc.component.chooseResourceStoreInfo2.resourceStores;
                if (selectResourceStores.length < 1) {
                    vc.toast("请选择需要采购的物品");
                    return;
                }
                var _resourceStores = [];
                for (var i = 0; i < selectResourceStores.length; i++) {
                    for (j = 0; j < resourceStores.length; j++) {
                        if (selectResourceStores[i] == resourceStores[j].resId) {
                            resourceStores[j].remark = '';
                            _resourceStores.push(resourceStores[j])
                        }
                    }
                }
                //传参
                vc.emit("viewResourceStoreInfo2", "setSelectResourceStores", _resourceStores);
                $('#chooseResourceStoreModel2').modal('hide');
            },
            _listStorehouses: function(_page, _rows) {
                let _resOrderType = vc.component.chooseResourceStoreInfo2.resOrderType;
                //let _shType = '2806';
                //这里根据客户需求 调整 为 可以从小区仓库采购
                let _shType = '';
                if (_resOrderType == '20000') {
                    _shType = '2807';
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        isShow: true,
                        communityId: vc.getCurrentCommunity().communityId,
                        shType: _shType
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function(json, res) {
                        var _storehouseManageInfo = JSON.parse(json);
                        vc.component.chooseResourceStoreInfo2.storehouses = _storehouseManageInfo.data;
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
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.chooseResourceStoreInfo2.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSonTypes: function() {
                vc.component.chooseResourceStoreInfo2.rstId = '';
                vc.component.chooseResourceStoreInfo2.resourceStoreSonTypes = [];
                if (vc.component.chooseResourceStoreInfo2.parentRstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: vc.component.chooseResourceStoreInfo2.parentRstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.chooseResourceStoreInfo2.resourceStoreSonTypes = _resourceStoreTypeManageInfo.data;
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
                            vc.component.chooseResourceStoreInfo2.selectResourceStores.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.chooseResourceStoreInfo2.selectResourceStores = [];
                }
            }
        }
    });
})(window.vc);