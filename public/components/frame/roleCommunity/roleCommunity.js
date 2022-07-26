/**
 入驻小区
 **/
 (function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var ALL_ROWS = 100;
    vc.extends({
        data: {
            roleCommunityInfo: {
                roleCommunitys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                pgId:'',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('roleCommunityInfo', 'openRoleCommunity', function (_param) {
                vc.copyObject(_param, vc.component.roleCommunityInfo);
                vc.component._listRoleCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('roleCommunityInfo', 'listRoleCommunity', function (_param) {
                //vc.copyObject(_param, vc.component.roleCommunityInfo.conditions);
                vc.component._listRoleCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRoleCommunitys(_currentPage, DEFAULT_ROWS);
            });

        },
        methods: {
            _listRoleCommunitys: function (_page, _rows) {

                var param = {
                    params: {
                        page:_page,
                        row:_rows,
                        roleId:vc.component.roleCommunityInfo.pgId
                    }
                };

                //发送get请求
                vc.http.apiGet('/roleCommunity.listRoleCommunity',
                    param,
                    function (json, res) {
                        var _roleCommunityInfo = JSON.parse(json);
                        vc.component.roleCommunityInfo.total = _roleCommunityInfo.total;
                        vc.component.roleCommunityInfo.records = _roleCommunityInfo.records;
                        vc.component.roleCommunityInfo.roleCommunitys = _roleCommunityInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.roleCommunityInfo.records,
                            dataCount: vc.component.roleCommunityInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddRoleCommunityModal: function () {
                vc.emit('addRoleCommunity','openAddRoleCommunityModal', {
                    roleId: vc.component.roleCommunityInfo.pgId,
                    orgName: vc.component.roleCommunityInfo.orgName
                });
            },
            _openDeleteRoleCommunityModel: function (_roleCommunity) {
                vc.emit('deleteRoleCommunity','openDeleteRoleCommunityModal', _roleCommunity);
            },
            _openBeyondRoleCommunity:function(_roleCommunity){
            },
            _queryRoleCommunityMethod: function () {
                vc.component._listRoleCommunitys(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.roleCommunityInfo.moreCondition) {
                    vc.component.roleCommunityInfo.moreCondition = false;
                } else {
                    vc.component.roleCommunityInfo.moreCondition = true;
                }
            },
            _goBack:function(){
                vc.emit('orgManage','onBack',{});
            }




        }
    });
})(window.vc);
