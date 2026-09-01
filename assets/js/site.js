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

const portfolioModal=document.querySelector('[data-portfolio-modal]');
const portfolioOpeners=[...document.querySelectorAll('[data-portfolio-open]')];
const portfolioClosers=[...document.querySelectorAll('[data-portfolio-close]')];
let portfolioTrigger=null;

function closePortfolio(){
  if(!portfolioModal?.open)return;
  portfolioModal.close();
}

function openPortfolio(card){
  if(!portfolioModal)return;
  portfolioTrigger=card;
  const set=(selector,value)=>{const target=portfolioModal.querySelector(selector);if(target)target.textContent=value};
  const image=portfolioModal.querySelector('[data-portfolio-image]');
  const link=portfolioModal.querySelector('[data-portfolio-link]');
  set('[data-portfolio-index]',card.dataset.index);
  set('[data-portfolio-service]',card.dataset.service);
  set('[data-portfolio-title]',card.dataset.title);
  set('[data-portfolio-client]',card.dataset.client);
  set('[data-portfolio-summary]',card.dataset.summary);
  const deliverables=portfolioModal.querySelector('[data-portfolio-deliverables]');
  if(deliverables){deliverables.replaceChildren(...card.dataset.deliverables.split('|').map(item=>{const tag=document.createElement('span');tag.textContent=item;return tag}))}
  if(image){image.src=card.dataset.image;image.alt=card.dataset.alt}
  if(link)link.href=card.dataset.link;
  portfolioModal.showModal();
  document.body.classList.add('portfolio-modal-open');
}

portfolioOpeners.forEach(card=>card.addEventListener('click',()=>openPortfolio(card)));
portfolioClosers.forEach(button=>button.addEventListener('click',closePortfolio));
portfolioModal?.addEventListener('click',event=>{if(event.target===portfolioModal)closePortfolio()});
portfolioModal?.addEventListener('close',()=>{document.body.classList.remove('portfolio-modal-open');portfolioTrigger?.focus()});

const serviceData={
  commercial:{number:'01',title:'Commercial & Digital',image:'commercial.jpg',alt:'Commercial video production on set',summary:'Campaign-ready film and digital content with one production partner from concept through delivery.',lead:'Build attention around the brand.',description:'We translate a commercial objective into a clear visual idea, then manage pre-production, filming, editing and platform versions. The result is a coherent campaign library that works across broadcast, web and social channels.',offerings:['Creative development','Brand films','Digital commercials','Social cut-downs','Post-production'],collections:[{title:'Campaign production',description:'A connected set of hero films, short edits and visual assets designed around the audience and channel.',images:[['commercial.jpg','Commercial production set'],['manama.jpg','Manama Spa campaign still'],['assets/clients/manama-spa.jpeg','Manama Spa brand identity']]}]},
  events:{number:'02',title:'Events & Live',image:'live.jpg',alt:'Live event production in progress',summary:'Multi-camera production that carries the energy of the room to audiences on site and online.',lead:'Cover every important moment.',description:'From conferences and concerts to panel conversations, we plan camera positions, sound, streaming and rapid-turnaround edits as one production system. Our crews work discreetly while keeping the story, speakers and audience experience clear.',offerings:['Multi-camera coverage','Livestreaming','Event photography','Speaker interviews','Highlight films'],collections:[{title:'Live coverage',description:'Reliable event production supported by considered framing, clean sound and story-led highlights.',images:[['live.jpg','Live event production'],['assets/work/2N0A0928.jpg','BizBazaar Festival performers'],['assets/work/conference-audience.jpg','Conference audience'],['50.jpg','Panel discussion photography']]}]},
  film:{number:'03',title:'Film & Interviews',image:'documentaries.jpg',alt:'Documentary camera operator at work',summary:'Human stories shaped through research, thoughtful interviews and cinematic production.',lead:'Give real stories room to breathe.',description:'We develop documentary and interview projects from the first research conversation through the final edit. Each production is built around a strong editorial point of view, comfortable contributors and visuals that support what is being said.',offerings:['Documentaries','Corporate interviews','Story development','Location production','Editing & grading'],collections:[{title:'Story-led production',description:'Interview environments and documentary coverage designed to feel composed, credible and human.',images:[['documentaries.jpg','Documentary production'],['REMY4390.jpg','Mic-Jasiri camera crew on location'],['assets/work/shell-field-production.jpg','Field production crew']]}]},
  studio:{number:'04',title:'Studio & Strategy',image:'show.jpg',alt:'Studio camera recording a talk show',summary:'Repeatable studio formats backed by audiovisual planning, format development and production systems.',lead:'Turn an idea into a format.',description:'We help teams define what a series, podcast or talk-show format needs to do before the cameras roll. Then we bring together the studio, crew, run of show, graphics and post-production workflow needed to deliver consistently.',offerings:['Talk shows','Video podcasts','Format development','Audiovisual strategy','Studio production'],collections:[{title:'Formats & systems',description:'Production environments built for clear conversations, repeatable episodes and efficient delivery.',images:[['show.jpg','Talk show production'],['assets/work/live-streaming-control.jpg','Live production control'],['commercial.jpg','Studio camera production']]}]},
  photography:{number:'05',title:'Photography',image:'assets/services/photography/_BRM1559.jpg',alt:'Corporate group portrait photographed by Mic-Jasiri',summary:'Focused photographic collections for organizations, hospitality brands and food businesses.',lead:'Still images with a clear purpose.',description:'We plan each photography assignment around where the images will live and what they need to communicate. The service is organized into three focused collections so the lighting, styling, shot list and pace match the subject.',offerings:['Corporate photography','Food photography','Hospitality & wellness','Art direction','Retouching'],collections:[
    {title:'Corporate Photography',description:'Leadership portraits, team photographs and partnership moments that feel polished, credible and natural.',images:[['assets/services/photography/_BRM1559.jpg','Corporate team portrait at Avenue Healthcare'],['assets/services/photography/_BRM1567.jpg','Corporate portrait of two executives'],['assets/services/photography/_BRM1579.jpg','Executives marking a partnership with a handshake']]},
    {title:'Food Photography',description:'Menu and campaign imagery styled to preserve texture, colour and appetite across digital and print use.',images:[['assets/services/photography/BRM_4069.jpg','Three freshly prepared smoothies'],['assets/services/photography/BRM_4104.jpg','Plated savoury dish photographed from above'],['assets/services/photography/BRM_4156.jpg','Plated dessert with berry garnish'],['assets/services/photography/BRM_4243.jpg','Burgers and fries plated for a menu campaign']]},
    {title:'Hospitality & Wellness Photography',description:'Atmospheric imagery for spas and hospitality brands, covering interiors, treatments, products and the complete guest experience.',images:[['manama.jpg','Manama Spa campaign interior'],['assets/clients/manama-spa.jpeg','Manama Spa brand mark']]}
  ]}
};

