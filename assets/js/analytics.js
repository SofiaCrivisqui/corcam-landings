(function(){
  'use strict';
  window.dataLayer=window.dataLayer||[];
  const params=new URLSearchParams(location.search);
  const landing=location.pathname.split('/').filter(Boolean).pop()||'delivery-9180-11180';
  const regionalDefaults={
    'meteor-mendoza':{region:'cuyo',utm_campaign:'meteor_cuyo'},
    'meteor-buenos-aires':{region:'buenos_aires',utm_campaign:'meteor_puerto'},
    'meteor-misiones':{region:'nea',utm_campaign:'meteor_nea'},
    'meteor-rio-cuarto':{region:'centro',utm_campaign:'meteor_agro'}
  };
  const defaults=regionalDefaults[landing]||{};
  const campaign={utm_source:params.get('utm_source')||'',utm_medium:params.get('utm_medium')||'',utm_campaign:params.get('utm_campaign')||defaults.utm_campaign||'',utm_content:params.get('utm_content')||'',region:params.get('region')||defaults.region||'nacional',landing_variant:landing};
  sessionStorage.setItem('corcam_campaign',JSON.stringify(campaign));
  const readHistory=()=>{try{return JSON.parse(localStorage.getItem('corcam_analytics_debug')||'[]')}catch(_){return[]}};
  const writeHistory=items=>localStorage.setItem('corcam_analytics_debug',JSON.stringify(items.slice(-100)));
  const drawEvent=payload=>{
    const stream=document.querySelector('#analytics-stream'); if(!stream)return;
    const item=document.createElement('button'); item.type='button'; item.className='analytics-event'; item.innerHTML=`<strong>${payload.event}</strong><span>${new Date().toLocaleTimeString('es-AR')}</span><small>${payload.landing_variant||payload.page_path}</small>`;
    item.addEventListener('click',()=>{document.querySelector('#analytics-payload').textContent=JSON.stringify(payload,null,2)}); stream.prepend(item);
  };
  window.corcamTrack=function(eventName,details={}){
    const payload={event:eventName,model:document.documentElement.dataset.model||'',region:document.documentElement.dataset.region||campaign.region,page_path:location.pathname,...campaign,...details};
    window.dataLayer.push(payload); const history=readHistory(); history.push({...payload,timestamp:new Date().toISOString()}); writeHistory(history); drawEvent(payload);
  };
  const id=window.CORCAM_ANALYTICS&&window.CORCAM_ANALYTICS.gtmId;
  if(id&&/^GTM-[A-Z0-9]+$/.test(id)&&id!=='GTM-XXXXXXX'){
    const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(id);document.head.appendChild(s);
  }
  const routes=[
    ['Nacional · Delivery 9.180 / 11.180',''],['Nacional · Delivery 11.180 4×4','delivery-11180-4x4/'],['Nacional · Constellation 17.280','constellation-17280/'],['Nacional · Constellation 19.330 / 19.360','constellation-19330-19360/'],['Nacional · Constellation 25.360','constellation-25360-6x2/'],['Nacional · Meteor 28.460 / 29.520','meteor-28460-29520/'],['Regional · Mendoza y Cuyo','meteor-mendoza/?utm_source=meta&utm_campaign=meteor_cuyo&debug=analytics'],['Regional · Buenos Aires','meteor-buenos-aires/?utm_source=google&utm_campaign=meteor_puerto&debug=analytics'],['Regional · Misiones y NEA','meteor-misiones/?utm_source=meta&utm_campaign=meteor_nea&debug=analytics'],['Regional · Río Cuarto / Centro','meteor-rio-cuarto/?utm_source=meta&utm_campaign=meteor_agro&debug=analytics']
  ];
  const debugEnabled=params.get('debug')==='analytics'||localStorage.getItem('corcam_analytics_drawer')==='1';
  const createDrawer=()=>{
    if(!debugEnabled)return;
    localStorage.setItem('corcam_analytics_drawer','1');
    const root=new URL('.',document.baseURI);
    document.body.insertAdjacentHTML('beforeend',`<button class="analytics-toggle" id="analytics-toggle" type="button">GA4 / GTM <span>●</span></button><aside class="analytics-drawer" id="analytics-drawer" aria-label="GA4 y GTM Stream"><header><div><small>MEDICIÓN</small><strong>GA4 / GTM Stream</strong></div><button type="button" id="analytics-close">×</button></header><section><label>Selector de pruebas<select id="analytics-route">${routes.map(([label,path])=>`<option value="${new URL(path,root).href}">${label}</option>`).join('')}</select></label><button class="analytics-go" id="analytics-go" type="button">ABRIR VARIANTE →</button><div class="analytics-meta"><span>Landing<strong>${landing}</strong></span><span>Región<strong>${campaign.region}</strong></span><span>Campaña<strong>${campaign.utm_campaign||'—'}</strong></span></div></section><section class="analytics-stream-wrap"><div class="analytics-stream-head"><strong>Eventos en tiempo real</strong><button type="button" id="analytics-clear">Limpiar</button></div><div id="analytics-stream" class="analytics-stream"></div></section><pre id="analytics-payload">Hacé clic en un evento para ver su payload.</pre></aside>`);
    const drawer=document.querySelector('#analytics-drawer');
    document.querySelector('#analytics-toggle').addEventListener('click',()=>drawer.classList.add('open'));
    document.querySelector('#analytics-close').addEventListener('click',()=>drawer.classList.remove('open'));
    document.querySelector('#analytics-go').addEventListener('click',()=>{location.href=document.querySelector('#analytics-route').value});
    document.querySelector('#analytics-clear').addEventListener('click',()=>{writeHistory([]);document.querySelector('#analytics-stream').innerHTML='';document.querySelector('#analytics-payload').textContent='Historial eliminado.'});
    readHistory().slice(-12).forEach(drawEvent);
  };
  document.addEventListener('click',e=>{const el=e.target.closest('[data-track]');if(!el)return;window.corcamTrack(el.dataset.track,{location:el.dataset.location||'',label:(el.textContent||'').trim(),destination:el.getAttribute('href')||''})});
  document.addEventListener('DOMContentLoaded',()=>{createDrawer();window.corcamTrack('landing_view',{landing_variant:landing})});
})();
