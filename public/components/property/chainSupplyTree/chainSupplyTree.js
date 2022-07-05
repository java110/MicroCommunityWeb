/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
        },
        data: {
            chainSupplyInfo: {
                chainSuppliers: [],
                csId:''
            }
        },
        _initMethod: function () {
            $that._listChainSuppliers();

        },
        _initEvent: function () {
            
            vc.on('chainSupplierManage', 'listChainSupplier', function (_param) {
                vc.component._listChainSuppliers(1, 100);
            });
            vc.on('chainSupplierCatalogManage', 'listChainSupplierCatalog', function (_param) {
                vc.component._listChainSuppliers(1, 100);
            });
        },
        methods: {
            _listChainSuppliers: function (_page, _rows) {
                var param = {
                    params:  {
                        page:1,
                        row:100
                    }
                };
                //发送get请求
                vc.http.apiGet('chainSupplier.listChainSupplier',
                    param,
                    function (json, res) {
                        var _chainSupplierManageInfo = JSON.parse(json);
                        $that.chainSupplyInfo.chainSuppliers = _chainSupplierManageInfo.data;
                        $that._initJsTreeFloorUnit();
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _initJsTreeFloorUnit: function () {

                let _data = $that._doJsTreeData();

                let _csId = '';

                $that.chainSupplyInfo.chainSuppliers.forEach(item=>{
                    if($that.chainSupplyInfo.csId && item.csId == $that.chainSupplyInfo.csId){
                        _csId = item.csId;
                    }
                })

               // _data = _data.sort(function (a, b) {
              //      return a.floorNum - b.floorNum
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
                    //     items: {unit.png
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
                    if(_csId){
                        $('#jstree_floorUnit').jstree('select_node', 'u_'+_csId /* , true */);
                        return ;
                    }
                    if(_data[0].children[0] != null){
                        $('#jstree_floorUnit').jstree('select_node', _data[0].children[0].id /* , true */);
                    }
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
                            suType: data.node.original.suType,
                            csId: data.node.original.csId
                        })
                        return;
                    }
                    vc.emit($props.callBackListener, 'switchUnit', {
                        csId: data.node.original.csId,
                        suType: data.node.original.suType,
                        catalogId: data.node.original.catalogId
                    })
                });


            },
            _doJsTreeData: function () {
                let _mFloorTree = [];

                let _chainSuppliers = $that.chainSupplyInfo.chainSuppliers;

                //构建 第一层菜单组
                _chainSuppliers.forEach(pItem => {
                    let _includeFloor = false;
                    for (let _mgIndex = 0; _mgIndex < _mFloorTree.length; _mgIndex++) {
                        if (pItem.csId == _mFloorTree[_mgIndex].csId) {
                            _includeFloor = true;
                        }
                    }

                    if (!_includeFloor) {
                        let _floorItem = {
                            id: 'f_' + pItem.csId,
                            csId: pItem.csId,
                            icon: "/img/supplier.png",
                            text: pItem.name,
                            suType: pItem.suType,
                            state: {
                                opened: false
                            },
                            children: pItem.catalogs
                        };
                        $that._doJsTreeMenuData(_floorItem);
                        _mFloorTree.push(_floorItem);
                    }
                });
                return _mFloorTree;
            },
            _doJsTreeMenuData: function (_floorItem) {
                //构建二级菜单
                let _children = _floorItem.children;
                let _children2 = [];
                for (let _pIndex = 0; _pIndex < _children.length; _pIndex++) {
                    let _menuItem = {
                        id: 'u_' + _children[_pIndex].catalogId,
                        text: _children[_pIndex].catalogName ,
                        catalogId: _children[_pIndex].catalogId ,
                        catalogName: _children[_pIndex].catalogName ,
                        csId: _children[_pIndex].csId ,
                        seq: _children[_pIndex].seq ,
                        icon: "/img/catalog.png"
                    };
                    _children2.push(_menuItem);
                }
                _floorItem.children = _children2;
            },

        }
    });
})(window.vc);