/**
    返省上报 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewReportInfoBackCityInfo:{
                index:0,
                flowComponent:'viewReportInfoBackCityInfo',
                name:'',
idCard:'',
tel:'',
source:'',
sourceCityName:'',
backTime:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadReportInfoBackCityInfoData();
        },
        _initEvent:function(){
            vc.on('viewReportInfoBackCityInfo','chooseReportInfoBackCity',function(_app){
                vc.copyObject(_app, vc.component.viewReportInfoBackCityInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewReportInfoBackCityInfo);
            });

            vc.on('viewReportInfoBackCityInfo', 'onIndex', function(_index){
                vc.component.viewReportInfoBackCityInfo.index = _index;
            });

        },
        methods:{

            _openSelectReportInfoBackCityInfoModel(){
                vc.emit('chooseReportInfoBackCity','openChooseReportInfoBackCityModel',{});
            },
            _openAddReportInfoBackCityInfoModel(){
                vc.emit('addReportInfoBackCity','openAddReportInfoBackCityModal',{});
            },
            _loadReportInfoBackCityInfoData:function(){

            }
        }
    });

})(window.vc);
