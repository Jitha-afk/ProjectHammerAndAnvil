import{r as x,j as g,P as y,S as M,C as w,N as b,a as E,b as z,M as S,W as C}from"./index-sUfhU-ME.js";import"./checklist-data-WpVywae4.js";const F=`
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
    vUv = uv;
    float time = uTime * 5.;

    float waveFactor = uEnableWaves;

    vec3 transformed = position;

    transformed.x += sin(time + position.y) * 0.5 * waveFactor;
    transformed.y += cos(time + position.z) * 0.15 * waveFactor;
    transformed.z += sin(time + position.x) * waveFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`,R=`
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;
    
    float move = sin(time + mouse) * 0.01;
    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`;Math.map=function(c,t,e,i,s){return(c-t)/(e-t)*(s-i)+i};const p=typeof window<"u"?window.devicePixelRatio:1;class T{constructor(t,{fontSize:e,fontFamily:i,charset:s,invert:o}={}){this.renderer=t,this.domElement=document.createElement("div"),this.domElement.style.position="absolute",this.domElement.style.top="0",this.domElement.style.left="0",this.domElement.style.width="100%",this.domElement.style.height="100%",this.pre=document.createElement("pre"),this.domElement.appendChild(this.pre),this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.domElement.appendChild(this.canvas),this.deg=0,this.invert=o??!0,this.fontSize=e??12,this.fontFamily=i??"'Courier New', monospace",this.charset=s??" .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",this.context.webkitImageSmoothingEnabled=!1,this.context.mozImageSmoothingEnabled=!1,this.context.msImageSmoothingEnabled=!1,this.context.imageSmoothingEnabled=!1,this.onMouseMove=this.onMouseMove.bind(this),document.addEventListener("mousemove",this.onMouseMove)}setSize(t,e){this.width=t,this.height=e,this.renderer.setSize(t,e),this.reset(),this.center={x:t/2,y:e/2},this.mouse={x:this.center.x,y:this.center.y}}reset(){this.context.font=`${this.fontSize}px ${this.fontFamily}`;const t=this.context.measureText("A").width;this.cols=Math.floor(this.width/(this.fontSize*(t/this.fontSize))),this.rows=Math.floor(this.height/this.fontSize),this.canvas.width=this.cols,this.canvas.height=this.rows,this.pre.style.fontFamily=this.fontFamily,this.pre.style.fontSize=`${this.fontSize}px`,this.pre.style.margin="0",this.pre.style.padding="0",this.pre.style.lineHeight="1em",this.pre.style.position="absolute",this.pre.style.left="50%",this.pre.style.top="50%",this.pre.style.transform="translate(-50%, -50%)",this.pre.style.zIndex="9",this.pre.style.backgroundAttachment="fixed",this.pre.style.mixBlendMode="difference"}render(t,e){this.renderer.render(t,e);const i=this.canvas.width,s=this.canvas.height;this.context.clearRect(0,0,i,s),this.context&&i&&s&&this.context.drawImage(this.renderer.domElement,0,0,i,s),this.asciify(this.context,i,s),this.hue()}onMouseMove(t){this.mouse={x:t.clientX*p,y:t.clientY*p}}get dx(){return this.mouse.x-this.center.x}get dy(){return this.mouse.y-this.center.y}hue(){const t=Math.atan2(this.dy,this.dx)*180/Math.PI;this.deg+=(t-this.deg)*.075,this.domElement.style.filter=`hue-rotate(${this.deg.toFixed(1)}deg)`}asciify(t,e,i){if(e&&i){const s=t.getImageData(0,0,e,i).data;let o="";for(let r=0;r<i;r++){for(let n=0;n<e;n++){const a=n*4+r*4*e,[m,f,l,h]=[s[a],s[a+1],s[a+2],s[a+3]];if(h===0){o+=" ";continue}let d=(.3*m+.6*f+.1*l)/255,u=Math.floor((1-d)*(this.charset.length-1));this.invert&&(u=this.charset.length-u-1),o+=this.charset[u]}o+=`
`}this.pre.innerHTML=o}}dispose(){document.removeEventListener("mousemove",this.onMouseMove)}}class I{constructor(t,{fontSize:e=200,fontFamily:i="Arial",color:s="#fdf9f3"}={}){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.txt=t,this.fontSize=e,this.fontFamily=i,this.color=s,this.font=`600 ${this.fontSize}px ${this.fontFamily}`}resize(){this.context.font=this.font;const t=this.context.measureText(this.txt),e=Math.ceil(t.width)+20,i=Math.ceil(t.actualBoundingBoxAscent+t.actualBoundingBoxDescent)+20;this.canvas.width=e,this.canvas.height=i}render(){this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.context.fillStyle=this.color,this.context.font=this.font;const e=10+this.context.measureText(this.txt).actualBoundingBoxAscent;this.context.fillText(this.txt,10,e)}get width(){return this.canvas.width}get height(){return this.canvas.height}get texture(){return this.canvas}}class v{constructor({text:t,asciiFontSize:e,textFontSize:i,textColor:s,planeBaseHeight:o,enableWaves:r},n,a,m){this.textString=t,this.asciiFontSize=e,this.textFontSize=i,this.textColor=s,this.planeBaseHeight=o,this.container=n,this.width=a,this.height=m,this.enableWaves=r,this.camera=new y(45,this.width/this.height,1,1e3),this.camera.position.z=30,this.scene=new M,this.mouse={x:0,y:0},this.onMouseMove=this.onMouseMove.bind(this),this.setMesh(),this.setRenderer()}setMesh(){this.textCanvas=new I(this.textString,{fontSize:this.textFontSize,fontFamily:"IBM Plex Mono",color:this.textColor}),this.textCanvas.resize(),this.textCanvas.render(),this.texture=new w(this.textCanvas.texture),this.texture.minFilter=b;const t=this.textCanvas.width/this.textCanvas.height,e=this.planeBaseHeight,i=e*t,s=e;this.geometry=new E(i,s,36,36),this.material=new z({vertexShader:F,fragmentShader:R,transparent:!0,uniforms:{uTime:{value:0},mouse:{value:1},uTexture:{value:this.texture},uEnableWaves:{value:this.enableWaves?1:0}}}),this.mesh=new S(this.geometry,this.material),this.scene.add(this.mesh)}setRenderer(){this.renderer=new C({antialias:!1,alpha:!0}),this.renderer.setPixelRatio(1),this.renderer.setClearColor(0,0),this.filter=new T(this.renderer,{fontFamily:"IBM Plex Mono",fontSize:this.asciiFontSize,invert:!0}),this.container.appendChild(this.filter.domElement),this.setSize(this.width,this.height),this.container.addEventListener("mousemove",this.onMouseMove),this.container.addEventListener("touchmove",this.onMouseMove)}setSize(t,e){this.width=t,this.height=e,this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.filter.setSize(t,e),this.center={x:t/2,y:e/2}}load(){this.animate()}onMouseMove(t){const e=t.touches?t.touches[0]:t,i=this.container.getBoundingClientRect(),s=e.clientX-i.left,o=e.clientY-i.top;this.mouse={x:s,y:o}}animate(){const t=()=>{this.animationFrameId=requestAnimationFrame(t),this.render()};t()}render(){const t=new Date().getTime()*.001;this.textCanvas.render(),this.texture.needsUpdate=!0,this.mesh.material.uniforms.uTime.value=Math.sin(t),this.updateRotation(),this.filter.render(this.scene,this.camera)}updateRotation(){const t=Math.map(this.mouse.y,0,this.height,.5,-.5),e=Math.map(this.mouse.x,0,this.width,-.5,.5);this.mesh.rotation.x+=(t-this.mesh.rotation.x)*.05,this.mesh.rotation.y+=(e-this.mesh.rotation.y)*.05}clear(){this.scene.traverse(t=>{t.isMesh&&typeof t.material=="object"&&t.material!==null&&(Object.keys(t.material).forEach(e=>{const i=t.material[e];i!==null&&typeof i=="object"&&typeof i.dispose=="function"&&i.dispose()}),t.material.dispose(),t.geometry.dispose())}),this.scene.clear()}dispose(){cancelAnimationFrame(this.animationFrameId),this.filter.dispose(),this.container.removeChild(this.filter.domElement),this.container.removeEventListener("mousemove",this.onMouseMove),this.container.removeEventListener("touchmove",this.onMouseMove),this.clear(),this.renderer.dispose()}}function A({text:c="David!",asciiFontSize:t=8,textFontSize:e=200,textColor:i="#fdf9f3",planeBaseHeight:s=8,enableWaves:o=!0}){const r=x.useRef(null),n=x.useRef(null);return x.useEffect(()=>{if(!r.current)return;const{width:a,height:m}=r.current.getBoundingClientRect();if(a===0||m===0){const l=new IntersectionObserver(([h])=>{if(h.isIntersecting&&h.boundingClientRect.width>0&&h.boundingClientRect.height>0){const{width:d,height:u}=h.boundingClientRect;n.current=new v({text:c,asciiFontSize:t,textFontSize:e,textColor:i,planeBaseHeight:s,enableWaves:o},r.current,d,u),n.current.load(),l.disconnect()}},{threshold:.1});return l.observe(r.current),()=>{l.disconnect(),n.current&&n.current.dispose()}}n.current=new v({text:c,asciiFontSize:t,textFontSize:e,textColor:i,planeBaseHeight:s,enableWaves:o},r.current,a,m),n.current.load();const f=new ResizeObserver(l=>{if(!l[0]||!n.current)return;const{width:h,height:d}=l[0].contentRect;h>0&&d>0&&n.current.setSize(h,d)});return f.observe(r.current),()=>{f.disconnect(),n.current&&n.current.dispose()}},[c,t,e,i,s,o]),g.jsx("div",{ref:r,className:"ascii-text-container",style:{position:"absolute",width:"100%",height:"100%"},children:g.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap');

        .ascii-text-container canvas {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          image-rendering: optimizeSpeed;
          image-rendering: -moz-crisp-edges;
          image-rendering: -o-crisp-edges;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: pixelated;
        }

        .ascii-text-container pre {
          margin: 0;
          user-select: none;
          padding: 0;
          line-height: 1em;
          text-align: left;
          position: absolute;
          left: 0;
          top: 0;
          background-image: radial-gradient(circle, #ff6188 0%, #fc9867 50%, #ffd866 100%);
          background-attachment: fixed;
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          z-index: 9;
          mix-blend-mode: difference;
        }
      `})})}export{A as default};
