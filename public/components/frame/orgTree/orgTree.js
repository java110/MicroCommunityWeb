/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
        },
        data: {
            orgTreeInfo: {
                orgs: [],
                orgId: ''
            }
        },
        _initMethod: function() {
            $that._loadOrgs();

        },
        _initEvent: function() {
            vc.on('orgTree', 'refreshTree', function(_param) {
                if (_param) {
                    $that.orgTreeInfo.orgId = _param.orgId;
                }
                $that._loadOrgs();
            });
        },
        methods: {

            _loadOrgs: function() {

                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/org.listOrgTree',
                    param,
                    function(json) {
                        let _orgs = JSON.parse(json).data;
                        $that.orgTreeInfo.orgs = _orgs;
                        $that._initJsTreeFloorUnit();
                    },
                    function() {
                        console.log('请求失败处理');
                    });
            },
            _initJsTreeFloorUnit: function() {

                let _data = $that.orgTreeInfo.orgs;
                $.jstree.destroy()
                $("#jstree_org").jstree({
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
                $("#jstree_org").on("ready.jstree", function(e, data) {
                    data.instance.open_all(); //打开所有节点
                });

                $('#jstree_org').on("changed.jstree", function(e, data) {
                    if (data.action == 'model' || data.action == 'ready') {
                        //默认合并
                        //$("#jstree_org").jstree("close_all");
                        return;
                    }
                    let _selected = data.selected[0];

                    vc.emit($props.callBackListener, 'switchOrg', {
                        orgId: data.node.original.orgId
                    })

                });
                $('#jstree_org')
                    .on('click', '.jstree-anchor', function(e) {
                        $(this).jstree(true).toggle_node(e.target);
                    })
            },

        }
    });
})(window.vc);