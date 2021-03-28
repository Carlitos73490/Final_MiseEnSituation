

const app = new Vue({
    el : "#app",
    data : {
        displayFormPortal : false,
        displayUI : false,
        portalObjectUrl : null,
        backgroundImgPath : null,
        portalCanvas : null,
        portals : {},
        newPortal :{},
        p: null,
        mx: null,
        my: null,
        px: null,
        py: null,
        btnTopLeftHtml : null,
        btnTopRightHtml : null,
        btnBottomLeftHtml : null,
        btnBottomRightHtml : null,
        firstPortalLoad : true,
        clickOnCanvas : false,
        mx : null,
        my : null,
    },
    methods : {
        add :function (){
            axios({
                method: 'post',
                url: '/portals/add',
                data: this.newPortal
            }).then(() => {
                this.portals.push(this.newPortal)
                this.initForm()
            });
        },
        deletePortal(portalId){
            axios({
                method: 'get',
                url: '/portals/delete',
                data: portalId
            }).then(() => {
                this.ajax("/portals/list").then(function(response){
                    this.portals = response.body
                })
            });
        },
        initForm : function (){
        this.displayFormPortal=! this.displayFormPortal
            this.newPortal = {
                name : "",
                color : "",
                nbVantaux : 1,
                imgDataUrl : "",
            }
        },
        portalImageChanged(portal){
            console.log("portalChanged")
            this.drawPortal(portal.imgDataUrl).then((value) =>{
                if(this.firstPortalLoad) {
                    this.centerPortal()
                }
            })

        },
        centerPortal(){
            if (this.firstPortalLoad) {
                let BoudingBox = this.portalCanvas.getBoundingClientRect();

                let margin = 100;

                let pTopLeftY = 0 - (this.btnTopLeftHtml.clientWidth / 2) ;
                let pTopLeftX = 0 + (BoudingBox.left - (this.btnTopLeftHtml.clientWidth / 2));

                let pTopRightY = (0 - this.btnTopRightHtml.clientWidth / 2) ;
                let pTopRightX = (BoudingBox.right - this.btnTopRightHtml.clientWidth / 2) - margin;

                let pBottomLeftY = (BoudingBox.bottom - BoudingBox.top - this.btnBottomLeftHtml.clientWidth / 2) - margin ;
                let pBottomLeftX = 0 + (BoudingBox.left - this.btnBottomLeftHtml.clientWidth / 2);

                let pBottomRightY = (BoudingBox.bottom - BoudingBox.top - this.btnBottomRightHtml.clientWidth / 2) - margin;
                let pBottomRightX = (BoudingBox.right - this.btnBottomRightHtml.clientWidth / 2) - margin;


                let ox = this.parentCanvas.clientWidth / 2 - (pTopRightX - pTopLeftX) / 2 ;

                let oy = margin/2

                this.btnTopLeftHtml.style.top = (pTopLeftY + oy).toString() + "px";
                this.btnTopLeftHtml.style.left = (pTopLeftX + ox).toString() + "px";

                this.btnTopRightHtml.style.top = (pTopRightY + oy).toString() + "px";
                this.btnTopRightHtml.style.left = (pTopRightX  + ox).toString() + "px";

                this.btnBottomLeftHtml.style.top = (pBottomLeftY).toString() + "px";
                this.btnBottomLeftHtml.style.left = (pBottomLeftX + ox).toString() + "px";

                this.btnBottomRightHtml.style.top = (pBottomRightY).toString() + "px";
                this.btnBottomRightHtml.style.left = (pBottomRightX + ox).toString() + "px";

                this.firstPortalLoad = false;
            }
        },
        async newPortalImageChanged(event){
            this.portalObjectUrl = URL.createObjectURL(event.target.files.item(0));
            let blob = await fetch(this.portalObjectUrl).then(r => r.blob());
            let dataUrl = await new Promise(resolve => {
                let reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob)
            });
            this.newPortal.imgDataUrl = dataUrl
            console.log(dataUrl);
        },
        backgroundImageChanged(event){
            console.log(event.target.files)
            this.backgroundImgPath = URL.createObjectURL(event.target.files.item(0));
        },

        drawPortal(ImageSrc) {
            var canvasPortalLoaded = new Promise((resolve, reject) => {
            let svgPortal = new Image();
            let parentWidth = this.parentCanvas.clientWidth;
            let parentHeight = this.parentCanvas.clientHeight;

            let svgPortalAdjustedWidth;
            let svgPortalAdjustedHeight;
            svgPortal.onload = () => {
                //Conserver le ratio;
                if (svgPortal.height <= svgPortal.width) {
                    svgPortalAdjustedWidth = parentWidth;
                    svgPortalAdjustedHeight = svgPortal.height * Math.round(parentWidth) / svgPortal.width;
                    if (svgPortalAdjustedHeight > parentHeight) {
                        let reduce = svgPortalAdjustedHeight - parentHeight
                        svgPortalAdjustedHeight = svgPortalAdjustedHeight - reduce;
                        svgPortalAdjustedWidth = svgPortalAdjustedWidth - reduce;
                    }
                } else {
                    svgPortalAdjustedWidth = svgPortal.width * Math.round(parentHeight) / svgPortal.height;
                    svgPortalAdjustedHeight = parentHeight;
                    if (svgPortalAdjustedWidth > parentWidth) {
                        let reduce = svgPortalAdjustedWidth - parentWidth
                        svgPortalAdjustedHeight = svgPortalAdjustedHeight - reduce;
                        svgPortalAdjustedWidth = svgPortalAdjustedWidth - reduce;
                    }
                }
                this.portalCanvas.width = svgPortalAdjustedWidth;
                this.portalCanvas.height = svgPortalAdjustedHeight;
                this.portalCanvas.getContext("2d").drawImage(svgPortal, 0, 0, svgPortalAdjustedWidth, svgPortalAdjustedHeight);
                resolve(true);
            }
                svgPortal.src = ImageSrc;
            });
            return canvasPortalLoaded;
        },
        MouseDownBtn(event) {
                this.p = event.target;
                this.px = parseFloat(this.p.style.left);
                this.py = parseFloat(this.p.style.top);

        },
        MouseDownCanvas(event) {
            this.clickOnCanvas = true;
            this.px = parseFloat(this.btnTopLeftHtml.style.left);
            this.py = parseFloat(this.btnTopLeftHtml.style.top);
            this.mx = event.clientX;
            this.my = event.clientY;
        },
        MouseMove(event) {
            var dx = event.clientX  ;
            var dy = event.clientY ;
        if(this.clickOnCanvas){
            this.px = dx - this.mx;
            this.py = dy - this.my;

            let offsetBottomLeftX = parseFloat(this.btnBottomLeftHtml.style.left) - parseFloat(this.btnTopLeftHtml.style.left);
            let offsetBottomLeftY = parseFloat(this.btnBottomLeftHtml.style.top) - parseFloat(this.btnTopLeftHtml.style.top);
            let offsetTopRightX = parseFloat(this.btnTopRightHtml.style.left) - parseFloat(this.btnTopLeftHtml.style.left);
            let offsetTopRightY = parseFloat(this.btnTopRightHtml.style.top) - parseFloat(this.btnTopLeftHtml.style.top);

            let offsetBottomRightX = parseFloat(this.btnBottomRightHtml.style.left) - parseFloat(this.btnTopLeftHtml.style.left);
            let offsetBottomRightY = parseFloat(this.btnBottomRightHtml.style.top) - parseFloat(this.btnTopLeftHtml.style.top);

            this.btnTopLeftHtml.style.left = this.px + "px";
            this.btnTopLeftHtml.style.top = this.py + "px";
            this.btnTopRightHtml.style.left = this.px + offsetTopRightX + "px";
            this.btnTopRightHtml.style.top = this.py + offsetTopRightY + "px";
            this.btnBottomLeftHtml.style.left = this.px + offsetBottomLeftX + "px";
            this.btnBottomLeftHtml.style.top = this.py + offsetBottomLeftY + "px";
            this.btnBottomRightHtml.style.left = this.px + offsetBottomRightX + "px";
            this.btnBottomRightHtml.style.top = this.py + offsetBottomRightY + "px";


        } else if (this.p) {
                this.px = dx;
                this.py = dy;
                this.p.style.top = this.py + "px";
                this.p.style.left = this.px + "px";
        }
            this.TransformCenter();

        },
         MouseUp(event) {
            this.p = null;
            this.clickOnCanvas = false;
            this.TransformCenter();
        },
         TransformCenter() {
             let c1 = this.Center(this.btnTopLeftHtml);
             let c2 = this.Center(this.btnTopRightHtml);
             let c3 = this.Center(this.btnBottomLeftHtml);
             let c4 = this.Center(this.btnBottomRightHtml);
            this.transform2d(this.portalCanvas, c1.x, c1.y, c2.x, c2.y, c3.x, c3.y, c4.x, c4.y);
        },
        Center(HTMLDivElement) {
                return { x: Math.round(parseFloat(HTMLDivElement.style.left) + HTMLDivElement.clientWidth / 2), y: Math.round(parseFloat(HTMLDivElement.style.top) + HTMLDivElement.clientHeight / 2) };
        },



         adj(m) { // Compute the adjugate of m
            return [
                m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
                m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
                m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3]
            ];
        },

         multmm(a, b) { // multiply two matrices
            var c = Array(9);
            for (var i = 0; i != 3; ++i) {
                for (var j = 0; j != 3; ++j) {
                    var cij = 0;
                    for (var k = 0; k != 3; ++k) {
                        cij += a[3 * i + k] * b[3 * k + j];
                    }
                    c[3 * i + j] = cij;
                }
            }
            return c;
        },

        multmv(m, v) { // multiply matrix and vector
            return [
                m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
                m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
                m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
            ];
        },
        pdbg(m, v) {
            var r = this.multmv(m, v);
            return r + " (" + r[0] / r[2] + ", " + r[1] / r[2] + ")";
        },

         basisToPoints(x1, y1, x2, y2, x3, y3, x4, y4) {
            var m  = [
                x1, x2, x3,
                y1, y2, y3,
                1, 1, 1
            ];
            var v = this.multmv(this.adj(m), [x4, y4, 1]);
            return this.multmm(m, [
                v[0], 0, 0,
                0, v[1], 0,
                0, 0, v[2]
            ]);
        },
        general2DProjection(
            x1s, y1s, x1d, y1d,
            x2s, y2s, x2d, y2d,
            x3s, y3s, x3d, y3d,
            x4s, y4s, x4d, y4d
        ) {
            var s = this.basisToPoints(x1s, y1s, x2s, y2s, x3s, y3s, x4s, y4s);
            var d = this.basisToPoints(x1d, y1d, x2d, y2d, x3d, y3d, x4d, y4d);
            return this.multmm(d, this.adj(s));
        },
        project(m, x, y) {
            var v = this.multmv(m, [x, y, 1]);
            return [v[0] / v[2], v[1] / v[2]];
        },
        transform2d(elt, x1, y1, x2, y2, x3, y3, x4, y4) {
            var w = elt.width, h = elt.height;
            var t = this.general2DProjection
            (0, 0, x1, y1, w, 0, x2, y2, 0, h, x3, y3, w, h, x4, y4);

            for (var i = 0; i != 9; ++i) t[i] = t[i] / t[8];

            t = [t[0], t[3], 0, t[6],
                t[1], t[4], 0, t[7],
                0, 0, 1, 0,
                t[2], t[5], 0, t[8]];

            var m = "matrix3d(" + t.join(", ") + ")";

            elt.style.transform = m;

        },
        ajax: function(url, params = { } ) {
            let s = url+"?";
            for(let key in params) {
                s += key + "=" + encodeURIComponent(params[key]) +"&"
            }

            return this.$http.get(s);
        }
    },
    computed : {
    },
    mounted : function (){
        this.btnTopLeftHtml = document.getElementById("btnTopLeft");
        this.btnTopRightHtml = document.getElementById("btnTopRight");
        this.btnBottomLeftHtml = document.getElementById("btnBottomLeft");
        this.btnBottomRightHtml = document.getElementById("btnBottomRight")
        this.portalCanvas = document.getElementById("portalCanvas");
        this.parentCanvas = document.getElementById("parentCanvas");
        this.ajax("/portals/list").then(function(response){
            console.log(response.body)
            this.portals = response.body
        })
    }
})