document.addEventListener('DOMContentLoaded',()=>{
  const overlay=document.querySelector('.holo-overlay');
  if(!overlay)return;

  /* map tilt to background-position */
  function tilt(e){
    const g=Math.max(-90,Math.min(90,e.gamma||0));
    const b=Math.max(-90,Math.min(90,e.beta ||0));
    overlay.style.backgroundPosition=`${50+g/90*50}% ${50+b/90*50}%`;
  }

  /* iOS 13+ needs user gesture for permission */
  const enable=()=>{
    if(DeviceOrientationEvent.requestPermission){
      DeviceOrientationEvent.requestPermission()
        .then(p=>{if(p==='granted')window.addEventListener('deviceorientation',tilt);})
        .catch(console.error);
    }else{
      window.addEventListener('deviceorientation',tilt);
    }
    document.body.removeEventListener('click',enable);
  };
  document.body.addEventListener('click',enable,{once:true});
});
