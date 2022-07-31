(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseAccountBondObj: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseAccountBondObjInfo: {
                accountBondObjs: [],
                _currentAccountBondObjName: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseAccountBondObj', 'openChooseAccountBondObjModel', function (_param) {
                $('#chooseAccountBondObjModel').modal('show');
                vc.component._refreshChooseAccountBondObjInfo();
                vc.component._loadAllAccountBondObjInfo(1, 10, '');
            });
        },
        methods: {
            _loadAllAccountBondObjInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        name: _name
                    }
                };

                //发送get请求
                vc.http.apiGet('/accountBondObj/listAccountBondObjs',
                    param,
                    function (json) {
                        var _accountBondObjInfo = JSON.parse(json);
                        vc.component.chooseAccountBondObjInfo.accountBondObjs = _accountBondObjInfo.accountBondObjs;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseAccountBondObj: function (_accountBondObj) {
                if (_accountBondObj.hasOwnProperty('name')) {
                    _accountBondObj.accountBondObjName = _accountBondObj.name;
                }
                vc.emit($props.emitChooseAccountBondObj, 'chooseAccountBondObj', _accountBondObj);
                vc.emit($props.emitLoadData, 'listAccountBondObjData', {
                    accountBondObjId: _accountBondObj.accountBondObjId
                });
                $('#chooseAccountBondObjModel').modal('hide');
            },
            queryAccountBondObjs: function () {
                vc.component._loadAllAccountBondObjInfo(1, 10, vc.component.chooseAccountBondObjInfo._currentAccountBondObjName);
            },
            _refreshChooseAccountBondObjInfo: function () {
                vc.component.chooseAccountBondObjInfo._currentAccountBondObjName = "";
            }
        }

    });
})(window.vc);
