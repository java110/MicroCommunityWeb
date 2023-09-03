/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
        },
        data: {
            orgTreeShowInfo: {
                orgs: [],
                orgId: '',
                curOrg: {}
            }
        },
        _initMethod: function () {
            $that._loadOrgsShow();
        },
        _initEvent: function() {
            vc.on('orgTreeShow', 'refreshTree', function() {
                $that._loadOrgsShow();
            })
        },
        methods: {
            _loadOrgsShow: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/org.listOrgTree',
                    param,
                    function (json) {
                        let _orgs = JSON.parse(json).data;
                        $that.orgTreeShowInfo.orgs = _orgs;
                        $that._initJsTreeOrgShow();
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            _initJsTreeOrgShow: function () {
                let _data = $that.orgTreeShowInfo.orgs;
                if ($.jstree) {
                    $.jstree.destroy()
                }

                $("#jstree_org_show").jstree({
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
                $("#jstree_org_show").on("ready.jstree", function (e, data) {
                    data.instance.open_all(); //打开所有节点
                });
                $('#jstree_org_show').on("changed.jstree", function (e, data) {
                    if (data.action == 'model' || data.action == 'ready') {
                        //默认合并
                        //$("#jstree_org").jstree("close_all");
                        return;
                    }
                    $that.orgTreeShowInfo.curOrg = data.node.original;
                    $that.orgTreeShowInfo.curOrg.orgId = $that.orgTreeShowInfo.curOrg.id;
                    vc.emit($props.callBackListener, 'switchOrg', {
                        orgId: data.node.original.id,
                        orgName: $that.orgTreeShowInfo.curOrg.text
                    })
                });
                // $('#jstree_org')
                //     .on('click', '.jstree-anchor', function(e) {
                //         $(this).jstree(true).toggle_node(e.target);
                //     })
            },
        }
    });
})(window.vc);