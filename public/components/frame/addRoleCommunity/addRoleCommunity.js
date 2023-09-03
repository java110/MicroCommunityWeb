(function (vc) {
    var DEFAULT_ROWS = 10
    vc.extends({
        propTypes: {
            emitListener: vc.propTypes.string,
            emitFunction: vc.propTypes.string
        },
        data: {
            addRoleCommunityInfo: {
                communitys: [],
                communityName: '',
                roleId: '',
                orgName: '',
                selectCommunitys: []
            }
        },
        watch: { // 监视双向绑定的数据数组
            checkData: {
                handler() { // 数据数组有变化将触发此函数
                    if (vc.component.addRoleCommunityInfo.selectCommunitys.length == vc.component.addRoleCommunityInfo.communitys.length) {
                        document.querySelector('#quan').checked = true;
                    } else {
                        document.querySelector('#quan').checked = false;
                    }
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addRoleCommunity', 'openAddRoleCommunityModal', function (_param) {
                vc.component._refreshChooseCommunityInfo();
                $('#addRoleCommunityModel').modal('show');
                vc.copyObject(_param, vc.component.addRoleCommunityInfo);
                vc.component._loadAllCommunityInfo(1, 10, '');
            });
            vc.on('addRoleCommunity', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadAllCommunityInfo(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadAllCommunityInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        nameLike: _name,
                        roleId: vc.component.addRoleCommunityInfo.roleId
                    }
                };
                //发送get请求
                vc.http.apiGet('/org.listOrgNoCommunitys',
                    param,
                    function (json) {
                        var _communityInfo = JSON.parse(json);
                        vc.component.addRoleCommunityInfo.communitys = _communityInfo.communitys;
                        vc.emit('addRoleCommunity', 'paginationPlus', 'init', {
                            total: _communityInfo.records,
                            dataCount: _communityInfo.total,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            addRoleCommunity: function (_org) {
                var _selectCommunitys = vc.component.addRoleCommunityInfo.selectCommunitys;
                var _tmpCommunitys = vc.component.addRoleCommunityInfo.communitys;
                if (_selectCommunitys.length < 1) {
                    vc.toast("请选择小区");
                    return;
                }
                var _communitys = [];
                for (var _selectIndex = 0; _selectIndex < _selectCommunitys.length; _selectIndex++) {
                    for (var _communityIndex = 0; _communityIndex < _tmpCommunitys.length; _communityIndex++) {
                        if (_selectCommunitys[_selectIndex] == _tmpCommunitys[_communityIndex].communityId) {
                            _communitys.push({
                                communityId: _tmpCommunitys[_communityIndex].communityId,
                                communityName: _tmpCommunitys[_communityIndex].name
                            });
                        }
                    }
                }
                var _objData = {
                    roleId: vc.component.addRoleCommunityInfo.roleId,
                    orgName: vc.component.addRoleCommunityInfo.orgName,
                    communitys: _communitys
                }
                vc.http.apiPost('/roleCommunity.saveRoleCommunity',
                    JSON.stringify(_objData),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        $('#addRoleCommunityModel').modal('hide');
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            vc.component.addRoleCommunityInfo.selectCommunitys = [];
                            vc.emit($props.emitListener, $props.emitFunction, {});
                            vc.toast("关联成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
                // $('#addRoleCommunityModel').modal('hide');
            },
            queryCommunitys: function () {
                vc.component._loadAllCommunityInfo(1, 10, vc.component.addRoleCommunityInfo.communityName);
            },
            _refreshChooseCommunityInfo: function () {
                vc.component.addRoleCommunityInfo = {
                    communitys: [],
                    communityName: '',
                    roleId: '',
                    orgName: '',
                    selectCommunitys: []
                };
            },
            checkAllCommunity: function (e) {
                var checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            vc.component.addRoleCommunityInfo.selectCommunitys.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.addRoleCommunityInfo.selectCommunitys = [];
                }
            }
        }
    });
})(window.vc);
