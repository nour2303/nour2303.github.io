const filters = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('[data-category]')];
function selectCategory(category) {
  filters.forEach(button => {
    const selected = button.dataset.filter === category;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  let count = 0;
  projects.forEach(project => {
    project.hidden = category !== 'all' && project.dataset.category !== category;
    if (!project.hidden) count++;
  });
  document.getElementById('filter-status').textContent = `Showing ${count} projects`;
}
filters.forEach(button => button.addEventListener('click', () => selectCategory(button.dataset.filter)));
document.querySelectorAll('[data-select]').forEach(link => link.addEventListener('click', () => selectCategory(link.dataset.select)));
document.getElementById('year').textContent = new Date().getFullYear();

// Floating navigation: real section links, with tooltips for pointer and keyboard.
const iconPaths = {
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1z"/>',
 about:'<circle cx="12" cy="7" r="4"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/>',
 expertise:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 work:'<path d="M3 7V5a2 2 0 0 1 2-2h4l3 4h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M8 16v-3m4 3v-5m4 5v-2"/>',
 contact:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/>',
 linkedin:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m4 0v-7m0 3a3 3 0 0 1 6 0v4"/><path d="M7 7h.01"/>',
 github:'<path d="M9 20c-5 1-5-3-7-3m14 5v-4c0-1-.3-2-1-2 3-.3 6-1.5 6-6a5 5 0 0 0-1.5-3.5 5 5 0 0 0-.1-3.5s-1.2-.4-3.8 1.4a13 13 0 0 0-7.2 0C5.8 2.6 4.6 3 4.6 3a5 5 0 0 0-.1 3.5A5 5 0 0 0 3 10c0 4.5 3 5.7 6 6-.7.5-1 1.3-1 2v4"/>'
};
const svgIcon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]}</svg>`;
const dock = document.createElement('nav');
dock.className = 'floating-dock';
dock.setAttribute('aria-label','Quick navigation');
const sections = [['home','Home'],['about','About'],['expertise','Expertise'],['work','Projects'],['contact','Contact']];
dock.innerHTML = sections.map(([id,label])=>`<a class="dock-item" href="#${id}" data-section="${id}" aria-label="${label}">${svgIcon(id)}<span class="dock-tooltip">${label}</span></a>`).join('') + '<span class="dock-divider" aria-hidden="true"></span>' + [['contact','Email','mailto:nourkhater39@gmail.com'],['linkedin','LinkedIn','https://www.linkedin.com/in/noureldin-essameldin-04339b347'],['github','GitHub','https://github.com/nour2303']].map(([icon,label,url])=>`<a class="dock-item dock-social" href="${url}" aria-label="${label}" ${url.startsWith('https')?'target="_blank" rel="noopener noreferrer"':''}>${svgIcon(icon)}<span class="dock-tooltip">${label}</span></a>`).join('');
document.body.append(dock);
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const dockLinks = [...dock.querySelectorAll('[data-section]')];
let scrollPending = false;
function markCurrentSection(){
 let current='home';
 for(const [id] of sections){const el=document.getElementById(id);if(el.getBoundingClientRect().top < innerHeight*.45)current=id;}
 // Follow physical page order: about and expertise are intentionally reversed in the dock.
 const passed=sections.map(([id])=>document.getElementById(id)).filter(el=>el.getBoundingClientRect().top<innerHeight*.45).sort((a,b)=>b.offsetTop-a.offsetTop);
 if(passed.length)current=passed[0].id;
 dockLinks.forEach(link=>{const active=link.dataset.section===current;link.classList.toggle('current',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 scrollPending=false;
}
addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(markCurrentSection);}},{passive:true});markCurrentSection();
dock.addEventListener('pointermove',event=>{
 if(!finePointer.matches||motionQuery.matches)return;
 dock.querySelectorAll('.dock-item').forEach(item=>{const rect=item.getBoundingClientRect();const distance=Math.abs(event.clientX-(rect.left+rect.width/2));item.style.setProperty('--magnify',Math.max(0,1-distance/100).toFixed(3));});
});
dock.addEventListener('pointerleave',()=>dock.querySelectorAll('.dock-item').forEach(item=>item.style.removeProperty('--magnify')));

// A subtle custom halo keeps the ordinary pointer available.
const halo=document.createElement('div');halo.className='pointer-halo';halo.setAttribute('aria-hidden','true');document.body.append(halo);
addEventListener('pointermove',event=>{if(!finePointer.matches||motionQuery.matches)return;halo.style.left=event.clientX+'px';halo.style.top=event.clientY+'px';halo.classList.add('visible');halo.classList.toggle('over-link',!!event.target.closest('a,button'));},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>halo.classList.remove('visible'));
document.querySelectorAll('.expertise-card,.project-preview').forEach(card=>{
 card.addEventListener('pointermove',event=>{if(!finePointer.matches||motionQuery.matches)return;const rect=card.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;card.style.setProperty('--spot-x',`${x*100}%`);card.style.setProperty('--spot-y',`${y*100}%`);card.style.transform=`perspective(900px) rotateX(${(0.5-y)*5}deg) rotateY(${(x-.5)*5}deg) translateY(-4px)`;});
 card.addEventListener('pointerleave',()=>{card.style.transform='';});
});

// Lightweight animated network: abstract nodes and connections, not a stock image.
const hero=document.querySelector('.hero');
const canvas=document.createElement('canvas');canvas.className='network-canvas';canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);
const ctx=canvas.getContext('2d');let width=0,height=0,points=[],frame=0,visible=true;
function resizeNetwork(){width=hero.clientWidth;height=hero.clientHeight;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=width*ratio;canvas.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);points=Array.from({length:width<600?32:65},(_,i)=>({x:((i*137.508)%1000)/1000*width,y:((i*211.39)%1000)/1000*height,r:i%8===0?3:1.4,phase:i*.7}));drawNetwork(0);}
function drawNetwork(time){ctx.clearRect(0,0,width,height);const t=motionQuery.matches?0:time/1800;const nodes=points.map(p=>({...p,x:p.x+Math.sin(t+p.phase)*14,y:p.y+Math.cos(t*.7+p.phase)*12}));for(let i=0;i<nodes.length;i++){const a=nodes[i];for(let j=i+1;j<nodes.length;j++){const b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<145){ctx.strokeStyle=`rgba(29,179,218,${(1-d/145)*.2})`;ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}ctx.fillStyle=a.r>2?'rgba(81,220,255,.7)':'rgba(53,192,227,.35)';ctx.shadowColor='#27c8f3';ctx.shadowBlur=a.r>2?14:0;ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}}
function animate(time){drawNetwork(time);frame=requestAnimationFrame(animate);}
function updateAnimation(){cancelAnimationFrame(frame);if(visible&&!document.hidden&&!motionQuery.matches)frame=requestAnimationFrame(animate);else drawNetwork(0);}
new ResizeObserver(resizeNetwork).observe(hero);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;updateAnimation();}).observe(hero);
motionQuery.addEventListener('change',updateAnimation);document.addEventListener('visibilitychange',updateAnimation);
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target);}}),{threshold:.08});
document.querySelectorAll('.section-heading,.expertise-card,.about-copy,.portrait-frame,.project,.toolkit-inner,.contact h2').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el);});

const serviceForm = document.getElementById('service-form');
const inquiryResult = document.getElementById('inquiry-result');
serviceForm.addEventListener('submit', event => {
 event.preventDefault();
 if (!serviceForm.reportValidity()) return;
 const values = new FormData(serviceForm);
 const value = key => String(values.get(key) || '').trim();
 const subject = `${value('service')}: ${value('project')}`;
 const body = `Hi Nour,\n\n${value('details')}\n\nName: ${value('name')}\nReply email: ${value('email')}\nService: ${value('service')}\nProject / role: ${value('project')}${value('timeline') ? '\nTiming: ' + value('timeline') : ''}\n`;
 document.getElementById('gmail-draft').href = 'https://mail.google.com/mail/?' + new URLSearchParams({view:'cm',fs:'1',to:'nourkhater39@gmail.com',su:subject,body});
 document.getElementById('email-draft').href = `mailto:nourkhater39@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
 document.getElementById('draft-text').value = `To: nourkhater39@gmail.com\nSubject: ${subject}\n\n${body}`;
 inquiryResult.hidden = false;
 document.getElementById('copy-status').textContent = '';
 document.getElementById('gmail-draft').focus({preventScroll:true});
 inquiryResult.scrollIntoView({behavior: motionQuery.matches ? 'instant' : 'smooth',block:'nearest'});
});
serviceForm.addEventListener('input', () => { inquiryResult.hidden = true; });
document.getElementById('copy-inquiry').addEventListener('click', async () => {
 const draft = document.getElementById('draft-text');
 try {
  await navigator.clipboard.writeText(draft.value);
  document.getElementById('copy-status').textContent = 'Copied. Paste it into your email to send.';
 } catch {
  draft.focus(); draft.select();
  document.getElementById('copy-status').textContent = 'Select and copy the message above, then paste it into your email.';
 }
});

