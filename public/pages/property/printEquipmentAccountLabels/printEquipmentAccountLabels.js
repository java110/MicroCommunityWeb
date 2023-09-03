(function (vc) {

    vc.extends({
        data: {
            equipmentInfo: {
                machineIds:[],
                equipmentAccounts:[],
            },
            yqName:'',
            printFlag:'0',
            nowTime: ''
        },
        _initMethod: function () {
            $that.equipmentInfo.machineIds = vc.getParam('machineIds');
            vc.component._initlDateInfo();
            // 当前时间
            vc.component.equipmentInfo.yqName = vc.getCurrentCommunity().name;
            let myDate = new Date();
            $that.nowTime = myDate.toLocaleDateString();
        },
        _initEvent: function () {
          
        },
        methods: {
            _initlDateInfo: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        machineIds: $that.equipmentInfo.machineIds,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                    vc.http.apiGet('/equipmentAccount.listEquipmentAccount',
                    param,
                    function (json, res) {
                        var _equipmentAccountManageInfo = JSON.parse(json);
                        vc.component.equipmentInfo.equipmentAccounts =_equipmentAccountManageInfo.data;
                        setTimeout(function(){
                            $that._generatorQrCode();
                        },2000)
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _generatorQrCode:function(){
                $that.equipmentInfo.equipmentAccounts.forEach(item => {
                    let qrcode = new QRCode('a'+item.machineId, {
                        text: item.url,  //你想要填写的文本
                        width: 200, //生成的二维码的宽度
                        height: 200, //生成的二维码的高度
                        colorDark: "#000000", // 生成的二维码的深色部分
                        colorLight: "#ffffff", //生成二维码的浅色部分
                        correctLevel: QRCode.CorrectLevel.H
                    });
                });
            },
            _printInspectionRouteDiv: function () {
                
                $that.printFlag = '1';
                console.log('console.log($that.printFlag);',$that.printFlag);
                document.getElementById("print-btn").style.display="none";//隐藏

                window.print();
                //$that.printFlag = false;
                window.opener=null;
                window.close();
            },
            _closePage: function () {
                window.opener=null;
                window.close();
            }
        }
    });

})(window.vc);
