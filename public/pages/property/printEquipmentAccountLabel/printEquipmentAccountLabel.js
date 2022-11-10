(function (vc) {

    vc.extends({
        data: {
            printEquipmentAccountInfo: {
                machineId: '',
                machineName: '',
                machineCode: '',
                brand: '',
                model: '',
                locationDetail: '',
                firstEnableTime: '',
                warrantyDeadline: '',
                usefulLife: '',
                importanceLevel: '',
                levelName: '',
                state: '',
                purchasePrice: '',
                netWorth: '',
                useOrgId: "",
                useOrgName: "",
                useUserId: "",
                useUserName: "",
                useUseTel: "",
                chargeOrgId: "",
                chargeOrgName: "",
                chargeOrgTel: "",
                chargeUseId: "",
                chargeUseName: "",
                remark: '',
                yqName: '',
                url:''
            },
            printFlag:'0',
            nowTime: ''
        },
        _initMethod: function () {
            // 加载数据
            vc.component._initPrintRepairDetailDateInfo();
            // 当前时间
            vc.component.printEquipmentAccountInfo.yqName = vc.getCurrentCommunity().name;
            let myDate = new Date();
            $that.nowTime = myDate.toLocaleDateString();
        },
        _initEvent: function () {
          
        },
        methods: {
            _initPrintRepairDetailDateInfo: function () {
                let _repairId = vc.getParam('machineId');
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        machineId: _repairId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/equipmentAccount.listEquipmentAccount',
                param,
                function (json, res) {
                    var _repairDetailInfo = JSON.parse(json);
                    vc.copyObject(_repairDetailInfo.data[0], $that.printEquipmentAccountInfo);
                    document.getElementById("qrcode").innerHTML = "";
                    let qrcode = new QRCode(document.getElementById("qrcode"), {
                        text: $that.printEquipmentAccountInfo.url,  //你想要填写的文本
                        width: 200, //生成的二维码的宽度
                        height: 200, //生成的二维码的高度
                        colorDark: "#000000", // 生成的二维码的深色部分
                        colorLight: "#ffffff", //生成二维码的浅色部分
                        correctLevel: QRCode.CorrectLevel.H
                    });
                    qrcode.makeCode();

                },
                function (errInfo, error) {
                    console.log('请求失败处理');
                }
                );
            },

            _printPurchaseApplyDiv: function () {
                
                $that.printFlag = '1';
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
