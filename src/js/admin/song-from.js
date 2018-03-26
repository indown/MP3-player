{
    let view = {
        el:'.songForm',
        template: `
      <form class="form">
        <div class="row">
          <label>
          专辑
          </label>
          <input name="name" id="album" type="text" value="__album__">
        </div>
        <div class="row">
          <label>
          歌手
          </label>
          <input name="singer" id="artist" type="text" value="__artist__">
        </div>
        <div class="row">
          <label>
          歌名
          </label>
          <input name="url" id="title" type="text" value="__title__">
        </div>
        <div class="row">
          <label>
          外链
          </label>
          <input name="url" id="url" type="text" value="__url__">
        </div>
        <div class="row actions">
          <button type="submit" id="submit">保存</button>
          
        </div>
      </form>
    `,
        renderurl(data={}){
            $(this.el).find('#url')[0].value=data.url;
        },
        render(data = {}){
            let placeholders = ['album', 'artist', 'title', 'url']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if(data.img){
                $('#art')[0].src=data.img
                $('#art').show()
            }else{
                $('#art')[0].src=''
            }
            if(!data.allTime){
                $('#submit').hide()
            }else{

            }
                
            
            
            
            window.eventHub.emit('formRenderOK')
           
        },
        reset(){
            this.render({})
            this.renderurl({url:''})
        }
    }
    let model = {
        data : {
            
        },
        update(data){
            var mp3 = AV.Object.createWithoutData('MP3', this.data.id)
            mp3.set('album',data.album);
            mp3.set('artist',data.artist);
            mp3.set('title',data.title);
            mp3.set('url',data.url);
            mp3.set('allTime',data.allTime);
            mp3.set('img',data.img);
            return mp3.save().then((response)=>{
                Object.assign(this.data, data)
                window.eventHub.emit('update',JSON.parse(JSON.stringify(this.data)))
                this.data={}
                return response
              })
              
        },
        create(data){
            var MP3 = AV.Object.extend('MP3');
            var mp3 = new MP3();
            mp3.set('album',data.album);
            mp3.set('artist',data.artist);
            mp3.set('title',data.title);
            mp3.set('url',data.url);
            mp3.set('allTime',data.allTime);
            mp3.set('img',data.img);
            return mp3.save().then((newmp3) =>{
              let {id, attributes} = newmp3
              this.data.id = newmp3.id
              window.eventHub.emit('create',JSON.parse(JSON.stringify(this.data)))
              this.data={}
            }, (error) =>{
              console.error(error);
            });    
        }
        
    }
    let controller ={
        init(view,model){
            this.view = view
            this.model = model
            this.view.render()
            this.bindevents()
            window.eventHub.on('upLoaderOver',(data)=>{
                this.view.renderurl(data)
                this.view.render(data)
                this.model.data =data
                $('.spinnerWarper').removeClass('active')
            })
            window.eventHub.on('select',(data)=>{
                this.model.data = JSON.parse(JSON.stringify(data))
                this.view.render(this.model.data)
                this.view.renderurl(this.model.data)
            })
        },
        bindevents(){
            $(this.view.el).on('submit','form',(e)=>{
                e.preventDefault()
                this.getFromData(this.view.el)
                if(this.model.data.id){
                    this.model.update(this.model.data)
                    this.view.render(this.model.data)
                    
                    this.view.reset()
                    
                }else{
                    this.model.create(this.model.data)
                    this.view.reset()
                }
                
                
            })
        }
        ,
        getFromData(elem){
            
            this.model.data.artist = $(elem).find('#artist')[0].value
            this.model.data.album = $(elem).find('#album')[0].value
            this.model.data.title = $(elem).find('#title')[0].value
            this.model.data.url = $(elem).find('#url')[0].value
            this.model.data.img = $('#art')[0].src
            
        },
        
        

    }
    controller.init(view,model)
}