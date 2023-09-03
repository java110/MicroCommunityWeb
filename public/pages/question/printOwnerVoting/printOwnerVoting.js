/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var photoUrl = '/callComponent/download/getFile/file';
    vc.extends({
        data: {
            printOwnerVotingInfo: {
                qaName: '',
                content: '',
                titleValues: [],
                qaId: '',
                userVotes: [],
                voteCount: 0,
                votedCount: 0
            }
        },
        _initMethod: function() {
            $that.printOwnerVotingInfo.qaId = vc.getParam('qaId');
            $that._listOwnerVotings();
        },
        _initEvent: function() {
            vc.on('ownerVoting', 'listOwnerVoting', function(_param) {
                $that._listOwnerVotings(DEFAULT_PAGE, DEFAULT_ROWS);
            });

        },
        methods: {
            _listOwnerVotings: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        qaId: $that.printOwnerVotingInfo.qaId
                    }
                };
                //发送get请求
                vc.http.apiGet('/question.listOwnerVote',
                    param,
                    function(json, res) {
                        let _ownerVotingInfo = JSON.parse(json);
                        vc.copyObject(_ownerVotingInfo.data[0], $that.printOwnerVotingInfo);
                        $that._listValues();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listValues: function() {

                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        qaId: $that.printOwnerVotingInfo.qaId
                    }
                };
                //发送get请求
                vc.http.apiGet('/question.listUserQuestionAnswer',
                    param,
                    function(json, res) {
                        let _ownerVotingInfo = JSON.parse(json);
                        let _titleValues = $that.printOwnerVotingInfo.titleValues;
                        _ownerVotingInfo.data.forEach(_value => {
                            _titleValues.forEach(_title => {
                                _value[_title.qaValue] = '';
                                if (_value.hasOwnProperty('values')) {
                                    _value.values.forEach(tmpValue => {
                                        if (tmpValue.qaValue == _title.qaValue) {
                                            _value[_title.qaValue] = 'V';
                                        }
                                    })
                                }
                            })
                        });
                        $that.printOwnerVotingInfo.userVotes = _ownerVotingInfo.data;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _printPurchaseApplyDiv: function() {
                $that.printFlag = '1';
                document.getElementById("print-btn").style.display = "none"; //隐藏
                window.print();
                //$that.printFlag = false;
                window.opener = null;
                window.close();
            },
            _closePage: function() {
                window.opener = null;
                window.close();
            },
        }
    });
})(window.vc);