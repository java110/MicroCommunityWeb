(function(vc){
    vc.extends({
        propTypes: {
           emitChooseActivitiesBeautifulStaff:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseActivitiesBeautifulStaffInfo:{
                activitiesBeautifulStaffs:[],
                _currentActivitiesBeautifulStaffName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseActivitiesBeautifulStaff','openChooseActivitiesBeautifulStaffModel',function(_param){
                $('#chooseActivitiesBeautifulStaffModel').modal('show');
                vc.component._refreshChooseActivitiesBeautifulStaffInfo();
                vc.component._loadAllActivitiesBeautifulStaffInfo(1,10,'');
            });
        },
        methods:{
            _loadAllActivitiesBeautifulStaffInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('activitiesBeautifulStaff.listActivitiesBeautifulStaffs',
                             param,
                             function(json){
                                var _activitiesBeautifulStaffInfo = JSON.parse(json);
                                vc.component.chooseActivitiesBeautifulStaffInfo.activitiesBeautifulStaffs = _activitiesBeautifulStaffInfo.activitiesBeautifulStaffs;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseActivitiesBeautifulStaff:function(_activitiesBeautifulStaff){
                if(_activitiesBeautifulStaff.hasOwnProperty('name')){
                     _activitiesBeautifulStaff.activitiesBeautifulStaffName = _activitiesBeautifulStaff.name;
                }
                vc.emit($props.emitChooseActivitiesBeautifulStaff,'chooseActivitiesBeautifulStaff',_activitiesBeautifulStaff);
                vc.emit($props.emitLoadData,'listActivitiesBeautifulStaffData',{
                    activitiesBeautifulStaffId:_activitiesBeautifulStaff.activitiesBeautifulStaffId
                });
                $('#chooseActivitiesBeautifulStaffModel').modal('hide');
            },
            queryActivitiesBeautifulStaffs:function(){
                vc.component._loadAllActivitiesBeautifulStaffInfo(1,10,vc.component.chooseActivitiesBeautifulStaffInfo._currentActivitiesBeautifulStaffName);
            },
            _refreshChooseActivitiesBeautifulStaffInfo:function(){
                vc.component.chooseActivitiesBeautifulStaffInfo._currentActivitiesBeautifulStaffName = "";
            }
        }

    });
})(window.vc);