const serviceModal=document.querySelector('[data-service-modal]');
const serviceOpeners=[...document.querySelectorAll('[data-service-open]')];
const serviceClosers=[...document.querySelectorAll('[data-service-close]')];
let serviceTrigger=null;

function closeService(){if(serviceModal?.open)serviceModal.close()}

function buildServiceCollections(collections){
  const host=serviceModal?.querySelector('[data-service-collections]');
  if(!host)return;
  host.replaceChildren(...collections.map((collection,index)=>{
    const block=document.createElement('section');block.className='service-detail-block';
    const head=document.createElement('div');head.className='service-detail-head';
    const number=document.createElement('span');number.className='service-detail-index';number.textContent=String(index+1).padStart(2,'0');
    const title=document.createElement('h3');title.textContent=collection.title;
    const description=document.createElement('p');description.textContent=collection.description;
    const gallery=document.createElement('div');gallery.className='service-detail-gallery';
    gallery.replaceChildren(...collection.images.map(([src,alt])=>{const figure=document.createElement('figure');const image=document.createElement('img');image.src=src;image.alt=alt;image.loading='lazy';figure.append(image);return figure}));
    head.append(number,title,description);block.append(head,gallery);return block;
  }));
}

function openService(button){
  const service=serviceData[button.dataset.serviceOpen];
  if(!serviceModal||!service)return;
  serviceTrigger=button;
  const set=(selector,value)=>{const target=serviceModal.querySelector(selector);if(target)target.textContent=value};
  set('[data-service-number]',service.number);set('[data-service-title]',service.title);set('[data-service-summary]',service.summary);set('[data-service-lead]',service.lead);set('[data-service-description]',service.description);
  const image=serviceModal.querySelector('[data-service-image]');if(image){image.src=service.image;image.alt=service.alt}
  const offerings=serviceModal.querySelector('[data-service-offerings]');if(offerings)offerings.replaceChildren(...service.offerings.map(item=>{const tag=document.createElement('span');tag.textContent=item;return tag}));
  buildServiceCollections(service.collections);
  serviceModal.showModal();serviceModal.querySelector('.service-modal-shell')?.scrollTo(0,0);document.body.classList.add('service-modal-open');
}

serviceOpeners.forEach(button=>button.addEventListener('click',()=>openService(button)));
serviceClosers.forEach(button=>button.addEventListener('click',closeService));
serviceModal?.addEventListener('click',event=>{if(event.target===serviceModal)closeService()});
serviceModal?.addEventListener('close',()=>{document.body.classList.remove('service-modal-open');serviceTrigger?.focus()});

const atmosphere=document.querySelector('.image-atmosphere');
const atmosphereImages={'services.html':'assets/work/shell-field-production.jpg','clients.html':'assets/work/conference-audience.jpg'};
const atmosphereImage=atmosphereImages[location.pathname.split('/').pop()];
if(atmosphere&&atmosphereImage){
  const backdrop=new URL(atmosphereImage,document.baseURI).href;
  atmosphere.style.setProperty('--section-backdrop',`url("${backdrop}")`);
}

const form=document.querySelector('#contactForm');
if(form)form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const value=name=>(data.get(name)||'').toString().trim();
  const message=[
    'Hi Mic-Jasiri Productions,',
    'I’d like to book a shoot.',
    '',
    `Name: ${value('name')}`,
    `Email: ${value('email')}`,
    `Phone: ${value('phone')||'Not provided'}`,
    `Service: ${value('service')||'Not selected'}`,
    '',
    'Project brief:',
    value('message')
  ].join('\n');
  location.href=`https://wa.me/254721561704?text=${encodeURIComponent(message)}`;
});

const video=document.querySelector('video');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(video&&reduced.matches)video.pause();
reduced.addEventListener?.('change',event=>{if(!video)return;event.matches?video.pause():video.play().catch(()=>{})});
