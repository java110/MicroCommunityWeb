/**
 权限组
 **/
(function (vc) {

    vc.extends({
        data: {
            parkingAreaTextInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                paId: '',
                texts: []
            }
        },

        _initMethod: function () {
            $that.parkingAreaTextInfo.paId = vc.getParam('paId');
            $that._initTexts();
            $that._listParkAreaTexts();
        },
        _initEvent: function () {

        },
        methods: {

            /**
             * 初始化
             * 类型：1001 月租车进场，2002 月租车出场，3003 月租车到期，4004 临时车进场 5005 临时车出场 6006 临时车未缴费
             */
            _initTexts: function () {

                let _texts = [];
                //与租车进场
                _texts.push({
                    typeCd: '1001',
                    typeName: '月租车进场',
                });
                _texts.push({
                    typeCd: '2002',
                    typeName: '月租车出场',
                });
                _texts.push({
                    typeCd: '3003',
                    typeName: '月租车到期',
                });
                _texts.push({
                    typeCd: '4004',
                    typeName: '临时车进场',
                });
                _texts.push({
                    typeCd: '5005',
                    typeName: '临时车出场',
                });
                _texts.push({
                    typeCd: '6006',
                    typeName: '临时车未缴费',
                });

                _texts.forEach(item => {
                    item.voice = "";
                    item.text1 = "";
                    item.text2 = "";
                    item.text3 = "";
                    item.text4 = "";
                });
                $that.parkingAreaTextInfo.texts = _texts;
            },
            _listParkAreaTexts: function () {
                var param = {
                    params: {
                        paId: $that.parkingAreaTextInfo.paId,
                        row: 10,
                        page: 1
                    }
                };
                //发送get请求
                vc.http.apiGet('/parkingAreaText.listParkingAreaText', param,
                    function (json, res) {
                        var _parkingAreaTexts = JSON.parse(json);
                        _parkingAreaTexts = _parkingAreaTexts.data;
                        if (_parkingAreaTexts.lenth < 1) {
                            return;
                        }
                        _parkingAreaTexts.forEach(text => {
                            $that.parkingAreaTextInfo.texts.forEach(item => {
                                if (text.typeCd == item.typeCd) {
                                    vc.copyObject(text, item);
                                }
                            })
                        })
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _saveParkingAreaText: function (_item) {

                if (!_item.voice) {
                    vc.toast('语音不能为空');
                    return;
                }
                _item.communityId = vc.getCurrentCommunity().communityId;
                _item.paId = $that.parkingAreaTextInfo.paId;
                vc.http.apiPost(
                    '/parkingAreaText.saveParkingAreaText',
                    JSON.stringify(_item),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        console.log(_json)
                        vc.toast(_json.msg);


                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });

            }
        }
    });

})(window.vc);