(function (vc) {
    //员工权限
    vc.extends({
        data: {
            memberInfo: {
                members: [],
                _currentOwnerId: '',
                listColumns: []
            }
        },
        _initMethod: function () {
            $that._getColumns(function () {
            });
        },
        _initEvent: function () {
            vc.on('listOwnerMember', 'loadOwner', function (_param) {
                vc.component._loadOwners(_param);
            });
            vc.on('listOwnerMember', 'listOwnerData', function (_param) {
                vc.component._loadOwners(_param);
            });
        },
        methods: {
            _loadOwners: function (_param) {
                if (_param.hasOwnProperty('ownerId')) {
                    vc.component.memberInfo._currentOwnerId = _param.ownerId;
                }
                var param = {
                    params: {
                        ownerId: vc.component.memberInfo._currentOwnerId,
                        communityId: vc.getCurrentCommunity().communityId

                    }
                };
                //发送get请求
                vc.http.get('listOwnerMember',
                    'list',
                    param,
                    function (json) {
                        var _memberInfo = JSON.parse(json);
                        vc.component.memberInfo.members = _memberInfo.owners;
                        $that.dealOwnerAttr(_memberInfo.owners);
                    }, function () {
                        console.log('请求失败处理');
                    });
            },
            _openDeleteOwnerModel: function (_member) {
                _member.ownerId = vc.component.memberInfo._currentOwnerId;
                vc.emit('deleteOwner', 'openOwnerModel', _member);
            },
            _openEditOwnerModel: function (_member) {
                _member.ownerId = vc.component.memberInfo._currentOwnerId;
                vc.emit('editOwner', 'openEditOwnerModal', _member);
            },
            dealOwnerAttr: function (owners) {
                owners.forEach(item => {
                    $that._getColumnsValue(item);
                });
            },
            _getColumnsValue: function (_owner) {
                _owner.listValues = [];
                if (!_owner.hasOwnProperty('ownerAttrDtos') || _owner.ownerAttrDtos.length < 1) {
                    $that.memberInfo.listColumns.forEach(_value => {
                        _owner.listValues.push('');
                    })
                    return;
                }
                let _ownerAttrDtos = _owner.ownerAttrDtos;
                $that.memberInfo.listColumns.forEach(_value => {
                    let _tmpValue = '';
                    _ownerAttrDtos.forEach(_attrItem => {
                        if (_value == _attrItem.specName) {
                            _tmpValue = _attrItem.valueName;
                        }
                    })
                    _owner.listValues.push(_tmpValue);
                })
            },
            _getColumns: function (_call) {
                console.log('_getColumns');
                $that.memberInfo.listColumns = [];
                vc.getAttrSpec('building_owner_attr', function (data) {
                    $that.memberInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.memberInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                });
                // 循环所有房屋信息
                // for (let _ownerIndex = 0; _ownerIndex < _owners.length; _ownerIndex++) {
                //     let _owner = _owners[_ownerIndex];
                //     if (!_owner.hasOwnProperty('ownerAttrDtos')) {
                //         break;
                //     }
                //     let _ownerAttrDtos = _owner.ownerAttrDto;
                //     if (_ownerAttrDtos.length < 1) {
                //         break;
                //     }
                //     //获取房屋信息中 任意属性作为 列
                //     for (let _ownerAttrIndex = 0; _ownerAttrIndex < _ownerAttrDtos.length; _ownerAttrIndex++) {
                //         let attrItem = _ownerAttrDtos[_ownerAttrIndex];
                //         if (attrItem.listShow == 'Y') {
                //             $that.ownerInfo.listColumns.push(attrItem.specName);
                //         }
                //     }
                //     if ($that.ownerInfo.listColumns.length > 0) {
                //         break;
                //     }
                // }
            }
        }
    });
})(window.vc);