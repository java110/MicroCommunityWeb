(function(vc) {
    vc.extends({
        data: {
            addOwnerVotingInfo: {
                qaName: '',
                startTime: '',
                endTime: '',
                communityId: vc.getCurrentCommunity().communityId,
                content: '',
                titleType: '',
                titleValues: [],
                roomIds:[]
            }
        },
        _initMethod: function() {
            $that._initVoiteContent();
            vc.emit('selectRooms', 'refreshTree', {});
            vc.initDateTime('startTime',function(_value){
                $that.addOwnerVotingInfo.startTime = _value;
            });
            vc.initDateTime('endTime',function(_value){
                $that.addOwnerVotingInfo.endTime = _value;
            })
        },
        _initEvent: function() {

            vc.on('addOwnerVoting','notifySelectRooms',function(_selectRooms){
                let _roomIds = [];
                _selectRooms.forEach(item =>{
                    _roomIds.push(item.roomId);
                })
                $that.addOwnerVotingInfo.roomIds = _roomIds;

            })

        },
        methods: {
            _initVoiteContent: function() {
                var $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 200,
                    placeholder: '必填，请输入投票说明',
                    callbacks: {
                        onChange: function(contents, $editable) {
                            vc.component.addOwnerVotingInfo.content = contents;
                        }
                    },
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'italic', 'underline', 'clear']],
                        ['fontname', ['fontname']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['height', ['height']],
                        ['table', ['table']],
                    ],
                });
            },
            addOwnerVotingValidate() {
                return vc.validate.validate({
                    addOwnerVotingInfo: vc.component.addOwnerVotingInfo
                }, {
                    'addOwnerVotingInfo.qaName': [{
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,256",
                            errInfo: "名称长度必须在1位至256位"
                        },
                    ],
                    'addOwnerVotingInfo.startTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "开始时间不能为空"
                    }, ],
                    'addOwnerVotingInfo.endTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "结束时间不能为空"
                    }],
                });
            },
            _saveOwnerVoting: function() {
                if (!vc.component.addOwnerVotingValidate()) {
                    //侦听回传
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost('/question.saveOwnerVote', JSON.stringify(vc.component.addOwnerVotingInfo), {
                    emulateJSON: true
                },
                function(json, res) {
                    //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                    let _json = JSON.parse(json);
                    if (_json.code == 0) {
                        //关闭model
                       vc.goBack();
                        return;
                    } else {
                        vc.toast(_json.msg);
                    }
                },
                function(errInfo, error) {
                    console.log('请求失败处理');
                    vc.toast(errInfo);
                });
            },
            _changeAddTitleType: function() {
                let _titleType = $that.addOwnerVotingInfo.titleType;
                if (_titleType == '3003') {
                    $that.addOwnerVotingInfo.titleValues = [];
                    return;
                }
                if (_titleType == '1001') {
                    $that.addOwnerVotingInfo.titleValues = [{
                        qaValue: '',
                        seq: 1
                    }];
                }
                if (_titleType == '2002') {
                    $that.addOwnerVotingInfo.titleValues = [{
                            qaValue: '',
                            seq: 1
                        },
                        {
                            qaValue: '',
                            seq: 2
                        }
                    ];
                }
            },
            _addTitleValue: function() {
                $that.addOwnerVotingInfo.titleValues.push({
                    qaValue: '',
                    seq: $that.addOwnerVotingInfo.titleValues.length + 1
                });
            },
            _deleteTitleValue: function(_seq) {
                let _newTitleValues = [];
                let _tmpTitleValues = $that.addOwnerVotingInfo.titleValues;
                _tmpTitleValues.forEach(item => {
                    if (item.seq != _seq) {
                        _newTitleValues.push({
                            qaValue: item.qaValue,
                            seq: _newTitleValues.length + 1
                        })
                    }
                });
                $that.addOwnerVotingInfo.titleValues = _newTitleValues;
            }
        }
    });
})(window.vc);