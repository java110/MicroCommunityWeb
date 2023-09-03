(function (vc) {
    var DEFAULT_ROWS = 10;
    vc.extends({
        propTypes: {
            emitListener: vc.propTypes.string,
            emitFunction: vc.propTypes.string
        },
        data: {
            chooseMaintainancePlanMachineInfo: {
                machines: [],
                machineName: '',
                planId: '',
                routeName: '',
                selectMachines: []
            }
        },
        watch: { // 监视双向绑定的数据数组
            checkData: {
                handler() { // 数据数组有变化将触发此函数
                    if ($that.chooseMaintainancePlanMachineInfo.selectMachines.length == $that.chooseMaintainancePlanMachineInfo.machines.length) {
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
            vc.on('chooseMaintainancePlanMachine', 'openchooseMaintainancePlanMachineModal', function (_param) {
                $that._refreshChooseMaintainancePlanMachineInfo();
                $('#chooseMaintainancePlanMachineModel').modal('show');
                vc.copyObject(_param, $that.chooseMaintainancePlanMachineInfo);
                $that._loadAllMachinesInfo(1, 10, '');
            });
            vc.on('chooseMaintainancePlanMachine', 'paginationPlus', 'page_event', function (_currentPage) {
                $that._loadAllMachinesInfo(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadAllMachinesInfo: function (_page, _row, _name) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        machineName: _name,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/equipmentAccount.listEquipmentAccount',
                    param,
                    function (json) {
                        var _pointInfo = JSON.parse(json);
                        $that.chooseMaintainancePlanMachineInfo.machines = _pointInfo.data;
                        vc.emit('chooseMaintainancePlanMachine', 'paginationPlus', 'init', {
                            total: _pointInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _chooseMaintainancePlanMachine: function (_org) {
                let _selectMachines = $that.chooseMaintainancePlanMachineInfo.selectMachines;
                if (_selectMachines.length < 1) {
                    vc.toast("请选择检查项");
                    return;
                }
                let _objData = {
                    communityId: vc.getCurrentCommunity().communityId,
                    planId: $that.chooseMaintainancePlanMachineInfo.planId,
                    machines: _selectMachines
                }
                vc.http.apiPost('/maintainancePlan.saveMaintainancePlanMachine',
                    JSON.stringify(_objData),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            $('#chooseMaintainancePlanMachineModel').modal('hide');
                            vc.emit('maintainancePlanMachine', 'loadMachine', {
                                planId: $that.chooseMaintainancePlanMachineInfo.planId
                            });
                            return;
                        }
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
                $('#chooseMaintainancePlanMachineModel').modal('hide');
            },
            //查询
            queryMachines: function () {
                $that._loadAllMachinesInfo(1, 10, $that.chooseMaintainancePlanMachineInfo.inspectionName);
            },
            //重置
            resetMachines: function () {
                $that.chooseMaintainancePlanMachineInfo.inspectionName = "";
                $that._loadAllMachinesInfo(1, 10, $that.chooseMaintainancePlanMachineInfo.inspectionName);
            },
            _refreshChooseMaintainancePlanMachineInfo: function () {
                $that.chooseMaintainancePlanMachineInfo = {
                    machines: [],
                    itemTitle: '',
                    planId: '',
                    routeName: '',
                    selectMachines: []
                };
            },
            checkAll: function (e) {
                var checkObj = document.querySelectorAll('.checkMachine'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            $that.chooseMaintainancePlanMachineInfo.selectMachines.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.chooseMaintainancePlanMachineInfo.selectMachines = [];
                }
            }
        }
    });
})(window.vc);
