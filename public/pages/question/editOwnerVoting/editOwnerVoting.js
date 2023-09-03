(function(vc) {
    vc.extends({
        data: {
            editOwnerVotingInfo: {
                qaId: '',
                qaName: '',
                startTime: '',
                endTime: '',
                communityId: vc.getCurrentCommunity().communityId,
                content: '',
                titleType: '',
                titleValues: [],
                roomIds: [],
                updateRoomIds: false,
                voteCount: 0
            }
        },
        _initMethod: function() {
            $that.editOwnerVotingInfo.qaId = vc.getParam('qaId')
            $that._initVoiteContent();
            $that._loadOwnerVoting()
            vc.emit('selectRooms', 'refreshTree', {});
            vc.initDateTime('startTime', function(_value) {
                $that.editOwnerVotingInfo.startTime = _value;
            });
            vc.initDateTime('endTime', function(_value) {
                $that.editOwnerVotingInfo.endTime = _value;
            })
        },
        _initEvent: function() {

            vc.on('editOwnerVoting', 'notifySelectRooms', function(_selectRooms) {
                let _roomIds = [];
                _selectRooms.forEach(item => {
                    _roomIds.push(item.roomId);
                })
                $that.editOwnerVotingInfo.roomIds = _roomIds;

            })

        },
        methods: {
            _loadOwnerVoting: function() {
                let _param = {
                    params: {
                        page: 1,
                        row: 1,
                        qaId: $that.editOwnerVotingInfo.qaId,
                        communityId: $that.editOwnerVotingInfo.communityId
                    }
                }
                vc.http.apiGet('/question.listOwnerVote',
                    _param,
                    function(json, res) {
                        let _ownerVotingInfo = JSON.parse(json);
                        vc.copyObject(_ownerVotingInfo.data[0], $that.editOwnerVotingInfo);
                        $(".summernote").summernote('code', $that.editOwnerVotingInfo.content);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initVoiteContent: function() {
                var $summernote = $('.summernote').summernote({
                    lang: 'zh-CN',
                    height: 200,
                    placeholder: '必填，请输入投票说明',
                    callbacks: {
                        onChange: function(contents, $editable) {
                            vc.component.editOwnerVotingInfo.content = contents;
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
            editOwnerVotingValidate() {
                return vc.validate.validate({
                    editOwnerVotingInfo: vc.component.editOwnerVotingInfo
                }, {
                    'editOwnerVotingInfo.qaName': [{
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
                    'editOwnerVotingInfo.startTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "开始时间不能为空"
                    }, ],
                    'editOwnerVotingInfo.endTime': [{
                        limit: "required",
                        param: "",
                        errInfo: "结束时间不能为空"
                    }],
                });
            },
            _saveOwnerVoting: function() {
                if (!vc.component.editOwnerVotingValidate()) {
                    //侦听回传
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost('/question.updateOwnerVote', JSON.stringify(vc.component.editOwnerVotingInfo), {
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
                let _titleType = $that.editOwnerVotingInfo.titleType;
                if (_titleType == '3003') {
                    $that.editOwnerVotingInfo.titleValues = [];
                    return;
                }
                if (_titleType == '1001') {
                    $that.editOwnerVotingInfo.titleValues = [{
                        qaValue: '',
                        seq: 1
                    }];
                }
                if (_titleType == '2002') {
                    $that.editOwnerVotingInfo.titleValues = [{
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
                $that.editOwnerVotingInfo.titleValues.push({
                    qaValue: '',
                    seq: $that.editOwnerVotingInfo.titleValues.length + 1
                });
            },
            _deleteTitleValue: function(_seq) {
                let _newTitleValues = [];
                let _tmpTitleValues = $that.editOwnerVotingInfo.titleValues;
                _tmpTitleValues.forEach(item => {
                    if (item.seq != _seq) {
                        _newTitleValues.push({
                            qaValue: item.qaValue,
                            seq: _newTitleValues.length + 1
                        })
                    }
                });
                $that.editOwnerVotingInfo.titleValues = _newTitleValues;
            },
            _updateRoomIdsMethod: function() {
                $that.editOwnerVotingInfo.updateRoomIds = true;
            }
        }
    });
})(window.vc);