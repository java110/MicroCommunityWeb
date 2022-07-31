/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            systemGoldSettingManageInfo:{
                systemGoldSettings:[],
                total:0,
                records:1,
                moreCondition:false,
                settingId:'',
                conditions:{
                    title:'',

                }
            }
        },
        _initMethod:function(){
            vc.component._listSystemGoldSettings(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            
            vc.on('systemGoldSettingManage','listSystemGoldSetting',function(_param){
                  vc.component._listSystemGoldSettings(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listSystemGoldSettings(_currentPage,DEFAULT_ROWS);
            });
        },
        methods:{
            _listSystemGoldSettings:function(_page, _rows){

                vc.component.systemGoldSettingManageInfo.conditions.page = _page;
                vc.component.systemGoldSettingManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.systemGoldSettingManageInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('/systemGoldSetting/querySystemGoldSetting',
                             param,
                             function(json,res){
                                var _systemGoldSettingManageInfo=JSON.parse(json);
                                vc.component.systemGoldSettingManageInfo.total = _systemGoldSettingManageInfo.total;
                                vc.component.systemGoldSettingManageInfo.records = _systemGoldSettingManageInfo.records;
                                vc.component.systemGoldSettingManageInfo.systemGoldSettings = _systemGoldSettingManageInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.systemGoldSettingManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddSystemGoldSettingModal:function(){
                vc.emit('addSystemGoldSetting','openAddSystemGoldSettingModal',{});
            },
            _openEditSystemGoldSettingModel:function(_systemGoldSetting){
                vc.emit('editSystemGoldSetting','openEditSystemGoldSettingModal',_systemGoldSetting);
            },
            _openDeleteSystemGoldSettingModel:function(_systemGoldSetting){
                vc.emit('deleteSystemGoldSetting','openDeleteSystemGoldSettingModal',_systemGoldSetting);
            },
            _querySystemGoldSettingMethod:function(){
                vc.component._listSystemGoldSettings(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.systemGoldSettingManageInfo.moreCondition){
                    vc.component.systemGoldSettingManageInfo.moreCondition = false;
                }else{
                    vc.component.systemGoldSettingManageInfo.moreCondition = true;
                }
            }

             
        }
    });
})(window.vc);
