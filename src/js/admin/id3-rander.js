{
    let view = {
        el:'.mediaLibrary'
    }
    let model = {

    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEvents($(this.view.el))
            
        },
        id3Rander(elem){
            function loadUrl(url, callback, reader) {
                var startDate = new Date().getTime();
                ID3.loadTags(url, function() {
                    var endDate = new Date().getTime();
                    if (typeof console !== "undefined") console.log("Time: " + ((endDate-startDate)/1000)+"s");
                    var tags = ID3.getAllTags(url);
                    elem.find("#artist")[0].value = tags.artist || "";
                    elem.find("#title")[0].value = tags.title || "";
                    elem.find("#album")[0].value = tags.album || "";
                    if( "picture" in tags ) {
                        var image = tags.picture;
                        var base64String = "";
                        for (var i = 0; i < image.data.length; i++) {
                            base64String += String.fromCharCode(image.data[i]);
                        }
                    elem.find("#art")[0].src = "data:" + image.format + ";base64," + window.btoa(base64String);
                    elem.find("#art")[0].style.display = "block";
                } else {
                    elem.find("#art")[0].style.display = "none";
                }
                if( callback ) { callback(); };
                },
                {tags: ["artist", "title", "album", "year", "comment", "track", "genre", "lyrics", "picture"],
                 dataReader: reader});
            }
              function loadFromFile(file) {
                  if(file){
                var url = file.urn ||file.name;
                console.log(file)
                loadUrl(url, null, FileAPIReader(file));
            }
            }
        
            function load(elem) {
                
                if (elem.find('#file')[0].id === "file") {
                    loadFromFile(elem.find('#file')[0].files[0]);
                    var objUrl = getObjectURL(elem.find('#file')[0].files[0]);
                        $("#audio").attr("src", objUrl);
                        getTime();
                } else {
                    loadFromLink(elem.find('#file')[0]);
                }
            }
            load(elem)
            console.log($(elem))
            
                
                    
                        
                    
               
                
            function getTime() {
                setTimeout(function () {
                    var duration = $("#audio")[0].duration;
                    if (isNaN(duration)) {
                        getTime();
                    }
                    else {
                        let allTime = $("#audio")[0].duration;
                        window.eventHub.emit('newTime', allTime)
                        console.info("该歌曲的总时间为：" + $("#audio")[0].duration + "秒")
                    }
                }, 10);
            }

            function getObjectURL(file) {
                var url = null;
                if (window.createObjectURL != undefined) { // basic
                    url = window.createObjectURL(file);
                } else if (window.URL != undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(file);
                } else if (window.webkitURL != undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(file);
                }
                return url;
            }


        },
        bindEvents(elem){
            let Elem = elem 
            window.eventHub.on('onchange',(elem)=>{
                this.id3Rander(Elem)
            })
        }
    }
    controller.init(view,model)
}