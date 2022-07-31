(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseAccountBond: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseAccountBondInfo: {
                accountBonds: [],
                _currentAccountBondName: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseAccountBond', 'openChooseAccountBondModel', function (_param) {
                $('#chooseAccountBondModel').modal('show');
                vc.component._refreshChooseAccountBondInfo();
                vc.component._loadAllAccountBondInfo(1, 10, '');
            });
        },
        methods: {
            _loadAllAccountBondInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        name: _name
                    }
                };

                //发送get请求
                vc.http.apiGet('/accountBond/listAccountBonds',
                    param,
                    function (json) {
                        var _accountBondInfo = JSON.parse(json);
                        vc.component.chooseAccountBondInfo.accountBonds = _accountBondInfo.accountBonds;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseAccountBond: function (_accountBond) {
                if (_accountBond.hasOwnProperty('name')) {
                    _accountBond.accountBondName = _accountBond.name;
                }
                vc.emit($props.emitChooseAccountBond, 'chooseAccountBond', _accountBond);
                vc.emit($props.emitLoadData, 'listAccountBondData', {
                    accountBondId: _accountBond.accountBondId
                });
                $('#chooseAccountBondModel').modal('hide');
            },
            queryAccountBonds: function () {
                vc.component._loadAllAccountBondInfo(1, 10, vc.component.chooseAccountBondInfo._currentAccountBondName);
            },
            _refreshChooseAccountBondInfo: function () {
                vc.component.chooseAccountBondInfo._currentAccountBondName = "";
            }
        }

    });
})(window.vc);
