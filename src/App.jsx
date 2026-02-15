import { useState, useRef } from "react";

// ─── DONNÉES ──────────────────────────────────────────────────────────────────

const AIRPORTS = [
  { code: "MRS", name: "Marseille",   emoji: "🌊" },
  { code: "LYS", name: "Lyon",        emoji: "🏔️" },
  { code: "NCE", name: "Nice",        emoji: "🌺" },
  { code: "BCN", name: "Barcelone",   emoji: "🎭" },
  { code: "CDG", name: "Paris CDG",   emoji: "🗼" },
  { code: "ORY", name: "Paris Orly",  emoji: "🏛️" },
];

// Destinations Amadeus disponibles (codes IATA)
const DESTINATIONS = [
  { code: "LON", name: "Londres",        icon: "🎡", region: "Europe" },
  { code: "AMS", name: "Amsterdam",      icon: "🌷", region: "Europe" },
  { code: "FCO", name: "Rome",           icon: "🏛️", region: "Europe" },
  { code: "BCN", name: "Barcelone",      icon: "🎭", region: "Europe" },
  { code: "LIS", name: "Lisbonne",       icon: "🐟", region: "Europe" },
  { code: "ATH", name: "Athènes",        icon: "🏛️", region: "Europe" },
  { code: "IST", name: "Istanbul",       icon: "🌙", region: "Europe" },
  { code: "DUB", name: "Dublin",         icon: "🍀", region: "Europe" },
  { code: "CPH", name: "Copenhague",     icon: "🧜", region: "Europe Nord" },
  { code: "ARN", name: "Stockholm",      icon: "🦌", region: "Europe Nord" },
  { code: "HEL", name: "Helsinki",       icon: "🌲", region: "Europe Nord" },
  { code: "VIE", name: "Vienne",         icon: "🎼", region: "Europe" },
  { code: "DXB", name: "Dubaï",          icon: "🏙️", region: "Moyen-Orient" },
  { code: "DOH", name: "Doha",           icon: "🕌", region: "Moyen-Orient" },
  { code: "CMN", name: "Casablanca",     icon: "🕌", region: "Afrique" },
  { code: "RAK", name: "Marrakech",      icon: "🌅", region: "Afrique" },
  { code: "TUN", name: "Tunis",          icon: "🏺", region: "Afrique" },
  { code: "MRU", name: "Maurice",        icon: "🐠", region: "Océan Indien" },
  { code: "RUN", name: "La Réunion",     icon: "🌋", region: "Océan Indien" },
  { code: "SEZ", name: "Seychelles",     icon: "🏝️", region: "Océan Indien" },
  { code: "BKK", name: "Bangkok",        icon: "🏯", region: "Asie" },
  { code: "SIN", name: "Singapour",      icon: "🦁", region: "Asie" },
  { code: "NRT", name: "Tokyo",          icon: "⛩️", region: "Asie" },
  { code: "JFK", name: "New York",       icon: "🗽", region: "Amériques" },
  { code: "MIA", name: "Miami",          icon: "🌊", region: "Amériques" },
  { code: "CUN", name: "Cancún",         icon: "🌴", region: "Amériques" },
];

const REGIONS = [...new Set(DESTINATIONS.map(d => d.region))];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#0b0b12;}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
@keyframes dot{0%,80%,100%{opacity:.2;transform:scale(.8);}40%{opacity:1;transform:scale(1);}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(200,169,110,.2);}50%{box-shadow:0 0 42px rgba(200,169,110,.45);}}

.chip{padding:7px 14px;border-radius:100px;cursor:pointer;transition:all .2s ease;
  font-size:12px;font-weight:500;border:1px solid rgba(200,169,110,.2);
  background:rgba(200,169,110,.04);color:rgba(255,255,255,.58);
  display:inline-flex;align-items:center;gap:5px;white-space:nowrap;
  font-family:'DM Sans',sans-serif;}
