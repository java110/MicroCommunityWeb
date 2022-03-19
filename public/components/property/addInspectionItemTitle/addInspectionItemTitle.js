(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addInspectionItemTitleInfo: {
                titleId: '0000',
                titleType: '',
                itemTitle: '',
                seq: '',
                itemId: '',
                titleValues: []
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addInspectionItemTitle', 'openAddInspectionItemTitleModal', function(_param) {
                vc.copyObject(_param, $that.addInspectionItemTitleInfo);
                $('#addInspectionItemTitleModel').modal('show');
            });
        },
        methods: {
            addInspectionItemTitleValidate() {
                return vc.validate.validate({
                    addInspectionItemTitleInfo: vc.component.addInspectionItemTitleInfo
                }, {
                    'addInspectionItemTitleInfo.titleType': [{
                            limit: "required",
                            param: "",
                            errInfo: "题目类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "题目类型格式错误"
                        },
                    ],
                    'addInspectionItemTitleInfo.itemTitle': [{
                            limit: "required",
                            param: "",
                            errInfo: "问卷题目不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "问卷题目太长"
                        },
                    ],
                    'addInspectionItemTitleInfo.seq': [{
                            limit: "required",
                            param: "",
                            errInfo: "顺序不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "顺序必须是数字"
                        },
                    ]
                });
            },
            saveInspectionItemTitleInfo: function() {
                if (!vc.component.addInspectionItemTitleValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }
                vc.component.addInspectionItemTitleInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addInspectionItemTitleInfo);
                    $('#addInspectionItemTitleModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/inspectionItemTitle.saveInspectionItemTitle',
                    JSON.stringify(vc.component.addInspectionItemTitleInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addInspectionItemTitleModel').modal('hide');
                            vc.component.clearAddInspectionItemTitleInfo();
                            vc.emit('inspectionItemTitleManage', 'listInspectionItemTitle', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddInspectionItemTitleInfo: function() {
                vc.component.addInspectionItemTitleInfo = {
                    titleId: '',
                    titleType: '',
                    itemTitle: '',
                    seq: '',
                    itemId: '',
                    titleValues: []
                };
            },
            _changeAddTitleType: function() {

                let _titleType = $that.addInspectionItemTitleInfo.titleType;

                if (_titleType == '3003') {
                    $that.addInspectionItemTitleInfo.titleValues = [];
                    return;
                }

                $that.addInspectionItemTitleInfo.titleValues = [{
                    itemValue: '',
                    seq: 1
                }];
            },
            _addTitleValue: function() {
                $that.addInspectionItemTitleInfo.titleValues.push({
                    itemValue: '',
                    seq: $that.addInspectionItemTitleInfo.titleValues.length + 1
                });
            },
            _deleteTitleValue: function(_seq) {
                console.log(_seq);

                let _newTitleValues = [];
                let _tmpTitleValues = $that.addInspectionItemTitleInfo.titleValues;
                _tmpTitleValues.forEach(item => {
                    if (item.seq != _seq) {
                        _newTitleValues.push({
                            itemValue: item.itemValue,
                            seq: _newTitleValues.length + 1
                        })
                    }
                });

                $that.addInspectionItemTitleInfo.titleValues = _newTitleValues;
            }
        }
    });

})(window.vc);