(function(vc) {
    vc.extends({
        propTypes: {
            emitChooseQuestionTitle: vc.propTypes.string
        },
        data: {
            chooseQuestionTitleInfo: {
                questionTitles: [],
                _currentQuestionTitleName: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('chooseQuestionTitle', 'openQuestionTitleModel', function(_param) {
                $('#chooseQuestionTitleModel').modal('show');
                $that._refreshChooseQuestionTitleInfo();
                $that._loadAllQuestionTitleInfo(1, 10, '');
            });
            vc.on('chooseQuestionTitle', 'paginationPlus', 'page_event', function(_currentPage) {
                vc.component._loadAllQuestionTitleInfo(_currentPage, 10, '');
            });
        },
        methods: {
            _loadAllQuestionTitleInfo: function(_page, _row, _name) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        qaName: _name
                    }
                };

                //发送get请求
                vc.http.apiGet('/question.listQuestionTitle',
                    param,
                    function(json) {
                        var _questionTitleInfo = JSON.parse(json);
                        $that.chooseQuestionTitleInfo.questionTitles = _questionTitleInfo.data;
                        vc.emit('chooseQuestionTitle', 'paginationPlus', 'init', {
                            total: _questionTitleInfo.records,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseQuestionTitle: function(_questionTitle) {
                vc.emit($props.emitChooseQuestionTitle, 'chooseQuestionTitle', _questionTitle);
                $('#chooseQuestionTitleModel').modal('hide');
            },
            queryQuestionTitles: function() {
                $that._loadAllQuestionTitleInfo(1, 10, $that.chooseQuestionTitleInfo._currentQuestionTitleName);
            },
            _refreshChooseQuestionTitleInfo: function() {
                $that.chooseQuestionTitleInfo._currentQuestionTitleName = "";
            }
        }

    });
})(window.vc);