/**
 入驻园区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    vc.extends({
        data: {
            equipmentAccountManageInfo: {
                currentPage: '1',
                equipmentAccounts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                showFlag: false,
                machineId: '',
                machineIds: [],
                conditions: {
                    machineName: '',
                    machineCode: '',
                    locationObjId: '',
                    releaseUserName: '',
                    state: '',
                    importanceLevel: '',
                    chargeOrgId: '',
                    firstEnableTime: '',
                    typeId: ''
                },
                useStatus: [],
                importanceLevels: []
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('equipment_account', "state", function (_data) {
                vc.component.equipmentAccountManageInfo.useStatus = _data;
            });
            //与字典表关联
            vc.getDict('equipment_account', "importance_level", function (_data) {
                vc.component.equipmentAccountManageInfo.importanceLevels = _data;
            });
            //根据 参数查询相应数据
            //vc.component._loadDataByParam();
            // vc.emit('roomNewTree', 'openRoomTree', {
            //     callName: 'equipmentAccount'
            // });
        },
        _initEvent: function () {
            vc.component._listEquipmentAccounts(DEFAULT_PAGE, DEFAULT_ROW);
            vc.on('equipmentAccount', 'switchType', function (_param) {
                vc.component.equipmentAccountManageInfo.conditions.typeId = _param.typeId;
                vc.component.equipmentAccountManageInfo.conditions.typeName = _param.typeName;
                vc.component.equipmentAccountManageInfo.conditions.flag = 1;
                $that.equipmentAccountManageInfo.conditions.locationObjId = '';
                vc.component._listEquipmentAccounts(DEFAULT_PAGE, DEFAULT_ROW);
                vc.component.equipmentAccountManageInfo.machineIds = [];
            });
            vc.on('equipmentAccount', 'changeRoom', function (_param) {
                console.log("就是我呀", _param)
            });
            vc.on('equipmentAccount', 'listEquipmentAccounts', function (_param) {
                vc.component.equipmentAccountManageInfo.machineIds = [];
                $that.equipmentAccountManageInfo.conditions.locationObjId = '';
                vc.component._listEquipmentAccounts($that.equipmentAccountManageInfo.currentPage, DEFAULT_ROW);
            });
            vc.on('equipmentAccount', 'loadData', function (_param) {
                vc.component.equipmentAccountManageInfo.machineIds = [];
                $that.equipmentAccountManageInfo.conditions.locationObjId = '';
                vc.component._listEquipmentAccounts($that.equipmentAccountManageInfo.currentPage, DEFAULT_ROW);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that.equipmentAccountManageInfo.currentPage = _currentPage;
                vc.component._listEquipmentAccounts(_currentPage, DEFAULT_ROW);
                vc.component.equipmentAccountManageInfo.machineIds = [];
            });
            vc.on('equipmentAccount', 'selectAction', function (_id) {
                vc.component.equipmentAccountManageInfo.machineIds = [];
                vc.component.equipmentAccountManageInfo.conditions.typeId = '';
                $that.equipmentAccountManageInfo.conditions.locationObjId = _id;
                vc.component._listEquipmentAccounts($that.equipmentAccountManageInfo.currentPage, DEFAULT_ROW);
            })
        },
        methods: {
            _listEquipmentAccounts: function (_page, _row) {
                vc.component.equipmentAccountManageInfo.conditions.page = _page;
                vc.component.equipmentAccountManageInfo.conditions.row = _row;
                vc.component.equipmentAccountManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: JSON.parse(JSON.stringify(vc.component.equipmentAccountManageInfo.conditions))
                };
                //发送get请求
                vc.http.apiGet('equipmentAccount.listEquipmentAccount',
                    param,
                    function (json, res) {
                        var _equipmentAccountManageInfo = JSON.parse(json);
                        vc.component.equipmentAccountManageInfo.total = _equipmentAccountManageInfo.total;
                        vc.component.equipmentAccountManageInfo.records = _equipmentAccountManageInfo.records;
                        vc.component.equipmentAccountManageInfo.equipmentAccounts = _equipmentAccountManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.equipmentAccountManageInfo.records,
                            dataCount: vc.component.equipmentAccountManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddEquipmentAccountModal: function () {
                if (!$that.equipmentAccountManageInfo.conditions.typeId) {
                    vc.toast('请先选择设备分类');
                    return;
                }
                vc.jumpToPage('/#/pages/property/addEquipmentAccount?typeId=' + $that.equipmentAccountManageInfo.conditions.typeId)
            },
            _openEditEquipmentAccountModel: function (_equipmentAccount) {
                vc.jumpToPage('/#/pages/property/editEquipmentAccount?machineId=' + _equipmentAccount.machineId);
            },
            _openChangeStateEquipmentModel: function (_equipmentAccount) {
                vc.emit('changeStateEquipment', 'openChangeStateEquipmentModal', _equipmentAccount);
            },
            _openMoveEquipmentModel: function (_equipmentAccount) {
                vc.emit('moveEquipment', 'openMoveEquipmentModal', _equipmentAccount);
            },
            _openEquipmentAccountDetail: function (_equipmentAccount) {
                vc.jumpToPage('/#/pages/property/equipmentAccountDetail?machineId=' + _equipmentAccount.machineId)
            },
            _openDeleteEquipmentAccountModel: function (_equipmentAccount) {
                vc.emit('deleteEquipmentAccount', 'openDeleteEquipmentAccountModal', _equipmentAccount);
            },
            _printEquipmentAccountInfoLabel: function (_equipmentAccount) {
                vc.emit('printEquipmentAccount', 'openPrintEquipmentAccountModal', _equipmentAccount);
            },
            /**
             * 新增打印功能，跳转打印页面
             */
            _printEquipmentAccount: function (_equipmentAccount) {
                window.open("/print.html#/pages/property/printEquipmentAccountLabel?machineId=" + _equipmentAccount.machineId)
            },
            // _openEquipmentAccountInfoModel: function (_equipmentAccount) {
            //     vc.emit('viewEquipmentAccount', 'openViewEquipmentAccountModal', _equipmentAccount);
            // },
            //查询
            _queryEquipmentAccountMethod: function () {
                vc.component._listEquipmentAccounts(DEFAULT_PAGE, DEFAULT_ROW);
            },
            //重置
            _resetEquipmentAccountMethod: function () {
                vc.component.equipmentAccountManageInfo.conditions.machineName = "";
                vc.component.equipmentAccountManageInfo.conditions.machineCode = "";
                vc.component.equipmentAccountManageInfo.conditions.state = "";
                vc.component.equipmentAccountManageInfo.conditions.importanceLevel = "";
                vc.component._listEquipmentAccounts(DEFAULT_PAGE, DEFAULT_ROW);
            },
            _exportEquipmentAccount: function () {
                vc.jumpToPage('/callComponent/importExportEquipment/exportData?communityId=' + vc.getCurrentCommunity().communityId + "&pagePath=equipmentAccount" + "&typeId=" +
                    $that.equipmentAccountManageInfo.conditions.typeId + "&machineIds=" + $that.equipmentAccountManageInfo.machineIds);
            },
            _openImportEquipment: function () {
                vc.emit('importEquipment', 'openImportEquipmentModal', {typeId: $that.equipmentAccountManageInfo.conditions.typeId})
            },
            _queryRoomMethod: function () {
                vc.component._listEquipmentAccounts(DEFAULT_PAGE, DEFAULT_ROW);
            },
            _showFlag: function () {
                if (vc.component.equipmentAccountManageInfo.showFlag) {
                    vc.component.equipmentAccountManageInfo.showFlag = false;
                } else {
                    vc.component.equipmentAccountManageInfo.showFlag = true;
                }
            },
            _moreCondition: function () {
                if (vc.component.equipmentAccountManageInfo.moreCondition) {
                    vc.component.equipmentAccountManageInfo.moreCondition = false;
                } else {
                    vc.component.equipmentAccountManageInfo.moreCondition = true;
                }
            },
            checkAllEqu: function (e) {
                var checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            vc.component.equipmentAccountManageInfo.machineIds.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.equipmentAccountManageInfo.machineIds = [];
                }
            },
            _printEquipmentAccounts: function () {
                if ($that.equipmentAccountManageInfo.machineIds.length == 0) {
                    vc.toast('请先勾选设备');
                    return;
                }
                window.open("/print.html#/pages/property/printEquipmentAccountLabels?machineIds=" + $that.equipmentAccountManageInfo.machineIds)
            },
        }
    });
})(window.vc);