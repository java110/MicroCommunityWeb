/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            propertyRightRegistrationManageInfo: {
                propertyRightRegistrations: [],
                total: 0,
                records: 1,
                moreCondition: false,
                prrId: '',
                states: [],
                floors: [],
                units: [],
                conditions: {
                    roomId: '',
                    roomNum: '',
                    unitNum: '',
                    floorNum: '',
                    allNum: '',
                    name: '',
                    link: '',
                    idCard: '',
                    address: '',
                    idCardUrl: '',
                    housePurchaseUrl: '',
                    repairUrl: '',
                    deedTaxUrl: '',
                    state: '',
                    floorId: '',
                    unitId: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component.selectFloor();
            vc.component._listPropertyRightRegistrations(DEFAULT_PAGE, DEFAULT_ROWS);
            //与字典表费用类型关联
            vc.getDict('property_right_registration', "state", function (_data) {
                vc.component.propertyRightRegistrationManageInfo.states = _data;
            });
        },
        _initEvent: function () {
            vc.on('propertyRightRegistrationManage', 'listPropertyRightRegistration', function (_param) {
                vc.component._listPropertyRightRegistrations(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listPropertyRightRegistrations(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listPropertyRightRegistrations: function (_page, _rows) {
                vc.component.propertyRightRegistrationManageInfo.conditions.page = _page;
                vc.component.propertyRightRegistrationManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.propertyRightRegistrationManageInfo.conditions
                };
                param.params.roomNum = param.params.roomNum.trim();
                param.params.unitNum = param.params.unitNum.trim();
                param.params.floorNum = param.params.floorNum.trim();
                param.params.roomId = param.params.roomId.trim();
                param.params.allNum = param.params.allNum.trim();
                param.params.name = param.params.name.trim();
                param.params.link = param.params.link.trim();
                param.params.address = param.params.address.trim();
                param.params.idCard = param.params.idCard.trim();
                let _allNum = $that.propertyRightRegistrationManageInfo.conditions.allNum;
                if (_allNum.split('-').length == 3) {
                    let _allNums = _allNum.split('-');
                    param.params.floorNum = _allNums[0].trim();
                    param.params.unitNum = _allNums[1].trim();
                    param.params.roomNum = _allNums[2].trim();
                } else {
                    param.params.floorNum = "";
                    param.params.unitNum = "";
                    param.params.roomNum = "";
                }
                //发送get请求
                vc.http.apiGet('propertyRightRegistration.listPropertyRightRegistration',
                    param,
                    function (json, res) {
                        var _propertyRightRegistrationManageInfo = JSON.parse(json);
                        vc.component.propertyRightRegistrationManageInfo.total = _propertyRightRegistrationManageInfo.total;
                        vc.component.propertyRightRegistrationManageInfo.records = _propertyRightRegistrationManageInfo.records;
                        vc.component.propertyRightRegistrationManageInfo.propertyRightRegistrations = _propertyRightRegistrationManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.propertyRightRegistrationManageInfo.records,
                            dataCount: vc.component.propertyRightRegistrationManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddPropertyRightRegistrationModal: function () {
                vc.emit('addPropertyRightRegistration', 'openAddPropertyRightRegistrationModal', {});
            },
            _openEditPropertyRightRegistrationModel: function (_propertyRightRegistration) {
                vc.emit('editPropertyRightRegistration', 'openEditPropertyRightRegistrationModal', _propertyRightRegistration);
            },
            _openDeletePropertyRightRegistrationModel: function (_propertyRightRegistration) {
                vc.emit('deletePropertyRightRegistration', 'openDeletePropertyRightRegistrationModal', _propertyRightRegistration);
            },
            //查询
            _queryPropertyRightRegistrationMethod: function () {
                vc.component._listPropertyRightRegistrations(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetPropertyRightRegistrationMethod: function () {
                vc.component.propertyRightRegistrationManageInfo.conditions.roomId = "";
                vc.component.propertyRightRegistrationManageInfo.conditions.roomNum = "";
                vc.component.propertyRightRegistrationManageInfo.conditions.unitNum = "";
                vc.component.propertyRightRegistrationManageInfo.conditions.floorNum = "";
                vc.component.propertyRightRegistrationManageInfo.conditions.allNum = "";
                vc.component.propertyRightRegistrationManageInfo.conditions.name = "";
                vc.component.propertyRightRegistrationManageInfo.conditions.link = "";
                vc.component.propertyRightRegistrationManageInfo.conditions.idCard = "";
                vc.component.propertyRightRegistrationManageInfo.conditions.address = "";
                vc.component.propertyRightRegistrationManageInfo.conditions.state = "";
                vc.component.propertyRightRegistrationManageInfo.conditions.floorId = "";
                vc.component.propertyRightRegistrationManageInfo.floors = [];
                vc.component.propertyRightRegistrationManageInfo.conditions.unitId = "";
                vc.component.propertyRightRegistrationManageInfo.units = [];
                vc.component.selectFloor();
                vc.component._listPropertyRightRegistrations(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询楼栋
            selectFloor: function () {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50
                    }
                };
                vc.http.apiGet(
                    '/floor.queryFloors',
                    param,
                    function (json, res) {
                        var listFloorData = JSON.parse(json);
                        vc.component.propertyRightRegistrationManageInfo.floors = listFloorData.apiFloorDataVoList;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //查询单元
            selectUnit: function () {
                var param = {
                    params: {
                        floorId: vc.component.propertyRightRegistrationManageInfo.conditions.floorId,
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50
                    }
                };
                vc.http.apiGet('/unit.queryUnits',
                    param,
                    function (json, res) {
                        var listUnitData = JSON.parse(json);
                        vc.component.propertyRightRegistrationManageInfo.units = listUnitData;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            //详情
            _openPropertyRightRegistrationDetail: function (_propertyRightRegistration) {
                vc.jumpToPage('/#/pages/property/listPropertyRightRegistrationDetail?prrId=' + _propertyRightRegistration.prrId +
                    "&floorNum=" + _propertyRightRegistration.floorNum + "&unitNum=" + _propertyRightRegistration.unitNum + "&roomNum=" + _propertyRightRegistration.roomNum);
            },
            //审核
            _openExaminePropertyRightRegistration: function (_propertyRightRegistration) {
                vc.emit('examinePropertyRightRegistration', 'openExaminePropertyRightRegistrationModal', _propertyRightRegistration);
            },
            _moreCondition: function () {
                if (vc.component.propertyRightRegistrationManageInfo.moreCondition) {
                    vc.component.propertyRightRegistrationManageInfo.moreCondition = false;
                } else {
                    vc.component.propertyRightRegistrationManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);