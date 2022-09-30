/**
    场地预约人 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewCommunitySpacePersonInfo:{
                index:0,
                flowComponent:'viewCommunitySpacePersonInfo',
                cspId:'',
spaceId:'',
personName:'',
personTel:'',
appointmentTime:'',
receivableAmount:'',
receivedAmount:'',
payWay:'',
state:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadCommunitySpacePersonInfoData();
        },
        _initEvent:function(){
            vc.on('viewCommunitySpacePersonInfo','chooseCommunitySpacePerson',function(_app){
                vc.copyObject(_app, vc.component.viewCommunitySpacePersonInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewCommunitySpacePersonInfo);
            });

            vc.on('viewCommunitySpacePersonInfo', 'onIndex', function(_index){
                vc.component.viewCommunitySpacePersonInfo.index = _index;
            });

        },
        methods:{

            _openSelectCommunitySpacePersonInfoModel(){
                vc.emit('chooseCommunitySpacePerson','openChooseCommunitySpacePersonModel',{});
            },
            _openAddCommunitySpacePersonInfoModel(){
                vc.emit('addCommunitySpacePerson','openAddCommunitySpacePersonModal',{});
            },
            _loadCommunitySpacePersonInfoData:function(){

            }
        }
    });

})(window.vc);
