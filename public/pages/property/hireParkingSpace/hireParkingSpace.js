/**
    入驻小区
**/
(function(vc){
    vc.extends({
        data:{
            hireParkingSpaceInfo:{
                $step:{},
                index:0,
                infos:[],
            }
        },
        _initMethod:function(){
            vc.component._initStep();
        },

        _initEvent:function(){

           vc.on("hireParkingSpace", "notify", function(_info){
                vc.component.hireParkingSpaceInfo.infos[vc.component.hireParkingSpaceInfo.index] = _info;

                /*if(vc.component.hireParkingSpaceInfo.index == 0){
                    vc.emit('searchRoom','listenerFloorInfo',_info);
                }*/
            });

        },
        methods:{
            _initStep:function(){
                vc.component.hireParkingSpaceInfo.$step = $("#step");
                vc.component.hireParkingSpaceInfo.$step.step({
                    index: 0,
                    time: 500,
                    title: ["选择车位","业主信息","车辆信息"]
                });
                vc.component.hireParkingSpaceInfo.index = vc.component.hireParkingSpaceInfo.$step.getIndex();
            },
            _prevStep:function(){
                vc.component.hireParkingSpaceInfo.$step.prevStep();
                vc.component.hireParkingSpaceInfo.index = vc.component.hireParkingSpaceInfo.$step.getIndex();

                vc.emit('viewSelectParkingSpace', 'onIndex', vc.component.hireParkingSpaceInfo.index);
                vc.emit('viewOwnerInfo', 'onIndex', vc.component.hireParkingSpaceInfo.index);
                vc.emit('addCar', 'onIndex', vc.component.hireParkingSpaceInfo.index);
                vc.emit('parkingSpaceFee', 'onIndex', vc.component.hireParkingSpaceInfo.index);

                if(vc.component.hireParkingSpaceInfo.index == 1){
                    vc.emit('viewOwnerInfo','callBackOwnerInfo',{});
                }

            },
            _nextStep:function(){
                var _currentData = vc.component.hireParkingSpaceInfo.infos[vc.component.hireParkingSpaceInfo.index];
                if( _currentData == null || _currentData == undefined){
                    vc.toast("请选择或填写必选信息");
                    return ;
                }
                vc.component.hireParkingSpaceInfo.$step.nextStep();
                vc.component.hireParkingSpaceInfo.index = vc.component.hireParkingSpaceInfo.$step.getIndex();

                vc.emit('viewSelectParkingSpace', 'onIndex', vc.component.hireParkingSpaceInfo.index);
                vc.emit('viewOwnerInfo', 'onIndex', vc.component.hireParkingSpaceInfo.index);
                vc.emit('addCar', 'onIndex', vc.component.hireParkingSpaceInfo.index);
                vc.emit('parkingSpaceFee', 'onIndex', vc.component.hireParkingSpaceInfo.index);
                if(vc.component.hireParkingSpaceInfo.index == 1){
                    vc.emit('viewOwnerInfo','callBackOwnerInfo',{});
                }

            },
            _finishStep:function(){


                var _currentData = vc.component.hireParkingSpaceInfo.infos[vc.component.hireParkingSpaceInfo.index];
                if( _currentData == null || _currentData == undefined){
                    vc.toast("请选择或填写必选信息");
                    return ;
                }

                let _infos = vc.component.hireParkingSpaceInfo.infos

                let param = _infos[2];
                param.communityId = vc.getCurrentCommunity().communityId;
                param.ownerId = _infos[1].ownerId;
                param.psId = _infos[0].psId;

               vc.http.apiPost(
                   'owner.saveOwnerCar',
                   JSON.stringify(param),
                   {
                       emulateJSON:true
                    },
                    function(json,res){
                       if(res.status == 200){
                            vc.toast("请记得收费哦！");
                           //关闭model
                           vc.jumpToPage("/admin.html#/pages/property/listOwnerCar");
                           return ;
                       }
                       vc.toast(json);
                    },
                    function(errInfo,error){
                       console.log('请求失败处理');

                       vc.toast(errInfo);
                    });
            }
        }
    });
})(window.vc);