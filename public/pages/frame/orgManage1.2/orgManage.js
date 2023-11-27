/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var ALL_ROWS = 100;
    vc.extends({
        data: {
            orgManageInfo: {
                orgs: [],
                total: 0,
                records: 1,
                currentSelectOrgId: "-1",
                moreCondition: false,
                showBelongCommunity: false,
                orgName: '',
                headOrg: [],
                branchOrg: [],
                orgTree: [],
                currentBelongCommunityId: '',
                conditions: {
                    orgId: '',
                    orgName: '',
                    communityId: '',
                    orgLevel: '',
                    parentOrgId: ''
                }
            }
        },
        watch: {
            "orgManageInfo.conditions.headOrgId": { //深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    $that._getOrgsByOrgLevel(DEFAULT_PAGE, DEFAULT_ROWS, 2, val);
                    $that.orgManageInfo.conditions.parentOrgId = val;
                    $that.orgManageInfo.conditions.branchOrgId = '';
                    $that._listOrgs(DEFAULT_PAGE, DEFAULT_ROWS);
                },
                deep: true
            },
            "orgManageInfo.conditions.branchOrgId": { //深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    if (val == '') {
                        $that.orgManageInfo.conditions.parentOrgId = $that.orgManageInfo.conditions.headOrgId;
                    } else {
                        $that.orgManageInfo.conditions.parentOrgId = val;
                    }
                    $that._listOrgs(DEFAULT_PAGE, DEFAULT_ROWS);
                },
                deep: true
            }
        },
        _initMethod: function () {
            //只查 查询总公司级组织
            $that.orgManageInfo.orgTree = [];
            $that._listOrgTrees($that.orgManageInfo.orgTree, '1', '', function () {
                $that._loadBranchOrgTrees();
            });
            $that._getOrgsByOrgLevel(DEFAULT_PAGE, DEFAULT_ROWS, 1, '');
            $that._loadAddCommunitys();
        },
        _initEvent: function () {
            vc.on('orgManage', 'listOrg', function (_param) {
                //vc.copyObject(_param, $that.orgManageInfo.conditions);
                $that._listOrgs(DEFAULT_PAGE, DEFAULT_ROWS);
                $that.orgManageInfo.orgTree = [];
                $that._listOrgTrees($that.orgManageInfo.orgTree, '1', '', function () {
                    $that._loadBranchOrgTrees();
                });
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listOrgs(_currentPage, DEFAULT_ROWS);
            });
            vc.on('orgManage', 'onBack', function (_param) {
                $that.orgManageInfo.showBelongCommunity = false;
            })
        },
        methods: {
            _refreshOrgTree: function () {
                $('#orgTree').treeview({
                    data: $that.orgManageInfo.orgTree,
                    selectedBackColor: '#1ab394'
                });
                $('#orgTree').on('nodeSelected', function (event, data) {
                    console.log(event, data);
                    $that.orgManageInfo.currentSelectOrgId = data.orgId;
                    $that.orgManageInfo.conditions.orgLevel = (parseInt(data.orgLevel) + 1);
                    $that.orgManageInfo.conditions.parentOrgId = data.orgId;
                    $that.orgManageInfo.currentBelongCommunityId = data.belongCommunityId;
                    $that._listOrgs(DEFAULT_PAGE, DEFAULT_ROWS);
                });
                //  if($that.orgManageInfo.currentSelectOrgId == '-1'){
                //    console.log('是否进入');
                //    $('#orgTree').treeview("selectNode", [0]);
                //  }
            },
            _loadBranchOrgTrees: function () {
                //默认查询分公司组织信息
                $that._listOrgTrees($that.orgManageInfo.orgTree[0].nodes,
                    '2',
                    $that.orgManageInfo.orgTree[0].orgId,
                    function (_tmpOrgs) {
                        $that._refreshOrgTree();
                    });
            },
            _listOrgTrees: function (_nodes, _orgLevel, _parentOrgId, _callback) {
                var param = {
                    params: {
                        page: DEFAULT_PAGE,
                        row: ALL_ROWS,
                        orgLevel: _orgLevel,
                        parentOrgId: _parentOrgId
                    }
                };
                //发送get请求
                vc.http.apiGet('/org.listOrgs',
                    param,
                    function (json, res) {
                        var _tmpOrgs = JSON.parse(json).orgs;
                        _tmpOrgs.forEach(function (_item) {
                            var _selected = false;
                            var _currentSelectOrgId = $that.orgManageInfo.currentSelectOrgId;
                            if (_currentSelectOrgId == '-1' && _orgLevel == 1) {
                                _selected = true;
                                $that.orgManageInfo.currentSelectOrgId = _item.orgId;
                                $that.orgManageInfo.conditions.orgLevel = (parseInt(_item.orgLevel) + 1);
                                $that.orgManageInfo.conditions.parentOrgId = _item.orgId;
                                $that.orgManageInfo.currentBelongCommunityId = _item.belongCommunityId;
                                $that._listOrgs(DEFAULT_PAGE, DEFAULT_ROWS);
                            } else if (_item.orgId == $that.orgManageInfo.currentSelectOrgId) {
                                _selected = true;
                            }
                            _nodes.push({
                                orgId: _item.orgId,
                                orgLevel: _orgLevel,
                                text: _item.orgLevelName + '|' + _item.orgName,
                                belongCommunityId: _item.belongCommunityId,
                                href: function (_item) {
                                },
                                state: {
                                    selected: _selected
                                },
                                tags: [0],
                                nodes: []
                            });
                            _callback();
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listOrgs: function (_page, _rows) {
                $that.orgManageInfo.conditions.page = _page;
                $that.orgManageInfo.conditions.row = _rows;
                var param = {
                    params: $that.orgManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/org.listOrgs',
                    param,
                    function (json, res) {
                        var _orgManageInfo = JSON.parse(json);
                        $that.orgManageInfo.total = _orgManageInfo.total;
                        $that.orgManageInfo.records = _orgManageInfo.records;
                        $that.orgManageInfo.orgs = _orgManageInfo.orgs;
                        vc.emit('pagination', 'init', {
                            total: $that.orgManageInfo.records,
                            dataCount: $that.orgManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddOrgModal: function () {
                vc.emit('addOrg', 'openAddOrgModal', {
                    parentOrgId: $that.orgManageInfo.conditions.parentOrgId,
                    orgLevel: $that.orgManageInfo.conditions.orgLevel,
                    belongCommunityId: $that.orgManageInfo.currentBelongCommunityId
                });
            },
            _openEditOrgModel: function (_org) {
                vc.emit('editOrg', 'openEditOrgModal', _org);
            },
            _openDeleteOrgModel: function (_org) {
                vc.emit('deleteOrg', 'openDeleteOrgModal', _org);
            },
            _openBeyondCommunity: function (_org) {
                $that.orgManageInfo.showBelongCommunity = true;
                vc.emit('orgCommunityManageInfo', 'openOrgCommunity', _org);
            },
            //查询
            _queryOrgMethod: function () {
                $that._listOrgs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetOrgMethod: function () {
                $that.orgManageInfo.conditions.orgId = "";
                $that.orgManageInfo.conditions.orgName = "";
                $that.orgManageInfo.conditions.communityId = "";
                $that._listOrgs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.orgManageInfo.moreCondition) {
                    $that.orgManageInfo.moreCondition = false;
                } else {
                    $that.orgManageInfo.moreCondition = true;
                }
            },
            _getOrgsByOrgLevel: function (_page, _rows, _orgLevel, _parentOrgId) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        orgLevel: _orgLevel,
                        parentOrgId: _parentOrgId
                    }
                };
                //发送get请求
                vc.http.apiGet('/org.listOrgs',
                    param,
                    function (json, res) {
                        var _orgManageInfo = JSON.parse(json);
                        if (_orgLevel == 1) {
                            $that.orgManageInfo.headOrg = _orgManageInfo.orgs;
                        } else {
                            $that.orgManageInfo.branchOrg = _orgManageInfo.orgs;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadAddCommunitys: function () {
                let param = {
                    params: {
                        _uId: 'ccdd00opikookjuhyyttvhnnjuuu',
                        page: 1,
                        row: 50
                    }
                };
                vc.http.apiGet('/community.listMyEnteredCommunitys',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            let _communityInfos = JSON.parse(json).communitys;
                            $that.orgManageInfo.communitys = _communityInfos;
                        }
                    },
                    function () {
                        console.log('请求失败处理');
                        vc.jumpToPage(_param.url);
                    }
                );
            },
        }
    });
})(window.vc);