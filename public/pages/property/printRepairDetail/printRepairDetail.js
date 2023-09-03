(function(vc) {

    vc.extends({
        data: {
            printRepairDetailInfo: {
                repairId: '',
                repairTypeName: '',
                appointmentTime: '',
                repairName: '',
                tel: '',
                repairObjName: '',
                context: '',
                repairUsers: [],
                maintenanceType: '',
                repairMaterials: '',
                repairFee: '',
            },
            printFlag: '0',
            nowTime: ''
        },
        _initMethod: function() {
            // 加载数据
            vc.component._initPrintRepairDetailDateInfo();
            // 当前时间
            let myDate = new Date();
            $that.nowTime = myDate.toLocaleDateString();
        },
        _initEvent: function() {
            // vc.on('printPurchaseApply', 'openPrintPurchaseApplyModal', function (_purchaseApplyDetailInfo) {
            //     $that.printRepairDetailInfo = _purchaseApplyDetailInfo;
            //     $('#printPurchaseApplyModel').modal('show');
            // });
        },
        methods: {
            _initPrintRepairDetailDateInfo: function() {
                let _repairId = vc.getParam('repairId');
                let _repairType = vc.getParam("repairType")
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        repairId: _repairId,
                        communityId: vc.getCurrentCommunity().communityId,
                        repairType: _repairType
                    }
                };

                //发送get请求
                vc.http.apiGet('/ownerRepair.listOwnerRepairs',
                    param,
                    function(json, res) {
                        var _repairDetailInfo = JSON.parse(json);
                        console.log('here Res :', _repairDetailInfo);
                        vc.copyObject(_repairDetailInfo.data[0], $that.printRepairDetailInfo);
                        console.log('that.info : ', $that.printRepairDetailInfo);
                        //查询处理轨迹
                        $that._loadRepairUser();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },

            /**
             * 查询处理轨迹
             */
            _loadRepairUser: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        repairId: $that.printRepairDetailInfo.repairId
                    }
                };
                //发送get请求
                vc.http.apiGet('ownerRepair.listRepairStaffs',
                    param,
                    function(json, res) {
                        var _repairStaffsInfo = JSON.parse(json);
                        let _repairs = _repairStaffsInfo.data;
                        console.log('repairUsers : ', _repairs);
                        $that.printRepairDetailInfo.repairUsers = _repairs;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _printPurchaseApplyDiv: function() {

                $that.printFlag = '1';
                console.log('console.log($that.printFlag);', $that.printFlag);
                document.getElementById("print-btn").style.display = "none"; //隐藏

                window.print();
                //$that.printFlag = false;
                window.opener = null;
                window.close();
            },
            _closePage: function() {
                window.opener = null;
                window.close();
            }
        }
    });

})(window.vc);