document.addEventListener('DOMContentLoaded',()=>{
  const o=document.querySelector('.holo-overlay');if(!o)return;
  const tilt=e=>{
    const g=Math.max(-90,Math.min(90,e.gamma||0));
    const b=Math.max(-90,Math.min(90,e.beta||0));
    o.style.backgroundPosition=`${50+g/90*50}% ${50+b/90*50}%`;
  };
  if(window.DeviceOrientationEvent
     &&typeof DeviceOrientationEvent.requestPermission==='function'){
    DeviceOrientationEvent.requestPermission().then(p=>{
      if(p==='granted')window.addEventListener('deviceorientation',tilt);
    });
  }else{
    window.addEventListener('deviceorientation',tilt);
  }
});
