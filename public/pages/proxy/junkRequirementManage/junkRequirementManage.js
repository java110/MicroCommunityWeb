/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            junkRequirementManageInfo: {
                junkRequirements: [],
                total: 0,
                records: 1,
                moreCondition: false,
                junkRequirementId: '',
                pageName: '旧货',
                conditions: {
                    classification: '',
                    publishUserName: '',
                    publishUserLink: '',
                    typeCd: '222222',
                }
            }
        },
        _initMethod: function () {
            vc.component._listJunkRequirements(DEFAULT_PAGE, DEFAULT_ROWS);
            $that.junkRequirementManageInfo.conditions.typeCd = vc.getParam('typeCd');
            if (vc.getParam('typeCd') == 333333) {
                $that.junkRequirementManageInfo.pageName = '需求';
            } else {
                $that.junkRequirementManageInfo.pageName = '旧货';
            }
        },
        _initEvent: function () {
            vc.on('junkRequirementManage', 'listJunkRequirement', function (_param) {
                vc.component._listJunkRequirements(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listJunkRequirements(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listJunkRequirements: function (_page, _rows) {
                vc.component.junkRequirementManageInfo.conditions.page = _page;
                vc.component.junkRequirementManageInfo.conditions.row = _rows;
                vc.component.junkRequirementManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.junkRequirementManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('junkRequirement.listJunkRequirements',
                    param,
                    function (json, res) {
                        var _junkRequirementManageInfo = JSON.parse(json);
                        vc.component.junkRequirementManageInfo.total = _junkRequirementManageInfo.total;
                        vc.component.junkRequirementManageInfo.records = _junkRequirementManageInfo.records;
                        vc.component.junkRequirementManageInfo.junkRequirements = _junkRequirementManageInfo.junkRequirements;
                        vc.emit('pagination', 'init', {
                            total: vc.component.junkRequirementManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddJunkRequirementModal: function () {
                vc.emit('addJunkRequirement', 'openAddJunkRequirementModal', {});
            },
            _openEditJunkRequirementModel: function (_junkRequirement) {
                vc.emit('editJunkRequirement', 'openEditJunkRequirementModal', _junkRequirement);
            },
            _openDeleteJunkRequirementModel: function (_junkRequirement) {
                vc.emit('deleteJunkRequirement', 'openDeleteJunkRequirementModal', _junkRequirement);
            },
            _queryJunkRequirementMethod: function () {
                vc.component._listJunkRequirements(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.junkRequirementManageInfo.moreCondition) {
                    vc.component.junkRequirementManageInfo.moreCondition = false;
                } else {
                    vc.component.junkRequirementManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
