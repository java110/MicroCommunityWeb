(function (vc) {

    vc.extends({
        data: {
            printPayFeeInfo: {
                communityName: '',
                roomName: '',
                feePrices: 0.00,
                fees: [],
                feeTime: '',
                wechatName:''
            },
            printFlag: '0'
        },
        _initMethod: function () {
            //vc.component._initPrintPurchaseApplyDateInfo();

            $that.printPayFeeInfo.roomName = vc.getParam('roomName');
            $that.printPayFeeInfo.feeTime = vc.dateTimeFormat(new Date());

            let _feeInfo = vc.getData('_feeInfo');
            $that.printPayFeeInfo.communityName = vc.getCurrentCommunity().name;

            $that.printPayFeeInfo.feePrices = _feeInfo.totalAmount;
            $that.printPayFeeInfo.fees = _feeInfo.fees;

            $that._loadWechat();
        },
        _initEvent: function () {


        },
        methods: {
            _initPayFee: function () {

            },
            _loadWechat: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        weChatType: 1100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('smallWeChat.listSmallWeChats',
                    param,
                    function (json, res) {
                        var _smallWeChatInfo = JSON.parse(json);
                        var _smallWeChats = _smallWeChatInfo.smallWeChats;
                        if(_smallWeChats.length > 0){
                            $that.printPayFeeInfo.wechatName = _smallWeChats[0].name
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },

            _printPurchaseApplyDiv: function () {

                $that.printFlag = '1';
                console.log('console.log($that.printFlag);', $that.printFlag);
                document.getElementById("print-btn").style.display = "none";//隐藏

                window.print();
                //$that.printFlag = false;
                window.opener = null;
                window.close();
            },
            _closePage: function () {
                window.opener = null;
                window.close();
            }
        }
    });

})(window.vc);