.chip:hover{border-color:rgba(200,169,110,.45);color:rgba(255,255,255,.9);background:rgba(200,169,110,.09);}
.chip.on{background:rgba(200,169,110,.14);border-color:#c8a96e;color:#c8a96e;}

.sbtn{background:linear-gradient(135deg,#c8a96e 0%,#9a7040 100%);
  border:none;color:white;padding:16px 48px;border-radius:100px;
  font-size:13px;font-weight:700;letter-spacing:2px;cursor:pointer;
  transition:all .3s ease;font-family:'DM Sans',sans-serif;animation:glow 3s ease-in-out infinite;}
.sbtn:hover{transform:translateY(-3px) scale(1.02);filter:brightness(1.1);}
.sbtn:disabled{opacity:.45;cursor:not-allowed;transform:none;animation:none;}

.tab-btn{padding:9px 22px;border-radius:100px;cursor:pointer;
  font-size:12px;font-weight:600;letter-spacing:1.2px;
  transition:all .2s;border:none;font-family:'DM Sans',sans-serif;}
.tab-btn.on{background:rgba(200,169,110,.12);color:#c8a96e;border:1px solid rgba(200,169,110,.28);}
.tab-btn.off{background:transparent;color:rgba(255,255,255,.3);border:1px solid transparent;}

input[type=date]{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
  color:white;padding:10px 14px;border-radius:10px;font-family:'DM Sans',sans-serif;
  font-size:13px;outline:none;cursor:pointer;width:100%;color-scheme:dark;}
select{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
  color:white;padding:8px 12px;border-radius:10px;font-family:'DM Sans',sans-serif;
  font-size:13px;outline:none;cursor:pointer;}
select option{background:#1a1a2e;}

.badge-real{display:inline-flex;align-items:center;gap:5px;
  background:rgba(0,200,150,.1);border:1px solid rgba(0,200,150,.25);
  color:#00c896;border-radius:6px;padding:2px 8px;font-size:10px;font-weight:600;}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:rgba(200,169,110,.25);border-radius:2px;}
`;

const P = {
  background: "rgba(255,255,255,.025)",
  border: "1px solid rgba(255,255,255,.07)",
  borderRadius: "20px", padding: "22px", marginBottom: "14px",
};

const LABEL = {
  color: "#c8a96e", fontSize: "10px", letterSpacing: "2.5px",
  fontWeight: "600", marginBottom: "14px",
};

// ─── COMPOSANTS ───────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ position: "relative", width: "64px", height: "64px", margin: "0 auto 24px" }}>
        <div style={{ position: "absolute", inset: 0, border: "2px solid rgba(200,169,110,.1)", borderTop: "2px solid #c8a96e", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <div style={{ position: "absolute", inset: "14px", border: "2px solid rgba(200,169,110,.06)", borderBottom: "2px solid rgba(200,169,110,.45)", borderRadius: "50%", animation: "spin 1.6s linear infinite reverse" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>✈</div>
      </div>
      <div style={{ fontFamily: "'Playfair Display',serif", color: "#c8a96e", fontSize: "18px", marginBottom: "10px" }}>Recherche en cours…</div>
      <div style={{ color: "rgba(255,255,255,.38)", fontSize: "13px", lineHeight: "1.7" }}>
        Interrogation de l'API Amadeus en temps réel
      </div>
      <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "18px" }}>
        {[0,1,2].map(i => <div key={i} style={{ width:"7px",height:"7px",borderRadius:"50%",background:"#c8a96e",animation:`dot 1.4s ease-in-out ${i*.16}s infinite` }} />)}
      </div>
    </div>
  );
}

function FlightCard({ f, rank }) {
  const [open, setOpen] = useState(false);
  const BADGE = {
    "🔥 MEILLEURE OFFRE": "linear-gradient(135deg,#ff6b35,#f7931e)",
    "⚡ PROMO FLASH":      "linear-gradient(135deg,#2193b0,#6dd5ed)",
  };
  return (
    <div
      onClick={() => setOpen(v => !v)}
      style={{
        background: "linear-gradient(135deg,rgba(255,255,255,.04),rgba(200,169,110,.02))",
        border: `1px solid ${open ? "rgba(200,169,110,.42)" : "rgba(200,169,110,.15)"}`,
        borderRadius: "18px", padding: "20px", marginBottom: "10px",
        cursor: "pointer", transition: "all .25s ease",
        animation: `fadeInUp .4s ease ${rank * .05}s both`, position: "relative",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(200,169,110,.42)"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 30px rgba(200,169,110,.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=open?"rgba(200,169,110,.42)":"rgba(200,169,110,.15)"; }}
    >
      {/* Rang */}
      <div style={{ position:"absolute",top:"14px",left:"14px",width:"26px",height:"26px",borderRadius:"50%",background:rank===1?"linear-gradient(135deg,#c8a96e,#9a7040)":"rgba(255,255,255,.07)",border:rank===1?"none":"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:"700",color:rank===1?"white":"rgba(255,255,255,.35)" }}>#{rank}</div>

      {/* Badge */}
      {f.badge && <div style={{ position:"absolute",top:"14px",right:"14px",background:BADGE[f.badge]||BADGE["🔥 MEILLEURE OFFRE"],color:"white",padding:"3px 11px",borderRadius:"20px",fontSize:"10px",fontWeight:"700",boxShadow:"0 2px 12px rgba(0,0,0,.35)" }}>{f.badge}</div>}

      <div style={{ display:"flex",gap:"14px",flexWrap:"wrap",justifyContent:"space-between",paddingLeft:"38px" }}>
        {/* Gauche */}
        <div style={{ flex:1,minWidth:"200px" }}>
          <div style={{ display:"flex",gap:"12px",alignItems:"center",marginBottom:"10px" }}>
            <div style={{ width:"46px",height:"46px",borderRadius:"12px",background:"rgba(200,169,110,.08)",border:"1px solid rgba(200,169,110,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",flexShrink:0 }}>{f.destinationIcon}</div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif",color:"white",fontSize:"18px",fontWeight:"700" }}>{f.destination}</div>
              <div style={{ display:"flex",gap:"6px",alignItems:"center",marginTop:"2px" }}>
                <span style={{ color:"#c8a96e",fontSize:"11px" }}>{f.airline}</span>
                {f.isRealData && <span className="badge-real">✓ Prix réel</span>}
              </div>
            </div>
          </div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:"5px" }}>
            {[["⏱",f.duration],["🔄",f.stops],["🛫",f.departureAirport],["📅",f.dates]].map(([ic,val]) => (
              <div key={ic} style={{ display:"flex",alignItems:"center",gap:"4px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.06)",borderRadius:"7px",padding:"3px 8px" }}>
                <span style={{ fontSize:"10px",opacity:.65 }}>{ic}</span>
                <span style={{ color:"rgba(255,255,255,.62)",fontSize:"11px" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Droite : prix */}
        <div style={{ textAlign:"right",flexShrink:0 }}>
          <div style={{ color:"rgba(255,255,255,.3)",fontSize:"10px" }}>à partir de</div>
          <div style={{ color:"#c8a96e",fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,32px)",fontWeight:"800",lineHeight:1,marginTop:"2px" }}>{f.price}€</div>
          <div style={{ color:"rgba(255,255,255,.38)",fontSize:"10px",marginTop:"3px" }}>/ personne · A/R</div>
          <div style={{ color:"rgba(255,255,255,.75)",fontSize:"12px",marginTop:"5px" }}>
            Total: <strong style={{ color:"white" }}>{f.totalPrice}€</strong>
          </div>
          <div style={{ marginTop:"7px",fontSize:"11px",color:open?"#c8a96e":"rgba(255,255,255,.28)",transition:"color .2s" }}>
            {open ? "▲ Masquer" : "▼ Détails"}
          </div>
        </div>
      </div>

      {/* Détails dépliés */}
      {open && (
        <div style={{ marginTop:"18px",paddingTop:"18px",borderTop:"1px solid rgba(200,169,110,.12)",animation:"fadeIn .25s ease" }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"8px",marginBottom:"14px" }}>
            {(f.details||[]).map((d,k) => (
              <div key={k} style={{ background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)",borderRadius:"10px",padding:"10px" }}>
                <div style={{ color:"rgba(255,255,255,.3)",fontSize:"9px",letterSpacing:"1px",marginBottom:"4px" }}>{(d.label||"").toUpperCase()}</div>
                <div style={{ color:"rgba(255,255,255,.82)",fontSize:"12px" }}>{d.value}</div>
              </div>
            ))}
          </div>
          {f.isRealData && (
            <div style={{ background:"rgba(0,200,150,.05)",border:"1px solid rgba(0,200,150,.15)",borderRadius:"10px",padding:"12px",marginBottom:"12px" }}>
              <div style={{ color:"#00c896",fontSize:"9px",letterSpacing:"1.5px",marginBottom:"6px" }}>✓ DONNÉES EN TEMPS RÉEL — AMADEUS</div>
              <div style={{ color:"rgba(255,255,255,.65)",fontSize:"12px",lineHeight:"1.6" }}>{f.aiAnalysis}</div>
            </div>
          )}
          <div style={{ display:"flex",gap:"8px",flexWrap:"wrap" }}>
            {[
              ["Voir sur Google Flights →", `https://www.google.com/flights?hl=fr`, true],
              ["Kayak",      "https://www.kayak.fr",      false],
              ["Skyscanner", "https://www.skyscanner.fr", false],
              ["Momondo",    "https://www.momondo.fr",    false],
            ].map(([label,url,primary]) => (
              <button key={label} onClick={e=>{e.stopPropagation();window.open(url,"_blank");}}
                style={{ flex:primary?"2":"1",minWidth:"110px",background:primary?"linear-gradient(135deg,#c8a96e,#a07840)":"rgba(255,255,255,.05)",border:primary?"none":"1px solid rgba(255,255,255,.1)",color:"white",padding:"10px 14px",borderRadius:"10px",fontSize:"12px",fontWeight:primary?"700":"400",cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────

export default function App() {
  const [origin,      setOrigin]      = useState("MRS");
  const [destCodes,   setDestCodes]   = useState(["LON","AMS","FCO","DXB","BKK","CUN"]);
  const [filterRegion,setFilterRegion]= useState("Toutes");
  const [departDate,  setDepartDate]  = useState("");
  const [returnDate,  setReturnDate]  = useState("");
  const [adults,      setAdults]      = useState(2);
  const [children,    setChildren]    = useState(1);
  const [infants,     setInfants]     = useState(0);
  const [tab,         setTab]         = useState("search");
  const [loading,     setLoading]     = useState(false);
  const [results,     setResults]     = useState(null);
  const [error,       setError]       = useState(null);
  const resultsRef = useRef(null);

  // Sélection/désélection destination
  const toggleDest = code => {
    setDestCodes(prev =>
      prev.includes(code) ? prev.filter(c=>c!==code) : [...prev, code]
    );
  };

  const selectAllRegion = region => {
    const codes = DESTINATIONS.filter(d => d.region === region).map(d => d.code);
    const allSelected = codes.every(c => destCodes.includes(c));
    if (allSelected) setDestCodes(prev => prev.filter(c => !codes.includes(c)));
    else setDestCodes(prev => [...new Set([...prev, ...codes])]);
  };

  const visibleDests = filterRegion === "Toutes"
    ? DESTINATIONS
    : DESTINATIONS.filter(d => d.region === filterRegion);

  // Dates par défaut (été prochain)
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const search = async () => {
    if (!departDate || !returnDate) {
      setError("Veuillez sélectionner des dates de départ et de retour.");
      setTab("results");
      return;
    }
    if (destCodes.length === 0) {
      setError("Veuillez sélectionner au moins une destination.");
      setTab("results");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setTab("results");
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 60);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originCode: origin,
          destinations: destCodes,
          departureDate: departDate,
          returnDate,
          adults,
          children,
          infants,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
      if (!data.flights || data.flights.length === 0) throw new Error("Aucun vol trouvé pour ces critères. Essayez d'autres dates ou destinations.");

      setResults(data);
    } catch (err) {
      setError(err.message || "Erreur lors de la recherche. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  const paxLabel = `${adults} adulte${adults>1?"s":""}`
    + (children>0 ? `, ${children} enfant${children>1?"s":""}` : "")
    + (infants>0  ? `, ${infants} bébé${infants>1?"s":""}` : "");

  return (
    <div style={{ minHeight:"100vh",background:"#0b0b12",color:"white",fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>

      {/* Ambient */}
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:"radial-gradient(ellipse 90% 55% at 50% -5%,rgba(200,169,110,.1) 0%,transparent 68%),radial-gradient(ellipse 45% 35% at 10% 90%,rgba(0,200,150,.04) 0%,transparent 55%)" }} />

      <div style={{ position:"relative",zIndex:1,maxWidth:"860px",margin:"0 auto",padding:"0 16px 90px" }}>

        {/* HEADER */}
        <div style={{ textAlign:"center",padding:"48px 0 30px",animation:"fadeInUp .7s ease" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(0,200,150,.07)",border:"1px solid rgba(0,200,150,.2)",borderRadius:"100px",padding:"5px 15px",marginBottom:"22px",fontSize:"10px",letterSpacing:"2px",color:"#00c896" }}>
            <span style={{ width:"6px",height:"6px",borderRadius:"50%",background:"#00c896",display:"inline-block",animation:"dot 2s ease-in-out infinite" }} />
            DONNÉES AMADEUS EN TEMPS RÉEL
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(34px,7vw,62px)",fontWeight:"800",lineHeight:1.05,letterSpacing:"-1px",marginBottom:"14px",background:"linear-gradient(135deg,#fff 20%,#c8a96e 55%,#fff 85%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
            Comparateur de vols
          </h1>
          <p style={{ color:"rgba(255,255,255,.4)",fontSize:"14px",lineHeight:"1.75",maxWidth:"400px",margin:"0 auto" }}>
            Vrais prix en temps réel via Amadeus — <strong style={{ color:"rgba(255,255,255,.7)" }}>{paxLabel}</strong>
          </p>
        </div>

        {/* TABS */}
        <div style={{ display:"flex",gap:"8px",justifyContent:"center",marginBottom:"26px" }}>
          <button className={`tab-btn ${tab==="search"?"on":"off"}`} onClick={()=>setTab("search")}>RECHERCHE</button>
          <button className={`tab-btn ${tab==="results"?"on":"off"}`} onClick={()=>setTab("results")} disabled={!results&&!loading}>
            RÉSULTATS {results?`(${results.flights?.length??0})` : ""}
          </button>
        </div>

        {/* ════ PANNEAU RECHERCHE ════ */}
        {tab === "search" && (
          <div style={{ animation:"fadeInUp .4s ease" }}>

            {/* Aéroport départ */}
            <div style={P}>
              <div style={LABEL}>✈ AÉROPORT DE DÉPART</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:"8px" }}>
                {AIRPORTS.map(a => (
                  <button key={a.code} className={`chip ${origin===a.code?"on":""}`}
                    onClick={()=>setOrigin(a.code)}>
                    {a.emoji} {a.name} <span style={{ opacity:.4,fontSize:"10px" }}>{a.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div style={P}>
              <div style={LABEL}>📅 DATES DU VOYAGE</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px" }}>
                <div>
                  <div style={{ color:"rgba(255,255,255,.35)",fontSize:"10px",letterSpacing:"1px",marginBottom:"8px" }}>DÉPART</div>
                  <input type="date" min={minDate} value={departDate}
                    onChange={e=>setDepartDate(e.target.value)} />
                </div>
                <div>
                  <div style={{ color:"rgba(255,255,255,.35)",fontSize:"10px",letterSpacing:"1px",marginBottom:"8px" }}>RETOUR</div>
                  <input type="date" min={departDate||minDate} value={returnDate}
                    onChange={e=>setReturnDate(e.target.value)} />
                </div>
              </div>
              {departDate && returnDate && (
                <div style={{ marginTop:"10px",color:"#c8a96e",fontSize:"12px" }}>
                  {Math.round((new Date(returnDate)-new Date(departDate))/(1000*60*60*24))} nuits
                </div>
              )}
            </div>

            {/* Passagers */}
            <div style={P}>
              <div style={LABEL}>👥 PASSAGERS</div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px" }}>
                {[
                  ["Adultes", "12+ ans", adults, setAdults, 1, 9],
                  ["Enfants", "2-11 ans", children, setChildren, 0, 8],
                  ["Bébés",  "-2 ans",  infants,  setInfants,  0, 4],
                ].map(([label,note,val,set,mn,mx]) => (
                  <div key={label} style={{ background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"12px",padding:"14px",textAlign:"center" }}>
                    <div style={{ color:"white",fontSize:"13px",fontWeight:"600",marginBottom:"2px" }}>{label}</div>
                    <div style={{ color:"rgba(255,255,255,.35)",fontSize:"11px",marginBottom:"12px" }}>{note}</div>
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"12px" }}>
                      <button onClick={()=>set(v=>Math.max(mn,v-1))} style={{ width:"28px",height:"28px",borderRadius:"50%",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",color:"white",cursor:"pointer",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                      <span style={{ color:"#c8a96e",fontSize:"20px",fontWeight:"700",fontFamily:"'Playfair Display',serif",minWidth:"24px" }}>{val}</span>
                      <button onClick={()=>set(v=>Math.min(mx,v+1))} style={{ width:"28px",height:"28px",borderRadius:"50%",background:"rgba(200,169,110,.15)",border:"1px solid rgba(200,169,110,.3)",color:"#c8a96e",cursor:"pointer",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destinations */}
            <div style={P}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px",flexWrap:"wrap",gap:"8px" }}>
                <div style={LABEL}>🌍 DESTINATIONS ({destCodes.length} sélectionnées)</div>
                <div style={{ display:"flex",gap:"6px",flexWrap:"wrap" }}>
                  <button className={`chip ${filterRegion==="Toutes"?"on":""}`} onClick={()=>setFilterRegion("Toutes")}>Toutes</button>
                  {REGIONS.map(r => (
                    <button key={r} className={`chip ${filterRegion===r?"on":""}`} onClick={()=>setFilterRegion(r)}>{r}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:"7px",marginBottom:"10px" }}>
                {visibleDests.map(d => (
                  <button key={d.code} className={`chip ${destCodes.includes(d.code)?"on":""}`}
                    onClick={()=>toggleDest(d.code)}>
                    {d.icon} {d.name} <span style={{ opacity:.4,fontSize:"10px" }}>{d.code}</span>
                  </button>
                ))}
              </div>
              {filterRegion !== "Toutes" && (
                <button className="chip" style={{ fontSize:"11px" }} onClick={()=>selectAllRegion(filterRegion)}>
                  {DESTINATIONS.filter(d=>d.region===filterRegion).every(d=>destCodes.includes(d.code)) ? "Désélectionner" : "Sélectionner"} toute la région
                </button>
              )}
            </div>

            {/* CTA */}
            <div style={{ textAlign:"center",paddingTop:"8px" }}>
              <div style={{ color:"rgba(255,255,255,.28)",fontSize:"12px",marginBottom:"18px" }}>
                {origin} → {destCodes.length} destination{destCodes.length>1?"s":""} · {paxLabel}
                {departDate && returnDate ? ` · ${departDate} → ${returnDate}` : " · Sélectionnez vos dates"}
              </div>
              <button className="sbtn" onClick={search} disabled={loading}>
                🔍 RECHERCHER LES VOLS
              </button>
            </div>
          </div>
        )}

        {/* ════ PANNEAU RÉSULTATS ════ */}
        {tab === "results" && (
          <div ref={resultsRef} style={{ animation:"fadeInUp .4s ease" }}>
            {loading && <Spinner />}

            {error && !loading && (
              <div style={{ textAlign:"center",padding:"60px 20px" }}>
                <div style={{ fontSize:"44px",marginBottom:"16px" }}>⚠️</div>
                <div style={{ color:"rgba(255,255,255,.6)",marginBottom:"8px",fontSize:"15px" }}>Une erreur est survenue</div>
                <div style={{ color:"rgba(255,255,255,.35)",fontSize:"12px",marginBottom:"26px",maxWidth:"500px",margin:"0 auto 26px" }}>{error}</div>
                <div style={{ display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap" }}>
                  <button className="sbtn" onClick={search}>RÉESSAYER</button>
                  <button className="chip on" onClick={()=>setTab("search")}>← Modifier</button>
                </div>
              </div>
            )}

            {!loading && !error && !results && (
              <div style={{ textAlign:"center",padding:"80px 20px" }}>
                <div style={{ fontSize:"60px",marginBottom:"20px",animation:"float 3s ease-in-out infinite" }}>✈️</div>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"24px",color:"rgba(255,255,255,.5)",marginBottom:"10px" }}>Prêt pour l'aventure ?</div>
                <div style={{ color:"rgba(255,255,255,.28)",fontSize:"14px",marginBottom:"26px" }}>Configurez votre recherche et lancez</div>
                <button className="chip on" onClick={()=>setTab("search")}>← Retour à la recherche</button>
              </div>
            )}

            {results && !loading && (
              <>
                {/* Résumé */}
                <div style={{ background:"linear-gradient(135deg,rgba(0,200,150,.07),rgba(200,169,110,.04))",border:"1px solid rgba(0,200,150,.18)",borderRadius:"18px",padding:"18px 22px",marginBottom:"18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"14px" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ color:"#00c896",fontSize:"9px",letterSpacing:"2px",marginBottom:"6px" }}>✓ RÉSULTATS EN TEMPS RÉEL</div>
                    <div style={{ color:"rgba(255,255,255,.78)",fontSize:"14px",lineHeight:"1.55" }}>{results.summary}</div>
                    <div style={{ marginTop:"8px",display:"inline-flex",alignItems:"center",gap:"6px",background:"rgba(200,169,110,.08)",border:"1px solid rgba(200,169,110,.18)",borderRadius:"8px",padding:"3px 10px" }}>
                      <span style={{ color:"#c8a96e",fontSize:"10px" }}>↑</span>
                      <span style={{ color:"rgba(255,255,255,.5)",fontSize:"11px" }}>Triés par prix croissant</span>
                    </div>
                  </div>
                  <div style={{ display:"flex",gap:"20px",flexShrink:0 }}>
                    {[[results.priceRange?.min+"€","Prix min"],[results.priceRange?.max+"€","Prix max"],[results.flights?.length??0,"Vols"]].map(([val,lbl]) => (
                      <div key={lbl} style={{ textAlign:"center" }}>
                        <div style={{ color:"#c8a96e",fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:"700" }}>{val}</div>
                        <div style={{ color:"rgba(255,255,255,.3)",fontSize:"10px" }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {results.errors?.length > 0 && (
                  <div style={{ background:"rgba(255,150,0,.05)",border:"1px solid rgba(255,150,0,.15)",borderRadius:"10px",padding:"10px 14px",marginBottom:"14px",color:"rgba(255,200,100,.7)",fontSize:"12px" }}>
                    ⚠️ {results.errors.length} destination(s) sans résultat (routes peut-être non desservies depuis {origin})
                  </div>
                )}

                {results.flights?.map((f,i) => <FlightCard key={f.id??i} f={f} rank={i+1} />)}

                <div style={{ marginTop:"28px",padding:"16px 20px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:"14px",textAlign:"center" }}>
                  <div style={{ color:"rgba(255,255,255,.26)",fontSize:"11px",lineHeight:"1.7",marginBottom:"12px" }}>
                    ✓ Prix fournis par l'API Amadeus (environnement test). Vérifiez toujours la disponibilité finale sur le site de la compagnie avant de réserver.
                  </div>
                  <div style={{ display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap" }}>
                    <button className="chip on" onClick={search}>🔄 Actualiser</button>
                    <button className="chip" onClick={()=>{setResults(null);setTab("search");}}>← Modifier</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

