/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerCommitteeManageInfo: {
                ownerCommittees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                ocId: '',
                conditions: {
                    name: '',
                    link: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listOwnerCommittees(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('ownerCommitteeManage', 'listOwnerCommittee', function (_param) {
                vc.component._listOwnerCommittees(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listOwnerCommittees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOwnerCommittees: function (_page, _rows) {
                vc.component.ownerCommitteeManageInfo.conditions.page = _page;
                vc.component.ownerCommitteeManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.ownerCommitteeManageInfo.conditions
                };
                param.params.name = param.params.name.trim();
                param.params.link = param.params.link.trim();
                //发送get请求
                vc.http.apiGet('/ownerCommittee.listOwnerCommittee',
                    param,
                    function (json, res) {
                        let _ownerCommitteeManageInfo = JSON.parse(json);
                        vc.component.ownerCommitteeManageInfo.total = _ownerCommitteeManageInfo.total;
                        vc.component.ownerCommitteeManageInfo.records = _ownerCommitteeManageInfo.records;
                        vc.component.ownerCommitteeManageInfo.ownerCommittees = _ownerCommitteeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.ownerCommitteeManageInfo.records,
                            dataCount: vc.component.ownerCommitteeManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddOwnerCommitteeModal: function () {
                vc.jumpToPage('/#/pages/owner/addOwnerCommittee')
            },
            _openEditOwnerCommitteeModel: function (_ownerCommittee) {
                //vc.emit('editOwnerCommittee', 'openEditOwnerCommitteeModal', _ownerCommittee);
                vc.jumpToPage('/#/pages/owner/editOwnerCommittee?ocId=' + _ownerCommittee.ocId);
            },
            _openDeleteOwnerCommitteeModel: function (_ownerCommittee) {
                vc.emit('deleteOwnerCommittee', 'openDeleteOwnerCommitteeModal', _ownerCommittee);
            },
            _openOwnerCommitteeDetail: function (_ownerCommittee) {
                //vc.emit('editOwnerCommittee', 'openEditOwnerCommitteeModal', _ownerCommittee);
                vc.jumpToPage('/#/pages/owner/ownerCommitteeDetail?ocId=' + _ownerCommittee.ocId);
            },
            _queryOwnerCommitteeMethod: function () {
                vc.component._listOwnerCommittees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _resetOwnerCommitteeMethod: function () {
                vc.component.ownerCommitteeManageInfo.conditions.name = "";
                vc.component.ownerCommitteeManageInfo.conditions.link = "";
                vc.component.ownerCommitteeManageInfo.conditions.state = "";
                vc.component._listOwnerCommittees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.ownerCommitteeManageInfo.moreCondition) {
                    vc.component.ownerCommitteeManageInfo.moreCondition = false;
                } else {
                    vc.component.ownerCommitteeManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);