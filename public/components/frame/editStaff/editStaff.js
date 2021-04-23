/**
    编辑员工
**/
(function(vc){
    var _fileUrl = '/callComponent/download/getFile/fileByObjId';
    vc.extends({
        data:{
            editStaffInfo:{
                userId:'',
                username:'',
                email:'',
                tel:'',
                sex:'',
                address:'',
                errorInfo:'',
                videoPlaying: false,
                photo:''
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
             vc.component.$on('edit_staff_event',function(_staffInfo){
                    vc.component.refreshEditStaffInfo(_staffInfo);
                    vc.component._initAddStaffMediaForEdit();
                    $('#editStaffModel').modal('show');
                });
        },
        methods:{
            refreshEditStaffInfo(_staffInfo){
                vc.component.editStaffInfo.userId = _staffInfo.userId;
                vc.component.editStaffInfo.username = _staffInfo.name;
                vc.component.editStaffInfo.email = _staffInfo.email;
                vc.component.editStaffInfo.tel = _staffInfo.tel;
                vc.component.editStaffInfo.sex = _staffInfo.sex;
                vc.component.editStaffInfo.address = _staffInfo.address;

                vc.component.editStaffInfo.photo = _fileUrl + "?objId=" +
                vc.component.editStaffInfo.userId + "&communityId=" + vc.getCurrentCommunity().communityId + "&fileTypeCd=12000&time=" + new Date();
            },
            editStaffValidate(){
                return vc.validate.validate({
                    editStaffInfo:vc.component.editStaffInfo
                },{
                    'editStaffInfo.username':[
                        {
                            limit:"required",
                            param:"",
                            errInfo:"用户名不能为空"
                        },
                        {
                            limit:"maxin",
                            param:"2,10",
                            errInfo:"用户名长度必须在2位至10位"
                        },
                    ],
                    'editStaffInfo.tel':[
                        {
                            limit:"required",
                            param:"",
                            errInfo:"手机号不能为空"
                        },
                        {
                            limit:"phone",
                            param:"",
                            errInfo:"不是有效的手机号"
                        }
                    ],
                    'editStaffInfo.sex':[
                        {
                            limit:"required",
                            param:"",
                            errInfo:"性别不能为空"
                        }
                    ],
                    'editStaffInfo.address':[
                        {
                            limit:"required",
                            param:"",
                            errInfo:"地址不能为空"
                        },
                        {
                            limit:"maxLength",
                            param:"200",
                            errInfo:"地址长度不能超过200位"
                        },
                    ]

                });
            },
            editStaffSubmit:function(){
                 if(!vc.component.editStaffValidate()){
                    vc.component.editStaffInfo.errorInfo = vc.validate.errInfo;
                    return ;
                }

                vc.component.editStaffInfo.errorInfo = "";
                vc.http.post(
                    'editStaff',
                    'modifyStaff',
                    JSON.stringify(vc.component.editStaffInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            $('#editStaffModel').modal('hide');
                            vc.component.$emit('editStaff_reload_event',{});
                            return ;
                        }
                        vc.component.editStaffInfo.errorInfo = json;
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.component.editStaffInfo.errorInfo = errInfo;
                     });
            },
            _editUserMedia: function () {
                return navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia || null;
            },
            _initAddStaffMediaForEdit: function () {
                if (vc.component._editUserMedia()) {
                    vc.component.editStaffInfo.videoPlaying = false;
                    var constraints = {
                        video: {
                            width:208,
                            height:208
                        },
                        audio: false
                    };
                    var video = document.getElementById('staffPhotoForEdit');
                    var media = navigator.getUserMedia(constraints, function (stream) {
                        var url = window.URL || window.webkitURL;
                        //video.src = url ? url.createObjectURL(stream) : stream;
                        try {
                            video.src = url ? url.createObjectURL(stream) : stream;
                        } catch (error) {
                            video.srcObject = stream;
                        }
                        video.play();
                        vc.component.editStaffInfo.videoPlaying = true;
                    }, function (error) {
                        console.log("ERROR");
                        console.log(error);
                    });
                } else {
                    console.log("初始化视频失败");
                }
            },
            _takePhotoForEdit: function () {
                if (vc.component.editStaffInfo.videoPlaying) {
                    var canvas = document.getElementById('canvasForEdit');
                    var video = document.getElementById('staffPhotoForEdit');
                    canvas.width = 208;
                    canvas.height = 208;
                    canvas.getContext('2d').drawImage(video, 0,0,208,208);
                    var data = canvas.toDataURL('image/jpeg',1.0);
                    vc.component.editStaffInfo.photo = data;
                    //document.getElementById('photo').setAttribute('src', data);
                }
            },
            _uploadEditPhoto: function (event) {
                $("#uploadEditStaffPhoto").trigger("click")
            },
            _chooseEditPhoto: function (event) {
                var photoFiles = event.target.files;
                if (photoFiles && photoFiles.length > 0) {
                    // 获取目前上传的文件
                    var file = photoFiles[0];// 文件大小校验的动作
                    if (file.size > 1024 * 1024 * 2) {
                        vc.toast("图片大小不能超过 2MB!")
                        return false;
                    }
                    var reader = new FileReader(); //新建FileReader对象
                    reader.readAsDataURL(file); //读取为base64
                    reader.onloadend = function (e) {
                        vc.component.editStaffInfo.photo = reader.result;
                    }
                }
            },
        },
    });
})(window.vc);