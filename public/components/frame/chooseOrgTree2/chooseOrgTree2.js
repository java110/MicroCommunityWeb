/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
        },
        data: {
            chooseOrgTree2Info: {
                orgs: [],
                orgId: '',
                curOrg: {},
                selectOrgFlag: false
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('chooseOrgTree2', 'openOrgModal', function (_param) {
                $that._loadChooseOrgs2();
            });
            vc.on('chooseOrgTree2', 'refreshTree', function (_param) {
                $that._loadChooseOrgs2();
            });
            vc.on('chooseOrgTree2', 'clearAll', function (_param) {
                $that.chooseOrgTree2Info = {
                    orgs: [],
                    orgId: '',
                    curOrg: {},
                    selectOrgFlag: false
                }
            });
        },
        methods: {
            _loadChooseOrgs2: function () {
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
                        $that.chooseOrgTree2Info.orgs = _orgs;
                        $that._initJsTreeChooseOrg2();
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            _initJsTreeChooseOrg2: function () {
                let _data = $that.chooseOrgTree2Info.orgs;
                $.jstree.destroy()
                $("#jstree_chooseOrg2").jstree({
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
                $("#jstree_chooseOrg2").on("ready.jstree", function (e, data) {
                    //data.instance.open_all(); //打开所有节点
                });
                $('#jstree_chooseOrg2').on("changed.jstree", function (e, data) {
                    if (data.action == 'model' || data.action == 'ready') {
                        //默认合并
                        $("#jstree_chooseOrg2").jstree("close_all");
                        return;
                    }
                    $that.chooseOrgTree2Info.curOrg = data.node.original;
                    $that.chooseOrgTree2Info.curOrg.orgId = $that.chooseOrgTree2Info.curOrg.id;
                });
            },
            _doChooseOrg: function () {
                vc.emit($props.callBackListener, 'switchOrg', $that.chooseOrgTree2Info.curOrg);
                $that.chooseOrgTree2Info.selectOrgFlag = false;
            },
            _changeOrg2: function () {
                $that.chooseOrgTree2Info.selectOrgFlag = true;
                $that._loadChooseOrgs2();
            }
        }
    });
})(window.vc);