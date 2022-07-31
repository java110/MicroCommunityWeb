/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
        },
        data: {
            chooseOrgInfo: {
                orgs: [],
                orgId: '',
                curOrg: {}
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('chooseOrgTree', 'openOrgModal', function(_param) {
                $('#chooseOrgTreeModel').modal('show');
                $that._loadChooseOrgs();
            });
            vc.on('jstree_chooseOrg', 'refreshTree', function(_param) {
                $that._loadChooseOrgs();
            });
        },
        methods: {

            _loadChooseOrgs: function() {
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
                        $that.chooseOrgInfo.orgs = _orgs;
                        $that._initJsTreeChooseOrg();
                    },
                    function() {
                        console.log('请求失败处理');
                    });
            },
            _initJsTreeChooseOrg: function() {

                let _data = $that.chooseOrgInfo.orgs;
                $.jstree.destroy()
                $("#jstree_chooseOrg").jstree({
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
                $("#jstree_chooseOrg").on("ready.jstree", function(e, data) {
                    //data.instance.open_all(); //打开所有节点
                });

                $('#jstree_chooseOrg').on("changed.jstree", function(e, data) {
                    if (data.action == 'model' || data.action == 'ready') {
                        //默认合并
                        $("#jstree_chooseorg").jstree("close_all");
                        return;
                    }
                    $that.chooseOrgInfo.curOrg = data.node.original;
                    $that.chooseOrgInfo.curOrg.orgId = $that.chooseOrgInfo.curOrg.id;
                });
            },
            _doChooseOrg: function() {
                vc.emit($props.callBackListener, 'switchOrg', $that.chooseOrgInfo.curOrg);
                $('#chooseOrgTreeModel').modal('hide');
            }
        }
    });
})(window.vc);