const inquiryButtons=[...document.querySelectorAll('[data-inquiry]')];
const serviceSelect=serviceForm.elements.service;
function updateInquiryMode(mode){
 const job=mode==='job';
 inquiryButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.inquiry===mode)));
 document.getElementById('project-label').textContent=job?'Role title':'Project title';
 document.getElementById('details-label').textContent=job?'Tell me about the role and your team':'What needs to be done?';
 serviceForm.elements.project.placeholder=job?'For example: Junior Data Analyst':'For example: a weekly sales report';
 serviceForm.elements.details.placeholder=job?'Share the responsibilities, your company, the location and working arrangement.':'Tell me about the task, the tools or data involved, and what you want the result to look like.';
 serviceForm.elements.timeline.placeholder=job?'An expected start date, if you have one':'A target date, or just exploring';
 inquiryResult.hidden=true;
}
inquiryButtons.forEach(button=>button.addEventListener('click',()=>{
 const mode=button.dataset.inquiry;
 if(mode==='job')serviceSelect.value='Job opportunity';
 else if(serviceSelect.value==='Job opportunity')serviceSelect.value='';
 updateInquiryMode(mode);
}));
serviceSelect.addEventListener('change',()=>updateInquiryMode(serviceSelect.value==='Job opportunity'?'job':'project'));

document.querySelectorAll('[data-workflow]').forEach(link=>link.addEventListener('click',()=>{
 serviceSelect.value='AI / n8n automation';
 serviceForm.elements.project.value=link.dataset.workflow;
 updateInquiryMode('project');
}));

document.querySelectorAll('[data-voice-service]').forEach(link=>link.addEventListener('click',()=>{
 serviceSelect.value='AI voice receptionist';
 serviceForm.elements.project.value='AI Voice Receptionist';
 updateInquiryMode('project');
}));

document.querySelectorAll('[data-analysis-project]').forEach(link=>link.addEventListener('click',()=>{
 serviceSelect.value='Data analysis';
 serviceForm.elements.project.value=link.dataset.analysisProject;
 updateInquiryMode('project');
}));
