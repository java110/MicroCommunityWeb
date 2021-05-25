(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseResourceStoreSpecification: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseResourceStoreSpecificationInfo: {
                resourceStoreSpecifications: [],
                _currentResourceStoreSpecificationName: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseResourceStoreSpecification', 'openChooseResourceStoreSpecificationModel', function (_param) {
                $('#chooseResourceStoreSpecificationModel').modal('show');
                vc.component._refreshChooseResourceStoreSpecificationInfo();
                vc.component._loadAllResourceStoreSpecificationInfo(1, 10, '');
            });
        },
        methods: {
            _loadAllResourceStoreSpecificationInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        name: _name
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json) {
                        var _resourceStoreSpecificationInfo = JSON.parse(json);
                        vc.component.chooseResourceStoreSpecificationInfo.resourceStoreSpecifications = _resourceStoreSpecificationInfo.resourceStoreSpecifications;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseResourceStoreSpecification: function (_resourceStoreSpecification) {
                if (_resourceStoreSpecification.hasOwnProperty('name')) {
                    _resourceStoreSpecification.resourceStoreSpecificationName = _resourceStoreSpecification.name;
                }
                vc.emit($props.emitChooseResourceStoreSpecification, 'chooseResourceStoreSpecification', _resourceStoreSpecification);
                vc.emit($props.emitLoadData, 'listResourceStoreSpecificationData', {
                    resourceStoreSpecificationId: _resourceStoreSpecification.resourceStoreSpecificationId
                });
                $('#chooseResourceStoreSpecificationModel').modal('hide');
            },
            queryResourceStoreSpecifications: function () {
                vc.component._loadAllResourceStoreSpecificationInfo(1, 10, vc.component.chooseResourceStoreSpecificationInfo._currentResourceStoreSpecificationName);
            },
            _refreshChooseResourceStoreSpecificationInfo: function () {
                vc.component.chooseResourceStoreSpecificationInfo._currentResourceStoreSpecificationName = "";
            }
        }

    });
})(window.vc);
