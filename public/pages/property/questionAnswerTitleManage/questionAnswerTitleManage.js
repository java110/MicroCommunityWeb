/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            questionAnswerTitleManageInfo: {
                questionAnswerTitles: [],
                total: 0,
                records: 1,
                moreCondition: false,
                titleId: '',
                conditions: {
                    titleType: '',
                    qaTitle: '',
                    titleId: '',
                    qaId: '',
                    objType: '',
                    objId: ''
                }
            }
        },
        _initMethod: function () {
            let _qaId = vc.getParam('qaId');
            $that.questionAnswerTitleManageInfo.conditions.qaId = _qaId;
            $that.questionAnswerTitleManageInfo.conditions.objType = vc.getParam('objType');
            $that.questionAnswerTitleManageInfo.conditions.objId = vc.getParam('objId');
            vc.component._listQuestionAnswerTitles(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('questionAnswerTitleManage', 'listQuestionAnswerTitle', function (_param) {
                vc.component._listQuestionAnswerTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listQuestionAnswerTitles(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listQuestionAnswerTitles: function (_page, _rows) {
                vc.component.questionAnswerTitleManageInfo.conditions.page = _page;
                vc.component.questionAnswerTitleManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.questionAnswerTitleManageInfo.conditions
                };
                param.params.titleId = param.params.titleId.trim();
                param.params.qaTitle = param.params.qaTitle.trim();
                //发送get请求
                vc.http.apiGet('/questionAnswer/queryQuestionAnswerTitle',
                    param,
                    function (json, res) {
                        var _questionAnswerTitleManageInfo = JSON.parse(json);
                        vc.component.questionAnswerTitleManageInfo.total = _questionAnswerTitleManageInfo.total;
                        vc.component.questionAnswerTitleManageInfo.records = _questionAnswerTitleManageInfo.records;
                        vc.component.questionAnswerTitleManageInfo.questionAnswerTitles = _questionAnswerTitleManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.questionAnswerTitleManageInfo.records,
                            dataCount: vc.component.questionAnswerTitleManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddQuestionAnswerTitleModal: function () {
                vc.emit('addQuestionAnswerTitle', 'openAddQuestionAnswerTitleModal', {
                    qaId: $that.questionAnswerTitleManageInfo.conditions.qaId,
                    objId: $that.questionAnswerTitleManageInfo.conditions.objId,
                    objType: $that.questionAnswerTitleManageInfo.conditions.objType,
                });
            },
            _openEditQuestionAnswerTitleModel: function (_questionAnswerTitle) {
                vc.emit('editQuestionAnswerTitle', 'openEditQuestionAnswerTitleModal', _questionAnswerTitle);
            },
            _openDeleteQuestionAnswerTitleModel: function (_questionAnswerTitle) {
                vc.emit('deleteQuestionAnswerTitle', 'openDeleteQuestionAnswerTitleModal', _questionAnswerTitle);
            },
            //查询
            _queryQuestionAnswerTitleMethod: function () {
                vc.component._listQuestionAnswerTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetQuestionAnswerTitleMethod: function () {
                vc.component.questionAnswerTitleManageInfo.conditions.titleType = "";
                vc.component.questionAnswerTitleManageInfo.conditions.qaTitle = "";
                vc.component.questionAnswerTitleManageInfo.conditions.titleId = "";
                vc.component._listQuestionAnswerTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _goBack: function () {
                vc.goBack();
            },
            _moreCondition: function () {
                if (vc.component.questionAnswerTitleManageInfo.moreCondition) {
                    vc.component.questionAnswerTitleManageInfo.moreCondition = false;
                } else {
                    vc.component.questionAnswerTitleManageInfo.moreCondition = true;
                }
            },
            _getTitleTypeName: function (_titleType) {
                if (_titleType == '1001') {
                    return '单选';
                } else if (_titleType == '2002') {
                    return '多选';
                } else {
                    return '简答';
                }
            },
            _openQuestionValueModel: function (_questionAnswerTitle) {
                vc.emit('questionValue', 'openQuestionValueModel', _questionAnswerTitle);
            },
            _toQuestionValueModel: function (_questionAnswerTitle) {
                vc.jumpToPage('/#/pages/property/questionAnswerTitleValueManage?titleId=' + _questionAnswerTitle.titleId)
            }
        }
    });
})(window.vc);