(function(vc){
    vc.extends({
        propTypes: {
           emitChooseDataPrivilege:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseDataPrivilegeInfo:{
                dataPrivileges:[],
                _currentDataPrivilegeName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseDataPrivilege','openChooseDataPrivilegeModel',function(_param){
                $('#chooseDataPrivilegeModel').modal('show');
                vc.component._refreshChooseDataPrivilegeInfo();
                vc.component._loadAllDataPrivilegeInfo(1,10,'');
            });
        },
        methods:{
            _loadAllDataPrivilegeInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('dataPrivilege.listDataPrivileges',
                             param,
                             function(json){
                                var _dataPrivilegeInfo = JSON.parse(json);
                                vc.component.chooseDataPrivilegeInfo.dataPrivileges = _dataPrivilegeInfo.dataPrivileges;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseDataPrivilege:function(_dataPrivilege){
                if(_dataPrivilege.hasOwnProperty('name')){
                     _dataPrivilege.dataPrivilegeName = _dataPrivilege.name;
                }
                vc.emit($props.emitChooseDataPrivilege,'chooseDataPrivilege',_dataPrivilege);
                vc.emit($props.emitLoadData,'listDataPrivilegeData',{
                    dataPrivilegeId:_dataPrivilege.dataPrivilegeId
                });
                $('#chooseDataPrivilegeModel').modal('hide');
            },
            queryDataPrivileges:function(){
                vc.component._loadAllDataPrivilegeInfo(1,10,vc.component.chooseDataPrivilegeInfo._currentDataPrivilegeName);
            },
            _refreshChooseDataPrivilegeInfo:function(){
                vc.component.chooseDataPrivilegeInfo._currentDataPrivilegeName = "";
            }
        }

    });
})(window.vc);
