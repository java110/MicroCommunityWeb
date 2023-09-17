(function(vc) {
    vc.extends({
        propTypes: {
            emitChooseResourceStore: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseResourceStoreInfo: {
                resourceStores: [],
                selectResourceStores: [],
                _currentResourceStoreName: '',
                parentRstId: '',
                rstId: '',
                shId: '',
                storehouses: [],
                resourceStoreTypes: [],
                resourceStoreSonTypes: [],
                name: '',
                resOrderType: ''
            }
        },
        watch: { // 监视双向绑定的数据数组
            chooseResourceStoreInfo: {
                handler() { // 数据数组有变化将触发此函数
                    if ($that.chooseResourceStoreInfo.selectResourceStores.length == $that.chooseResourceStoreInfo.resourceStores.length) {
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
            vc.on('chooseResourceStore', 'openChooseResourceStoreModel', function(_param) {
                $('#chooseResourceStoreModel').modal('show');
                $that.chooseResourceStoreInfo.resOrderType = _param.resOrderType;
                $that.chooseResourceStoreInfo.shId = _param.shId;
                $that._refreshChooseResourceStoreInfo();
                $that._loadAllResourceStoreInfo(1, 10, '');
            });
            vc.on('chooseResourceStore', 'paginationPlus', 'page_event', function(_currentPage) {
                $that._loadAllResourceStoreInfo(_currentPage, 10, $that.chooseResourceStoreInfo.name);
            });
            // 监听移除选中项
            vc.on('chooseResourceStore', 'removeSelectResourceStoreItem', function(_resId) {
                $that.chooseResourceStoreInfo.selectResourceStores.forEach((item, index) => {
                    if (item == _resId) {
                        $that.chooseResourceStoreInfo.selectResourceStores.splice(index, 1);
                    }
                })
            });
        },
        methods: {
            _loadAllResourceStoreInfo: function(_page, _row, _name) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        isShow: true,
                        communityId: vc.getCurrentCommunity().communityId,
                        // name: _name,
                        resOrderType: $that.chooseResourceStoreInfo.resOrderType,
                        resName: $that.chooseResourceStoreInfo._currentResourceStoreName,
                        parentRstId: $that.chooseResourceStoreInfo.parentRstId,
                        rstId: $that.chooseResourceStoreInfo.rstId,
                        shId: $that.chooseResourceStoreInfo.shId
                    }
                };
                if($that.chooseResourceStoreInfo.shId){
                    param.params.communityId = '';
                }
                //发送get请求
                vc.http.apiGet('/resourceStore.listResourceStores',
                    param,
                    function(json) {
                        var _resourceStoreInfo = JSON.parse(json);
                        $that.chooseResourceStoreInfo.resourceStores = _resourceStoreInfo.resourceStores;
                        vc.emit('chooseResourceStore', 'paginationPlus', 'init', {
                            total: _resourceStoreInfo.records,
                            dataCount: _resourceStoreInfo.total,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseResourceStore_BACK: function(_resourceStore) {
                if (_resourceStore.hasOwnProperty('name')) {
                    _resourceStore.resourceStoreName = _resourceStore.name;
                }
                vc.emit($props.emitChooseResourceStore, 'chooseResourceStore', _resourceStore);
                vc.emit($props.emitLoadData, 'listResourceStoreData', {
                    resourceStoreId: _resourceStore.resourceStoreId
                });
                $('#chooseResourceStoreModel').modal('hide');
            },
            chooseResourceStore: function() {
                var selectResourceStores = $that.chooseResourceStoreInfo.selectResourceStores;
                var resourceStores = $that.chooseResourceStoreInfo.resourceStores;
                if (selectResourceStores < 1) {
                    vc.toast('请选择商品');
                    return;
                }
                var _resourceStores = [];
                for (var i = 0; i < selectResourceStores.length; i++) {
                    for (j = 0; j < resourceStores.length; j++) {
                        if (selectResourceStores[i] == resourceStores[j].resId) {
                            if (resourceStores[j].hasOwnProperty('name')) {
                                resourceStores[j].resourceStoreName = resourceStores[j].name;
                            }
                            _resourceStores.push(resourceStores[j])
                        }
                    }
                }
                vc.emit($props.emitChooseResourceStore, 'chooseResourceStore', _resourceStores);
                $('#chooseResourceStoreModel').modal('hide');
            },
            queryResourceStores: function() {
                $that._loadAllResourceStoreInfo(1, 10, $that.chooseResourceStoreInfo._currentResourceStoreName);
            },
            _refreshChooseResourceStoreInfo: function() {
                $that.chooseResourceStoreInfo._currentResourceStoreName = "";
            },
            _listStorehouses: function(_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        isShow: true,
                        flag: "0",
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function(json, res) {
                        var _storehouseManageInfo = JSON.parse(json);
                        $that.chooseResourceStoreInfo.storehouses = _storehouseManageInfo.data;
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
                        parentId: '0'
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        $that.chooseResourceStoreInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSonTypes: function() {
                $that.chooseResourceStoreInfo.rstId = '';
                $that.chooseResourceStoreInfo.resourceStoreSonTypes = [];
                if ($that.chooseResourceStoreInfo.parentRstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: $that.chooseResourceStoreInfo.parentRstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        $that.chooseResourceStoreInfo.resourceStoreSonTypes = _resourceStoreTypeManageInfo.data;
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
                            $that.chooseResourceStoreInfo.selectResourceStores.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.chooseResourceStoreInfo.selectResourceStores = [];
                }
            }
        }
    });
})(window.vc);