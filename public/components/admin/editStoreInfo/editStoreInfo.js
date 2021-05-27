(function(vc,vm){

    vc.extends({
        data:{
            editStoreInfoInfo:{
                storeInfoId:'',
                name:'',
                icon:'',
                tel:'',
                site:'',
                seq:'',
                workTime:'',
                remark:'',

            }
        },
         _initMethod:function(){
            $that._initEditProduct();
         },
         _initEvent:function(){
             vc.on('editStoreInfo','openEditStoreInfoModal',function(_params){
                vc.component.refreshEditStoreInfoInfo();
                $('#editStoreInfoModel').modal('show');
                vc.copyObject(_params, vc.component.editStoreInfoInfo );

                let _photos = [];
                _photos.push(vc.component.editStoreInfoInfo.icon);
                vc.emit('editIconCover','uploadImage', 'notifyPhotos',_photos);
                vc.component.editStoreInfoInfo.communityId = vc.getCurrentCommunity().communityId;
                $(".editSummernote").summernote('code', vc.component.editStoreInfoInfo.remark);
            });

            vc.on("editIcon", "notifyUploadCoverImage", function (_param) {
                if(_param.length > 0){
                    vc.component.editStoreInfoInfo.icon = _param[0];
                }else{
                    vc.component.editStoreInfoInfo.icon = '';
                }
                
            });
        },
        methods:{
            editStoreInfoValidate:function(){
                        return vc.validate.validate({
                            editStoreInfoInfo:vc.component.editStoreInfoInfo
                        },{
                            'editStoreInfoInfo.name':[
{
                            limit:"required",
                            param:"",
                            errInfo:"商户名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"50",
                            errInfo:"商户名称太长"
                        },
                    ],
'editStoreInfoInfo.tel':[
 {
                            limit:"maxLength",
                            param:"13",
                            errInfo:"电话太长"
                        },
                    ],
'editStoreInfoInfo.site':[
 {
                            limit:"maxLength",
                            param:"100",
                            errInfo:"商户位置太长"
                        },
                    ],
'editStoreInfoInfo.seq':[
{
                            limit:"required",
                            param:"",
                            errInfo:"显示序号不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"显示序号不是有效数字"
                        },
                    ],
'editStoreInfoInfo.workTime':[
 {
                            limit:"maxLength",
                            param:"200",
                            errInfo:"工作时间太长"
                        },
                    ],
'editStoreInfoInfo.remark':[
 {
                            limit:"maxLength",
                            param:"5000",
                            errInfo:"备注太长"
                        },
                    ],
'editStoreInfoInfo.storeInfoId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"商户信息ID不能为空"
                        }]

                        });
             },
            editStoreInfo:function(){
                if(!vc.component.editStoreInfoValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    '/storeInfo/updateStoreInfo',
                    JSON.stringify(vc.component.editStoreInfoInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editStoreInfoModel').modal('hide');
                             vc.emit('storeInfoManage','listStoreInfo',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            _initEditProduct:function(){
                let $summernote = $('.editSummernote').summernote({
                    lang: 'zh-CN',
                    height: 300,
                    placeholder: '必填，请输入商家信息',
                    callbacks: {
                        onImageUpload: function (files, editor, $editable) {
                            $that.sendEditFile($summernote, files);
                        },
                        onChange: function (contents, $editable) {
                            $that.editStoreInfoInfo.remark = contents;
                        }
                    },
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'italic', 'underline', 'clear']],
                        ['fontname', ['fontname']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['height', ['height']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture']],
                        ['view', ['fullscreen', 'codeview']],
                        ['help', ['help']]
                    ],
                });

            },
            sendEditFile: function ($summernote, files) {
                console.log('上传图片', files);

                var param = new FormData();
                param.append("uploadFile", files[0]);
                param.append('communityId', vc.getCurrentCommunity().communityId);

                vc.http.upload(
                    'addNoticeView',
                    'uploadImage',
                    param,
                    {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            var data = JSON.parse(json);
                            //关闭model
                            $summernote.summernote('insertImage', "/callComponent/download/getFile/file?fileId=" + data.fileId + "&communityId=" + vc.getCurrentCommunity().communityId);
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });

            },
            _closeStoreInfo: function () {
                $that.refreshEditStoreInfoInfo();
                vc.emit('storeInfoManage','listStoreInfo',{});
            },
            refreshEditStoreInfoInfo:function(){
                vc.component.editStoreInfoInfo= {
                  storeInfoId:'',
                    name:'',
                    icon:'',
                    tel:'',
                    site:'',
                    seq:'',
                    workTime:'',
                    remark:'',

                                    }
                                }
                            }
                        });

})(window.vc,window.vc.component);
