/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
        },
        data: {
            resourceStoreTypeTreeInfo: {
                types: [],
            }
        },
        _initMethod: function () {
            $that._loadResourceStoreTypeTree();
        },
        _initEvent: function () {
            vc.on('resourceStoreTypeTree', 'refreshTree', function (_param) {
                $that._loadResourceStoreTypeTree();
            });
        },
        methods: {
            _loadResourceStoreTypeTree: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listResourceStoreTypeTree',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.resourceStoreTypeTreeInfo.types = _json.data;
                        $that._initJsTreeResourceStoreType();
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            _initJsTreeResourceStoreType: function () {
                let _data = $that._doTypeJsTreeData();
                $.jstree.destroy()
                $("#jstree_resourceStoreType").jstree({
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
                $("#jstree_resourceStoreType").on("ready.jstree", function (e, data) {
                    //data.instance.open_all();//打开所有节点
                    //$('#jstree_resourceStoreType').jstree('select_node', _data[0].children[0].id /* , true */);
                });

                $('#jstree_resourceStoreType').on("changed.jstree", function (e, data) {
                    if (data.action == 'model' || data.action == 'ready') {
                        //默认合并
                        //$("#jstree_resourceStoreType").jstree("close_all");
                        return;
                    }
                    let _selected = data.selected[0];
                    if (_selected.startsWith('f_')) {
                        vc.emit($props.callBackListener, 'switchParent', {
                            parentRstId: data.node.original.parentRstId
                        })
                        return;
                    }
                    vc.emit($props.callBackListener, 'switchRst', {
                        rstId: data.node.original.rstId
                    })
                });
                $('#jstree_resourceStoreType')
                    .on('click', '.jstree-anchor', function (e) {
                        $(this).jstree(true).toggle_node(e.target);
                    })
            },
            _doTypeJsTreeData: function () {
                let _mFloorTree = [];
                let _types = $that.resourceStoreTypeTreeInfo.types;
                //构建 第一层菜单组
                _types.forEach(pItem => {
                    let _floorItem = {
                        id: 'f_' + pItem.parentRstId,
                        parentRstId: pItem.parentRstId,
                        parentName: pItem.parentName,
                        icon: "/img/floor.png",
                        text: pItem.parentName,
                        state: {
                            opened: false
                        },
                        children: []
                    };
                    if (pItem.subTypes) {
                        pItem.subTypes.forEach(_subType => {
                            let _menuItem = {
                                id: 'u_' + _subType.rstId,
                                rstId: _subType.rstId,
                                text: _subType.name,
                                icon: "/img/unit.png"
                            };
                            _floorItem.children.push(_menuItem);
                        });
                    }

                    _mFloorTree.push(_floorItem);

                });
                return _mFloorTree;
            },

        }
    });
})(window.vc);