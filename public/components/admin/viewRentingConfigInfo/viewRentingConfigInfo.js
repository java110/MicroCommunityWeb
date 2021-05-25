/**
    租聘设置 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewRentingConfigInfo:{
                index:0,
                flowComponent:'viewRentingConfigInfo',
                rentingType:'',
rentingFormula:'',
servicePrice:'',
serviceOwnerRate:'',
serviceTenantRate:'',
adminSeparateRate:'',
proxySeparateRate:'',
propertySeparateRate:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadRentingConfigInfoData();
        },
        _initEvent:function(){
            vc.on('viewRentingConfigInfo','chooseRentingConfig',function(_app){
                vc.copyObject(_app, vc.component.viewRentingConfigInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewRentingConfigInfo);
            });

            vc.on('viewRentingConfigInfo', 'onIndex', function(_index){
                vc.component.viewRentingConfigInfo.index = _index;
            });

        },
        methods:{

            _openSelectRentingConfigInfoModel(){
                vc.emit('chooseRentingConfig','openChooseRentingConfigModel',{});
            },
            _openAddRentingConfigInfoModel(){
                vc.emit('addRentingConfig','openAddRentingConfigModal',{});
            },
            _loadRentingConfigInfoData:function(){

            }
        }
    });

})(window.vc);
