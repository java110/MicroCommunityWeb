(function(vc) {
    vc.extends({
        propTypes: {
            emitChooseService: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseServiceInfo: {
                services: [],
                _currentServiceName: ''
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('chooseService', 'openChooseServiceModel', function(_param) {
                $('#chooseServiceModel').modal('show');
                vc.component._refreshChooseServiceInfo();
                vc.component._loadAllServiceInfo(1, 10, '');
            });
        },
        methods: {
            _loadAllServiceInfo: function(_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        /*communityId:vc.getCurrentCommunity().communityId,*/
                        name: _name
                    }
                };
                //发送get请求
                vc.http.apiGet('/service.listServices',
                    param,
                    function(json) {
                        var _serviceInfo = JSON.parse(json);
                        vc.component.chooseServiceInfo.services = _serviceInfo.services;
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseService: function(_service) {
                vc.emit($props.emitChooseService, 'chooseService', _service);
                vc.emit($props.emitLoadData, 'listServiceData', {
                    serviceId: _service.serviceId
                });
                $('#chooseServiceModel').modal('hide');
            },
            queryServices: function() {
                vc.component._loadAllServiceInfo(1, 10, vc.component.chooseServiceInfo._currentServiceName);
            },
            _refreshChooseServiceInfo: function() {
                vc.component.chooseServiceInfo._currentServiceName = "";
            }
        }
    });
})(window.vc);