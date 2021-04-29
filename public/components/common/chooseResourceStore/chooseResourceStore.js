(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseResourceStore: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseResourceStoreInfo: {
                resourceStores: [],
                _currentResourceStoreName: '',
                name: '',
                resOrderType: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseResourceStore', 'openChooseResourceStoreModel', function (_param) {
                $('#chooseResourceStoreModel').modal('show');
                $that.chooseResourceStoreInfo.resOrderType = _param.resOrderType;
                vc.component._refreshChooseResourceStoreInfo();
                vc.component._loadAllResourceStoreInfo(1, 10, '');
            });

            vc.on('chooseResourceStore', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadAllResourceStoreInfo(_currentPage, 10, vc.component.chooseResourceStoreInfo.name);
            });
        },
        methods: {
            _loadAllResourceStoreInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        name: _name,
                        resOrderType: $that.chooseResourceStoreInfo.resOrderType
                    }
                };

                //发送get请求
                vc.http.get('chooseResourceStore',
                    'list',
                    param,
                    function (json) {
                        var _resourceStoreInfo = JSON.parse(json);
                        vc.component.chooseResourceStoreInfo.resourceStores = _resourceStoreInfo.resourceStores;
                        vc.emit('chooseResourceStore', 'paginationPlus', 'init', {
                            total: _resourceStoreInfo.records,
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
                vc.component._loadAllResourceStoreInfo(1, 10, vc.component.chooseResourceStoreInfo._currentResourceStoreName);
            },
            _refreshChooseResourceStoreInfo: function () {
                vc.component.chooseResourceStoreInfo._currentResourceStoreName = "";
            }
        }

    });
})(window.vc);
