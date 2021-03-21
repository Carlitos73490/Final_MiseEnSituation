
const app = new Vue({
    el : "#app",
    data : {
        displayFormPortal : false,
        displayUI : false,
        backgroundImgPath : "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
        newPortal :{},
    },
    methods : {

        initForm : function (){
            this.newPortal = {
                name : "unPortal",
                color : "loremRouge",
                imgDataUrl : "",
            }
        },
        async portalImageChanged(event){
            let blob = await fetch(event.target.files.item(0)).then(r => r.blob());
            let dataUrl = await new Promise(resolve => {
                let reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
            this.newPortal.imgDataUrl = dataUrl
            console.log(dataUrl);
        },
        backgroundImageChanged(event){
            console.log(event.target.files)
            this.backgroundImgPath = URL.createObjectURL(event.target.files.item(0));
        },

        ajax: function(url, params = { } ) {
            let s = url+"?";
            for(let key in params) {
                s += key + "=" + encodeURIComponent(params[key]) +"&"
            }
            setTimeout(() =>{
                this.loading = false
            },300)
            return this.$http.get(s);
        }
    },
    computed : {

    },
    mounted : function (){

    }
})