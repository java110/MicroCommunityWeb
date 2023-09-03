/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            accessControlWhiteManageInfo: {
                accessControlWhites: [],
                total: 0,
                records: 1,
                moreCondition: false,
                acwId: '',
                conditions: {
                    machineId: '',
                    personNameLike: '',
                    tel: '',
                    personType: '',
                    communityId: vc.getCurrentCommunity().communityId
                },
                personTypes: [],
                machines: []
            }
        },
        _initMethod: function () {
            vc.getDict('access_control_white', "person_type", function (_data) {
                _data.unshift({
                    name: '全部人员',
                    statusCd: ''
                })
                $that.accessControlWhiteManageInfo.personTypes = _data;
            });
            $that._listMachines();
            vc.component._listAccessControlWhites(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('accessControlWhiteManage', 'listAccessControlWhite', function (_param) {
                vc.component._listAccessControlWhites(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAccessControlWhites(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            swatchPersonType: function (_item) {
                $that.accessControlWhiteManageInfo.conditions.personType = _item.statusCd;
                vc.component._listAccessControlWhites(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listAccessControlWhites: function (_page, _rows) {
                vc.component.accessControlWhiteManageInfo.conditions.page = _page;
                vc.component.accessControlWhiteManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.accessControlWhiteManageInfo.conditions
                };
                param.params.personNameLike = param.params.personNameLike.trim();
                param.params.tel = param.params.tel.trim();
                //发送get请求
                vc.http.apiGet('/machine.listAccessControlWhite',
                    param,
                    function (json, res) {
                        var _accessControlWhiteManageInfo = JSON.parse(json);
                        vc.component.accessControlWhiteManageInfo.total = _accessControlWhiteManageInfo.total;
                        vc.component.accessControlWhiteManageInfo.records = _accessControlWhiteManageInfo.records;
                        vc.component.accessControlWhiteManageInfo.accessControlWhites = _accessControlWhiteManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.accessControlWhiteManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddAccessControlWhiteModal: function () {
                //vc.emit('addAccessControlWhite', 'openAddAccessControlWhiteModal', {});
                vc.jumpToPage('/#/pages/machine/addAccessControlWhite')
            },
            _openEditAccessControlWhiteModel: function (_accessControlWhite) {
                vc.emit('editAccessControlWhite', 'openEditAccessControlWhiteModal', _accessControlWhite);
            },
            _openDeleteAccessControlWhiteModel: function (_accessControlWhite) {
                vc.emit('deleteAccessControlWhite', 'openDeleteAccessControlWhiteModal', _accessControlWhite);
            },
            //查询
            _queryAccessControlWhiteMethod: function () {
                vc.component._listAccessControlWhites(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAccessControlWhiteMethod: function () {
                vc.component.accessControlWhiteManageInfo.conditions.machineId = "";
                vc.component.accessControlWhiteManageInfo.conditions.personNameLike = "";
                vc.component.accessControlWhiteManageInfo.conditions.tel = "";
                vc.component._listAccessControlWhites(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.accessControlWhiteManageInfo.moreCondition) {
                    vc.component.accessControlWhiteManageInfo.moreCondition = false;
                } else {
                    vc.component.accessControlWhiteManageInfo.moreCondition = true;
                }
            },
            showImg: function (e) {
                if (!e) {
                    e = '/img/noPhoto.jpg';
                }
                vc.emit('viewImage', 'showImage', {url: e});
            },
            _listMachines: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        machineTypeCd: '9999',
                        domain: 'ACCESS_CONTROL',
                    }
                };
                //发送get请求
                vc.http.apiGet('/machine.listMachines',
                    param,
                    function (json, res) {
                        let _accessControlMachineManageInfo = JSON.parse(json);
                        $that.accessControlWhiteManageInfo.machines = _accessControlMachineManageInfo.machines;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _viewAuth:function(_accessControlWhite){
                vc.jumpToPage('/#/pages/machine/accessControlWhiteAuthManage?acwId='+_accessControlWhite.acwId)
            }
        }
    });
})(window.vc);
