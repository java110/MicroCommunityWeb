/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            auditApplicationKeyManageInfo: {
                applicationKeys: [],
                total: 0,
                records: 1,
                currentApplicationKeyId: '',
                moreCondition: false,
                conditions: {
                    name: '',
                    tel: '',
                    typeCd: '',
                    idCard: '',
                    state: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listAuditApplicationKeys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('auditApplicationKeyManage', 'listApplicationKey', function (_param) {
                vc.component._listAuditApplicationKeys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('auditApplicationKeyManage', 'notifyAuditInfo', function (_auditInfo) {
                vc.component._auditApplicationKeyState(_auditInfo);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAuditApplicationKeys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAuditApplicationKeys: function (_page, _rows) {
                vc.component.auditApplicationKeyManageInfo.conditions.page = _page;
                vc.component.auditApplicationKeyManageInfo.conditions.row = _rows;
                vc.component.auditApplicationKeyManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.auditApplicationKeyManageInfo.conditions
                };
                param.params.name = param.params.name.trim();
                param.params.tel = param.params.tel.trim();
                param.params.idCard = param.params.idCard.trim();
                //发送get请求
                vc.http.apiGet('/applicationKey.listApplicationKeys',
                    param,
                    function (json, res) {
                        var _auditApplicationKeyManageInfo = JSON.parse(json);
                        vc.component.auditApplicationKeyManageInfo.total = _auditApplicationKeyManageInfo.total;
                        vc.component.auditApplicationKeyManageInfo.records = _auditApplicationKeyManageInfo.records;
                        vc.component.auditApplicationKeyManageInfo.applicationKeys = _auditApplicationKeyManageInfo.applicationKeys;
                        vc.emit('pagination', 'init', {
                            total: vc.component.auditApplicationKeyManageInfo.records,
                            dataCount: vc.component.auditApplicationKeyManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditApplicationKeyModal: function (_applicationKey) {
                vc.component.auditApplicationKeyManageInfo.currentApplicationKeyId = _applicationKey.applicationKeyId;
                vc.emit('audit', 'openAuditModal', {});
            },
            _auditApplicationKeyState: function (_auditInfo) {
                _auditInfo.applicationKeyId = vc.component.auditApplicationKeyManageInfo.currentApplicationKeyId;
                _auditInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/applicationKey.auditApplicationKey',
                    JSON.stringify(_auditInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            vc.component._listAuditApplicationKeys(DEFAULT_PAGE, DEFAULT_ROWS);
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询
            _queryApplicationKeyMethod: function () {
                vc.component._listAuditApplicationKeys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetApplicationKeyMethod: function () {
                vc.component.auditApplicationKeyManageInfo.conditions.name = "";
                vc.component.auditApplicationKeyManageInfo.conditions.tel = "";
                vc.component.auditApplicationKeyManageInfo.conditions.state = "";
                vc.component.auditApplicationKeyManageInfo.conditions.typeCd = "";
                vc.component.auditApplicationKeyManageInfo.conditions.idCard = "";
                vc.component._listAuditApplicationKeys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.auditApplicationKeyManageInfo.moreCondition) {
                    vc.component.auditApplicationKeyManageInfo.moreCondition = false;
                } else {
                    vc.component.auditApplicationKeyManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);