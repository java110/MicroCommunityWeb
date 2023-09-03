/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            questionTitleInfo: {
                questionTitles: [],
                total: 0,
                records: 1,
                moreCondition: false,
                titleId: '',
                conditions: {
                    titleType: '',
                    itemTitle: '',
                    title: '',
                    titleId: '',
                    seq: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            $that._listQuestionTitles(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('questionTitle', 'listQuestionTitle', function(_param) {
                $that._listQuestionTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listQuestionTitles(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listQuestionTitles: function(_page, _rows) {
                $that.questionTitleInfo.conditions.page = _page;
                $that.questionTitleInfo.conditions.row = _rows;
                let param = {
                    params: $that.questionTitleInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/question.listQuestionTitle',
                    param,
                    function(json, res) {
                        let _questionTitleInfo = JSON.parse(json);
                        $that.questionTitleInfo.total = _questionTitleInfo.total;
                        $that.questionTitleInfo.records = _questionTitleInfo.records;
                        $that.questionTitleInfo.questionTitles = _questionTitleInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.questionTitleInfo.records,
                            dataCount: $that.questionTitleInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddQuestionTitleModal: function() {
                vc.emit('addQuestionTitle', 'openAddQuestionTitleModal', {
                    itemId: $that.questionTitleInfo.conditions.itemId,
                });
            },
            _openEditQuestionTitleModel: function(_questionTitle) {
                vc.emit('editQuestionTitle', 'openEditQuestionTitleModal', _questionTitle);
            },
            _openDeleteQuestionTitleModel: function(_questionTitle) {
                vc.emit('deleteQuestionTitle', 'openDeleteQuestionTitleModal', _questionTitle);
            },
            //查询
            _queryQuestionTitleMethod: function() {
                $that._listQuestionTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetQuestionTitleMethod: function() {
                $that.questionTitleInfo.conditions.titleId = "";
                $that.questionTitleInfo.conditions.itemTitle = "";
                $that.questionTitleInfo.conditions.titleType = "";
                $that._listQuestionTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if ($that.questionTitleInfo.moreCondition) {
                    $that.questionTitleInfo.moreCondition = false;
                } else {
                    $that.questionTitleInfo.moreCondition = true;
                }
            },
            _getTitleTypeName: function(_titleType) {
                if (_titleType == '1001') {
                    return '单选';
                } else if (_titleType == '2002') {
                    return '多选';
                } else {
                    return '简答';
                }
            },
            _openQuestionValueModel: function(_questionTitle) {
                vc.emit('questionTitleValue', 'openquestionTitleValueModel', _questionTitle);
            },
            _toQuestionValueModel: function(_questionTitle) {
                vc.jumpToPage('/#/pages/property/reportInfoAnswerValueManage?titleId=' + _questionTitle.titleId)
            }
        }
    });
})(window.vc);