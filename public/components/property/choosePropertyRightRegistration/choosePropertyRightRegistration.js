(function (vc) {
    vc.extends({
        propTypes: {
            emitChoosePropertyRightRegistration: vc.propTypes.string,
            emitLoadData: vc.propTypes.string
        },
        data: {
            choosePropertyRightRegistrationInfo: {
                propertyRightRegistrations: [],
                _currentPropertyRightRegistrationName: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('choosePropertyRightRegistration', 'openChoosePropertyRightRegistrationModel', function (_param) {
                $('#choosePropertyRightRegistrationModel').modal('show');
                vc.component._refreshChoosePropertyRightRegistrationInfo();
                vc.component._loadAllPropertyRightRegistrationInfo(1, 10, '');
            });
        },
        methods: {
            _loadAllPropertyRightRegistrationInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        name: _name
                    }
                };

                //发送get请求
                vc.http.apiGet('propertyRightRegistration.listPropertyRightRegistration',
                    param,
                    function (json) {
                        var _propertyRightRegistrationInfo = JSON.parse(json);
                        vc.component.choosePropertyRightRegistrationInfo.propertyRightRegistrations = _propertyRightRegistrationInfo.propertyRightRegistrations;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            choosePropertyRightRegistration: function (_propertyRightRegistration) {
                if (_propertyRightRegistration.hasOwnProperty('name')) {
                    _propertyRightRegistration.propertyRightRegistrationName = _propertyRightRegistration.name;
                }
                vc.emit($props.emitChoosePropertyRightRegistration, 'choosePropertyRightRegistration', _propertyRightRegistration);
                vc.emit($props.emitLoadData, 'listPropertyRightRegistrationData', {
                    propertyRightRegistrationId: _propertyRightRegistration.propertyRightRegistrationId
                });
                $('#choosePropertyRightRegistrationModel').modal('hide');
            },
            queryPropertyRightRegistrations: function () {
                vc.component._loadAllPropertyRightRegistrationInfo(1, 10, vc.component.choosePropertyRightRegistrationInfo._currentPropertyRightRegistrationName);
            },
            _refreshChoosePropertyRightRegistrationInfo: function () {
                vc.component.choosePropertyRightRegistrationInfo._currentPropertyRightRegistrationName = "";
            }
        }

    });
})(window.vc);
