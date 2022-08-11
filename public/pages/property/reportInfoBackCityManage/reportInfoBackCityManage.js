/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportInfoBackCityManageInfo: {
                reportInfoBackCitys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                backId: '',
                conditions: {
                    name: '',
                    idCard: '',
                    tel: '',
                    source: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listReportInfoBackCitys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('reportInfoBackCityManage', 'listReportInfoBackCity', function (_param) {
                vc.component._listReportInfoBackCitys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listReportInfoBackCitys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listReportInfoBackCitys: function (_page, _rows) {
                vc.component.reportInfoBackCityManageInfo.conditions.page = _page;
                vc.component.reportInfoBackCityManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.reportInfoBackCityManageInfo.conditions
                };
                param.params.name = param.params.name.trim();
                param.params.tel = param.params.tel.trim();
                param.params.idCard = param.params.idCard.trim();
                //发送get请求
                vc.http.apiGet('/reportInfoBackCity/queryReportInfoBackCity',
                    param,
                    function (json, res) {
                        var _reportInfoBackCityManageInfo = JSON.parse(json);
                        vc.component.reportInfoBackCityManageInfo.total = _reportInfoBackCityManageInfo.total;
                        vc.component.reportInfoBackCityManageInfo.records = _reportInfoBackCityManageInfo.records;
                        vc.component.reportInfoBackCityManageInfo.reportInfoBackCitys = _reportInfoBackCityManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.reportInfoBackCityManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddReportInfoBackCityModal: function () {
                vc.emit('addReportInfoBackCity', 'openAddReportInfoBackCityModal', {});
            },
            _openEditReportInfoBackCityModel: function (_reportInfoBackCity) {
                vc.emit('editReportInfoBackCity', 'openEditReportInfoBackCityModal', _reportInfoBackCity);
            },
            _openDeleteReportInfoBackCityModel: function (_reportInfoBackCity) {
                vc.emit('deleteReportInfoBackCity', 'openDeleteReportInfoBackCityModal', _reportInfoBackCity);
            },
            //查询
            _queryReportInfoBackCityMethod: function () {
                vc.component._listReportInfoBackCitys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetReportInfoBackCityMethod: function () {
                vc.component.reportInfoBackCityManageInfo.conditions.name = "";
                vc.component.reportInfoBackCityManageInfo.conditions.idCard = "";
                vc.component.reportInfoBackCityManageInfo.conditions.tel = "";
                vc.component.reportInfoBackCityManageInfo.conditions.source = "";
                vc.component._listReportInfoBackCitys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.reportInfoBackCityManageInfo.moreCondition) {
                    vc.component.reportInfoBackCityManageInfo.moreCondition = false;
                } else {
                    vc.component.reportInfoBackCityManageInfo.moreCondition = true;
                }
            },
            _payBackCity: function () {
                let _data = {
                    communityId: vc.getCurrentCommunity().communityId
                }
                vc.http.apiPost(
                    '/payment/toQrBackCityPay',
                    JSON.stringify(_data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        //谈二维码
                        $that._openRweiMaBackCityModel(_json.codeUrl);
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
            _openRweiMaBackCityModel: function (_url) {
                document.getElementById("qrcode").innerHTML = "";
                let qrcode = new QRCode(document.getElementById("qrcode"), {
                    text: "出入登记",  //你想要填写的文本
                    width: 200, //生成的二维码的宽度
                    height: 200, //生成的二维码的高度
                    colorDark: "#000000", // 生成的二维码的深色部分
                    colorLight: "#ffffff", //生成二维码的浅色部分
                    correctLevel: QRCode.CorrectLevel.H
                });
                qrcode.makeCode(_url);
                $('#payFeeResult').modal('show');
            }
        }
    });
})(window.vc);
