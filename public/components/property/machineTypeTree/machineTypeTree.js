/**
 入驻园区
 **/
(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
        },
        data: {
            machineTypesTreeInfo: {
                machineTypes: [],
                typeId: ''
            }
        },
        _initMethod: function () {
            setTimeout(function(){
                $that._loadMachineTypesTree();
            },1000)
        },
        _initEvent: function () {
            vc.on('machineTypesTree', 'refreshTree', function (_param) {
                console.log('machineTypesTree')
                if (_param) {
                    $that.machineTypesTreeInfo.typeId = _param.typeId;
                }
                $that._loadMachineTypesTree();
            });
        },
        methods: {
            _loadMachineTypesTree: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('machineType.listMachineType',
                    param,
                    function (json) {
                        var _machineTypeInfo = JSON.parse(json);
                        vc.component.machineTypesTreeInfo.machineTypes = _machineTypeInfo.data;
                        $that._initJsTreeMachineType();
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            _initJsTreeMachineType: function () {
                let _data = $that._doMachineTypeTreeData();
                $.jstree.destroy()
                $("#jstree_machineType").jstree({
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
                });
                $("#jstree_machineType").on("ready.jstree", function (e, data) {
                    data.instance.open_all();//打开所有节点
                    // if (_unitId) {
                    //     $('#jstree_machineType').jstree('select_node', 'u_' + _unitId /* , true */ );
                    //     return;
                    // }
                    //$('#jstree_machineType').jstree('select_node', _data[0].children[0].id /* , true */ );

                });

                $('#jstree_machineType').on("changed.jstree", function (e, data) {
                    if (data.action == 'model' || data.action == 'ready') {
                        //默认合并
                        //$("#jstree_machineType").jstree("close_all");
                        return;
                    }
                    vc.emit($props.callBackListener, 'switchType', {
                        typeId: data.node.original.typeId,
                        typeName: data.node.original.text
                    })
                });
                $('#jstree_machineType')
                    .on('click', '.jstree-anchor', function (e) {
                        $(this).jstree(true).toggle_node(e.target);
                    })


            },
            _doMachineTypeTreeData: function () {
                let _mFloorTree = [];
                let _types = $that.machineTypesTreeInfo.machineTypes;
                _types.forEach(pItem => {
                    let _typeItem = {
                        id: pItem.typeId,
                        typeId: pItem.typeId,
                        parentTypeId: pItem.parentTypeId,
                        icon: "/img/floor.png",
                        text: pItem.machineTypeName,
                        state: {
                            opened: false
                        },
                        children: []
                    };
                    _mFloorTree.push(_typeItem);
                });
                return $that.toMachineTypeTree(_mFloorTree);
            },
            toMachineTypeTree: function (data) {
                let result = []
                if (!Array.isArray(data)) {
                    return result
                }
                data.forEach(item => {
                    delete item.children;
                });
                let map = {};
                data.forEach(item => {
                    map[item.id] = item;
                });
                data.forEach(item => {
                    let parent = map[item.parentTypeId];
                    if (parent) {
                        (parent.children || (parent.children = [])).push(item);
                    } else {
                        result.push(item);
                    }
                });
                return result;
            },
        }
    });
})(window.vc);