// WellerU Mobile Prototype JS with Accolades + Confetti
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>Array.from(el.querySelectorAll(s));

const App = {
  state: JSON.parse(localStorage.getItem('welleru_mobile')||'{}'),
  init(){
    // make sure collections exist
    this.state.celebrated = this.state.celebrated || {}; // M1..M5
    this.state.users = this.state.users || {};      // stored accounts by email
    this.bindChrome();
    this.route();
    window.addEventListener('hashchange', ()=>this.route());
    this.refreshAuth();
  },
  persist(){ localStorage.setItem('welleru_mobile', JSON.stringify(this.state)); },
  authed(){ return !!this.state.user; },
  bindChrome(){
    $('#menuToggle').addEventListener('click', ()=>{ $('#sideMenu').hidden=false; });
    $('#closeMenu').addEventListener('click', ()=>{ $('#sideMenu').hidden=true; });
    $('#contrastToggle').addEventListener('click', ()=>{ document.documentElement.classList.toggle('high-contrast'); });
    $('#logoutBtn').addEventListener('click', ()=>{ this.state.user=null; this.persist(); this.refreshAuth(); location.hash='#login'; });
  },
  refreshAuth(){ $$('.authed').forEach(el=>el.hidden=!this.authed()); },
  route(){
    const r = (location.hash.slice(1)||'login');
    const views = { login:Views.Login, signup:Views.Signup, mfa:Views.MFA, dashboard:Views.Dashboard, pcp:Views.PCP, hra:Views.HRA, appointment:Views.Appointment, awv:Views.AWV, rewards:Views.Rewards, profile:Views.Profile, celebration:Views.Celebration };
    const View = views[r] || Views.Login;
    $('#screen').innerHTML = View.render();
    View.bind?.();
    this.refreshAuth();
    $$('.tab').forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+r));
    $('#sideMenu').hidden=true;
  },
  celebrate(mId){
    if(this.state.celebrated[mId]) return; // avoid duplicates in demo
    this.state.celebrated[mId] = true; this.persist();
    this.celebrationData = { mId, reward: {M1:5,M2:5,M3:5,M4:10,M5:50}[mId], next: {M1:'#pcp',M2:'#hra',M3:'#appointment',M4:'#awv',M5:'#rewards'}[mId] };
    location.hash='#celebration';
  },
  showAccolade({title, subtitle, nextHref, nextText}){
    const ov = $('#overlay');
    const box = document.createElement('div');
    box.className='accolade';
    box.innerHTML = `
      <div class='icon'>🏆</div>
      <div class='content'>
        <div class='title'>${title}</div>
        <div class='subtitle'>${subtitle}</div>
      </div>
      <div class='actions'>
        <button class='btn-inline close' aria-label='Close'>Close</button>
        <a class='btn-inline' href='${nextHref}'>${nextText}</a>
      </div>`;
    ov.appendChild(box);
    const close = ()=>{ box.remove(); };
    box.querySelector('.close').addEventListener('click', close);
    setTimeout(close, 6000);
  },
  launchConfetti(ms=2000){
    const ov = $('#overlay');
    const canvas = document.createElement('canvas');
    canvas.className='confetti-canvas'; ov.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = Math.max(1, window.devicePixelRatio||1);
    const rect = ov.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr; canvas.style.width=rect.width+'px'; canvas.style.height=rect.height+'px'; ctx.scale(dpr,dpr);

    const colors = ['#A7C7E7','#BFD8B8','#F5EBD6','#FF6B6B','#2F3E46'];
    const N = 140; const parts=[];
    for(let i=0;i<N;i++){
      parts.push({
        x: Math.random()*rect.width,
        y: -20 - Math.random()*rect.height*0.3,
        r: 4+Math.random()*6,
        a: Math.random()*Math.PI*2,
        v: 1.5+Math.random()*2.5,
        w: 0.02+Math.random()*0.08,
        col: colors[i%colors.length]
      });
    }
    let start=null;
    function step(ts){
      if(!start) start=ts; const t=ts-start; ctx.clearRect(0,0,rect.width,rect.height);
      parts.forEach(p=>{ p.y += p.v; p.x += Math.sin(p.a+=p.w)*0.9; ctx.save(); ctx.fillStyle=p.col; ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r); ctx.restore(); });
      if(t<ms){ requestAnimationFrame(step);} else { canvas.remove(); }
    }
    requestAnimationFrame(step);
  },
  launchCelebrationConfetti(ms=2000){
    const screen = $('#screen');
    const canvas = document.createElement('canvas');
    canvas.className='celebration-confetti'; screen.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = Math.max(1, window.devicePixelRatio||1);
    const rect = screen.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr; canvas.style.width=rect.width+'px'; canvas.style.height=rect.height+'px'; ctx.scale(dpr,dpr);

    const colors = ['#A7C7E7','#BFD8B8','#F5EBD6','#FF6B6B','#2F3E46'];
    const N = 200; const parts=[];
    for(let i=0;i<N;i++){
      parts.push({
        x: Math.random()*rect.width,
        y: -20 - Math.random()*rect.height*0.3,
        r: 4+Math.random()*8,
        a: Math.random()*Math.PI*2,
        v: 1.5+Math.random()*3,
        w: 0.02+Math.random()*0.1,
        col: colors[i%colors.length]
      });
    }
    let start=null;
    function step(ts){
      if(!start) start=ts; const t=ts-start; ctx.clearRect(0,0,rect.width,rect.height);
      parts.forEach(p=>{ p.y += p.v; p.x += Math.sin(p.a+=p.w)*0.9; ctx.save(); ctx.fillStyle=p.col; ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r); ctx.restore(); });
      if(t<ms){ requestAnimationFrame(step);} else { canvas.remove(); }
    }
    requestAnimationFrame(step);
  }
};

