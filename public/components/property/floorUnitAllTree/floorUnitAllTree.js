/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
        },
        data: {
            floorUnitTreeInfo: {
                units: [],
                floorId: ''
            }
        },
        _initMethod: function () {
            $that._loadFloorAndUnits();
        },
        _initEvent: function () {
            vc.on('floorUnitTree', 'refreshTree', function (_param) {
                if (_param) {
                    $that.floorUnitTreeInfo.floorId = _param.floorId;
                }
                $that._loadFloorAndUnits();
            });
        },
        methods: {
            _loadFloorAndUnits: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/floor.queryFloorAndUnits',
                    param,
                    function (json) {
                        let _unitInfo = JSON.parse(json);
                        $that.floorUnitTreeInfo.units = _unitInfo;
                        $that._initJsTreeFloorUnit();
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            _initJsTreeFloorUnit: function () {
                let _data = $that._doJsTreeData();
                let _unitId = '';
                $that.floorUnitTreeInfo.units.forEach(item => {
                    if ($that.floorUnitTreeInfo.floorId && item.floorId == $that.floorUnitTreeInfo.floorId) {
                        _unitId = item.unitId;
                    }
                })
                // _data = _data.sort(function(a, b) {
                //     return a.seq - b.seq
                // });
                $.jstree.destroy()
                $("#jstree_floorUnit").jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    'state': { //一些初始化状态
                        "opened": true,
                    },
                    // 'plugins': ['contextmenu'],
                    'core': {
                        'data': _data
                    },
                    // "contextmenu": {
                    //     items: {
                    //         "修改": {
                    //             "label": "修改",
                    //             "icon": "fa fa-plus",
                    //             "action": function (data) {
                    //                 var inst = $.jstree.reference(data.reference),
                    //                     obj = inst.get_node(data.reference);
                    //             }
                    //         },
                    //     },
                    // }
                });
                $("#jstree_floorUnit").on("ready.jstree", function (e, data) {
                    //data.instance.open_all();//打开所有节点
                    if (_unitId) {
                        $('#jstree_floorUnit').jstree('select_node', 'u_' + _unitId /* , true */);
                        return;
                    }
                    $('#jstree_floorUnit').jstree('select_node', _data[0].children[0].id /* , true */);
                });

                $('#jstree_floorUnit').on("changed.jstree", function (e, data) {
                    if (data.action == 'model' || data.action == 'ready') {
                        //默认合并
                        //$("#jstree_floorUnit").jstree("close_all");
                        return;
                    }
                    let _selected = data.selected[0];
                    if (_selected.startsWith('f_')) {
                        vc.emit($props.callBackListener, 'switchFloor', {
                            floorId: data.node.original.floorId
                        })
                        return;
                    }
                    //console.log(_selected, data.node.original.unitId)
                    vc.emit($props.callBackListener, 'switchUnit', {
                        unitId: data.node.original.unitId
                    })
                });
                $('#jstree_floorUnit')
                    .on('click', '.jstree-anchor', function (e) {
                        $(this).jstree(true).toggle_node(e.target);
                    })
            },
            _doJsTreeData: function () {
                let _mFloorTree = [];
                let _units = $that.floorUnitTreeInfo.units;
                //构建 第一层菜单组
                _units.forEach(pItem => {
                    let _includeFloor = false;
                    for (let _mgIndex = 0; _mgIndex < _mFloorTree.length; _mgIndex++) {
                        if (pItem.floorId == _mFloorTree[_mgIndex].floorId) {
                            _includeFloor = true;
                        }
                    }
                    if (!_includeFloor) {
                        let _floorItem = {
                            id: 'f_' + pItem.floorId,
                            floorId: pItem.floorId,
                            floorNum: pItem.floorNum,
                            icon: "/img/floor.png",
                            text: pItem.floorNum + "栋" + '(' + pItem.floorName + ')',
                            state: {
                                opened: false
                            },
                            children: []
                        };
                        $that._doJsTreeMenuData(_floorItem);
                        _mFloorTree.push(_floorItem);
                    }
                });
                return _mFloorTree;
            },
            _doJsTreeMenuData: function (_floorItem) {
                let _units = $that.floorUnitTreeInfo.units;
                //构建菜单
                let _children = _floorItem.children;
                for (let _pIndex = 0; _pIndex < _units.length; _pIndex++) {
                    if (_floorItem.floorId == _units[_pIndex].floorId && _units[_pIndex].unitId) {
                        let _includeMenu = false;
                        for (let _mgIndex = 0; _mgIndex < _children.length; _mgIndex++) {
                            if (_units[_pIndex].unitId == _children[_mgIndex].unitId) {
                                _includeMenu = true;
                            }
                        }
                        // if (_units[_pIndex].unitNum == "0") {
                        //     continue;
                        // }
                        if (!_includeMenu) {
                            let _menuItem = {
                                id: 'u_' + _units[_pIndex].unitId,
                                unitId: _units[_pIndex].unitId,
                                text: _units[_pIndex].unitNum + "单元",
                                icon: "/img/unit.png"
                            };
                            _children.push(_menuItem);
                        }
                    }
                }
            },
        }
    });
})(window.vc);