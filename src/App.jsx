import { useState, useEffect, useRef } from "react";

/* ── TOKENS ─────────────────────────────────────────── */
const C = {
  bg:      "#080b14",
  surface: "#0f1629",
  border:  "#1e2d4a",
  teal:    "#2bd4b8",
  violet:  "#a78bfa",
  amber:   "#f59e0b",
  text:    "#e2e8f0",
  sub:     "#94a3b8",
  muted:   "#475569",
};
const ACCENT     = [C.teal, C.violet, C.amber];
const ACCENT_RGB = ["43,212,184","167,139,250","245,158,11"];
const font       = "'Plus Jakarta Sans',sans-serif";

const GHL_FORM_ID  = "E0DGPlNKwF71BjKkElAU";
const GHL_FORM_URL = `https://link.centralize.es/widget/form/${GHL_FORM_ID}`;
const GHL_JS_URL   = "https://link.centralize.es/js/form_embed.js";

/* ── DATA ────────────────────────────────────────────── */
const PERFILES = [
  { id:"consultor",    icon:"◈", titulo:"Consultor o Coach independiente",            desc:"Vendes tu conocimiento o acompañamiento de forma independiente" },
  { id:"vendedor",     icon:"◆", titulo:"Vendedor B2B empleado",                      desc:"Vendes productos o servicios de una empresa a otras empresas" },
  { id:"afiliado",     icon:"◇", titulo:"Afiliado de productos digitales",            desc:"Promueves productos de otros y ganas comisiones por ventas" },
  { id:"emprendedor",  icon:"○", titulo:"Emprendedor online construyendo su negocio", desc:"Quieres vender algo online pero aún defines qué y a quién" },
  { id:"inmobiliario", icon:"□", titulo:"Agente inmobiliario independiente",          desc:"Vendes o rentas propiedades de forma independiente" },
];

const SINTOMAS = {
  consultor:   [
    { id:"horas",    txt:"Trabajo muchas horas pero no veo crecer mis ingresos" },
    { id:"clientes", txt:"No me llegan clientes solos y no sé cómo conseguirlos sin sentirme vendiendo" },
    { id:"precio",   txt:"Cuando me preguntan cuánto cobro, no sé cómo justificar mi precio" },
    { id:"cero",     txt:"Cada cliente nuevo me exige empezar todo desde cero" },
  ],
  vendedor:    [
    { id:"admin",       txt:"Paso más tiempo en papeleos y reportes que hablando con clientes" },
    { id:"prospectos",  txt:"Escribo mensajes a prospectos y la mayoría no me responde" },
    { id:"seguimiento", txt:"Mando propuestas y después no sé cómo darle seguimiento sin molestar" },
    { id:"reunion",     txt:"Llego a las reuniones sin saber bien cómo prepararme para ese cliente específico" },
  ],
  afiliado:    [
    { id:"conversion", txt:"Tengo visitas pero casi nadie compra a través de mis links" },
    { id:"email",      txt:"Mando emails a mi lista y las ventas no reflejan el esfuerzo que pongo" },
    { id:"anuncios",   txt:"Gasto en anuncios pero no logro que sean rentables de forma consistente" },
    { id:"sistema",    txt:"Promoción tras promoción y siento que siempre estoy empezando de nuevo" },
  ],
  emprendedor: [
    { id:"producto",  txt:"Sé que tengo conocimiento valioso pero no sé cómo convertirlo en algo que vender" },
    { id:"inicio",    txt:"No sé por dónde empezar y cada vez que investigo me confundo más" },
    { id:"ideas",     txt:"Tengo varias ideas pero no sé cuál elegir ni si alguna tiene mercado real" },
    { id:"abandono",  txt:"Arranco proyectos con energía pero a la semana los abandono sin saber por qué" },
  ],
  inmobiliario:[
    { id:"frios",        txt:"Tengo prospectos interesados pero se me enfrían porque no les doy seguimiento a tiempo" },
    { id:"redes",        txt:"No sé cómo usar redes sociales para atraer clientes sin parecer desesperado" },
    { id:"contacto",     txt:"Cuando escribo para contactar a alguien no sé qué decir para que me respondan" },
    { id:"presentacion", txt:"Cada presentación de propiedad la improviso porque no tengo una estructura fija" },
  ],
};

