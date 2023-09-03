/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            initializeCommunityManageInfo: {
                initializeCommunitys: [],
                total: 0,
                records: 1,
                storeTypeCd: vc.getData('/nav/getUserInfo').storeTypeCd,
                devPassword: '',
                msgData: '',
                conditions: {
                    name: '',
                    cityCode: '',
                    communityId: ''
                },
                listColumns: []
            }
        },
        _initMethod: function () {
            vc.component._listCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('initializeCommunityManage', 'listCommunity', function (_param) {
                vc.component._listCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on("chooseinitializeCommunity", "chooseinitializeCommunity", function (_param) {
                $that._initializeCommunity(_param);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listCommunitys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listCommunitys: function (_page, _rows) {
                vc.component.initializeCommunityManageInfo.conditions.page = _page;
                vc.component.initializeCommunityManageInfo.conditions.row = _rows;
                let _param = {
                    params: vc.component.initializeCommunityManageInfo.conditions
                }
                _param.params.name = _param.params.name.trim();
                _param.params.communityId = _param.params.communityId.trim();
                //发送get请求
                vc.http.apiGet('/community.listCommunitys',
                    _param,
                    function (json, res) {
                        var _initializeCommunityManageInfo = JSON.parse(json);
                        vc.component.initializeCommunityManageInfo.total = _initializeCommunityManageInfo.total;
                        vc.component.initializeCommunityManageInfo.records = _initializeCommunityManageInfo.records;
                        vc.component.initializeCommunityManageInfo.initializeCommunitys = _initializeCommunityManageInfo.communitys;
                        vc.emit('pagination', 'init', {
                            total: vc.component.initializeCommunityManageInfo.records,
                            dataCount: vc.component.initializeCommunityManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initializeCommunity: function (_community) {
                var _param = {
                    communityId: _community.communityId,
                    devPassword: _community._devPassword
                }
                vc.http.apiPost(
                    '/initializeBuildingUnit/deleteBuildingUnit',
                    JSON.stringify(_param), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.component.initializeCommunityManageInfo.msgData = _json.data;
                            //关闭model
                            vc.emit('initializeCommunityManage', 'listCommunity', {});
                            vc.toast("删除成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询
            _queryCommunitys: function () {
                vc.component._listCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetCommunitys: function () {
                vc.component.initializeCommunityManageInfo.conditions.communityId = ""
                vc.component.initializeCommunityManageInfo.conditions.name = ""
                vc.component._listCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openChooseinInitializeCommunity: function (_initializeCommunity) {
                vc.emit('chooseinitializeCommunity', 'openChooseinitializeCommunityModel', {_initializeCommunity});
            }
        }
    });
})(window.vc);