(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addOrgInfo: {
                orgId: '',
                orgName: '',
                orgLevel: '',
                parentOrgId: '',
                parentOrgName: '',
                description: '',
                belongCommunityId: '',
                parentOrg:[],
                belongCommunitys:[]

            },
            flagOrgName:false
        }
        ,
        _initMethod: function () {

        }
        ,
        _initEvent: function () {
            vc.on('addOrg', 'openAddOrgModal', function (_param) {
                if (_param.hasOwnProperty('parentOrgId')) {
                    vc.component.addOrgInfo.parentOrgId = _param.parentOrgId;
                    vc.component.addOrgInfo.parentOrgName = _param.parentOrgName;
                    
                }
                $('#addOrgModel').modal('show');
            });
        }
        ,
        methods: {
            addOrgValidate:function() {
                return vc.validate.validate({
                    addOrgInfo: vc.component.addOrgInfo
                }, {
                    'addOrgInfo.orgName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组织名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,50",
                            errInfo: "组织名称长度为2至50"
                        },
                    ],
                    'addOrgInfo.parentOrgId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "上级ID不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "上级ID不正确"
                        },
                    ],
                    'addOrgInfo.description': [

                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "描述不能为空"
                        },
                    ],


                });
            }
            ,
            saveOrgInfo: function () {
                if (!vc.component.addOrgValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                //vc.component.addOrgInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addOrgInfo);
                    $('#addOrgModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/org.saveOrg',
                    JSON.stringify(vc.component.addOrgInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addOrgModel').modal('hide');
                            vc.component.clearAddOrgInfo();
                            vc.emit('orgTree', 'refreshTree', {});

                            return;
                        }
                        vc.toast(json);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            }
            ,
            clearAddOrgInfo: function () {
                vc.component.addOrgInfo = {
                    orgName: '',
                    orgLevel: '',
                    parentOrgId: '',
                    parentOrgName: '',
                    description: '',
                    parentOrg: [],
                    belongCommunityId: '',
                    communityId: '',
                };
            }
            ,
            _addOrgListParentOrgInfo: function () {


                var _tmpOrgLevel = vc.component.addOrgInfo.orgLevel;

                if (_tmpOrgLevel > 1) {
                    _tmpOrgLevel = _tmpOrgLevel - 1;
                }

                var param = {
                    params: {
                        orgLevel: _tmpOrgLevel,
                        page: 1,
                        row: 30,
                    }
                };

                //发送get请求
                vc.http.get('addOrg',
                    'list',
                    param,
                    function (json, res) {
                        var _orgManageInfo = JSON.parse(json);
                        vc.component.addOrgInfo.parentOrg = _orgManageInfo.orgs;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            textOrgName(){
                var _tmpOrgLevel = vc.component.addOrgInfo.orgLevel;
                var param = {
                    params: {
                        page: 1,
                        row: 30,
                        orgLevel: _tmpOrgLevel,
                        parentOrgId:vc.component.addOrgInfo.parentOrgId,
                        orgName: vc.component.addOrgInfo.orgName
                    }
                };
                console.log(param,6666)
                //发送get请求
                vc.http.get('orgManage',
                    'list',
                    param,
                    function (json, res) {
                        var arr = JSON.parse(json).orgs;
                        if (_tmpOrgLevel == 2) {
                            if(arr.length>0){
                                vc.toast("公司名重复");
                                vc.component.flagOrgName=true
                            }else{
                                vc.component.flagOrgName=false
                            }
                        } else if(_tmpOrgLevel == 3) {
                            if(arr.length>0){
                                vc.toast("组织名称重复");
                                vc.component.flagOrgName=true
                            }else{
                                vc.component.flagOrgName=false
                            }
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    })
    ;

})(window.vc);
