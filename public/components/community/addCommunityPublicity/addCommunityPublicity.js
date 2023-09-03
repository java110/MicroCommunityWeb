(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCommunityPublicityInfo: {
                pubId: '',
                title: '',
                pubType: '',
                headerImg: '',
                context: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addCommunityPublicity', 'openAddCommunityPublicityModal', function () {
                $('#addCommunityPublicityModel').modal('show');
            });
        },
        methods: {
            addCommunityPublicityValidate() {
                return vc.validate.validate({
                    addCommunityPublicityInfo: vc.component.addCommunityPublicityInfo
                }, {
                    'addCommunityPublicityInfo.title': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公示标题不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "公示标题不能超过200"
                        }
                    ],
                    'addCommunityPublicityInfo.pubType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公示类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "公示类型不能超过30"
                        }
                    ],
                    'addCommunityPublicityInfo.headerImg': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "头部照片,照片名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "头部照片,照片名称不能超过200"
                        }
                    ],
                    'addCommunityPublicityInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "活动内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "活动内容不能超过200"
                        }
                    ]
                });
            },
            saveCommunityPublicityInfo: function () {
                if (!vc.component.addCommunityPublicityValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addCommunityPublicityInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addCommunityPublicityInfo);
                    $('#addCommunityPublicityModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    'communityPublicity.saveCommunityPublicity',
                    JSON.stringify(vc.component.addCommunityPublicityInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCommunityPublicityModel').modal('hide');
                            vc.component.clearAddCommunityPublicityInfo();
                            vc.emit('communityPublicityManage', 'listCommunityPublicity', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddCommunityPublicityInfo: function () {
                vc.component.addCommunityPublicityInfo = {
                    title: '',
                    pubType: '',
                    headerImg: '',
                    context: ''
                };
            }
        }
    });
})(window.vc);
