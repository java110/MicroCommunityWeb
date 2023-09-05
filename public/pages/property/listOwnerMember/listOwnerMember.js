(function(vc) {
    //员工权限
    vc.extends({
        data: {
            memberInfo: {
                members: [],
                _currentOwnerId: '',
                listColumns: [],
                currentPage:1,
                total:0,
                records:0,
                conditions:{
                    ownerId:'',
                    nameLike:'',
                    link:'',
                    idCard:'',
                    ownerTypeCd:''
                }
            }
        },
        _initMethod: function() {
            $that._getColumns(function() {});
        },
        _initEvent: function() {
            vc.on('listOwnerMember', 'loadOwner', function(_param) {
                $that.memberInfo.conditions.ownerId = _param.ownerId;
                $that._loadOwners($that.memberInfo.currentPage,10);
            });
            vc.on('listOwnerMember', 'listOwnerData', function(_param) {
                $that.memberInfo.conditions.ownerId = _param.ownerId;
                $that._loadOwners($that.memberInfo.currentPage,10);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that.memberInfo.currentPage = _currentPage;
                $that._listOwnerData(_currentPage, 10);
            });
        },
        methods: {
            _loadOwners: function(_page,_row) {
                $that.memberInfo.conditions.page = _page;
                $that.memberInfo.conditions.row = _row;
                $that.memberInfo.conditions.communityId = vc.getCurrentCommunity().communityId;

                let param = {
                    params: $that.memberInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/owner.queryOwnerMembers',
                    param,
                    function(json) {
                        var _memberInfo = JSON.parse(json);
                        $that.memberInfo.members = _memberInfo.owners;
                        $that.dealOwnerAttr(_memberInfo.owners);
                        $that.memberInfo.total = _memberInfo.total;
                        $that.memberInfo.records = _memberInfo.records;
                        vc.emit('pagination', 'init', {
                            total: $that.memberInfo.records,
                            dataCount: $that.memberInfo.total,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    });
            },
            _queryOwnerMember:function(){
                $that._loadOwners(1,10);
            },
            _openDeleteOwnerModel: function(_member) {
                _member.ownerId = $that.memberInfo.conditions.ownerId;
                vc.emit('deleteOwner', 'openOwnerModel', _member);
            },
            _openEditOwnerMemberModel: function(_member) {
                _member.ownerId = $that.memberInfo.conditions.ownerId;
                vc.emit('editOwner', 'openEditOwnerModal', _member);
            },
            dealOwnerAttr: function(owners) {
                owners.forEach(item => {
                    $that._getColumnsValue(item);
                });
            },
            _getColumnsValue: function(_owner) {
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
            _getColumns: function(_call) {
                $that.memberInfo.listColumns = [];
                vc.getAttrSpec('building_owner_attr', function(data) {
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
            },
            _viewOwnerFace: function (_url) {
                vc.emit('viewImage', 'showImage', {
                    url: _url
                });
            },
        }
    });
})(window.vc);