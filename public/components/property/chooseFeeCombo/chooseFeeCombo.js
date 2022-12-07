(function (vc) {
    vc.extends({
        propTypes: {
            emitChooseFeeCombo: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            chooseFeeComboInfo: {
                feeCombos: [],
                _currentFeeComboName: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseFeeCombo', 'openChooseFeeComboModel', function (_param) {
                $('#chooseFeeComboModel').modal('show');
                vc.component._refreshChooseFeeComboInfo();
                vc.component._loadAllFeeComboInfo(1, 10, '');
            });
        },
        methods: {
            _loadAllFeeComboInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        name: _name
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeCombo.listFeeCombo',
                    param,
                    function (json) {
                        var _feeComboInfo = JSON.parse(json);
                        vc.component.chooseFeeComboInfo.feeCombos = _feeComboInfo.data;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseFeeCombo: function (_feeCombo) {
                if (_feeCombo.hasOwnProperty('name')) {
                    _feeCombo.feeComboName = _feeCombo.name;
                }
                vc.emit($props.emitChooseFeeCombo, 'chooseFeeCombo', _feeCombo);
                vc.emit($props.emitLoadData, 'listFeeComboData', {
                    feeComboId: _feeCombo.feeComboId
                });
                $('#chooseFeeComboModel').modal('hide');
            },
            queryFeeCombos: function () {
                vc.component._loadAllFeeComboInfo(1, 10, vc.component.chooseFeeComboInfo._currentFeeComboName);
            },
            _refreshChooseFeeComboInfo: function () {
                vc.component.chooseFeeComboInfo._currentFeeComboName = "";
            }
        }
    });
})(window.vc);
