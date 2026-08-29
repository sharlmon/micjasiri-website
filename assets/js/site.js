const root=document.documentElement;
const nav=document.querySelector('.site-nav');
const themeButton=document.querySelector('[data-theme-toggle]');
const themeMeta=document.querySelector('meta[name="theme-color"]');
const menuButton=document.querySelector('[data-menu-toggle]');
const mobilePanel=document.querySelector('[data-mobile-panel]');
const mobileLinks=[...mobilePanel.querySelectorAll('a[href]')];
const main=document.querySelector('main');
const footer=document.querySelector('footer');
let menuOpen=false;

const innerPageHero=document.querySelector('.page-hero .hero-media img,.project-hero .hero-media img');
const homeVideo=document.querySelector('.home-hero video[poster]');
const innerPageFallback=document.querySelector('main img');
const pageBackdropPath=innerPageHero?.getAttribute('src')||homeVideo?.getAttribute('poster')||innerPageFallback?.getAttribute('src');
if(pageBackdropPath){
  const backdrop=document.createElement('div');
  backdrop.className='page-glass-backdrop';
  backdrop.setAttribute('aria-hidden','true');
  const source=new URL(pageBackdropPath,document.baseURI).href;
  backdrop.style.setProperty('--page-backdrop',`url("${source}")`);
  document.body.classList.add('glass-page');
  if(homeVideo)document.body.classList.add('home-glass');
  document.body.prepend(backdrop);
}

function applyTheme(value,persist=false){
  const theme=value==='light'?'light':'dark';
  root.dataset.theme=theme;
  themeButton.setAttribute('aria-pressed',String(theme==='light'));
  themeButton.setAttribute('aria-label',theme==='light'?'Switch to dark mode':'Switch to light mode');
  themeMeta.content=theme==='light'?'#ece8df':'#090909';
  if(persist)try{localStorage.setItem('micjasiri-theme',theme)}catch(error){}
}

applyTheme(root.dataset.theme);
themeButton.addEventListener('click',()=>applyTheme(root.dataset.theme==='light'?'dark':'light',true));

function updateNav(){nav.classList.toggle('compact',scrollY>72)}
updateNav();
addEventListener('scroll',updateNav,{passive:true});

function setMenu(open,restore=false){
  menuOpen=open;
  mobilePanel.classList.toggle('open',open);
  mobilePanel.setAttribute('aria-hidden',String(!open));
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
  document.body.classList.toggle('menu-open',open);
  main.inert=open;
  footer.inert=open;
  if(open)setTimeout(()=>mobileLinks[0].focus(),40);
  if(!open&&restore)menuButton.focus();
}

menuButton.addEventListener('click',()=>setMenu(!menuOpen,menuOpen));
mobileLinks.forEach(link=>link.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',event=>{
  if(!menuOpen)return;
  if(event.key==='Escape'){event.preventDefault();setMenu(false,true);return}
  if(event.key!=='Tab')return;
  const first=mobileLinks[0],last=mobileLinks.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));

const workExplorer=document.querySelector('[data-work-explorer]');
const workFilters=[...document.querySelectorAll('[data-work-filter]')];
const workPanels=[...document.querySelectorAll('[data-work-panel]')];

function selectWorkPanel(id,moveFocus=false){
  const activeButton=workFilters.find(button=>button.dataset.workFilter===id);
  if(!activeButton)return;
  workFilters.forEach(button=>{
    const active=button===activeButton;
    button.setAttribute('aria-selected',String(active));
    button.tabIndex=active?0:-1;
  });
  workPanels.forEach(panel=>{
    const active=panel.dataset.workPanel===id;
    panel.hidden=!active;
    panel.classList.toggle('is-active',active);
  });
  const backdrop=new URL(activeButton.dataset.backdrop,document.baseURI).href;
  workExplorer?.style.setProperty('--work-backdrop',`url("${backdrop}")`);
  if(moveFocus)activeButton.focus();
}

workFilters.forEach((button,index)=>{
  button.addEventListener('click',()=>selectWorkPanel(button.dataset.workFilter));
  button.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    let next=index;
    if(event.key==='ArrowRight')next=(index+1)%workFilters.length;
    if(event.key==='ArrowLeft')next=(index-1+workFilters.length)%workFilters.length;
    if(event.key==='Home')next=0;
    if(event.key==='End')next=workFilters.length-1;
    selectWorkPanel(workFilters[next].dataset.workFilter,true);
  });
});
if(workFilters.length)selectWorkPanel(workFilters.find(button=>button.getAttribute('aria-selected')==='true')?.dataset.workFilter||workFilters[0].dataset.workFilter);

const atmosphere=document.querySelector('.image-atmosphere');
const atmosphereImages={'services.html':'assets/work/shell-field-production.jpg','clients.html':'assets/work/conference-audience.jpg'};
const atmosphereImage=atmosphereImages[location.pathname.split('/').pop()];
if(atmosphere&&atmosphereImage){
  const backdrop=new URL(atmosphereImage,document.baseURI).href;
  atmosphere.style.setProperty('--section-backdrop',`url("${backdrop}")`);
}

const form=document.querySelector('#contactForm');
if(form)form.addEventListener('submit',async event=>{
  event.preventDefault();
  const status=form.querySelector('.form-status');
  if(!form.reportValidity())return;
  const submit=form.querySelector('button[type="submit"]');
  submit.disabled=true;submit.textContent='Sending…';status.textContent='';
  try{
    const response=await fetch('https://formspree.io/f/mrerowkg',{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error('Request failed');
    form.reset();status.textContent='Thank you. The Mic-Jasiri team will be in touch within 24 hours.';
  }catch(error){status.textContent='We could not send your message. Please email info@micjasiri.co.ke or call +254 721 561 704.'}
  finally{submit.disabled=false;submit.textContent='Send message'}
});

const video=document.querySelector('video');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(video&&reduced.matches)video.pause();
reduced.addEventListener?.('change',event=>{if(!video)return;event.matches?video.pause():video.play().catch(()=>{})});