const HRA = [
  {id:1, q:'In the past 7 days, how many days did you exercise?', type:'number', req:true},
  {id:2, q:'How intense was your typical exercise?', type:'select', opts:['Light','Moderate','Heavy','Very heavy','Not exercising']},
  {id:3, q:'In the last 30 days, have you smoked tobacco?', type:'select', opts:['Yes','No'], req:true},
  {id:4, q:'How many sugar-sweetened beverages per day (past 7 days)?', type:'number'},
  {id:5, q:'In the past 2 weeks, how often have you felt down?', type:'select', opts:['Almost all','Most','Some','Almost never']},
];

const Views = {
  Login:{
    render(){return `
      <section class='card'>
        <div class='h1'>Welcome to WellerU</div>
        <form id='f' class='grid'>
          <div class='form-row'><label>Email<input class='input' name='email' type='email' required></label></div>
          <div class='form-row'><label>Password<input class='input' name='pwd' type='password' required></label></div>
          <button class='btn' type='submit'>Sign in</button>
          <button class='btn ghost' type='button' id='toSignup'>Create Account</button>
        </form>
      </section>`;},
    bind(){
      $('#f').addEventListener('submit',e=>{
        e.preventDefault();
        const fd=new FormData(e.target);
        const email = fd.get('email');
        const pwd = fd.get('pwd');
        const users = App.state.users || {};
        if(!users[email]){
          alert('No account found for that email. Please create an account first.');
          location.hash='#signup';
          return;
        }
        if(pwd !== users[email].pwd){
          alert('Incorrect password');
          return;
        }
        // successful login
        App.state.user = users[email];
        App.persist();
        location.hash='#mfa';
      });
      $('#toSignup').addEventListener('click',()=>location.hash='#signup');
    }
  },
  Signup:{
    render(){return `
      <section class='card'>
        <div class='h1'>Create your account</div>
        <form id='sign' class='grid'>
          <label class='form-row'>Email<input class='input' name='email' type='email' required></label>
          <label class='form-row'>Password<input class='input' name='pwd' type='password' required></label>
          <label class='form-row'>Full name<input class='input' name='name' required></label>
          <label class='form-row'>Date of birth<input class='input' type='date' name='dob' required></label>
          <label class='form-row'>Plan ID<input class='input' name='plan' required></label>
          <label class='form-row'>Group ID<input class='input' name='group' required></label>
          <button class='btn' type='submit'>Create Account</button>
        </form>
      </section>`;},
    bind(){
      $('#sign').addEventListener('submit', e=>{
        e.preventDefault();
        const fd = new FormData(e.target);
        const email = fd.get('email');
        const pwd = fd.get('pwd');
        if(App.state.users[email]){
          alert('An account already exists with that email. Please log in.');
          location.hash = '#login';
          return;
        }
        const user = {
          email,
          pwd,
          name: fd.get('name'),
          dob: fd.get('dob'),
          plan: fd.get('plan'),
          group: fd.get('group'),
          journey:{m1:false,m2:false,m3:false,m4:false,m5:false}
        };
        App.state.users[email] = user;
        App.state.user = user;
        App.persist();
        // milestone m1 tracks account creation
        App.state.user.journey.m1 = true;
        App.persist();
        App.celebrate('M1');
        location.hash='#dashboard';
      });
    }
  },
  MFA:{
    render(){return `
      <section class='card'>
        <div class='h1'>Multi‑Factor Authentication</div>
        <form id='mf' class='grid'>
          <label class='form-row'>Enter 6‑digit code<input class='input' name='code' pattern='\\d{6}' maxlength='6' required></label>
          <button class='btn' type='submit'>Verify</button>
        </form>
      </section>`;},
    bind(){ $('#mf').addEventListener('submit',e=>{e.preventDefault();App.state.user.journey.m1=true;App.persist();App.celebrate('M1');location.hash='#dashboard';}); }
  },
  Dashboard:{
    render(){
      const j=App.state.user?.journey||{}; const pct=Math.round(((j.m1+j.m2+j.m3+j.m4+j.m5)/5)*100);
      const next=!j.m2?'#pcp':!j.m3?'#hra':!j.m4?'#appointment':!j.m5?'#awv':'#rewards';
      const earn=(j.m1?5:0)+(j.m2?5:0)+(j.m3?5:0)+(j.m4?10:0)+(j.m5?50:0);
      return `
        <section class='card'>
          <div class='h1'>Your Journey</div>
          <div class='progress' aria-valuenow='${pct}'><span style='width:${pct}%'></span></div>
          <div class='kpi'><span>${pct}% complete</span><span class='badge'>$${earn} earned</span></div>
        </section>
        <section class='card'>
          <div class='h2'>Milestones</div>
          <ol>
            <li>M1: Create Account ${j.m1?'✅':''}</li>
            <li>M2: Select PCP ${j.m2?'✅':''}</li>
            <li>M3: Complete HRA ${j.m3?'✅':''}</li>
            <li>M4: Make Appointment ${j.m4?'✅':''}</li>
            <li>M5: Complete AWV ${j.m5?'✅':''}</li>
          </ol>
        </section>
        <a class='btn' href='${next}'>Continue</a>
        <button id='clearData' class='btn ghost' style='margin-top:2rem;'>Clear All Data</button>`;
    },
    bind(){
      // existing functionality left untouched
      $('#clearData').addEventListener('click',()=>{
        if(confirm('This will erase all stored data and log you out. Continue?')){
          localStorage.clear();
          location.reload();
        }
      });
    }
  },
  PCP:{
    render(){ const cur=App.state.pcpName||'No PCP on file'; return `
      <section class='card'>
        <div class='h1'>Primary Care Provider</div>
        <p><strong>Current:</strong> ${cur}</p>
        <div class='grid'>
          <button id='confirm' class='btn'>Confirm Existing PCP</button>
          <details class='card'><summary>Choose Provider</summary>
            <label class='form-row'>Search<input class='input' id='q' placeholder='City or name'></label>
            <div id='list'></div>
          </details>
        </div>
      </section>`;},
    bind(){
      $('#confirm').addEventListener('click',()=>{App.state.user.journey.m2=true;App.persist();App.celebrate('M2');location.hash='#dashboard';});
      const providers=[{name:'Dr. Lee',specialty:'Family Medicine',city:'Grapevine'},{name:'Dr. Patel',specialty:'Internal Medicine',city:'Dallas'},{name:'Dr. Garcia',specialty:'Family Medicine',city:'Irving'}];
      const render=q=>{ const wrap=$('#list'); wrap.innerHTML=''; providers.filter(p=>!q||`${p.name} ${p.city}`.toLowerCase().includes(q.toLowerCase())).forEach(p=>{ const d=document.createElement('div'); d.className='card'; d.innerHTML=`<strong>${p.name}</strong><br><small>${p.specialty} • ${p.city}</small><br><button class='btn pick'>Select</button>`; d.querySelector('.pick').addEventListener('click',()=>{App.state.pcpName=p.name;App.persist();alert('Selected '+p.name);}); wrap.appendChild(d); }); };
      render(''); $('#q').addEventListener('input',e=>render(e.target.value));
    }
  },
  HRA:{
    render(){ const a=App.state.hra||{}; const answered=Object.keys(a).length; const complete=HRA.every(q=>!q.req||a[q.id]); return `
      <section class='card'>
        <div class='h1'>Health Risk Assessment</div>
        <form id='hf'></form>
        <div class='progress'><span style='width:${Math.round(answered/HRA.length*100)}%'></span></div>
        <button id='submit' class='btn' ${complete?'':'disabled'}>Submit HRA</button>
      </section>`;},
    bind(){ const form=$('#hf'); const a=App.state.hra||{}; HRA.forEach(q=>{ const c=document.createElement('div'); c.className='form-row';
      if(q.type==='number'){ c.innerHTML=`<label>${q.q}${q.req?" <span class='badge'>*</span>":''}<input class='input' type='number' data-id='${q.id}' value='${a[q.id]||''}'></label>`; }
      else{ c.innerHTML=`<label>${q.q}${q.req?" <span class='badge'>*</span>":''}<select class='input' data-id='${q.id}'>${(q.opts||[]).map(o=>`<option ${a[q.id]===o?'selected':''}>${o}</option>`).join('')}</select></label>`; }
      form.appendChild(c); });
      form.addEventListener('input',e=>{ const id=e.target.dataset.id; if(!id) return; App.state.hra=App.state.hra||{}; App.state.hra[id]=e.target.value; App.persist(); });
      $('#submit').addEventListener('click',()=>{ App.state.user.journey.m3=true; App.persist(); App.celebrate('M3'); location.hash='#dashboard'; });
    }
  },
  Appointment:{
    render(){ const a=App.state.appt||{}; return `
      <section class='card'>
        <div class='h1'>Make Appointment</div>
        <form id='af' class='grid'>
          <label class='form-row'>Date<input class='input' name='date' type='date' value='${a.date||''}' required></label>
          <label class='form-row'>Time<input class='input' name='time' type='time' value='${a.time||''}' required></label>
          <label class='form-row'>Location / Address<input class='input' name='loc' value='${a.loc||''}' required></label>
          <button class='btn' type='submit'>Save Appointment</button>
        </form>
      </section>`;},
    bind(){ $('#af').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.target);App.state.appt={date:fd.get('date'),time:fd.get('time'),loc:fd.get('loc')};App.state.user.journey.m4=true;App.persist();App.celebrate('M4');location.hash='#dashboard';}); }
  },
  AWV:{
    render(){ return `
      <section class='card'>
        <div class='h1'>Confirm AWV Completion</div>
        <p>Option 1: Upload visit summary (mock)</p>
        <input type='file' aria-label='Upload visit summary'>
        <p>Option 2: Mark as Completed</p>
        <button id='done' class='btn'>Mark as Completed</button>
      </section>`;},
    bind(){ $('#done').addEventListener('click',()=>{App.state.user.journey.m5=true;App.persist();App.celebrate('M5');location.hash='#dashboard';}); }
  },
  Rewards:{
    render(){ const j=App.state.user?.journey||{}; const total=(j.m1?5:0)+(j.m2?5:0)+(j.m3?5:0)+(j.m4?10:0)+(j.m5?50:0); return `
      <section class='card'>
        <div class='h1'>Rewards</div>
        <p>Total Earned: <strong>$${total}</strong></p>
        <p>Gift card account: <code>${App.state.amazon||'not linked'}</code></p>
      </section>`; }
  },
  Profile:{
    render(){ return `
      <section class='card'>
        <div class='h1'>Profile</div>
        <form id='pf' class='grid'>
          <label class='form-row'>Language
            <select class='input' name='lang'>
              <option value='en' selected>English</option>
              <option value='es'>Español</option>
            </select>
          </label>
          <label class='form-row'>Amazon account email
            <input class='input' name='amazon' value='${App.state.amazon||''}' placeholder='name@example.com'>
          </label>
          <button class='btn' type='submit'>Save</button>
        </form>
      </section>`;},
    bind(){ $('#pf').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.target);App.state.amazon=fd.get('amazon');App.persist();alert('Saved');}); }
  },
  Celebration:{
    render(){ 
      const data = App.celebrationData || {};
      return `
      <div class='celebration-screen'>
        <div class='trophy-wrapper'>
          <div class='trophy'>🏆</div>
        </div>
        <div class='celebration-content'>
          <div class='milestone-title'>Achievement Unlocked!</div>
          <div class='reward-amount'>+$${data.reward || 0}</div>
          <div class='reward-text'>added to your gift card</div>
        </div>
        <div class='celebration-actions'>
          <button id='continue-btn' class='btn celebration-btn'>Continue</button>
          <a href='#dashboard' class='btn ghost celebration-btn'>Dashboard</a>
        </div>
      </div>`;
    },
    bind(){ 
      const data = App.celebrationData || {};
      $('#continue-btn').addEventListener('click', ()=>{ location.hash = data.next || '#dashboard'; });
      App.launchCelebrationConfetti(4000);
    }
  }
};

window.addEventListener('DOMContentLoaded',()=>App.init());
