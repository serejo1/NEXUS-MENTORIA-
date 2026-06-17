// NEXUS IA — Landing
const TWEAK_DEFAULTS = JSON.parse(
  document.getElementById('__tweaks_defaults__').textContent.replace(/\/\*EDITMODE-(BEGIN|END)\*\//g, '')
);

const PALETTES = [
  ["#0A0A0B", "#F4F4F2", "#C6FF3D"],
  ["#0B0F1A", "#EDF2FF", "#7B61FF"],
  ["#0E0E0E", "#F5F1E8", "#FF6B2C"],
  ["#08120E", "#EAF5EE", "#16E0A2"],
];
const FONT_PAIRS = {
  grotesk: { display: '"Space Grotesk", sans-serif', body: '"Inter Tight", sans-serif' },
  serif:   { display: '"Inter Tight", sans-serif',   body: '"Inter Tight", sans-serif' },
};

function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCountdown(targetIso) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const ms = Math.max(0, new Date(targetIso).getTime() - now);
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms % 86400000) / 3600000),
    m: Math.floor((ms % 3600000) / 60000),
    s: Math.floor((ms % 60000) / 1000),
  };
}
const pad = n => String(n).padStart(2, '0');

const Ic = ({ d, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const ICONS = {
  bolt: <path d="M13 2L3 14h7l-1 8 10-12h-7z" />,
  spark: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></>,
  brush: <><path d="M14 3l7 7-9 9H5v-7z" /><path d="M11 6l7 7" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></>,
  check: <path d="M4 12l5 5L20 6" />,
  arrow: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
  star: <path d="M12 2l3 7 7 .8-5.3 4.7L18 22l-6-3.6L6 22l1.3-7.5L2 9.8 9 9z" />,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  whats: <path d="M20 4A10 10 0 0 0 4 17.5L3 21l3.6-1A10 10 0 1 0 20 4zm-8 16a8 8 0 0 1-4-1l-3 .8.8-2.9A8 8 0 1 1 12 20zm4.5-5.7c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.5.3-.5.8-1.5a.6.6 0 0 0 0-.6L9.7 8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4 4.4 4.4 0 0 0 2.7.6 2.5 2.5 0 0 0 1.6-1.2 2 2 0 0 0 .1-1.2c-.1-.1-.2-.2-.5-.3z" />,
  ig: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></>,
  play: <path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none" />,
  cert: <><path d="M12 15a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" /><path d="M9 14l-2 7 5-3 5 3-2-7" /></>,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
  chat: <path d="M21 12a8 8 0 1 1-3.5-6.6L21 4l-1 4.4A8 8 0 0 1 21 12z" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></>,
  cube: <><path d="M12 3l9 5v8l-9 5-9-5V8z" /><path d="M3 8l9 5 9-5" /><path d="M12 13v10" /></>,
  shop: <><path d="M3 7h18l-1 5H4z" /><path d="M5 12v8h14v-8" /></>,
  cam: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  pin: <><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></>,
  cal: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
  code: <><path d="M8 6l-6 6 6 6"/><path d="M16 6l6 6-6 6"/><path d="M14 4l-4 16"/></>,
};

// ── NAV ────────────────────────────────────────────────────────────────────
function Nav({ accent, ctaLabel }) {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <div className="logo" style={{display:"flex",alignItems:"center",gap:14}}>
          <img src="assets/nexus-ia-wordmark.png" alt="NEXUS IA" style={{height:18,width:"auto",display:"block"}}/>
          <span style={{width:1,height:18,background:"var(--line-2)",display:"inline-block"}}/>
          <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--muted)",fontFamily:"var(--mono)"}}>
            por <img src="assets/next-logo.png" alt="Next Digital" style={{height:22,width:"auto",display:"block"}}/>
          </span>
        </div>
        <nav className="nav-links">
          <a href="#beneficios">Formato</a>
          <a href="#modulos">Módulos</a>
          <a href="#cronograma">Cronograma</a>
          <a href="#mentor">Mentor</a>
          <a href="#preco">Investimento</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a href="#preco" className="btn btn-primary" style={{padding:"10px 18px",fontSize:13,background:accent}}>
          {ctaLabel} <Ic d={ICONS.arrow} size={16}/>
        </a>
      </div>
    </header>
  );
}