const SKILLS = {
  consultor:{
    horas:[
      {n:"Diagnóstico de modelo de negocio", r:"Identifica dónde se pierde el dinero antes de optimizar cualquier otra cosa."},
      {n:"Diseño de oferta y precio",        r:"Para cobrar por valor entregado, no por horas trabajadas."},
      {n:"Propuestas comerciales",           r:"Para cerrar mejor los clientes que ya llegan sin dejar dinero sobre la mesa."},
    ],
    clientes:[
      {n:"Posicionamiento personal",     r:"Define desde dónde hablas antes de salir a buscar clientes."},
      {n:"Contenido que atrae clientes", r:"Para que el contenido haga la prospección sin que tú vendas directamente."},
      {n:"Conversación de ventas",       r:"Para cerrar cuando llega el prospecto sin sentir que estás presionando."},
    ],
    precio:[
      {n:"Propuesta de valor",             r:"Articula en lenguaje del cliente qué resultado concreto produce tu trabajo."},
      {n:"Estructura de precios",          r:"Diseña paquetes que justifican la tarifa sin negociar hacia abajo."},
      {n:"Manejo de objeciones de precio", r:"Para responder sin descuentos y sin perder al cliente."},
    ],
    cero:[
      {n:"Onboarding de clientes",            r:"Un proceso de entrada estándar que no dependa de improvisar cada vez."},
      {n:"Entregables y reportes",            r:"Para producir documentos de cliente en minutos, no en horas."},
      {n:"Seguimiento y gestión de relación", r:"Para mantener al cliente informado sin que te consuma tiempo."},
    ],
  },
  vendedor:{
    admin:[
      {n:"Actualización de CRM",     r:"Convierte notas de reunión en campos estructurados en minutos."},
      {n:"Reportes y forecast",      r:"Genera el reporte semanal al manager sin invertir media mañana."},
      {n:"Preparación de reuniones", r:"Para que el tiempo que sí tienes con clientes sea más efectivo."},
    ],
    prospectos:[
      {n:"Investigación de cuentas",   r:"Entiende al prospecto antes de escribirle y personaliza el ángulo de entrada."},
      {n:"Mensajes de prospección",    r:"Para escribir por canal con estructura que genera respuesta real."},
      {n:"Seguimiento de prospección", r:"Para saber qué decir en el segundo y tercer contacto sin repetirte."},
    ],
    seguimiento:[
      {n:"Propuestas comerciales",     r:"Para que la propuesta en sí genere el siguiente paso claro desde el inicio."},
      {n:"Seguimiento post-propuesta", r:"Mensajes de seguimiento con pretexto real, no con frases genéricas."},
      {n:"Manejo de objeciones",       r:"Para responder bien cuando el silencio se rompe con una objeción."},
    ],
    reunion:[
      {n:"Investigación de cuentas",  r:"Construye el brief de la empresa antes de la reunión con criterio."},
      {n:"Preparación de reuniones",  r:"Agenda, preguntas y posibles objeciones listas antes de entrar."},
      {n:"Seguimiento post-reunión",  r:"Para cerrar bien con el email correcto después de cada reunión."},
    ],
  },
  afiliado:{
    conversion:[
      {n:"Análisis de páginas de ventas", r:"Entiende qué promete el producto para alinear tu contenido con eso."},
      {n:"Bridge pages",                  r:"Para precalentar al prospecto antes de mandarlo a la página de ventas."},
      {n:"Reviews y comparativas",        r:"El contenido que más convierte en afiliación cuando está bien estructurado."},
    ],
    email:[
      {n:"Segmentación de lista",            r:"Para no mandar el mismo mensaje a todos y aumentar relevancia."},
      {n:"Secuencias de email de promoción", r:"Campañas de 5–7 emails en lugar de un solo disparo."},
      {n:"Análisis de métricas de email",    r:"Para identificar dónde se rompe la secuencia y qué corregir primero."},
    ],
    anuncios:[
      {n:"Creación de anuncios para afiliación", r:"Hooks y copies que convierten sin disparar moderación de plataforma."},
      {n:"Análisis de métricas de campaña",      r:"Diagnostica dónde está el cuello de botella antes de gastar más."},
      {n:"Bridge pages",                         r:"Para mejorar la conversión entre el anuncio y la página de ventas."},
    ],
    sistema:[
      {n:"Calendario editorial de promociones", r:"Planifica con anticipación y deja de reaccionar al último momento."},
      {n:"Contenido evergreen de afiliación",   r:"Piezas que generan comisiones sin depender de lanzamientos."},
      {n:"Análisis de portafolio de productos", r:"Decide qué productos vale la pena seguir promoviendo y cuáles cortar."},
    ],
  },
  emprendedor:{
    producto:[
      {n:"Autodiagnóstico de activos",        r:"Inventaría lo que sabes y tradúcelo en problemas reales que resuelve."},
      {n:"Diseño de oferta mínima validable", r:"Construye algo vendible en días, no en meses."},
      {n:"Propuesta de valor",                r:"Para comunicar lo que vendes en lenguaje que el cliente entiende."},
    ],
    inicio:[
      {n:"Desbloqueador de parálisis", r:"Identifica la decisión real que hay que tomar y el siguiente paso mínimo."},
      {n:"Validación de nicho",        r:"Evalúa ideas con criterios objetivos en lugar de buscar la idea perfecta."},
      {n:"Definición de avatar",       r:"Claridad de a quién le hablas antes de crear cualquier contenido."},
    ],
    ideas:[
      {n:"Validación de nicho",          r:"Compara ideas con criterios de mercado concretos y medibles."},
      {n:"Conversaciones de validación", r:"Habla con 10 personas del perfil y confirma si el problema es real."},
      {n:"Análisis de competencia",      r:"Identifica si hay mercado y dónde está el espacio diferenciado."},
    ],
    abandono:[
      {n:"Desbloqueador de parálisis",        r:"Identifica si el abandono es miedo, falta de claridad o modelo equivocado."},
      {n:"Diseño de oferta mínima validable", r:"Reduce el proyecto a algo ejecutable en días, no en meses."},
      {n:"Planificación semanal",             r:"Estructura de ejecución que no dependa de la motivación del momento."},
    ],
  },
  inmobiliario:{
    frios:[
      {n:"Sistema de seguimiento",           r:"Un protocolo claro de contacto por etapa del prospecto."},
      {n:"Mensajes de seguimiento",          r:"El mensaje correcto según el momento de la relación con cada prospecto."},
      {n:"Gestión de pipeline inmobiliario", r:"Visualiza el estado de cada prospecto sin depender de la memoria."},
    ],
    redes:[
      {n:"Posicionamiento del agente",        r:"Define desde qué ángulo hablar en redes antes de publicar cualquier cosa."},
      {n:"Contenido inmobiliario para redes", r:"Publicaciones que educan y atraen sin sonar a anuncio."},
      {n:"Calendario editorial inmobiliario", r:"Para publicar de forma consistente sin improvisar cada semana."},
    ],
    contacto:[
      {n:"Investigación de prospecto",           r:"Personaliza el primer contacto con contexto real de esa persona."},
      {n:"Mensajes de prospección inmobiliaria", r:"Escribe por canal con un ángulo que genera respuesta."},
      {n:"Seguimiento de prospección",           r:"Qué decir en el segundo contacto sin repetir el primero."},
    ],
    presentacion:[
      {n:"Ficha de propiedad",        r:"Describe cualquier inmueble con estructura persuasiva en minutos."},
      {n:"Presentación de propiedad", r:"Un guión de visita que destaca los puntos correctos según el comprador."},
      {n:"Seguimiento post-visita",   r:"El mensaje correcto después de mostrar la propiedad para mantener el interés."},
    ],
  },
};

