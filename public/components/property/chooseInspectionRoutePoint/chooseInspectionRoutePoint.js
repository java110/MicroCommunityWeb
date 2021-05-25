(function (vc) {
    var DEFAULT_ROWS = 10;
    vc.extends({
        propTypes: {
            emitListener: vc.propTypes.string,
            emitFunction: vc.propTypes.string
        },
        data: {
            chooseInspectionRoutePointInfo: {
                points: [],
                inspectionName: '',
                inspectionRouteId: '',
                routeName: '',
                selectPoints: []
            }
        },
        watch: { // 监视双向绑定的数据数组
            checkData: {
                handler() { // 数据数组有变化将触发此函数
                    if ($that.chooseInspectionRoutePointInfo.selectPoints.length == $that.chooseInspectionRoutePointInfo.points.length) {
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
            vc.on('chooseInspectionRoutePoint', 'openchooseInspectionRoutePointModal', function (_param) {
                $that._refreshChooseInspectionRoutePointInfo();
                $('#chooseInspectionRoutePointModel').modal('show');
                vc.copyObject(_param, $that.chooseInspectionRoutePointInfo);
                $that._loadAllPointsInfo(1, 10, '');
            });
            vc.on('chooseInspectionRoutePoint', 'paginationPlus', 'page_event', function (_currentPage) {
                $that._loadAllPointsInfo(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadAllPointsInfo: function (_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        inspectionName: _name,
                        relationship: '0',
                        inspectionRouteId: $that.chooseInspectionRoutePointInfo.inspectionRouteId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('inspectionPoint.listInspectionPoints',
                    param,
                    function (json) {
                        var _pointInfo = JSON.parse(json);
                        $that.chooseInspectionRoutePointInfo.points = _pointInfo.inspectionPoints;
                        vc.emit('chooseInspectionRoutePoint', 'paginationPlus', 'init', {
                            total: _pointInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _chooseInspectionRoutePoint: function (_org) {
                var _selectPoints = $that.chooseInspectionRoutePointInfo.selectPoints;
                var _tmpPoints = $that.chooseInspectionRoutePointInfo.points;
                if (_selectPoints.length < 1) {
                    vc.toast("请选择巡检点");
                    return;
                }
                var _points = [];
                for (var _selectIndex = 0; _selectIndex < _selectPoints.length; _selectIndex++) {
                    for (var _pointIndex = 0; _pointIndex < _tmpPoints.length; _pointIndex++) {
                        if (_selectPoints[_selectIndex] == _tmpPoints[_pointIndex].inspectionId) {
                            _points.push({
                                inspectionId: _tmpPoints[_pointIndex].inspectionId,
                                inspectionName: _tmpPoints[_pointIndex].inspectionName
                            });
                        }
                    }
                }
                var _objData = {
                    communityId: vc.getCurrentCommunity().communityId,
                    inspectionRouteId: $that.chooseInspectionRoutePointInfo.inspectionRouteId,
                    points: _points
                }
                vc.http.apiPost('inspectionRoute.saveInspectionRoutePoint',
                    JSON.stringify(_objData),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        $('#chooseInspectionRoutePointModel').modal('hide');
                        if (res.status == 200) {
                            vc.emit($props.emitListener, $props.emitFunction, {
                                inspectionRouteId: $that.chooseInspectionRoutePointInfo.inspectionRouteId
                            });
                            return;
                        }
                        vc.toast(json);
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
                $('#chooseInspectionRoutePointModel').modal('hide');
            },
            //查询
            queryPoints: function () {
                $that._loadAllPointsInfo(1, 10, $that.chooseInspectionRoutePointInfo.inspectionName);
            },
            //重置
            resetPoints: function () {
                $that.chooseInspectionRoutePointInfo.inspectionName = "";
                $that._loadAllPointsInfo(1, 10, $that.chooseInspectionRoutePointInfo.inspectionName);
            },
            _refreshChooseInspectionRoutePointInfo: function () {
                $that.chooseInspectionRoutePointInfo = {
                    points: [],
                    inspectionName: '',
                    inspectionRouteId: '',
                    routeName: '',
                    selectPoints: []
                };
            },
            checkAll: function (e) {
                var checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            $that.chooseInspectionRoutePointInfo.selectPoints.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.chooseInspectionRoutePointInfo.selectPoints = [];
                }
            }
        }
    });
})(window.vc);
