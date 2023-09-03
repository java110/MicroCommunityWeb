(function (vc) {
    var DEFAULT_ROWS = 10;
    vc.extends({
        propTypes: {
            emitListener: vc.propTypes.string,
            emitFunction: vc.propTypes.string
        },
        data: {
            addDataPrivilegeUnitInfo: {
                total: 0,
                records: 1,
                units: [],
                unitNum: '',
                floorNum:'',
                dpId: '',
                orgName: '',
                selectUnits: []
            }
        },
        watch: { // 监视双向绑定的数据数组
            addDataPrivilegeUnitInfo: {
                handler() { // 数据数组有变化将触发此函数
                    if ($that.addDataPrivilegeUnitInfo.selectUnits.length == $that.addDataPrivilegeUnitInfo.units.length) {
                        document.querySelector('#unitQuan').checked = true;
                    } else {
                        document.querySelector('#unitQuan').checked = false;
                    }
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function() {},
        _initEvent: function() {

            vc.on('addDataPrivilegeUnit', 'openAddDataPrivilegeUnitModal', function(_param) {
                $that._refreshChooseUnitInfo();
                $('#addDataPrivilegeUnitModel').modal('show');
                vc.copyObject(_param, $that.addDataPrivilegeUnitInfo);
                $that._loadAllUnitsInfo(1, 10, '');
            });
            vc.on('addDataPrivilegeUnit', 'paginationPlus', 'page_event', function(_currentPage) {
                $that._loadAllUnitsInfo(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadAllUnitsInfo: function (_page, _row, _name) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        unitNum: $that.addDataPrivilegeUnitInfo.unitNum,
                        floorNum: $that.addDataPrivilegeUnitInfo.floorNum,
                        dpId: $that.addDataPrivilegeUnitInfo.dpId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/dataPrivilegeUnit.listUnitsNotInDataPrivilege',
                    param,
                    function (json) {
                        var _staffInfo = JSON.parse(json);
                        $that.addDataPrivilegeUnitInfo.total = _staffInfo.total;
                        $that.addDataPrivilegeUnitInfo.records = _staffInfo.records;
                        $that.addDataPrivilegeUnitInfo.units = _staffInfo.data;
                        vc.emit('addDataPrivilegeUnit', 'paginationPlus', 'init', {
                            total: $that.addDataPrivilegeUnitInfo.records,
                            dataCount: $that.addDataPrivilegeUnitInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            addDataPrivilegeUnit: function(_org) {
                var _selectUnits = $that.addDataPrivilegeUnitInfo.selectUnits;
                var _tmpUnits = $that.addDataPrivilegeUnitInfo.units;
                if (_selectUnits.length < 1) {
                    vc.toast("请选择员工");
                    return;
                }
                let _units = [];
                for (var _selectIndex = 0; _selectIndex < _selectUnits.length; _selectIndex++) {
                    for (var _staffIndex = 0; _staffIndex < _tmpUnits.length; _staffIndex++) {
                        if (_selectUnits[_selectIndex] == _tmpUnits[_staffIndex].unitId) {
                            _units.push({
                                unitId: _tmpUnits[_staffIndex].unitId,
                                unitNum: _tmpUnits[_staffIndex].unitNum,
                                floorId: _tmpUnits[_staffIndex].floorId,
                                floorNum: _tmpUnits[_staffIndex].floorNum,
                            });
                        }
                    }
                }
                let _objData = {
                    dpId: $that.addDataPrivilegeUnitInfo.dpId,
                    units: _units,
                    communityId: vc.getCurrentCommunity().communityId
                }
                vc.http.apiPost('/dataPrivilegeUnit.saveDataPrivilegeUnit',
                    JSON.stringify(_objData), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        $('#addDataPrivilegeUnitModel').modal('hide');
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            vc.emit($props.emitListener, $props.emitFunction, {});
                            vc.toast("操作成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
                $('#addDataPrivilegeUnitModel').modal('hide');
            },
            queryUnits: function() {
                $that._loadAllUnitsInfo(1, 10, $that.addDataPrivilegeUnitInfo.unitNum);
            },
            _refreshChooseUnitInfo: function() {
                $that.addDataPrivilegeUnitInfo = {
                    units: [],
                    staffName: '',
                    dpId: '',
                    orgName: '',
                    selectUnits: []
                };
            },
            checkUnitAll: function(e) {
                let checkObj = document.querySelectorAll('.checkUnitItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            $that.addDataPrivilegeUnitInfo.selectUnits.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.addDataPrivilegeUnitInfo.selectUnits = [];
                }
            }
        }
    });
})(window.vc);