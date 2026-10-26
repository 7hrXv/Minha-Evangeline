/* Reprodução confirmada controla o vinil. Falhas recolhem o iframe; a canção nunca é substituída. */
(()=>{
 'use strict';
 const get=id=>document.getElementById(id),room=get('musicRoom');let frame=get('youtubePlayer');if(!frame||!room)return;
 const config=window.MuralCoracaoConfig||{},videoId=config.youtubeId||'QW0i1U4u0KE';
 const wrap=get('youtubeFrame'),alternative=get('musicAlternative'),message=get('musicFallbackMessage'),button=get('sequencePlay'),mute=get('sequenceMute'),status=get('soundStatus'),audio=get('localMusicAudio'),retry=get('tryYoutube'),fallback=document.querySelector('.youtube-fallback');
 fallback.href='https://www.youtube.com/watch?v='+encodeURIComponent(videoId);
 const volume=get('musicVolume'),volumeGroup=get('musicVolumeGroup');const initialVolume=Math.max(0,Math.min(1,Number.isFinite(Number(config.volume))?Number(config.volume):.5));
 let player=null,ready=false,active=false,held=false,playing=false,mode='choice',timer,source=String(config.audio||'').trim(),apiRequested=false,apiCallbackInstalled=false;
 function background(pause){if(pause===held)return;held=pause;window.dispatchEvent(new CustomEvent('evangeline:music-'+(pause?'pause':'resume'),{detail:{source:'music-room'}}));}
 function visual(on){playing=!!on&&active&&!document.hidden;room.classList.toggle('is-playing',playing);button.textContent=playing?'Pausar nossa música Ⅱ':'Reproduzir nossa música ▷';button.setAttribute('aria-pressed',String(playing));}
 function destroyVideo(){clearTimeout(timer);ready=false;const previous=player;player=null;previous?.destroy?.();const next=document.createElement('iframe');next.id='youtubePlayer';next.title='Nossa música — player oficial do YouTube';next.setAttribute('allow','autoplay; encrypted-media; picture-in-picture; fullscreen');next.setAttribute('allowfullscreen','');next.setAttribute('referrerpolicy','strict-origin-when-cross-origin');next.src='about:blank';wrap.replaceChildren(next);frame=next;wrap.hidden=true;}
 function showChoice(text){if(volumeGroup)volumeGroup.hidden=true;mode='choice';destroyVideo();visual(false);background(false);alternative.hidden=false;button.hidden=true;mute.hidden=true;button.disabled=false;if(text){message.textContent=text;status.textContent=text;}if(source){audio.hidden=false;button.hidden=false;}}
 function fail(code){
  if(!active)return;
  const reasons={100:'Esta canção está indisponível no player.',101:'O YouTube não permite tocar este vídeo dentro do site.',150:'O YouTube não permite tocar este vídeo dentro do site.',153:'Não foi possível conectar o player à nossa canção.'};console.warn('[Evangeline: YouTube]',code);
  showChoice((reasons[code]||'Não foi possível reproduzir o vídeo neste site.')+' Você ainda pode ouvir nossa música no YouTube.');
 }
 function attach(){
  if(mode!=='youtube'||!active||player||!window.YT?.Player)return;
  player=new window.YT.Player('youtubePlayer',{events:{
   onReady(event){if(mode!=='youtube'||event.target!==player)return;clearTimeout(timer);ready=true;button.hidden=false;button.disabled=false;mute.hidden=false;status.textContent='Toque para ouvir nossa canção.';if(volumeGroup)volumeGroup.hidden=false;if(volume){volume.value=String(Math.round(initialVolume*100));event.target.setVolume?.(Number(volume.value));}if(active){background(true);event.target.playVideo();}},
   onStateChange(event){if(!active||mode!=='youtube'||event.target&&event.target!==player)return;visual(event.data===1);if(event.data===3)background(true);if(event.data===1){background(true);status.textContent='Agora, só a nossa canção.';}if(event.data===2)status.textContent='Pausa. Retome quando quiser.';if(event.data===3)status.textContent='Preparando a música…';if(event.data===0){background(false);window.dispatchEvent(new CustomEvent('evangeline:video-ended'));}},
   onAutoplayBlocked(){if(mode!=='youtube')return;visual(false);background(false);status.textContent='Toque no play do vídeo ou em Reproduzir nossa música.';},
   onError(event){if(mode==='youtube')fail(event.data);}
  }});
 }
 function tryVideo(){
  if(!active)return;audio.pause();visual(false);background(false);destroyVideo();mode='youtube';alternative.hidden=true;audio.hidden=true;wrap.hidden=false;button.hidden=true;mute.hidden=true;status.textContent='Conectando ao YouTube…';
  const params=new URLSearchParams({enablejsapi:'1',controls:'1',playsinline:'1',rel:'0',origin:location.origin,widget_referrer:location.href});
  frame.src='https://www.youtube.com/embed/'+encodeURIComponent(videoId)+'?'+params;
  if(window.YT?.Player)attach();else if(!apiRequested){apiRequested=true;if(!apiCallbackInstalled){apiCallbackInstalled=true;const previous=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{if(typeof previous==='function')previous();attach();};}const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;script.onerror=()=>{script.remove();apiRequested=false;if(mode==='youtube')fail(0);};document.head.appendChild(script);}
  timer=setTimeout(()=>{if(mode==='youtube'&&!ready)fail(0);},12000);
 }
 function useLocal(nextSource){destroyVideo();audio.pause();visual(false);background(false);mode='local';source=nextSource;audio.src=source;audio.volume=initialVolume;audio.hidden=false;alternative.hidden=true;button.hidden=true;button.disabled=false;mute.hidden=true;if(volumeGroup)volumeGroup.hidden=false;if(volume)volume.value=String(Math.round(audio.volume*100));status.textContent='Esta canção é para você, Mirella.';}
 function start(){active=true;if(source)useLocal(source);else tryVideo();}
 function stop(reset=false){active=false;audio.pause();if(reset&&source)audio.currentTime=0;if(volumeGroup)volumeGroup.hidden=true;destroyVideo();mode=source?'local':'choice';visual(false);background(false);alternative.hidden=false;}
 retry.addEventListener('click',tryVideo);
 volume?.addEventListener('input',()=>{const value=Math.max(0,Math.min(100,Number(volume.value)||0));if(mode==='youtube'&&ready)player.setVolume(value);else audio.volume=value/100;});
 audio.addEventListener('play',()=>{if(active)background(true);});
 audio.addEventListener('playing',()=>{if(!active){audio.pause();return;}mode='local';visual(true);background(true);status.textContent='Agora, só a nossa canção.';});
 audio.addEventListener('pause',()=>{if(mode==='local')visual(false);});
 audio.addEventListener('waiting',()=>{if(mode==='local')visual(false);});
 audio.addEventListener('ended',()=>{if(!active||mode!=='local')return;visual(false);background(false);window.dispatchEvent(new CustomEvent('evangeline:video-ended'));});
 audio.addEventListener('error',()=>{if(!active||!source)return;visual(false);background(false);audio.hidden=true;button.hidden=true;mute.hidden=true;if(volumeGroup)volumeGroup.hidden=true;alternative.hidden=false;message.textContent='Nossa canção não pôde tocar aqui agora. Você ainda pode ouvi-la no YouTube.';status.textContent='A música está indisponível neste momento.';});
 window.EvangelineMusicRoom={start,stop,
  toggle(){if(!active)return;if(mode==='youtube'){if(!ready)return;if(player.getPlayerState()===1)player.pauseVideo();else{background(true);player.playVideo();}return;}if(!source)return;if(mode!=='local')useLocal(source);if(!audio.paused)audio.pause();else{background(true);audio.play().catch(()=>{visual(false);background(false);status.textContent='Toque no play para ouvir nossa canção.';});}},
  mute(){if(mode==='youtube'&&ready){const muted=player.isMuted();muted?player.unMute():player.mute();mute.textContent=muted?'Silenciar':'Ativar som';mute.setAttribute('aria-pressed',String(!muted));}else{audio.muted=!audio.muted;mute.textContent=audio.muted?'Ativar som':'Silenciar';mute.setAttribute('aria-pressed',String(audio.muted));}},
  getTime(){return mode==='local'?Number(audio.currentTime)||0:ready?Number(player.getCurrentTime())||0:0;}
 };
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)return;if(mode==='local')audio.pause();else if(ready&&playing)player.pauseVideo();visual(false);});
 window.addEventListener('pagehide',()=>{stop();});
})();