// ── HERO ───────────────────────────────────────────────────────────────────
function Hero({ t, countdown }) {
  return (
    <section style={{position:"relative",overflow:"hidden",borderTop:"none"}} data-screen-label="01 Hero">
      <div aria-hidden style={{position:"absolute",inset:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",top:-200,right:-180,width:560,height:560,borderRadius:"50%",background:`radial-gradient(circle, ${t.accent}33, transparent 60%)`,filter:"blur(40px)"}}/>
        <div style={{position:"absolute",top:120,left:-220,width:520,height:520,borderRadius:"50%",background:"radial-gradient(circle, rgba(123,97,255,.18), transparent 60%)",filter:"blur(50px)"}}/>
      </div>

      <div className="wrap" style={{paddingTop:80,paddingBottom:120,position:"relative"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.2fr .9fr",gap:64,alignItems:"start"}} className="hero-grid">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
              <span className="pulse" style={{width:8,height:8,borderRadius:"50%",background:t.accent}}/>
              <span className="mono" style={{color:t.accent}}>{t.heroKicker}</span>
            </div>

            <h1 className="display" style={{fontSize:"clamp(52px, 8vw, 116px)",margin:"0 0 28px",letterSpacing:"-.04em"}}>
              {t.heroTitle.split('.').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}{i < arr.length-1 && <span style={{color:t.accent}}>.</span>}
                </React.Fragment>
              ))}
            </h1>

            <p style={{fontSize:20,maxWidth:580,color:"var(--muted)",margin:"0 0 40px",lineHeight:1.5}}>
              {t.heroSub}
            </p>

            <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"center"}}>
              <a href="#preco" className="btn btn-primary" style={{background:t.accent}}>
                {t.ctaLabel} <Ic d={ICONS.arrow} size={18}/>
              </a>
              <a href="#mentor" className="btn btn-ghost">
                <span style={{display:"inline-grid",placeItems:"center",width:22,height:22,borderRadius:"50%",background:"var(--fg)",color:"var(--bg)"}}>
                  <Ic d={ICONS.play} size={9}/>
                </span>
                Conhecer o mentor
              </a>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18,marginTop:64,paddingTop:32,borderTop:"1px solid var(--line)"}} className="hero-stats">
              <Stat n="6" label="Módulos" />
              <Stat n="48" label="Aulas gravadas" />
              <Stat n="10" label="Mentorias 1:1" />
              <Stat n="5" label="Meses · presencial" />
            </div>
          </div>

          <div style={{position:"relative"}}>
            <div style={{aspectRatio:"4/5",borderRadius:24,overflow:"hidden",border:"1px solid var(--line-2)",background:"linear-gradient(180deg,#1a1a1c 0%,#0d0d0e 100%)",position:"relative"}}>
              <image-slot id="hero-mentor" placeholder="Foto Serejo (ensaio IA)" shape="rounded" radius="24" style={{width:"100%",height:"100%"}}></image-slot>
              <div style={{position:"absolute",top:16,left:16,padding:"8px 12px",borderRadius:999,background:"rgba(10,10,11,.6)",backdropFilter:"blur(10px)",border:"1px solid var(--line-2)",fontSize:12}}>
                <span className="pulse" style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:t.accent,marginRight:8,verticalAlign:"middle"}}/>
                TURMA 2026 · PRESENCIAL
              </div>
              <div style={{position:"absolute",bottom:16,right:16,left:16,padding:14,borderRadius:14,background:"rgba(10,10,11,.7)",backdropFilter:"blur(10px)",border:"1px solid var(--line-2)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>Mentor</div>
                  <div style={{fontWeight:600}}>Serejo Oliveira</div>
                </div>
                <a href="https://www.instagram.com/serejomentor" target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,color:t.accent}}>
                  <Ic d={ICONS.ig} size={14}/> @serejomentor
                </a>
              </div>
            </div>

            {t.showCountdown && (
              <div style={{marginTop:16,padding:18,borderRadius:16,border:"1px solid var(--line-2)",background:"var(--card)"}}>
                <div className="mono" style={{marginBottom:10}}>Inscrições encerram em</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                  {[["DIAS",countdown.d],["HRS",countdown.h],["MIN",countdown.m],["SEG",countdown.s]].map(([l,v]) => (
                    <div key={l} style={{textAlign:"center",padding:"10px 4px",borderRadius:10,background:"rgba(0,0,0,.4)",border:"1px solid var(--line)"}}>
                      <div className="display" style={{fontSize:26,fontVariantNumeric:"tabular-nums"}}>{pad(v)}</div>
                      <div style={{fontSize:9,letterSpacing:".15em",color:"var(--muted)",marginTop:2}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)",overflow:"hidden",padding:"22px 0"}}>
        <div className="mq mono" style={{color:"var(--muted)",whiteSpace:"nowrap"}}>
          {[...Array(2)].map((_, k) => (
            <React.Fragment key={k}>
              {["Meta Ads","Midjourney","Firefly","Runway","Kling","Pika","Premiere Pro","After Effects","HeyGen","D-ID","Synthesia","ChatGPT","Claude","Make","N8N","GitHub"].map((x,i) => (
                <span key={`${k}-${i}`} style={{display:"inline-flex",alignItems:"center",gap:48}}>
                  {x}<span style={{opacity:.3}}>◆</span>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:980px){.hero-grid{grid-template-columns:1fr !important;gap:40px !important}}
        @media(max-width:560px){.hero-stats{grid-template-columns:repeat(2,1fr) !important}}
      `}</style>
    </section>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div className="display" style={{fontSize:32,letterSpacing:"-.02em"}}>{n}</div>
      <div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>{label}</div>
    </div>
  );
}

function SecHead({ kicker, title, sub, align="left" }) {
  return (
    <div className="reveal" style={{maxWidth:780,marginBottom:64,textAlign:align,marginLeft:align==="center"?"auto":0,marginRight:align==="center"?"auto":0}}>
      <div className="h-eyebrow" style={{marginBottom:16}}>{kicker}</div>
      <h2 className="display" style={{fontSize:"clamp(36px, 5vw, 64px)",margin:0,letterSpacing:"-.03em"}}>{title}</h2>
      {sub && <p style={{fontSize:18,color:"var(--muted)",marginTop:18,maxWidth:640,marginLeft:align==="center"?"auto":0,marginRight:align==="center"?"auto":0}}>{sub}</p>}
    </div>
  );
}

// ── PARA QUEM ──────────────────────────────────────────────────────────────
const PERFIS = [
  { icon: ICONS.bolt, key:"01", title:"Empreendedores", body:"Escale seu negócio com IA. Tráfego pago, automação e geração de leads que rodam 24/7.", bullets:["Meta Ads do zero ao avançado","Funil ToFu / MoFu / BoFu","Agentes de qualificação","Escalabilidade real"] },
  { icon: ICONS.brush, key:"02", title:"Designers & Criadores", body:"Domine criativos profissionais com IA. Crie em escala e aumente seu valor de mercado.", bullets:["Prompt engineering","Vídeos com Runway / Kling","Edição com Premiere + IA","Influencer virtual"] },
  { icon: ICONS.briefcase, key:"03", title:"Freelancers & Devs", body:"Potencialize seus serviços. Construa agentes, consuma APIs e venda automação.", bullets:["Make + N8N","ChatGPT + Claude API","JavaScript + GitHub","Projeto final próprio"] },
];

function ParaQuem({ accent }) {
  return (
    <section className="sec" id="perfis" data-screen-label="02 Para Quem">
      <div className="wrap">
        <SecHead kicker="Para quem é" title="Feito pra quem quer parar de assistir o jogo de fora." sub="Três perfis se beneficiam mais com o NEXUS IA. Confira se você é um deles." />
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}} className="perfis-grid">
          {PERFIS.map((p,i) => (
            <article key={i} className="reveal" style={{padding:32,borderRadius:20,border:"1px solid var(--line-2)",background:"var(--card)",position:"relative",transition:"all .3s",overflow:"hidden"}}
              onMouseEnter={e=>{e.currentTarget.style.background="var(--card-hover)";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor="var(--fg)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="var(--card)";e.currentTarget.style.transform="";e.currentTarget.style.borderColor="var(--line-2)"}}
            >
              <div className="mono" style={{position:"absolute",top:24,right:28,color:"var(--muted)"}}>{p.key}</div>
              <div style={{width:48,height:48,borderRadius:12,background:accent,color:"#0A0A0B",display:"grid",placeItems:"center",marginBottom:20}}>
                <Ic d={p.icon} size={24}/>
              </div>
              <h3 className="display" style={{fontSize:26,margin:"0 0 12px",letterSpacing:"-.01em"}}>{p.title}</h3>
              <p style={{color:"var(--muted)",margin:"0 0 24px"}}>{p.body}</p>
              <ul style={{listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:8}}>
                {p.bullets.map((b,j)=>(
                  <li key={j} style={{display:"flex",alignItems:"center",gap:10,fontSize:14}}>
                    <span style={{color:accent,display:"inline-flex"}}><Ic d={ICONS.check} size={16}/></span>
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:880px){.perfis-grid{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}

// ── MENTOR ─────────────────────────────────────────────────────────────────
function Mentor({ accent }) {
  return (
    <section className="sec" id="mentor" data-screen-label="03 Mentor">
      <div className="wrap">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.1fr",gap:64,alignItems:"center"}} className="mentor-grid">
          <div className="reveal" style={{position:"relative"}}>
            <div style={{aspectRatio:"3/4",borderRadius:24,overflow:"hidden",border:"1px solid var(--line-2)",background:"#1a1a1c"}}>
              <image-slot id="mentor-portrait" placeholder="Retrato Serejo (ensaio IA)" shape="rounded" radius="24" style={{width:"100%",height:"100%"}}></image-slot>
            </div>
            <div style={{position:"absolute",bottom:-20,right:-20,padding:20,borderRadius:16,background:accent,color:"#0A0A0B",maxWidth:240}}>
              <div className="display" style={{fontSize:36,letterSpacing:"-.02em"}}>15+</div>
              <div style={{fontSize:13,fontWeight:500}}>anos em design, tech e marketing</div>
            </div>
          </div>

          <div className="reveal">
            <div className="h-eyebrow" style={{color:accent,marginBottom:16}}>Quem é seu mentor</div>
            <h2 className="display" style={{fontSize:"clamp(40px, 5vw, 72px)",margin:"0 0 8px",letterSpacing:"-.03em"}}>Prof. Serejo Oliveira</h2>
            <p style={{color:"var(--muted)",fontSize:15,margin:"0 0 24px",lineHeight:1.6}}>
              Especialista em IA, Marketing Digital e Tecnologia · Adobe Expert · Figma · UX/UI · Engenheiro de Software.
            </p>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:32}}>
              {[
                ["+500","mentorados"],
                ["R$ 100k+","gerados por alunos"],
                ["80k+","seguidores @designersbrazil"],
                ["30 dias","para a 1ª venda"],
              ].map(([n,l],i)=>(
                <div key={i} style={{padding:"16px 18px",border:"1px solid var(--line)",borderRadius:14}}>
                  <div className="display" style={{fontSize:24,letterSpacing:"-.02em"}}>{n}</div>
                  <div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>

            <p style={{fontSize:17,lineHeight:1.6,marginBottom:24}}>
              Une visão criativa e pensamento técnico para estruturar soluções práticas com IA voltadas a performance e faturamento. Metodologia direta, orientada a resultado: encontros presenciais na Intech Cursos, mentorias 1:1 quinzenais e materiais para implementação imediata.
            </p>

            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <a className="btn btn-ghost" href="https://www.instagram.com/serejomentor" target="_blank" rel="noopener">
                <Ic d={ICONS.ig} size={16}/> @serejomentor
              </a>
              <a className="btn btn-ghost" href="https://www.instagram.com/designersbrazil" target="_blank" rel="noopener">
                <Ic d={ICONS.ig} size={16}/> @designersbrazil
              </a>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:880px){.mentor-grid{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}

// ── BENEFICIOS ─────────────────────────────────────────────────────────────
const PILARES = [
  { icon: ICONS.play,   t:"48 aulas gravadas",     d:"2 aulas por semana liberadas no portal Next Digital. Acesso vitalício, no seu ritmo.", meta:"Online · 24/7" },
  { icon: ICONS.pin,    t:"Encontros presenciais", d:"Workshops práticos na Intech Cursos — mão na massa com a turma e o mentor.",          meta:"Intech Cursos" },
  { icon: ICONS.chat,   t:"10 mentorias ao vivo",  d:"Sessões quinzenais 1:1 com Prof. Serejo para revisar projetos e destravar execução.",  meta:"Quinzenal" },
  { icon: ICONS.cube,   t:"6 apostilas PDF",       d:"Material completo de cada módulo — referência durante e depois do curso.",             meta:"1 por módulo" },
];

function Beneficios({ accent }) {
  return (
    <section className="sec" id="beneficios" data-screen-label="04 Beneficios">
      <div className="wrap">
        <SecHead kicker="O que você recebe" title="Híbrido: online, presencial e ao vivo." sub="5 meses de imersão em IA aplicada a negócios. Aulas no portal, workshops na Intech Cursos e mentorias 1:1 quinzenais." />
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}} className="beneficios-grid">
          {PILARES.map((p,i)=>(
            <div key={i} className="reveal" style={{padding:28,borderRadius:18,border:"1px solid var(--line-2)",background:"var(--card)",minHeight:260,display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{width:44,height:44,borderRadius:12,border:`1px solid ${accent}`,color:accent,display:"grid",placeItems:"center"}}>
                  <Ic d={p.icon} size={22}/>
                </div>
                {p.meta && <span className="mono" style={{fontSize:10,color:"var(--muted)"}}>{p.meta}</span>}
              </div>
              <div>
                <h3 className="display" style={{fontSize:22,margin:"0 0 10px",letterSpacing:"-.01em"}}>{p.t}</h3>
                <p style={{color:"var(--muted)",fontSize:14,margin:0,lineHeight:1.5}}>{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:980px){.beneficios-grid{grid-template-columns:repeat(2,1fr) !important}} @media(max-width:560px){.beneficios-grid{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}

// ── MÓDULOS ────────────────────────────────────────────────────────────────
const MODULOS = [
  { n:"01", t:"Tráfego Pago", icon: ICONS.target, dur:"10 aulas", mes:"Mês 1",
    bullets:["Briefing, público-alvo e persona","Análise de concorrência · Meta Ads Library","Funil ToFu / MoFu / BoFu","Copywriting: AIDA, PASTOR, 4Ps","Planejamento Meta Ads · Landing page","Checklist, portfólio e pitch final"] },
  { n:"02", t:"Criativos com IA para Ads", icon: ICONS.brush, dur:"8 aulas", mes:"Mês 2",
    bullets:["Prompt engineering (Midjourney, Firefly)","Vídeos com IA (Runway, Kling, Pika)","Thumbstop: gancho visual nos 1ºˢ 3s","Canva + IA para Feed, Stories e Reels","Copy gerada por IA + revisão estratégica","Batch de criativos em escala"] },
  { n:"03", t:"Vídeo Edição com IA", icon: ICONS.cam, dur:"8 aulas", mes:"Mês 3",
    bullets:["Fluxo e corte automático no Premiere Pro","Motion graphics no After Effects","Legendas automáticas · Firefly em vídeo","Edição de Reels e UGC com IA","Exportação e formatos por plataforma"] },
  { n:"04", t:"Influencer IA", icon: ICONS.user, dur:"7 aulas", mes:"Mês 3",
    bullets:["Avatar virtual com HeyGen / D-ID / Synthesia","Clonagem de voz e lip-sync","UGC sintético para anúncios","Roteiro e script com ChatGPT / Claude","Cases e tendências de influencer IA"] },
  { n:"05", t:"Agentes com IA", icon: ICONS.bolt, dur:"8 aulas", mes:"Mês 4",
    bullets:["O que são agentes e como funcionam","Make e N8N: automação visual","Agentes com ChatGPT e Claude API","Agente de atendimento · qualificação de leads","Deploy: disponibilizando seu agente"] },
  { n:"06", t:"Programação Base", icon: ICONS.code, dur:"7 aulas", mes:"Mês 5",
    bullets:["Lógica + JSON: estrutura e uso em APIs","JavaScript: variáveis, funções e loops","Consumindo APIs com fetch","GitHub: versionamento básico","Projeto final: mini ferramenta com IA"] },
];

function Modulos({ accent }) {
  return (
    <section className="sec" id="modulos" data-screen-label="05 Modulos">
      <div className="wrap">
        <div style={{display:"flex",alignItems:"end",justifyContent:"space-between",gap:24,flexWrap:"wrap",marginBottom:64}} className="reveal">
          <div style={{maxWidth:680}}>
            <div className="h-eyebrow" style={{marginBottom:16}}>Currículo · 6 módulos</div>
            <h2 className="display" style={{fontSize:"clamp(36px, 5vw, 64px)",margin:0,letterSpacing:"-.03em"}}>
              Do tráfego pago aos <span style={{color:accent}}>agentes de IA.</span>
            </h2>
          </div>
          <div className="mono" style={{color:"var(--muted)"}}>
            48 aulas · 10 mentorias ao vivo · 6 apostilas
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:0,border:"1px solid var(--line-2)",borderRadius:24,overflow:"hidden"}} className="mod-grid">
          {MODULOS.map((m,i)=>{
            const col = i % 2;
            const row = Math.floor(i/2);
            const lastRow = Math.floor((MODULOS.length-1)/2);
            return (
              <div key={m.n} className="reveal mod-cell" style={{
                padding:"36px 32px",
                borderRight: col === 0 ? "1px solid var(--line-2)" : "none",
                borderBottom: row < lastRow ? "1px solid var(--line-2)" : "none",
                display:"grid",gridTemplateColumns:"auto 1fr",gap:24,alignItems:"start",
                transition:"background .3s",cursor:"default"
              }}
                onMouseEnter={e=>e.currentTarget.style.background="var(--card-hover)"}
                onMouseLeave={e=>e.currentTarget.style.background=""}
              >
                <div style={{display:"flex",flexDirection:"column",gap:14,alignItems:"center"}}>
                  <div style={{fontSize:28,fontFamily:"var(--display)",color:accent,fontWeight:600,letterSpacing:".02em"}}>{m.n}</div>
                  <div style={{width:42,height:42,borderRadius:10,background:"rgba(244,244,242,.06)",color:"var(--fg)",display:"grid",placeItems:"center"}}>
                    <Ic d={m.icon} size={20}/>
                  </div>
                </div>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,flexWrap:"wrap"}}>
                    <h3 className="display" style={{fontSize:24,margin:0,letterSpacing:"-.01em"}}>{m.t}</h3>
                    <span className="mono" style={{padding:"3px 8px",borderRadius:999,background:"rgba(244,244,242,.06)",fontSize:10}}>{m.dur}</span>
                    <span className="mono" style={{padding:"3px 8px",borderRadius:999,border:`1px solid ${accent}`,color:accent,fontSize:10}}>{m.mes}</span>
                  </div>
                  <ul style={{listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:6}}>
                    {m.bullets.map((b,j)=>(
                      <li key={j} style={{display:"flex",alignItems:"flex-start",gap:10,fontSize:14,color:"var(--muted)",lineHeight:1.5}}>
                        <span style={{marginTop:8,width:4,height:4,borderRadius:"50%",background:accent,flexShrink:0,display:"inline-block"}}/>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@media(max-width:760px){.mod-grid{grid-template-columns:1fr !important} .mod-cell{border-right:none !important}}`}</style>
    </section>
  );
}

// ── CRONOGRAMA ─────────────────────────────────────────────────────────────
const CRONO = [
  { mes:"Mês 1", t:"Tráfego Pago",                  m:"Módulo 01",       acc:"10 aulas · mentorias 1:1" },
  { mes:"Mês 2", t:"Criativos com IA",              m:"Módulo 02",       acc:"8 aulas · mentorias 1:1" },
  { mes:"Mês 3", t:"Vídeo + Influencer IA",         m:"Módulos 03–04",   acc:"15 aulas · mentorias 1:1" },
  { mes:"Mês 4", t:"Agentes com IA",                m:"Módulo 05",       acc:"8 aulas · mentorias 1:1" },
  { mes:"Mês 5", t:"Programação Base + Projeto Final", m:"Módulo 06",     acc:"7 aulas · projeto final" },
];

function Cronograma({ accent }) {
  return (
    <section className="sec" id="cronograma" data-screen-label="06 Cronograma">
      <div className="wrap">
        <SecHead kicker="Cronograma" title="5 meses de imersão." sub="Do briefing ao deploy do seu primeiro agente. Aulas semanais + workshops presenciais + mentorias quinzenais." />

        <div style={{display:"grid",gridTemplateColumns:`repeat(${CRONO.length},1fr)`,gap:0,border:"1px solid var(--line-2)",borderRadius:20,overflow:"hidden"}} className="crono-grid">
          {CRONO.map((c,i)=>(
            <div key={i} className="reveal" style={{
              padding:"32px 24px",
              borderRight: i < CRONO.length-1 ? "1px solid var(--line-2)" : "none",
              position:"relative",minHeight:240,
              display:"flex",flexDirection:"column",justifyContent:"space-between",
              background: i === 2 ? `linear-gradient(180deg, ${accent}10 0%, transparent 100%)` : "transparent"
            }}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                  <span style={{display:"inline-grid",placeItems:"center",width:28,height:28,borderRadius:"50%",background:accent,color:"#0A0A0B",fontWeight:700,fontSize:13}}>{i+1}</span>
                  <span className="mono" style={{color:accent}}>{c.mes}</span>
                </div>
                <h3 className="display" style={{fontSize:22,margin:"0 0 8px",letterSpacing:"-.01em",lineHeight:1.15}}>{c.t}</h3>
                <div className="mono" style={{color:"var(--muted)"}}>{c.m}</div>
              </div>
              <div style={{marginTop:20,paddingTop:16,borderTop:"1px solid var(--line)",fontSize:12,color:"var(--muted)"}}>
                {c.acc}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:980px){.crono-grid{grid-template-columns:repeat(2,1fr) !important} .crono-grid > div{border-right:none !important;border-bottom:1px solid var(--line-2)}} @media(max-width:560px){.crono-grid{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}

// ── COMUNIDADE ─────────────────────────────────────────────────────────────
function Comunidade({ accent }) {
  return (
    <section className="sec" data-screen-label="07 Comunidade" style={{position:"relative",overflow:"hidden"}}>
      <div aria-hidden style={{position:"absolute",inset:0,pointerEvents:"none",background:`radial-gradient(60% 60% at 50% 0%, ${accent}10, transparent 70%)`}}/>
      <div className="wrap">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center"}} className="com-layout">
          <div className="reveal" style={{position:"relative"}}>
            <div style={{borderRadius:24,overflow:"hidden",border:"1px solid var(--line-2)",background:"#0d0d0e",boxShadow:"0 30px 80px rgba(0,0,0,.45)"}}>
              <img src="assets/db-comunidade.png" alt="Designers Brasil — maior comunidade de designers do Brasil" style={{display:"block",width:"100%",height:"auto"}}/>
            </div>
          </div>
          <div className="reveal">
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
              <img src="assets/designers-brasil-logo.png" alt="Designers Brasil" style={{height:42,width:"auto",display:"block"}}/>
            </div>
            <div className="h-eyebrow" style={{color:accent,marginBottom:14}}>@designersbrazil</div>
            <h2 className="display" style={{fontSize:"clamp(36px, 4.6vw, 64px)",margin:"0 0 20px",letterSpacing:"-.03em"}}>
              Criei a maior comunidade de Designers do Brasil.
            </h2>
            <p style={{fontSize:17,color:"var(--muted)",margin:"0 0 32px",maxWidth:520}}>
              Conecte-se, aprenda e evolua com milhares de designers como você. Acesso ao ecossistema do Designers Brasil incluso na mentoria.
            </p>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:32}} className="com-grid">
              {[["+10k","Designers"],["60%","Conteúdo IA"],["24/7","Networking"]].map(([n,l],i)=>(
                <div key={i} style={{padding:"16px 12px",borderTop:`2px solid ${accent}`}}>
                  <div className="display" style={{fontSize:28,letterSpacing:"-.02em"}}>{n}</div>
                  <div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>

            <a className="btn btn-ghost" href="https://www.instagram.com/designersbrazil" target="_blank" rel="noopener">
              <Ic d={ICONS.ig} size={16}/> Seguir @designersbrazil
            </a>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:880px){.com-layout{grid-template-columns:1fr !important}} @media(max-width:520px){.com-grid{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}

// ── PRICING ────────────────────────────────────────────────────────────────
const PLANS = [
  { id:"p1",   tag:"PARTE 1", title:"Meses 1 e 2",    sub:"Módulos 01–02",   price:"R$ 1.997", parc:"6× R$ 366",  feats:["Aulas gravadas","Apostilas PDF","Acesso vitalício","Mentorias 1:1 do período"] },
  { id:"full", tag:"★ RECOMENDADO", title:"Curso completo", sub:"5 meses · todos os 6 módulos", price:"R$ 3.997", parc:"12× R$ 366", feats:["Todos os 6 módulos","48 aulas gravadas","10 mentorias ao vivo","6 apostilas PDF","Workshops presenciais","Acesso vitalício"], featured:true },
  { id:"p2",   tag:"PARTE 2", title:"Meses 3–5",      sub:"Módulos 03–06",   price:"R$ 1.997", parc:"6× R$ 366",  feats:["Aulas gravadas","Apostilas PDF","Acesso vitalício","Mentorias 1:1 do período"] },
];

function Pricing({ t, setTweak }) {
  return (
    <section className="sec" id="preco" data-screen-label="08 Preco">
      <div className="wrap">
        <SecHead kicker="Investimento" title="Faça inteiro ou divida em partes." sub="Escolha o formato ideal pra você. Pagamento via Perfect Pay — cartão parcelado, boleto ou Pix. Acesso liberado em até 24h." align="center" />

        <div style={{display:"grid",gridTemplateColumns:"1fr 1.15fr 1fr",gap:18,maxWidth:1080,margin:"0 auto",alignItems:"stretch"}} className="price-grid">
          {PLANS.map((p,i) => {
            const featured = !!p.featured;
            return (
              <div key={p.id} className="reveal" style={{
                padding:32,
                borderRadius:24,
                border: featured ? `1px solid ${t.accent}` : "1px solid var(--line-2)",
                background: featured ? `linear-gradient(180deg, ${t.accent}0d, transparent 60%)` : "var(--card)",
                position:"relative",overflow:"hidden",
                display:"flex",flexDirection:"column",
                transform: featured ? "scale(1.02)" : "none",
                zIndex: featured ? 2 : 1
              }}>
                <div className="mono" style={{
                  display:"inline-flex",alignSelf:"flex-start",
                  padding:"4px 10px",borderRadius:999,
                  background: featured ? t.accent : "rgba(244,244,242,.08)",
                  color: featured ? "#0A0A0B" : "var(--muted)",
                  fontSize:10,fontWeight:600,letterSpacing:".1em",marginBottom:20
                }}>{p.tag}</div>

                <h3 className="display" style={{fontSize:30,margin:"0 0 4px",letterSpacing:"-.02em"}}>{p.title}</h3>
                <div style={{fontSize:13,color:"var(--muted)",marginBottom:24}}>{p.sub}</div>

                <div style={{marginBottom:8}}>
                  <div className="display" style={{fontSize:48,letterSpacing:"-.03em",lineHeight:1}}>{p.price}</div>
                  <div style={{fontSize:13,color:"var(--muted)",marginTop:6}}>ou {p.parc} no cartão</div>
                </div>

                <ul style={{listStyle:"none",margin:"24px 0",padding:0,display:"flex",flexDirection:"column",gap:10,flex:1}}>
                  {p.feats.map((f,j)=>(
                    <li key={j} style={{display:"flex",alignItems:"flex-start",gap:10,fontSize:14}}>
                      <span style={{display:"inline-grid",placeItems:"center",width:20,height:20,borderRadius:"50%",background: featured ? t.accent : "rgba(244,244,242,.08)",color: featured ? "#0A0A0B" : "var(--fg)",flexShrink:0,marginTop:1}}>
                        <Ic d={ICONS.check} size={12}/>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a href="https://wa.me/5598982474962?text=Ol%C3%A1%20Serejo!%20Quero%20fazer%20a%20inscri%C3%A7%C3%A3o%20no%20NEXUS%20IA" target="_blank" rel="noopener" className="btn"
                   style={{
                     justifyContent:"center",
                     background: featured ? t.accent : "transparent",
                     color: featured ? "#0A0A0B" : "var(--fg)",
                     border: featured ? "0" : "1px solid var(--line-2)",
                     fontWeight:600
                   }}>
                  {featured ? "Quero o curso completo" : "Quero esse formato"} <Ic d={ICONS.arrow} size={16}/>
                </a>
              </div>
            );
          })}
        </div>

        <div style={{textAlign:"center",fontSize:12,color:"var(--muted)",marginTop:32,display:"flex",justifyContent:"center",alignItems:"center",gap:18,flexWrap:"wrap"}}>
          <span>🔒 Pagamento seguro · Perfect Pay</span>
          <span style={{opacity:.4}}>•</span>
          <span>💳 Cartão / Boleto / Pix</span>
          <span style={{opacity:.4}}>•</span>
          <span>⚡ Acesso em 24h</span>
          <span style={{opacity:.4}}>•</span>
          <span>📜 Proposta válida por 15 dias</span>
        </div>
      </div>
      <style>{`@media(max-width:980px){.price-grid{grid-template-columns:1fr !important;max-width:480px !important} .price-grid > div{transform:none !important}}`}</style>
    </section>
  );
}

// ── DEPOIMENTOS ────────────────────────────────────────────────────────────
const DEPOS = [
  { name:"Lucas Silva",      role:"Empreendedor digital",    result:"R$ 15K em 30 dias",    q:"Em 30 dias fiz minha primeira venda usando IA. A mentoria mudou meu negócio completamente." },
  { name:"Marina Costa",     role:"Designer freelancer",     result:"3× mais clientes",      q:"Aprendi a criar criativos profissionais com IA. Meus clientes ficaram impressionados." },
  { name:"Rafael Oliveira",  role:"Desenvolvedor",           result:"20h/semana economizadas", q:"A automação que aprendi me economizou 20 horas por semana. Foco no que importa." },
  { name:"Juliana Ferreira", role:"Consultora de marketing", result:"5 novos clientes",      q:"Os encontros foram incríveis. Serejo me ajudou a estruturar minha estratégia de IA." },
  { name:"Carlos Mendes",    role:"Produtor de conteúdo",    result:"+300% de crescimento",  q:"Comecei a gerar vídeos e notícias automaticamente. Meu canal cresceu 300% em 2 meses." },
];

function Depoimentos({ accent }) {
  return (
    <section className="sec" data-screen-label="09 Depoimentos">
      <div className="wrap">
        <SecHead kicker="Quem já passou" title="Resultados reais, em pouco tempo." />
      </div>
      <div style={{overflow:"hidden"}}>
        <div style={{display:"flex",gap:20,padding:"0 32px",overflowX:"auto",scrollSnapType:"x mandatory",paddingBottom:8}} className="depos-row">
          {DEPOS.map((d,i)=>(
            <article key={i} style={{minWidth:380,maxWidth:380,padding:32,borderRadius:20,border:"1px solid var(--line-2)",background:"var(--card)",scrollSnapAlign:"start",display:"flex",flexDirection:"column",justifyContent:"space-between",minHeight:280}}>
              <div>
                <div style={{display:"flex",gap:2,color:accent,marginBottom:18}}>
                  {[...Array(5)].map((_,k)=>(<Ic key={k} d={ICONS.star} size={14}/>))}
                </div>
                <p style={{fontSize:17,lineHeight:1.5,margin:0}}>"{d.q}"</p>
              </div>
              <div style={{marginTop:24,paddingTop:20,borderTop:"1px solid var(--line)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{d.name}</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>{d.role}</div>
                </div>
                <div className="mono" style={{padding:"6px 10px",borderRadius:999,border:`1px solid ${accent}`,color:accent,fontSize:10}}>{d.result}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`.depos-row::-webkit-scrollbar{height:6px} .depos-row::-webkit-scrollbar-thumb{background:rgba(244,244,242,.2);border-radius:3px}`}</style>
    </section>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────────
const FAQS = [
  ["Como funciona o acesso ao curso?", "Você recebe acesso vitalício a todos os módulos no portal Next Digital, com 2 aulas liberadas por semana. Apostilas PDF, mentorias 1:1 quinzenais e workshops presenciais na Intech Cursos completam o pacote."],
  ["É presencial ou online?", "Híbrido. As 48 aulas gravadas ficam no portal (estuda no seu ritmo), enquanto os encontros presenciais acontecem na Intech Cursos e as 10 mentorias 1:1 são ao vivo com o Prof. Serejo."],
  ["Preciso ter experiência com IA?", "Não. O curso começa do zero — Tráfego Pago no Mês 1 — e vai até desenvolvimento de agentes e programação base no Mês 5."],
  ["Quanto tempo dura?", "5 meses de imersão. 6 módulos, 48 aulas gravadas e 10 mentorias ao vivo. Acesso ao material é vitalício."],
  ["Posso fazer só uma parte?", "Sim. Parte 1 (Módulos 01–02) e Parte 2 (Módulos 03–06) podem ser feitas separadamente por R$ 1.997 cada. Curso completo sai R$ 3.997 (recomendado)."],
  ["Como funciona o pagamento?", "Pagamento seguro via Perfect Pay: cartão de crédito parcelado, boleto bancário ou Pix. Acesso liberado em até 24h após confirmação."],
  ["Posso parcelar?", "Sim — até 12× de R$ 366 no curso completo, ou 6× de R$ 366 nas partes individuais."],
  ["Tem certificado?", "Sim. Você recebe certificado profissional ao concluir os módulos contratados."],
];

function FAQ({ accent }) {
  const [open, setOpen] = React.useState(0);
  return (
    <section className="sec" id="faq" data-screen-label="10 FAQ">
      <div className="wrap">
        <div style={{display:"grid",gridTemplateColumns:".8fr 1.2fr",gap:64,alignItems:"start"}} className="faq-grid">
          <div className="reveal">
            <div className="h-eyebrow" style={{color:accent,marginBottom:16}}>Perguntas frequentes</div>
            <h2 className="display" style={{fontSize:"clamp(36px, 5vw, 64px)",margin:"0 0 24px",letterSpacing:"-.03em"}}>Ainda em dúvida?</h2>
            <p style={{color:"var(--muted)",fontSize:16,marginBottom:24}}>
              Se alguma resposta abaixo não te ajudar, fale com Serejo direto no WhatsApp.
            </p>
            <a href="https://wa.me/5598982474962" target="_blank" rel="noopener" className="btn btn-primary" style={{background:accent}}>
              <Ic d={ICONS.whats} size={18}/> Falar no WhatsApp
            </a>
          </div>
          <div>
            {FAQS.map(([q,a],i)=>{
              const isOpen = open === i;
              return (
                <div key={i} className="reveal" style={{borderTop:"1px solid var(--line-2)", borderBottom: i===FAQS.length-1?"1px solid var(--line-2)":"none"}}>
                  <button onClick={()=>setOpen(isOpen?-1:i)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,padding:"24px 0",background:"transparent",border:0,textAlign:"left",cursor:"default"}}>
                    <span style={{fontSize:18,fontWeight:500}}>{q}</span>
                    <span style={{flexShrink:0,width:32,height:32,borderRadius:"50%",border:"1px solid var(--line-2)",display:"grid",placeItems:"center",color:isOpen?accent:"var(--fg)",transition:"all .2s",borderColor:isOpen?accent:"var(--line-2)"}}>
                      <Ic d={isOpen?ICONS.minus:ICONS.plus} size={16}/>
                    </span>
                  </button>
                  <div style={{maxHeight:isOpen?260:0,overflow:"hidden",transition:"max-height .35s ease, padding .25s ease",paddingBottom:isOpen?24:0}}>
                    <p style={{margin:0,color:"var(--muted)",fontSize:16,lineHeight:1.55,maxWidth:640}}>{a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:880px){.faq-grid{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}

// ── FINAL CTA ──────────────────────────────────────────────────────────────
function FinalCTA({ accent, ctaLabel }) {
  return (
    <section className="sec" data-screen-label="11 Final CTA" style={{position:"relative",overflow:"hidden",padding:"120px 0"}}>
      <div aria-hidden style={{position:"absolute",inset:0,background:`radial-gradient(60% 80% at 50% 50%, ${accent}1a, transparent 70%)`}}/>
      <div className="wrap" style={{textAlign:"center",position:"relative"}}>
        <div className="reveal">
          <div className="h-eyebrow" style={{color:accent,marginBottom:16}}>Vagas limitadas</div>
          <h2 className="display" style={{fontSize:"clamp(48px, 8vw, 128px)",margin:"0 0 32px",letterSpacing:"-.04em",lineHeight:.95}}>
            Você está a <span style={{color:accent,fontStyle:"italic"}}>1 passo</span><br/>de lucrar com IA.
          </h2>
          <p style={{fontSize:18,color:"var(--muted)",maxWidth:580,margin:"0 auto 40px"}}>
            5 meses de imersão. Tráfego pago, criativos com IA, vídeo, influencer virtual, agentes e programação base.
          </p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="#preco" className="btn btn-primary" style={{background:accent,padding:"18px 28px",fontSize:16}}>
              {ctaLabel} <Ic d={ICONS.arrow} size={18}/>
            </a>
            <a href="https://wa.me/5598982474962" target="_blank" rel="noopener" className="btn btn-ghost" style={{padding:"18px 24px",fontSize:15}}>
              <Ic d={ICONS.whats} size={18}/> Falar com Serejo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────────────
function Footer({ accent }) {
  return (
    <footer style={{borderTop:"1px solid var(--line)",padding:"56px 0 32px",fontSize:14}}>
      <div className="wrap">
        {/* partners strip */}
        <div className="reveal" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,flexWrap:"wrap",padding:"24px 28px",borderRadius:18,border:"1px solid var(--line-2)",background:"var(--card)",marginBottom:48}}>
          <div className="mono" style={{color:"var(--muted)"}}>Realização & Parceiros</div>
          <div style={{display:"flex",alignItems:"center",gap:32,flexWrap:"wrap"}}>
            <img src="assets/next-logo.png" alt="Next Digital" style={{height:44,width:"auto",display:"block"}}/>
            <div style={{width:1,height:24,background:"var(--line-2)"}}/>
            <img src="assets/nexus-ia-wordmark.png" alt="NEXUS IA" style={{height:20,width:"auto",display:"block"}}/>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr 1fr",gap:32}} className="ftr-grid">
          <div>
            <div className="logo" style={{marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
              <img src="assets/nexus-ia-wordmark.png" alt="NEXUS IA" style={{height:20,width:"auto",display:"block"}}/>
              <span style={{width:1,height:18,background:"var(--line-2)"}}/>
              <img src="assets/next-logo.png" alt="Next Digital" style={{height:26,width:"auto",display:"block"}}/>
            </div>
            <div style={{color:"var(--muted)",maxWidth:300,marginBottom:16}}>5 meses de imersão em IA aplicada a negócios. Do tráfego pago ao desenvolvimento de agentes.</div>
            <div style={{fontSize:13,color:"var(--muted)"}}>Prof. Serejo Oliveira · Especialista em IA, Marketing e Tecnologia</div>
          </div>
          <div>
            <div className="mono" style={{marginBottom:12}}>Curso</div>
            <ul style={{listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:8,color:"var(--muted)"}}>
              <li><a href="#beneficios">Formato</a></li>
              <li><a href="#modulos">Módulos</a></li>
              <li><a href="#cronograma">Cronograma</a></li>
              <li><a href="#preco">Investimento</a></li>
            </ul>
          </div>
          <div>
            <div className="mono" style={{marginBottom:12}}>Contato</div>
            <ul style={{listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:8,color:"var(--muted)"}}>
              <li><a href="https://wa.me/5598982474962" target="_blank" rel="noopener">(98) 98247-4962</a></li>
              <li><a href="mailto:seja@nextdigital.dev.br">seja@nextdigital.dev.br</a></li>
              <li><a href="https://nextdigital.dev.br" target="_blank" rel="noopener">nextdigital.dev.br</a></li>
            </ul>
          </div>
          <div>
            <div className="mono" style={{marginBottom:12}}>Redes</div>
            <ul style={{listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:8,color:"var(--muted)"}}>
              <li><a href="https://www.instagram.com/serejomentor" target="_blank" rel="noopener">@serejomentor</a></li>
              <li><a href="https://www.instagram.com/designersbrazil" target="_blank" rel="noopener">@designersbrazil</a></li>
            </ul>
          </div>
        </div>
        <div style={{marginTop:40,paddingTop:24,borderTop:"1px solid var(--line)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,color:"var(--muted)",fontSize:12}}>
          <div>© 2026 Curso NEXUS IA · Next Digital. Todos os direitos reservados.</div>
          <div className="mono">Pagamento via Perfect Pay · Proposta válida por 15 dias</div>
        </div>
      </div>
      <style>{`@media(max-width:760px){.ftr-grid{grid-template-columns:1fr 1fr !important}}`}</style>
    </footer>
  );
}

function FloatWhats({ accent }) {
  return (
    <a href="https://wa.me/5598982474962" target="_blank" rel="noopener" style={{
      position:"fixed",bottom:20,right:20,zIndex:40,
      width:56,height:56,borderRadius:"50%",background:accent,color:"#0A0A0B",
      display:"grid",placeItems:"center",
      boxShadow:`0 10px 30px ${accent}55`,
      animation:"pulse 2.4s ease-in-out infinite"
    }} aria-label="WhatsApp">
      <Ic d={ICONS.whats} size={26}/>
    </a>
  );
}

// ── APP ────────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();

  React.useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--bg', t.palette[0]);
    r.style.setProperty('--fg', t.palette[1]);
    r.style.setProperty('--accent', t.accent);
    const f = FONT_PAIRS[t.fontPair] || FONT_PAIRS.grotesk;
    r.style.setProperty('--display', f.display);
    r.style.setProperty('--body', f.body);
  }, [t.palette, t.accent, t.fontPair]);

  const cd = useCountdown(getDeadline());

  return (
    <div>
      <Nav accent={t.accent} ctaLabel="Garantir vaga" />
      <Hero t={t} countdown={cd} />
      <ParaQuem accent={t.accent} />
      <Mentor accent={t.accent} />
      <Beneficios accent={t.accent} />
      <Modulos accent={t.accent} />
      <Cronograma accent={t.accent} />
      <Comunidade accent={t.accent} />
      <Pricing t={t} setTweak={setTweak} />
      <Depoimentos accent={t.accent} />
      <FAQ accent={t.accent} />
      <FinalCTA accent={t.accent} ctaLabel={t.ctaLabel} />
      <Footer accent={t.accent} />
      <FloatWhats accent={t.accent} />

      <TweaksPanel>
        <TweakSection label="Identidade" />
        <TweakColor
          label="Paleta"
          value={t.palette}
          options={PALETTES}
          onChange={(v) => setTweak({ palette: v, accent: v[2] })}
        />
        <TweakColor
          label="Cor de destaque"
          value={t.accent}
          options={["#C6FF3D", "#7B61FF", "#FF6B2C", "#16E0A2", "#FFD60A", "#FF3D71"]}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakRadio
          label="Tipografia"
          value={t.fontPair}
          options={[{ value: "grotesk", label: "Grotesk" },{ value: "serif", label: "Tight" }]}
          onChange={(v) => setTweak('fontPair', v)}
        />

        <TweakSection label="Hero" />
        <TweakText label="Kicker" value={t.heroKicker} onChange={(v)=>setTweak('heroKicker',v)} />
        <TweakText label="Título"  value={t.heroTitle}  onChange={(v)=>setTweak('heroTitle',v)} />
        <TweakText label="Sub"     value={t.heroSub}    onChange={(v)=>setTweak('heroSub',v)} />
        <TweakText label="CTA"     value={t.ctaLabel}   onChange={(v)=>setTweak('ctaLabel',v)} />
        <TweakToggle label="Contagem regressiva" value={t.showCountdown} onChange={(v)=>setTweak('showCountdown',v)} />
      </TweaksPanel>
    </div>
  );
}

function getDeadline() {
  const k = "nexus_deadline";
  let v = localStorage.getItem(k);
  if (!v) { v = new Date(Date.now() + 7*24*3600*1000).toISOString(); localStorage.setItem(k, v); }
  return v;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
