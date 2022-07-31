/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            wechatSmsTemplateManageInfo: {
                wechatSmsTemplates: [],
                total: 0,
                records: 1,
                moreCondition: false,
                templateId: '',
                conditions: {
                    smsTemplateId: '',
                    templateType: '',
                    templateId: '',
                    communityId: vc.getCurrentCommunity().communityId

                }
            }
        },
        _initMethod: function () {
            vc.component._listWechatSmsTemplates(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('wechatSmsTemplateManage', 'listWechatSmsTemplate', function (_param) {
                vc.component._listWechatSmsTemplates(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listWechatSmsTemplates(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listWechatSmsTemplates: function (_page, _rows) {

                vc.component.wechatSmsTemplateManageInfo.conditions.page = _page;
                vc.component.wechatSmsTemplateManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.wechatSmsTemplateManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/wechat/queryWechatTemplate',
                    param,
                    function (json, res) {
                        var _wechatSmsTemplateManageInfo = JSON.parse(json);
                        vc.component.wechatSmsTemplateManageInfo.total = _wechatSmsTemplateManageInfo.total;
                        vc.component.wechatSmsTemplateManageInfo.records = _wechatSmsTemplateManageInfo.records;
                        vc.component.wechatSmsTemplateManageInfo.wechatSmsTemplates = _wechatSmsTemplateManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.wechatSmsTemplateManageInfo.records,
                            dataCount: vc.component.wechatSmsTemplateManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddWechatSmsTemplateModal: function () {
                vc.emit('addWechatSmsTemplate', 'openAddWechatSmsTemplateModal', {});
            },
            _openEditWechatSmsTemplateModel: function (_wechatSmsTemplate) {
                vc.emit('editWechatSmsTemplate', 'openEditWechatSmsTemplateModal', _wechatSmsTemplate);
            },
            _openDeleteWechatSmsTemplateModel: function (_wechatSmsTemplate) {
                vc.emit('deleteWechatSmsTemplate', 'openDeleteWechatSmsTemplateModal', _wechatSmsTemplate);
            },
            _queryWechatSmsTemplateMethod: function () {
                vc.component._listWechatSmsTemplates(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.wechatSmsTemplateManageInfo.moreCondition) {
                    vc.component.wechatSmsTemplateManageInfo.moreCondition = false;
                } else {
                    vc.component.wechatSmsTemplateManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
