(function (vc) {
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
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseResourceStaff', 'openChooseResourceStaffModel', function (_param) {
                $('#chooseResourceStaffModel').modal('show');
                vc.component.chooseResourceStaffInfo._currentResourceStoreName = "";
                vc.component._loadAllResourceStaffInfo(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._loadAllResourceStaffInfo(_currentPage, DEFAULT_ROWS);
            });
            // 监听移除选中项
            vc.on('chooseResourceStaff', 'removeSelectResourceStaffItem', function (_resId) {
                vc.component.chooseResourceStaffInfo.selectResourceStores.forEach((item, index) => {
                    if(item == _resId){
                        vc.component.chooseResourceStaffInfo.selectResourceStores.splice(index, 1);
                    }
                })
            });
        },
        methods: {
            _loadAllResourceStaffInfo: function (_page, _row) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listUserStorehouses',
                    param,
                    function (json) {
                        var _resourceStaffInfo = JSON.parse(json);
                        vc.component.chooseResourceStaffInfo.resourceStores = _resourceStaffInfo.data;
                        vc.component.chooseResourceStaffInfo.total = _resourceStaffInfo.total;
                        vc.component.chooseResourceStaffInfo.records = _resourceStaffInfo.records;
                        vc.emit('pagination', 'init', {
                            total: vc.component.chooseResourceStaffInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseResourceStore: function (_resourceStore) {
                if (_resourceStore.hasOwnProperty('name')) {
                    _resourceStore.resourceStoreName = _resourceStore.name;
                }
                vc.emit($props.emitChooseResourceStore, 'chooseResourceStore', _resourceStore);
                vc.emit($props.emitLoadData, 'listResourceStoreData', {
                    resourceStoreId: _resourceStore.resourceStoreId
                });
                $('#chooseResourceStoreModel').modal('hide');
            },
            queryResourceStores: function () {
                vc.component._loadAllResourceStaffInfo(1, 10, vc.component.chooseResourceStaffInfo._currentResourceStoreName);
            },
            getSelectResourceStores: function () {
                var selectResourceStores = vc.component.chooseResourceStaffInfo.selectResourceStores;
                console.log(selectResourceStores);
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
                                description: resourceStores[j].description,
                            })
                        }
                    }
                }
                //传参
                vc.emit("viewResourceStaffInfo", "setSelectResourceStores", _resourceStores);
                $('#chooseResourceStaffModel').modal('hide');
            }
        }

    });
})(window.vc);
