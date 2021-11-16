/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportInfoSettingManageInfo: {
                reportInfoSettings: [],
                total: 0,
                records: 1,
                moreCondition: false,
                settingId: '',
                conditions: {
                    name: '',
                    settingId: '',
                    communityId:vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listReportInfoSettings(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('reportInfoSettingManage','listReportInfoSetting', function (_param) {
                vc.component._listReportInfoSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listReportInfoSettings(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReportInfoSettings: function (_page, _rows) {

                vc.component.reportInfoSettingManageInfo.conditions.page = _page;
                vc.component.reportInfoSettingManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reportInfoSettingManageInfo.conditions
                };

                vc.http.apiGet('/reportInfoSetting/queryReportInfoSetting',
                    param,
                    function (json, res) {
                        var _reportInfoSettingManageInfo = JSON.parse(json);
                        vc.component.reportInfoSettingManageInfo.total = _reportInfoSettingManageInfo.total;
                        vc.component.reportInfoSettingManageInfo.records = _reportInfoSettingManageInfo.records;
                        vc.component.reportInfoSettingManageInfo.reportInfoSettings = _reportInfoSettingManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportInfoSettingManageInfo.records,
                            dataCount: vc.component.reportInfoSettingManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddReportInfoSettingModal: function () {
                vc.emit('addReportInfoSetting', 'openAddReportInfoSettingModal', {});
            },
            _openEditReportInfoSettingModel: function (_reportInfoSetting) {
                vc.emit('editReportInfoSetting', 'openEditReportInfoSettingModal', _reportInfoSetting);
            },
            _openDeleteReportInfoSettingModel: function (_reportInfoSetting) {
                vc.emit('deleteReportInfoSetting', 'openDeleteReportInfoSettingModal', _reportInfoSetting);
            },
            _queryReportInfoSettingMethod: function () {
                vc.component._listReportInfoSettings(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _toReportInfoSettingTitle:function(_reportInfoSetting){
                vc.jumpToPage('/admin.html#/pages/property/reportInfoSettingTitleManage?settingId='+_reportInfoSetting.settingId)
            },
            _moreCondition: function () {
                if (vc.component.reportInfoSettingManageInfo.moreCondition) {
                    vc.component.reportInfoSettingManageInfo.moreCondition = false;
                } else {
                    vc.component.reportInfoSettingManageInfo.moreCondition = true;
                }
            },
            _payInGoOut: function (_reportInfoSetting) {

                let _data = {
                    settingId: _reportInfoSetting.settingId,
                    communityId: vc.getCurrentCommunity().communityId
                }

                vc.http.apiPost(
                    '/payment/toQrInGoOutPay',
                    JSON.stringify(_data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        //谈二维码
                        $that._openRweiMaSettingModel(_json.codeUrl);
                        $('#payFeeResult').modal('show');
                        return;

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            _back: function () {
                $('#payFeeResult').modal('hide');
            },
            _openRweiMaSettingModel: function(_url){

                document.getElementById("qrcode").innerHTML="";
                let qrcode = new QRCode(document.getElementById("qrcode"), {
                    text: "出入登记",  //你想要填写的文本
                    width: 200, //生成的二维码的宽度
                    height: 200, //生成的二维码的高度
                    colorDark: "#000000", // 生成的二维码的深色部分
                    colorLight: "#ffffff", //生成二维码的浅色部分
                    correctLevel: QRCode.CorrectLevel.H
                });
                console.log(_url);
                qrcode.makeCode(_url);
            }


        }
    });
})(window.vc);
