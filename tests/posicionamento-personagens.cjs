const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const source=fs.readFileSync(path.join(__dirname,'../js/personagens-nas-secoes.js'),'utf8');
function run({blocked=false,hidden=false}={}){
 const callbacks=[],classes=new Set(),rect={left:200,top:300,right:1000,bottom:700,width:800,height:400};
 const obstruction={tagName:'CANVAS',closest:()=>null,getBoundingClientRect:()=>rect};
 const anchor={closest:()=>hidden?{}:null,getBoundingClientRect:()=>rect,querySelectorAll:()=>blocked?[obstruction]:[]};
 const img={parentElement:anchor,naturalWidth:80,naturalHeight:100,dataset:{placement:'0'},style:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)},addEventListener(){}};
 const ctx={document:{hidden:false,querySelectorAll:()=>[img],querySelector:()=>({getBoundingClientRect:()=>rect}),addEventListener(){},removeEventListener(){}},window:{addEventListener(){},removeEventListener(){}},getComputedStyle:()=>({display:'block',width:'80px',maxHeight:'120px'}),requestAnimationFrame:fn=>{callbacks.push(fn);return callbacks.length},cancelAnimationFrame(){},ResizeObserver:class{observe(){}disconnect(){}},MutationObserver:class{observe(){}disconnect(){}}};
 vm.runInNewContext(source,ctx);callbacks.shift()();return{img,classes};
}
let r=run();assert(r.classes.has('is-placed'));assert(parseFloat(r.img.style.left)>=0&&parseFloat(r.img.style.left)<=720);assert(parseFloat(r.img.style.top)>=0&&parseFloat(r.img.style.top)<=300);
r=run({blocked:true});assert(!r.classes.has('is-placed'));
r=run({hidden:true});assert(!r.classes.has('is-placed'));
console.log('PASS posicionamento relativo à seção; conflito e seção oculta não exibem recortes; nenhum espaço em fluxo criado');
