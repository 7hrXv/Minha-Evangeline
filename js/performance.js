(()=>{'use strict';if(window.__evPerfReady)return;window.__evPerfReady=true;
const sync=()=>document.documentElement.classList.toggle('ev-page-hidden',document.hidden);
document.addEventListener('visibilitychange',sync,{passive:true});sync();
const io=('IntersectionObserver'in window)?new IntersectionObserver(entries=>{for(const e of entries)e.target.style.animationPlayState=e.isIntersecting?'running':'paused'},{rootMargin:'100px'}):null;
if(io){const observe=()=>document.querySelectorAll('.carinho-polaroid,.retrospectiva-polaroid').forEach(el=>io.observe(el));if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();window.addEventListener('pagehide',()=>io.disconnect(),{once:true});}
})();