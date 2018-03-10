

{
    let view = {
        el:'.app',
        init(){
            this.$el = $(this.el)
          },
        render(data) {
            let { song, status } = data
            // $('.page')[0].css('background', `transparent url(${song.img})`)
            // $('.page')[0].style=` display: flex; 
            // flex-direction: column; 
            // height: 100vh;
            // background:transparent url(${song.img}) no-repeat center;
            // background-size: cover;
            // `
            this.$el.find('img.cover').attr('src', song.img)
            if (this.$el.find('audio').attr('src') !== song.url) {
                let audio = this.$el.find('audio').attr('src', song.url).get(0)
                audio.onended = () => { window.eventHub.emit('songEnd') }
                audio.ontimeupdate = () => { this.showLyric(audio.currentTime) }
            }
            this.$el.find('.title').text(song.title)
            this.$el.find('.artist').text(song.artist)
            
            this.coverplaiying(status)
            let {lyrics} = song
            lyrics.split('\n').map((string)=>{
                let p = document.createElement('p')
                let regex = /\[([\d:.]+)\](.+)/
                let matches =string.match(regex)
                if(matches){
                  p.textContent = matches[2]
                  let time = matches[1]
                  let parts = time.split(':')
                  let minutes = parts[0]
                  let seconds = parts[1]
                  let newTime = parseInt(minutes,10) * 60 + parseFloat(seconds,10)
                  p.setAttribute('data-time', newTime)
                }else{
                  p.textContent = string
                }
                this.$el.find('.lrcwp>.lrc').append(p)
              })
        },
        showLyric(time){
            let allP = this.$el.find('.lrcwp>.lrc>p')
            let p
            let app = 0
            for(let i =0;i<allP.length;i++){
              if(i===allP.length-1){
                p = allP[i]
                break
              }else{
                let currentTime = allP.eq(i).attr('data-time')
                let nextTime = allP.eq(i+1).attr('data-time')
                if(currentTime <= time && time < nextTime){
                  p = allP[i]
                  app=p
                  break
                }
              }
            }
            
            let pHeight
            if(app === 0){
                pHeight = this.$el.find('.lrcwp>.lrc')[0].getBoundingClientRect().top
            }else{
                pHeight = app.getBoundingClientRect().top
            }
            console.log(pHeight)
            
            let linesHeight = this.$el.find('.lrcwp>.lrc')[0].getBoundingClientRect().top
            let height = pHeight - linesHeight
            
            this.$el.find('.lrcwp>.lrc').css({
              transform: `translateY(${- (height - 25)}px)`
            })
            $(p).addClass('active').siblings('.active').removeClass('active')
          },
        open(data){
            let {status} = data
            if(status === 'playing'){
                this.$el.find('audio')[0].pause()
              }else if(status === 'pause'){
                this.$el.find('audio')[0].play()
               
            }
        },
        coverplaiying(status){
            if(status === 'playing'){
                this.$el.find('.cover').addClass('playing')
              }else{
                this.$el.find('.cover').removeClass('playing')
              }
        }
            
         
         
            
         
        }
    let model = {
        data:{
            song:{

            },
            status:'playing'
        },
        get(id){
            var query = new AV.Query('MP3')
            return query.get(id).then((song)=>{
              Object.assign(this.data.song, {id: song.id, ...song.attributes})
              return song
            })
          }
    }
    let controller = {
        init(){
            this.view = view
            this.model = model
            this.view.init()
            this.avinit()
            let id = this.getSongId()
            this.model.get(id).then(()=>{
                this.view.render(this.model.data)
                // this.view.$el.find('audio')[0].play()
            })
            this.bindEvents(this.model.data)
        },
        bindEvents(data){
            $(this.view.el).find('.songdiscwp').on('click', ()=> {
                if(this.model.data.status === 'playing'){
                    this.view.open(this.model.data)
                    this.model.data.status = 'pause'
                    this.view.coverplaiying(this.model.data.status)
                }else if(this.model.data.status === 'pause'){
                    this.view.open(this.model.data)
                    this.model.data.status = 'playing'
                    this.view.coverplaiying(this.model.data.status)
                }
            })
            window.eventHub.on('songEnd',()=>{
                console.log(1)
                this.model.data.status = 'pause'
                this.view.render(this.model.data)
            })
            
            
          },
        getSongId(){

            let search = window.location.search
            if(search.indexOf('?') === 0){
              search = search.substring(1)
            }
            
            let array = search.split('&').filter((v=>v))
            let id = ''
      
            for(let i = 0 ;i<array.length; i++){
              let kv = array[i].split('=')
              let key = kv[0]
              let value = kv[1]
              if(key ==='id'){
                id = value
                break
              }
            }
            return id
        },
        avinit(){
            var APP_ID = 'G5yOdsGmxXUewCPn0L07q2OM-gzGzoHsz';
            var APP_KEY = 'iOivIiSOU4ensUM1lO9xw4Op';

            AV.init({
                appId: APP_ID,
                appKey: APP_KEY
            });
        }
    }
        controller.init(view,model)
}
    
