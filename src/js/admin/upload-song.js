{
    let view = {
        el:'.songInfo'
    }
    let model = {
        songs:{},
        token:null
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            window.eventHub.on('ajax',(data)=>{
                this.model.token = data
            })
            this.bindEvents(this.view.el)
        },
        qiniuInit(file,model){
            var config = {
                useCdnDomain: true,
                region: qiniu.region.z2
            };
            var putExtra = {
                // fname: "",
                // params: {},
                // mimeType: [] || null
            };
            let resUrl
            var observer = {
                    next(res) {
                        $('.spinnerWarper').addClass('active')
                    },
                    error(err) {
                        // ...
                    },
                    complete(res) {
                        resUrl = 'http://p3zwz04dp.bkt.clouddn.com/' + encodeURI(res.key)
                        model.songs.url=resUrl
                        window.eventHub.emit('upLoaderOver',JSON.parse(JSON.stringify(model.songs)))
                    }
                }
                let key = file.name
                var observable = qiniu.upload(file, key, model.token, putExtra, config)
                var subscription = observable.subscribe(observer)
                var requestUrl = qiniu.createMkFileUrl(
                    'p3zwz04dp.bkt.clouddn.com',
                    file.size,
                    key,
                    putExtra
                )
            
        },
        Id3Render(event){
            let file = event.target.files[0]
            jsmediatags.read(file, {
                    onSuccess:  (tag)=> {
                        let {album,artist,title} = tag.tags
                        if( "picture" in tag.tags ) {
                            let image = tag.tags.picture;
                            let base64String = "";
                            for (let i = 0; i < image.data.length; i++) {
                                base64String += String.fromCharCode(image.data[i]);
                            }
                            let img = "data:" + image.format + ";base64," + window.btoa(base64String)
                            this.model.songs.img=img
                        }
                        this.model.songs.album=album
                        this.model.songs.artist=artist
                        this.model.songs.title=title
                        this.qiniuInit(file,this.model)
                    },
                    onError: function (error) {
                        console.log(error);
                    }
                });
        },
        getTime() {
            setTimeout( ()=> {
                var duration = $("#audio")[0].duration;
                if (isNaN(duration)) {
                    this.getTime()
                }
                else {
                    let allTime = $("#audio")[0].duration;
                    this.model.songs.allTime = allTime
                    console.info("该歌曲的总时间为：" + $("#audio")[0].duration + "秒")
                }
            }, 10);
        },
        getObjectURL(file) {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        },
        bindEvents(input){
            $(input).find('#pickfiles').on('change',(input)=>{
                var objUrl = this.getObjectURL(input.target.files[0]);
                       $("#audio").attr("src", objUrl);
                        this.getTime();
                        this.Id3Render(input)
            })
        }
        
    }
    controller.init(view,model)
}
