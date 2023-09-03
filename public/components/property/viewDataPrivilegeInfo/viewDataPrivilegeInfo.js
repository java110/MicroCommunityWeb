/**
    数据权限 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewDataPrivilegeInfo:{
                index:0,
                flowComponent:'viewDataPrivilegeInfo',
                name:'',
code:'',
communityId:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadDataPrivilegeInfoData();
        },
        _initEvent:function(){
            vc.on('viewDataPrivilegeInfo','chooseDataPrivilege',function(_app){
                vc.copyObject(_app, vc.component.viewDataPrivilegeInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewDataPrivilegeInfo);
            });

            vc.on('viewDataPrivilegeInfo', 'onIndex', function(_index){
                vc.component.viewDataPrivilegeInfo.index = _index;
            });

        },
        methods:{

            _openSelectDataPrivilegeInfoModel(){
                vc.emit('chooseDataPrivilege','openChooseDataPrivilegeModel',{});
            },
            _openAddDataPrivilegeInfoModel(){
                vc.emit('addDataPrivilege','openAddDataPrivilegeModal',{});
            },
            _loadDataPrivilegeInfoData:function(){

            }
        }
    });

})(window.vc);
