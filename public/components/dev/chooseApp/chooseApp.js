(function(vc) {
    vc.extends({
        propTypes: {
            emitChooseApp: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseAppInfo: {
                apps: [],
                _currentAppName: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('chooseApp', 'openChooseAppModel', function(_param) {
                $('#chooseAppModel').modal('show');
                vc.component._refreshChooseAppInfo();
                vc.component._loadAllAppInfo(1, 10, '');
            });
            vc.on('chooseApp', 'paginationPlus', 'page_event', function(_currentPage) {
                vc.component._loadAllAppInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadAllAppInfo: function(_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        name: _name
                    }
                };
                //发送get请求
                vc.http.apiGet('/app.listApps',
                    param,
                    function(json) {
                        var _appInfo = JSON.parse(json);
                        vc.component.chooseAppInfo.apps = _appInfo.apps;
                        vc.emit('chooseApp', 'paginationPlus', 'init', {
                            total: _appInfo.records,
                            dataCount: _appInfo.total,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseApp: function(_app) {
                _app.appName = _app.name;
                vc.emit($props.emitChooseApp, 'chooseApp', _app);
                vc.emit($props.emitLoadData, 'listAppData', {
                    appId: _app.appId
                });
                $('#chooseAppModel').modal('hide');
            },
            queryApps: function() {
                vc.component._loadAllAppInfo(1, 10, vc.component.chooseAppInfo._currentAppName);
            },
            _refreshChooseAppInfo: function() {
                vc.component.chooseAppInfo._currentAppName = "";
            }
        }
    });
})(window.vc);