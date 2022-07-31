/**
    物业公司 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewPropertyCompanyInfo:{
                index:0,
                flowComponent:'viewPropertyCompanyInfo',
                name:'',
address:'',
tel:'',
corporation:'',
foundingTime:'',
nearbyLandmarks:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadPropertyCompanyInfoData();
        },
        _initEvent:function(){
            vc.on('viewPropertyCompanyInfo','choosePropertyCompany',function(_app){
                vc.copyObject(_app, vc.component.viewPropertyCompanyInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewPropertyCompanyInfo);
            });

            vc.on('viewPropertyCompanyInfo', 'onIndex', function(_index){
                vc.component.viewPropertyCompanyInfo.index = _index;
            });

        },
        methods:{

            _openSelectPropertyCompanyInfoModel(){
                vc.emit('choosePropertyCompany','openChoosePropertyCompanyModel',{});
            },
            _openAddPropertyCompanyInfoModel(){
                vc.emit('addPropertyCompany','openAddPropertyCompanyModal',{});
            },
            _loadPropertyCompanyInfoData:function(){

            }
        }
    });

})(window.vc);
