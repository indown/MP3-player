{
    let view={
        el:".newsongslist",
        template:`
        <ul class="songslist"></ul>
        `,
        render(data={}){
            let $el=$(this.el)
            $el.html(this.template)
            let {songs,id}=data
            console.log(songs)
            let songslist = songs.map((song)=>{
                let $li = $(`
                <li>
                    <a class="playButton" href="">
                    <div class="songinfo">
                        <div class="title"></div>
                        <div class="artist">
                            <div class="sqwarper">
                                <div class="sq"></div>
                            </div>
                            <p class="artistp"></p>
                        </div>
                    </div>
                        <div class="playbtnwarper">
                            <div class="playbtn"></div>
                        </div>
                    </a>
                </li>
                    `).attr('data-song-id', song.id)
                $li.find(".title").text(song.title)
                $li.find(".artistp").text(song.artist+' - '+song.album)
                $li.find(".playButton")[0].href="./song.html?id="+song.id
                
                return $li
            })
            $el.find('ul').empty()
            songslist.map((domli)=>{
                $el.find('ul').append(domli)
            })
        }
    }
    let model={
        data:{
            songs:[],
            selectId:undefined,
        },
        
        getsong(){
            var query = new AV.Query('MP3');
            return query.find().then((songs)=>{
              this.data.songs = songs.map((song)=>{
                return {id: song.id, ...song.attributes}
              })
              return songs
            })
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.avinit()
            this.model.getsong().then(()=>{
                this.view.render(this.model.data)
            })
           
            console.log(this.model)
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