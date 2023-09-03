(function(vc) {
    vc.extends({
        propTypes: {
            emitChooseFeePrintPage: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseFeePrintPageInfo: {
                feePrintPages: [],
                _currentFeePrintPageName: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('chooseFeePrintPage', 'openChooseFeePrintPageModel', function(_param) {
                $('#chooseFeePrintPageModel').modal('show');
                vc.component._refreshChooseFeePrintPageInfo();
                vc.component._loadAllFeePrintPageInfo(1, 10, '');
            });
        },
        methods: {
            _loadAllFeePrintPageInfo: function(_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        name: _name
                    }
                };

                //发送get请求
                vc.http.apiGet('/feePrintPage.listFeePrintPages',
                    param,
                    function(json) {
                        var _feePrintPageInfo = JSON.parse(json);
                        vc.component.chooseFeePrintPageInfo.feePrintPages = _feePrintPageInfo.feePrintPages;
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseFeePrintPage: function(_feePrintPage) {
                if (_feePrintPage.hasOwnProperty('name')) {
                    _feePrintPage.feePrintPageName = _feePrintPage.name;
                }
                vc.emit($props.emitChooseFeePrintPage, 'chooseFeePrintPage', _feePrintPage);
                vc.emit($props.emitLoadData, 'listFeePrintPageData', {
                    feePrintPageId: _feePrintPage.feePrintPageId
                });
                $('#chooseFeePrintPageModel').modal('hide');
            },
            queryFeePrintPages: function() {
                vc.component._loadAllFeePrintPageInfo(1, 10, vc.component.chooseFeePrintPageInfo._currentFeePrintPageName);
            },
            _refreshChooseFeePrintPageInfo: function() {
                vc.component.chooseFeePrintPageInfo._currentFeePrintPageName = "";
            }
        }

    });
})(window.vc);