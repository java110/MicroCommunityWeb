(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyOwnerMemberInfo: {
                members: [],
                ownerId: '',
                listColumns: []
            }
        },
        _initMethod: function () {
            $that._getSimplifyOwnerMemberColumns(function () {
            });
        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyOwnerMember', 'switch', function (_param) {
                if (_param.ownerId == '') {
                    return;
                }
                $that.clearSimplifyOwnerMemberInfo();
                vc.copyObject(_param, $that.simplifyOwnerMemberInfo)
                $that._listSimplifyOwnerMember(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyOwnerMember', 'listOwnerData', function (_param) {
                $that._listSimplifyOwnerMember(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event',
                function (_currentPage) {
                    $that._listSimplifyOwnerMember(_currentPage, DEFAULT_ROWS);
                }
            );
        },
        methods: {
            _listSimplifyOwnerMember: function (_param) {
                let param = {
                    params: {
                        ownerId: vc.component.simplifyOwnerMemberInfo.ownerId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/owner.queryOwnerMembers',
                    param,
                    function (json) {
                        let _simplifyOwnerMemberInfo = JSON.parse(json);
                        $that.simplifyOwnerMemberInfo.members = _simplifyOwnerMemberInfo.owners;
                        $that.dealSimplifyOwnerMemberAttr(_simplifyOwnerMemberInfo.owners);
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            openAddMemberModel() {
                vc.emit('addOwner', 'openAddOwnerModal', vc.component.simplifyOwnerMemberInfo.ownerId);
            },
            _openDeleteOwnerModel: function (_member) {
                _member.ownerId = vc.component.simplifyOwnerMemberInfo.ownerId;
                vc.emit('deleteOwner', 'openOwnerModel', _member);
            },
            _openEditOwnerModel: function (_member) {
                _member.ownerId = vc.component.simplifyOwnerMemberInfo.ownerId;
                vc.emit('editOwner', 'openEditOwnerModal', _member);
            },
            clearSimplifyOwnerMemberInfo: function () {
                let _listColumns = $that.simplifyOwnerMemberInfo.listColumns;
                $that.simplifyOwnerMemberInfo = {
                    members: [],
                    ownerId: '',
                    listColumns: _listColumns
                }
            },
            dealSimplifyOwnerMemberAttr: function (owners) {
                owners.forEach(item => {
                    $that._getSimplifyOwnerMemberColumnsValue(item);
                });
            },
            _getSimplifyOwnerMemberColumnsValue: function (_owner) {
                _owner.listValues = [];
                if (!_owner.hasOwnProperty('ownerAttrDtos') || _owner.ownerAttrDtos.length < 1) {
                    $that.simplifyOwnerMemberInfo.listColumns.forEach(_value => {
                        _owner.listValues.push('');
                    })
                    return;
                }
                let _ownerAttrDtos = _owner.ownerAttrDtos;
                $that.simplifyOwnerMemberInfo.listColumns.forEach(_value => {
                    let _tmpValue = '';
                    _ownerAttrDtos.forEach(_attrItem => {
                        if (_value == _attrItem.specName) {
                            _tmpValue = _attrItem.valueName;
                        }
                    })
                    _owner.listValues.push(_tmpValue);
                })
            },
            _getSimplifyOwnerMemberColumns: function (_call) {
                $that.simplifyOwnerMemberInfo.listColumns = [];
                vc.getAttrSpec('building_owner_attr', function (data) {
                    $that.simplifyOwnerMemberInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.simplifyOwnerMemberInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                });
            }
        }
    });
})(window.vc);