/* ── GHL IFRAME FORM COMPONENT ───────────────────────── */
function GHLForm({ onSubmit }) {
  const scriptLoaded = useRef(false);

  // Load GHL embed script once
  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;
    const s = document.createElement("script");
    s.src = GHL_JS_URL;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // Listen for GHL postMessage on successful form submit
  useEffect(() => {
    const handler = (e) => {
      try {
        // GHL sends different message shapes depending on version
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        const isGHL = (
          e.origin.includes("centralize.es") ||
          e.origin.includes("leadconnectorhq.com") ||
          e.origin.includes("msgsndr.com")
        );
        if (!isGHL) return;

        // Detect submission success signal
        const isSubmit =
          data?.type === "form_submitted" ||
          data?.event === "form_submitted" ||
          data?.message === "form_submitted" ||
          data?.action === "submit" ||
          data?.submitted === true ||
          (data?.type === "resize" && data?.height > 0 && paso3Submitted.current);

        if (isSubmit) {
          onSubmit();
        }
      } catch {}
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onSubmit]);

  return (
    <iframe
      src={GHL_FORM_URL}
      id={`inline-${GHL_FORM_ID}`}
      data-layout={`{"id":"INLINE"}`}
      data-trigger-type="alwaysShow"
      data-trigger-value=""
      data-activation-type="alwaysActivated"
      data-activation-value=""
      data-deactivation-type="neverDeactivate"
      data-deactivation-value=""
      data-form-name="Form Diagnostico Skills"
      data-height="465"
      data-layout-iframe-id={`inline-${GHL_FORM_ID}`}
      data-form-id={GHL_FORM_ID}
      title="Form Diagnostico Skills"
      style={{
        width:"100%",
        height:"465px",
        border:"none",
        borderRadius:"10px",
        display:"block",
      }}
    />
  );
}

// Ref outside component to track submit state for resize fallback
const paso3Submitted = { current: false };

/* ── MAIN COMPONENT ──────────────────────────────────── */
export default function App() {
  // 0=intro 1=perfil 2=sintoma 3=form 4=resultado
  const [paso,     setPaso]    = useState(0);
  const [perfil,   setPerfil]  = useState(null);
  const [sintoma,  setSintoma] = useState(null);
  const [fade,     setFade]    = useState(false);
  const [hov,      setHov]     = useState(null);
  const [isMobile, setIsMobile]= useState(false);
  // Fallback: manual "Ya lo llené" button visible after 8s on step 3
  const [showManual, setShowManual] = useState(false);
  const manualTimer = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Show manual fallback button after 8s on step 3
  useEffect(() => {
    if (paso === 3) {
      paso3Submitted.current = false;
      setShowManual(false);
      manualTimer.current = setTimeout(() => setShowManual(true), 8000);
    } else {
      clearTimeout(manualTimer.current);
      setShowManual(false);
    }
    return () => clearTimeout(manualTimer.current);
  }, [paso]);

  const go = (n) => {
    setFade(true);
    setTimeout(() => { setPaso(n); setFade(false); }, 240);
  };

  const pickPerfil  = (id) => { setPerfil(id); setSintoma(null); go(2); };
  const pickSintoma = (id) => { setSintoma(id); go(3); };
  const handleFormSubmit = () => {
    paso3Submitted.current = true;
    go(4);
  };
  const reset = () => { setPerfil(null); setSintoma(null); go(0); };

  const skills     = perfil && sintoma ? SKILLS[perfil]?.[sintoma] || [] : [];
  const perfilObj  = PERFILES.find(p => p.id === perfil);
  const sintomaObj = SINTOMAS[perfil]?.find(s => s.id === sintoma);

  return (
    <div style={{
      minHeight:"100vh", background:C.bg,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"flex-start",
      padding: isMobile ? "0" : "40px 24px 60px",
      position:"relative", overflowX:"hidden",
    }}>

      {/* GLOWS */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        background:`
          radial-gradient(ellipse 80vw 50vh at 0% 0%,   rgba(43,212,184,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 70vw 50vh at 100% 100%, rgba(167,139,250,0.07) 0%, transparent 60%)
        `,
      }}/>
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        backgroundImage:`
          linear-gradient(rgba(43,212,184,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(43,212,184,0.022) 1px, transparent 1px)
        `,
        backgroundSize:"52px 52px",
      }}/>

      {/* CARD */}
      <div style={{
        width:"100%",
        maxWidth: isMobile ? "100%" : "680px",
        background: isMobile ? C.bg : C.surface,
        border: isMobile ? "none" : `1px solid ${C.border}`,
        borderRadius: isMobile ? 0 : "12px",
        padding: isMobile ? "28px 20px 48px" : "48px 52px",
        position:"relative", zIndex:1,
        minHeight: isMobile ? "100vh" : "auto",
        opacity: fade ? 0 : 1,
        transform: fade ? "translateY(8px)" : "translateY(0)",
        transition:"opacity 0.24s ease, transform 0.24s ease",
      }}>

        {/* EYEBROW */}
        <div style={{
          fontSize:"11px", letterSpacing:"0.2em", color:C.teal,
          textTransform:"uppercase", marginBottom:"12px",
          opacity:0.6, fontFamily:font, fontWeight:500,
        }}>
          Skills Diagnóstico · Smart Business
        </div>

        {/* PROGRESS — pasos 1-4 */}
        {paso > 0 && (
          <div style={{ display:"flex", gap:"6px", marginBottom: isMobile?"28px":"36px" }}>
            {[1,2,3,4].map((_,i)=>(
              <div key={i} style={{
                height:"3px", flex:1, borderRadius:"2px",
                background: paso > i+1 ? C.violet : paso === i+1 ? C.teal : "rgba(43,212,184,0.1)",
                transition:"background 0.4s ease",
              }}/>
            ))}
          </div>
        )}

        {/* ══ INTRO ══ */}
        {paso === 0 && (
          <div>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              background:"rgba(43,212,184,0.08)", border:"1px solid rgba(43,212,184,0.2)",
              borderRadius:"100px", padding:"6px 16px",
              marginBottom: isMobile?"24px":"32px",
            }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:C.teal, display:"inline-block", flexShrink:0 }}/>
              <span style={{ fontSize: isMobile?"12px":"13px", color:C.teal, fontFamily:font, fontWeight:500 }}>
                2 preguntas · resultado inmediato
              </span>
            </div>

            <h1 style={{
              fontSize: isMobile?"28px":"42px",
              fontFamily:font, fontWeight:800, lineHeight:1.15,
              marginBottom: isMobile?"16px":"20px",
              color:"#f8fafc", letterSpacing:"-0.02em",
            }}>
              Descubre las 3 Skills de Claude que necesitas ahora mismo
            </h1>

            <p style={{
              fontSize: isMobile?"16px":"18px",
              lineHeight:1.7, color:C.sub, fontFamily:font,
              marginBottom: isMobile?"32px":"40px", maxWidth:"520px",
            }}>
              Identifica tu perfil, tu cuello de botella y la ruta exacta de Skills que debes construir primero — en el orden correcto.
            </p>

            <button
              onClick={()=>go(1)}
              onMouseEnter={()=>setHov("start")}
              onMouseLeave={()=>setHov(null)}
              style={{
                background: hov==="start" ? "#d97706" : C.amber,
                color:"#080b14", border:"none", borderRadius:"10px",
                padding: isMobile?"16px 28px":"18px 36px",
                fontSize: isMobile?"15px":"16px",
                fontFamily:font, fontWeight:700, cursor:"pointer",
                transition:"background 0.18s ease",
                width: isMobile?"100%":"auto",
              }}
            >
              Comenzar diagnóstico →
            </button>
            <p style={{ marginTop:"12px", fontSize:"13px", color:C.muted, fontFamily:font }}>
              Sin registro previo · Resultado en 2 pasos
            </p>
          </div>
        )}

        {/* ══ PERFIL ══ */}
        {paso === 1 && (
          <div>
            <div style={{ fontSize:"12px", color:C.teal, letterSpacing:"0.14em", fontFamily:font, fontWeight:700, marginBottom:"10px", textTransform:"uppercase" }}>
              Paso 1 de 2 — Tu perfil
            </div>
            <h2 style={{ fontSize: isMobile?"22px":"30px", fontFamily:font, fontWeight:800, color:"#f8fafc", lineHeight:1.2, marginBottom:"8px", letterSpacing:"-0.02em" }}>
              ¿Cuál describe mejor tu situación?
            </h2>
            <p style={{ fontSize: isMobile?"14px":"16px", color:C.sub, marginBottom: isMobile?"20px":"28px", fontFamily:font }}>
              Elige el perfil más cercano a lo que haces hoy
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {PERFILES.map(p=>(
                <button
                  key={p.id}
                  onClick={()=>pickPerfil(p.id)}
                  onMouseEnter={()=>setHov(p.id)}
                  onMouseLeave={()=>setHov(null)}
                  style={{
                    background: hov===p.id ? "rgba(43,212,184,0.06)" : "rgba(15,22,41,0.8)",
                    border:`1.5px solid ${hov===p.id ? C.teal : C.border}`,
                    borderRadius:"10px",
                    padding: isMobile?"14px 16px":"16px 20px",
                    textAlign:"left", cursor:"pointer",
                    transition:"all 0.16s ease",
                    display:"flex", alignItems:"center", gap:"14px",
                  }}
                >
                  <span style={{
                    width:36, height:36, borderRadius:"8px", flexShrink:0,
                    background: hov===p.id ? "rgba(43,212,184,0.12)" : C.border,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"16px", color: hov===p.id ? C.teal : C.sub,
                    transition:"all 0.16s ease",
                  }}>{p.icon}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize: isMobile?"15px":"16px", fontWeight:700, color: hov===p.id?"#f8fafc":C.text, fontFamily:font, marginBottom:"3px", transition:"color 0.16s ease" }}>
                      {p.titulo}
                    </div>
                    <div style={{ fontSize: isMobile?"13px":"14px", color:C.muted, fontFamily:font, lineHeight:1.5 }}>{p.desc}</div>
                  </div>
                  <span style={{ fontSize:"18px", flexShrink:0, color: hov===p.id?C.teal:"transparent", transition:"color 0.16s ease" }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ SÍNTOMA ══ */}
        {paso === 2 && (
          <div>
            <div style={{ fontSize:"12px", color:C.violet, letterSpacing:"0.14em", fontFamily:font, fontWeight:700, marginBottom:"10px", textTransform:"uppercase" }}>
              Paso 2 de 2 — Tu problema
            </div>
            <h2 style={{ fontSize: isMobile?"22px":"30px", fontFamily:font, fontWeight:800, color:"#f8fafc", lineHeight:1.2, marginBottom:"8px", letterSpacing:"-0.02em" }}>
              ¿Qué te está costando más?
            </h2>
            <p style={{ fontSize: isMobile?"14px":"16px", color:C.sub, marginBottom: isMobile?"20px":"28px", fontFamily:font }}>
              Elige el problema que más te pesa hoy
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {(SINTOMAS[perfil]||[]).map((s,i)=>(
                <button
                  key={s.id}
                  onClick={()=>pickSintoma(s.id)}
                  onMouseEnter={()=>setHov(s.id)}
                  onMouseLeave={()=>setHov(null)}
                  style={{
                    background: hov===s.id ? "rgba(167,139,250,0.06)" : "rgba(15,22,41,0.8)",
                    border:`1.5px solid ${hov===s.id ? C.violet : C.border}`,
                    borderRadius:"10px",
                    padding: isMobile?"14px 16px":"16px 20px",
                    textAlign:"left", cursor:"pointer",
                    transition:"all 0.16s ease",
                    display:"flex", alignItems:"center", gap:"14px",
                  }}
                >
                  <span style={{
                    width:32, height:32, borderRadius:"8px", flexShrink:0,
                    background: hov===s.id ? "rgba(167,139,250,0.12)" : C.border,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"12px", fontWeight:700,
                    color: hov===s.id ? C.violet : C.muted,
                    fontFamily:font, transition:"all 0.16s ease",
                  }}>0{i+1}</span>
                  <span style={{
                    flex:1, fontSize: isMobile?"14px":"15px",
                    color: hov===s.id ? C.text : C.sub,
                    fontFamily:font, lineHeight:1.55, fontWeight:500,
                    transition:"color 0.16s ease",
                  }}>{s.txt}</span>
                  <span style={{ fontSize:"18px", flexShrink:0, color: hov===s.id?C.violet:"transparent", transition:"color 0.16s ease" }}>→</span>
                </button>
              ))}
            </div>

            <button
              onClick={()=>go(1)}
              style={{ marginTop:"20px", background:"transparent", border:"none", color:C.muted, fontSize:"14px", cursor:"pointer", fontFamily:font, fontWeight:500, padding:"6px 0" }}
            >
              ← Cambiar perfil
            </button>
          </div>
        )}

        {/* ══ PASO 3 — FORMULARIO GHL ══ */}
        {paso === 3 && (
          <div>
            {/* Header */}
            <div style={{
              display:"flex", alignItems:"center", gap:"10px",
              marginBottom: isMobile?"20px":"28px",
            }}>
              <div style={{
                width:40, height:40, borderRadius:"10px", flexShrink:0,
                background:"rgba(43,212,184,0.1)",
                border:"1.5px solid rgba(43,212,184,0.25)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"18px",
              }}>🔒</div>
              <div>
                <div style={{ fontSize: isMobile?"15px":"16px", fontWeight:700, color:"#f8fafc", fontFamily:font, marginBottom:"3px" }}>
                  Tu diagnóstico está listo
                </div>
                <div style={{ fontSize: isMobile?"13px":"14px", color:C.sub, fontFamily:font, lineHeight:1.5 }}>
                  Déjanos tus datos para ver las 3 Skills que necesitas
                </div>
              </div>
            </div>

            {/* GHL iframe */}
            <div style={{
              background:"rgba(15,22,41,0.6)",
              border:`1px solid ${C.border}`,
              borderRadius:"12px",
              overflow:"hidden",
              marginBottom:"16px",
            }}>
              <GHLForm onSubmit={handleFormSubmit} />
            </div>

            {/* Fallback manual button — aparece después de 8s */}
            {showManual && (
              <div style={{
                textAlign:"center",
                padding:"16px",
                background:"rgba(43,212,184,0.04)",
                border:"1px solid rgba(43,212,184,0.12)",
                borderRadius:"10px",
                marginBottom:"16px",
              }}>
                <p style={{ fontSize:"13px", color:C.sub, fontFamily:font, marginBottom:"12px", lineHeight:1.5 }}>
                  ¿Ya enviaste el formulario?
                </p>
                <button
                  onClick={handleFormSubmit}
                  onMouseEnter={()=>setHov("manual")}
                  onMouseLeave={()=>setHov(null)}
                  style={{
                    background: hov==="manual" ? "#d97706" : C.amber,
                    color:"#080b14", border:"none", borderRadius:"8px",
                    padding:"12px 24px", fontSize:"14px",
                    fontFamily:font, fontWeight:700,
                    cursor:"pointer", transition:"background 0.16s ease",
                  }}
                >
                  Ver mi diagnóstico →
                </button>
              </div>
            )}

            <button
              onClick={()=>go(2)}
              style={{ background:"transparent", border:"none", color:C.muted, fontSize:"14px", cursor:"pointer", fontFamily:font, fontWeight:500, padding:"4px 0" }}
            >
              ← Volver
            </button>
          </div>
        )}

        {/* ══ PASO 4 — RESULTADO ══ */}
        {paso === 4 && (
          <div>
            {/* Confirmación */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              background:"rgba(43,212,184,0.08)", border:"1px solid rgba(43,212,184,0.2)",
              borderRadius:"100px", padding:"6px 16px",
              marginBottom: isMobile?"20px":"28px",
            }}>
              <span style={{ color:C.teal, fontSize:"14px", fontWeight:700 }}>✓</span>
              <span style={{ fontSize:"13px", color:C.teal, fontFamily:font, fontWeight:600 }}>
                Registro completado · Revisa tu email
              </span>
            </div>

            {/* Contexto */}
            <div style={{
              background:"rgba(43,212,184,0.05)",
              border:"1px solid rgba(43,212,184,0.15)",
              borderRadius:"10px",
              padding: isMobile?"14px 16px":"16px 20px",
              marginBottom: isMobile?"24px":"32px",
            }}>
              <div style={{ fontSize:"11px", color:C.teal, letterSpacing:"0.14em", fontFamily:font, fontWeight:700, marginBottom:"10px", textTransform:"uppercase" }}>
                Tu diagnóstico
              </div>
              <div style={{ fontSize: isMobile?"13px":"14px", color:C.sub, marginBottom:"4px", fontFamily:font }}>
                Perfil: <span style={{ color:C.text, fontWeight:600 }}>{perfilObj?.titulo}</span>
              </div>
              <div style={{ fontSize: isMobile?"13px":"14px", color:C.sub, fontFamily:font, lineHeight:1.5 }}>
                Problema: <span style={{ color:C.text, fontWeight:600 }}>{sintomaObj?.txt}</span>
              </div>
            </div>

            <h2 style={{
              fontSize: isMobile?"20px":"28px",
              fontFamily:font, fontWeight:800, color:"#f8fafc",
              marginBottom:"8px", lineHeight:1.2, letterSpacing:"-0.02em",
            }}>
              Las 3 Skills que debes construir primero
            </h2>
            <p style={{ fontSize: isMobile?"14px":"15px", color:C.sub, marginBottom: isMobile?"20px":"24px", fontFamily:font, lineHeight:1.6 }}>
              En este orden. Cada una prepara el terreno para la siguiente.
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom: isMobile?"28px":"36px" }}>
              {skills.map((sk,i)=>(
                <div key={i} style={{
                  background:"rgba(15,22,41,0.9)",
                  border:`1.5px solid ${C.border}`,
                  borderLeft:`4px solid ${ACCENT[i]}`,
                  borderRadius:"10px",
                  padding: isMobile?"16px":"20px 22px",
                  position:"relative",
                }}>
                  {i===0 && (
                    <div style={{
                      position:"absolute", top:"14px", right:"14px",
                      fontSize:"10px", color:C.teal, letterSpacing:"0.1em",
                      background:"rgba(43,212,184,0.1)",
                      borderRadius:"100px", padding:"3px 10px",
                      fontFamily:font, fontWeight:700,
                    }}>PRIMERO</div>
                  )}
                  <div style={{ display:"flex", gap:"14px", alignItems:"flex-start" }}>
                    <div style={{
                      width:40, height:40, flexShrink:0, borderRadius:"10px",
                      background:`rgba(${ACCENT_RGB[i]},0.1)`,
                      border:`1.5px solid rgba(${ACCENT_RGB[i]},0.25)`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      <span style={{ fontSize:"14px", color:ACCENT[i], fontWeight:800, fontFamily:font }}>0{i+1}</span>
                    </div>
                    <div style={{ flex:1, paddingRight: i===0 ? (isMobile?"64px":"72px") : 0 }}>
                      <div style={{ fontSize: isMobile?"15px":"17px", fontWeight:700, color:"#f8fafc", fontFamily:font, marginBottom:"6px", lineHeight:1.3 }}>
                        {sk.n}
                      </div>
                      <div style={{ fontSize: isMobile?"13px":"14px", color:C.sub, lineHeight:1.65, fontFamily:font }}>
                        {sk.r}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{
              background:"rgba(15,22,41,0.6)",
              border:`1px solid ${C.border}`,
              borderRadius:"12px",
              padding: isMobile?"20px":"28px",
              marginBottom:"20px",
            }}>
              <div style={{ fontSize:"11px", color:C.violet, letterSpacing:"0.14em", fontFamily:font, fontWeight:700, marginBottom:"10px", textTransform:"uppercase" }}>
                ¿Qué sigue?
              </div>
              <p style={{ fontSize: isMobile?"14px":"15px", color:C.sub, lineHeight:1.7, fontFamily:font, marginBottom:"18px" }}>
                Estas Skills ya están construidas y listas para usar en Claude. Puedes obtenerlas de forma individual o en el Pack completo para tu perfil.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                <button
                  onMouseEnter={()=>setHov("pack")}
                  onMouseLeave={()=>setHov(null)}
                  style={{
                    background: hov==="pack" ? "#d97706" : C.amber,
                    color:"#080b14", border:"none", borderRadius:"8px",
                    padding: isMobile?"16px 20px":"16px 24px",
                    fontSize: isMobile?"15px":"16px",
                    fontFamily:font, fontWeight:700,
                    cursor:"pointer", textAlign:"left",
                    transition:"background 0.16s ease", width:"100%",
                  }}
                >
                  Ver Pack completo para mi perfil →
                </button>
                <button
                  onMouseEnter={()=>setHov("single")}
                  onMouseLeave={()=>setHov(null)}
                  style={{
                    background:"transparent",
                    color: hov==="single" ? C.teal : C.sub,
                    border:`1.5px solid ${hov==="single" ? C.teal : C.border}`,
                    borderRadius:"8px",
                    padding: isMobile?"15px 20px":"15px 24px",
                    fontSize: isMobile?"15px":"16px",
                    fontFamily:font, fontWeight:600,
                    cursor:"pointer", textAlign:"left",
                    transition:"all 0.16s ease", width:"100%",
                  }}
                >
                  Obtener solo la primera Skill →
                </button>
              </div>
            </div>

            <button
              onClick={reset}
              onMouseEnter={e=>e.currentTarget.style.color=C.sub}
              onMouseLeave={e=>e.currentTarget.style.color=C.muted}
              style={{ background:"transparent", border:"none", color:C.muted, fontSize:"14px", cursor:"pointer", fontFamily:font, fontWeight:500, padding:"4px 0" }}
            >
              ← Hacer diagnóstico de nuevo
            </button>
          </div>
        )}

        {/* FOOTER */}
        <div style={{
          marginTop: isMobile?"40px":"52px",
          paddingTop:"16px",
          borderTop:`1px solid ${C.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          fontSize:"11px", color:C.muted, fontFamily:font, letterSpacing:"0.06em",
        }}>
          <span style={{ fontWeight:600 }}>SMART BUSINESS</span>
          <span style={{ color:"rgba(43,212,184,0.2)", fontSize:"16px" }}>◈</span>
          <span>SKILLS PARA CLAUDE</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { -webkit-text-size-adjust:100%; }
        button { -webkit-tap-highlight-color:transparent; }
        button:focus-visible { outline:2px solid rgba(43,212,184,0.5); outline-offset:2px; }
        @media (max-width:639px) { body { overflow-x:hidden; } }
      `}</style>
    </div>
  );
}
