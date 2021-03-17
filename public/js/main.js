
const app = new Vue({
    el : "#app",
    data : {
        displayUI : false,
    },
    methods : {
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