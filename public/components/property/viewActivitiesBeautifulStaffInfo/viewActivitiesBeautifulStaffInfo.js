/**
    最美员工 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewActivitiesBeautifulStaffInfo:{
                index:0,
                flowComponent:'viewActivitiesBeautifulStaffInfo',
                ruleId:'',
staffId:'',
activitiesNum:'',
workContent:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadActivitiesBeautifulStaffInfoData();
        },
        _initEvent:function(){
            vc.on('viewActivitiesBeautifulStaffInfo','chooseActivitiesBeautifulStaff',function(_app){
                vc.copyObject(_app, vc.component.viewActivitiesBeautifulStaffInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewActivitiesBeautifulStaffInfo);
            });

            vc.on('viewActivitiesBeautifulStaffInfo', 'onIndex', function(_index){
                vc.component.viewActivitiesBeautifulStaffInfo.index = _index;
            });

        },
        methods:{

            _openSelectActivitiesBeautifulStaffInfoModel(){
                vc.emit('chooseActivitiesBeautifulStaff','openChooseActivitiesBeautifulStaffModel',{});
            },
            _openAddActivitiesBeautifulStaffInfoModel(){
                vc.emit('addActivitiesBeautifulStaff','openAddActivitiesBeautifulStaffModal',{});
            },
            _loadActivitiesBeautifulStaffInfoData:function(){

            }
        }
    });

})(window.vc);
