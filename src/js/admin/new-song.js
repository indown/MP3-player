{
    let view = {
        el: ".newsong",
        template:`
        音乐
        `,
        rendaer(data){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            window.eventHub.on('new',(data)=>{
                this.active()
            })
            window.eventHub.on('select',(data)=>{
                this.deactive()
            })
            $(this.view.el).on('click',()=>{
                window.eventHub.emit('new')
            })
        },
        active(){
            $(this.view.el).addClass('active')
        },
        deactive(){
            $(this.view.el).removeClass('active')
        }
    }
    controller.init(view,model)
}