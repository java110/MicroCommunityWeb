/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            groupBuySettingManageInfo:{
                groupBuySettings:[],
                total:0,
                records:1,
                moreCondition:false,
                settingId:'',
                conditions:{
                    groupBuyName:'',
validHours:'',
settingId:'',

                }
            }
        },
        _initMethod:function(){
            vc.component._listGroupBuySettings(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            
            vc.on('groupBuySettingManage','listGroupBuySetting',function(_param){
                  vc.component._listGroupBuySettings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listGroupBuySettings(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listGroupBuySettings:function(_page, _rows){

                vc.component.groupBuySettingManageInfo.conditions.page = _page;
                vc.component.groupBuySettingManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.groupBuySettingManageInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('groupBuySetting.listGroupBuySettings',
                             param,
                             function(json,res){
                                var _groupBuySettingManageInfo=JSON.parse(json);
                                vc.component.groupBuySettingManageInfo.total = _groupBuySettingManageInfo.total;
                                vc.component.groupBuySettingManageInfo.records = _groupBuySettingManageInfo.records;
                                vc.component.groupBuySettingManageInfo.groupBuySettings = _groupBuySettingManageInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.groupBuySettingManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddGroupBuySettingModal:function(){
                vc.emit('addGroupBuySetting','openAddGroupBuySettingModal',{});
            },
            _openEditGroupBuySettingModel:function(_groupBuySetting){
                vc.emit('editGroupBuySetting','openEditGroupBuySettingModal',_groupBuySetting);
            },
            _openDeleteGroupBuySettingModel:function(_groupBuySetting){
                vc.emit('deleteGroupBuySetting','openDeleteGroupBuySettingModal',_groupBuySetting);
            },
            _queryGroupBuySettingMethod:function(){
                vc.component._listGroupBuySettings(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.groupBuySettingManageInfo.moreCondition){
                    vc.component.groupBuySettingManageInfo.moreCondition = false;
                }else{
                    vc.component.groupBuySettingManageInfo.moreCondition = true;
                }
            }

             
        }
    });
})(window.vc);
