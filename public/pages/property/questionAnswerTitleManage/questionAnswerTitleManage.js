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
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
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
            _queryQuestionAnswerTitleMethod: function () {
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
            }


        }
    });
})(window.vc);
