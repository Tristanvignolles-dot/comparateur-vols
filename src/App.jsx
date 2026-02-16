import { useState, useRef } from "react";

// ─── AÉROPORTS DE DÉPART ──────────────────────────────────────────────────────
const AIRPORTS = [
  { code: "MRS", name: "Marseille",  emoji: "🌊" },
  { code: "LYS", name: "Lyon",       emoji: "🏔️" },
  { code: "NCE", name: "Nice",       emoji: "🌺" },
  { code: "BCN", name: "Barcelone",  emoji: "🎭" },
  { code: "CDG", name: "Paris CDG",  emoji: "🗼" },
  { code: "ORY", name: "Paris Orly", emoji: "🏛️" },
];

// ─── DESTINATIONS PAR RÉGION ET PAYS ─────────────────────────────────────────
const WORLD = [
  { region: "🇪🇺 Europe", country: "France",          cities: [{ code:"NCE",name:"Nice" },{ code:"LYS",name:"Lyon" },{ code:"MRS",name:"Marseille" }] },
  { region: "🇪🇺 Europe", country: "Espagne",         cities: [{ code:"BCN",name:"Barcelone" },{ code:"MAD",name:"Madrid" },{ code:"SVQ",name:"Séville" },{ code:"VLC",name:"Valence" },{ code:"ALC",name:"Alicante" },{ code:"PMI",name:"Palma de Majorque" },{ code:"IBZ",name:"Ibiza" },{ code:"TFS",name:"Tenerife" },{ code:"LPA",name:"Gran Canaria" }] },
  { region: "🇪🇺 Europe", country: "Portugal",        cities: [{ code:"LIS",name:"Lisbonne" },{ code:"OPO",name:"Porto" },{ code:"FAO",name:"Faro" },{ code:"FNC",name:"Funchal (Madère)" }] },
  { region: "🇪🇺 Europe", country: "Italie",          cities: [{ code:"FCO",name:"Rome" },{ code:"MXP",name:"Milan" },{ code:"VCE",name:"Venise" },{ code:"NAP",name:"Naples" },{ code:"PSA",name:"Pise" },{ code:"BLQ",name:"Bologne" },{ code:"FLR",name:"Florence" },{ code:"CTA",name:"Catane (Sicile)" },{ code:"CAG",name:"Cagliari (Sardaigne)" }] },
  { region: "🇪🇺 Europe", country: "Grèce",           cities: [{ code:"ATH",name:"Athènes" },{ code:"HER",name:"Héraklion (Crète)" },{ code:"SKG",name:"Thessalonique" },{ code:"RHO",name:"Rhodes" },{ code:"MYK",name:"Mykonos" },{ code:"JTR",name:"Santorin" },{ code:"CFU",name:"Corfou" }] },
  { region: "🇪🇺 Europe", country: "Turquie",         cities: [{ code:"IST",name:"Istanbul" },{ code:"AYT",name:"Antalya" },{ code:"ADB",name:"Izmir" },{ code:"DLM",name:"Dalaman" },{ code:"BJV",name:"Bodrum" }] },
  { region: "🇪🇺 Europe", country: "Royaume-Uni",     cities: [{ code:"LON",name:"Londres" },{ code:"EDI",name:"Édimbourg" },{ code:"MAN",name:"Manchester" }] },
  { region: "🇪🇺 Europe", country: "Irlande",         cities: [{ code:"DUB",name:"Dublin" }] },
  { region: "🇪🇺 Europe", country: "Pays-Bas",        cities: [{ code:"AMS",name:"Amsterdam" }] },
  { region: "🇪🇺 Europe", country: "Belgique",        cities: [{ code:"BRU",name:"Bruxelles" }] },
  { region: "🇪🇺 Europe", country: "Allemagne",       cities: [{ code:"MUC",name:"Munich" },{ code:"FRA",name:"Francfort" },{ code:"BER",name:"Berlin" },{ code:"HAM",name:"Hambourg" }] },
  { region: "🇪🇺 Europe", country: "Autriche",        cities: [{ code:"VIE",name:"Vienne" }] },
  { region: "🇪🇺 Europe", country: "Suisse",          cities: [{ code:"ZRH",name:"Zurich" },{ code:"GVA",name:"Genève" }] },
  { region: "🇪🇺 Europe", country: "Europe de l'Est", cities: [{ code:"PRG",name:"Prague" },{ code:"BUD",name:"Budapest" },{ code:"WAW",name:"Varsovie" },{ code:"KRK",name:"Cracovie" }] },
  { region: "🇪🇺 Europe", country: "Scandinavie",     cities: [{ code:"CPH",name:"Copenhague" },{ code:"ARN",name:"Stockholm" },{ code:"HEL",name:"Helsinki" },{ code:"OSL",name:"Oslo" }] },
  { region: "🇪🇺 Europe", country: "Croatie & Balkans", cities: [{ code:"DBV",name:"Dubrovnik" },{ code:"SPU",name:"Split" },{ code:"ZAD",name:"Zadar" }] },
  { region: "🇪🇺 Europe", country: "Chypre & Malte",  cities: [{ code:"LCA",name:"Larnaca (Chypre)" },{ code:"MLA",name:"Malte" }] },

  { region: "🌍 Afrique du Nord", country: "Maroc",   cities: [{ code:"CMN",name:"Casablanca" },{ code:"RAK",name:"Marrakech" },{ code:"AGA",name:"Agadir" },{ code:"TNG",name:"Tanger" },{ code:"FEZ",name:"Fès" }] },
  { region: "🌍 Afrique du Nord", country: "Tunisie", cities: [{ code:"TUN",name:"Tunis" },{ code:"DJE",name:"Djerba" },{ code:"MIR",name:"Monastir" }] },
  { region: "🌍 Afrique du Nord", country: "Algérie", cities: [{ code:"ALG",name:"Alger" },{ code:"ORN",name:"Oran" }] },
  { region: "🌍 Afrique du Nord", country: "Égypte",  cities: [{ code:"CAI",name:"Le Caire" },{ code:"HRG",name:"Hurghada" },{ code:"SSH",name:"Charm el-Cheikh" },{ code:"LXR",name:"Louxor" }] },

  { region: "🌍 Afrique",         country: "Afrique de l'Ouest", cities: [{ code:"DKR",name:"Dakar" },{ code:"ABJ",name:"Abidjan" },{ code:"ACC",name:"Accra" }] },
  { region: "🌍 Afrique",         country: "Afrique de l'Est",   cities: [{ code:"NBO",name:"Nairobi" },{ code:"MBA",name:"Mombasa" },{ code:"DAR",name:"Dar es Salaam" },{ code:"ADD",name:"Addis-Abeba" }] },
  { region: "🌍 Afrique",         country: "Afrique du Sud",     cities: [{ code:"JNB",name:"Johannesburg" },{ code:"CPT",name:"Le Cap" },{ code:"DUR",name:"Durban" }] },

  { region: "🕌 Moyen-Orient",    country: "Émirats Arabes Unis", cities: [{ code:"DXB",name:"Dubaï" },{ code:"AUH",name:"Abu Dhabi" },{ code:"SHJ",name:"Sharjah" }] },
  { region: "🕌 Moyen-Orient",    country: "Qatar",               cities: [{ code:"DOH",name:"Doha" }] },
  { region: "🕌 Moyen-Orient",    country: "Arabie Saoudite",     cities: [{ code:"RUH",name:"Riyad" },{ code:"JED",name:"Djeddah" }] },
  { region: "🕌 Moyen-Orient",    country: "Jordanie & Liban",    cities: [{ code:"AMM",name:"Amman" },{ code:"BEY",name:"Beyrouth" }] },

  { region: "🌺 Océan Indien",    country: "Île Maurice",  cities: [{ code:"MRU",name:"Maurice" }] },
  { region: "🌺 Océan Indien",    country: "La Réunion",   cities: [{ code:"RUN",name:"La Réunion" }] },
  { region: "🌺 Océan Indien",    country: "Seychelles",   cities: [{ code:"SEZ",name:"Mahé" }] },
  { region: "🌺 Océan Indien",    country: "Maldives",     cities: [{ code:"MLE",name:"Malé" }] },
  { region: "🌺 Océan Indien",    country: "Madagascar",   cities: [{ code:"TNR",name:"Antananarivo" }] },

  { region: "🏯 Asie",            country: "Thaïlande",    cities: [{ code:"BKK",name:"Bangkok" },{ code:"HKT",name:"Phuket" },{ code:"CNX",name:"Chiang Mai" },{ code:"USM",name:"Koh Samui" }] },
  { region: "🏯 Asie",            country: "Singapour",    cities: [{ code:"SIN",name:"Singapour" }] },
  { region: "🏯 Asie",            country: "Malaisie",     cities: [{ code:"KUL",name:"Kuala Lumpur" },{ code:"PEN",name:"Penang" }] },
  { region: "🏯 Asie",            country: "Indonésie",    cities: [{ code:"CGK",name:"Jakarta" },{ code:"DPS",name:"Bali" }] },
  { region: "🏯 Asie",            country: "Vietnam",      cities: [{ code:"HAN",name:"Hanoï" },{ code:"SGN",name:"Hô Chi Minh" },{ code:"DAD",name:"Da Nang" }] },
  { region: "🏯 Asie",            country: "Japon",        cities: [{ code:"NRT",name:"Tokyo" },{ code:"KIX",name:"Osaka" },{ code:"FUK",name:"Fukuoka" }] },
  { region: "🏯 Asie",            country: "Corée du Sud", cities: [{ code:"ICN",name:"Séoul" }] },
  { region: "🏯 Asie",            country: "Chine",        cities: [{ code:"PEK",name:"Pékin" },{ code:"PVG",name:"Shanghai" }] },
  { region: "🏯 Asie",            country: "Hong Kong",    cities: [{ code:"HKG",name:"Hong Kong" }] },
  { region: "🏯 Asie",            country: "Inde",         cities: [{ code:"DEL",name:"Delhi" },{ code:"BOM",name:"Mumbai" },{ code:"MAA",name:"Chennai" },{ code:"GOI",name:"Goa" }] },
  { region: "🏯 Asie",            country: "Sri Lanka",    cities: [{ code:"CMB",name:"Colombo" }] },
  { region: "🏯 Asie",            country: "Philippines",  cities: [{ code:"MNL",name:"Manille" },{ code:"CEB",name:"Cebu" }] },

  { region: "🌎 Amériques",       country: "États-Unis",   cities: [{ code:"JFK",name:"New York" },{ code:"LAX",name:"Los Angeles" },{ code:"MIA",name:"Miami" },{ code:"ORD",name:"Chicago" },{ code:"SFO",name:"San Francisco" },{ code:"BOS",name:"Boston" },{ code:"LAS",name:"Las Vegas" }] },
  { region: "🌎 Amériques",       country: "Canada",       cities: [{ code:"YYZ",name:"Toronto" },{ code:"YVR",name:"Vancouver" },{ code:"YUL",name:"Montréal" }] },
  { region: "🌎 Amériques",       country: "Mexique & Caraïbes", cities: [{ code:"CUN",name:"Cancún" },{ code:"PUJ",name:"Punta Cana" },{ code:"MBJ",name:"Jamaïque" },{ code:"HAV",name:"La Havane" },{ code:"MEX",name:"Mexico" }] },
  { region: "🌎 Amériques",       country: "Amérique du Sud", cities: [{ code:"GRU",name:"São Paulo" },{ code:"GIG",name:"Rio de Janeiro" },{ code:"EZE",name:"Buenos Aires" },{ code:"SCL",name:"Santiago" },{ code:"BOG",name:"Bogotá" },{ code:"LIM",name:"Lima" }] },

  { region: "🌏 Pacifique",       country: "Australie",    cities: [{ code:"SYD",name:"Sydney" },{ code:"MEL",name:"Melbourne" },{ code:"BNE",name:"Brisbane" }] },
  { region: "🌏 Pacifique",       country: "Nouvelle-Zélande", cities: [{ code:"AKL",name:"Auckland" }] },
  { region: "🌏 Pacifique",       country: "Polynésie",    cities: [{ code:"PPT",name:"Tahiti" },{ code:"NAN",name:"Fidji" }] },
];

const ALL_REGIONS = [...new Set(WORLD.map(g => g.region))];
const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const TRIP_DAYS_OPTIONS = [3,4,5,6,7,8,9,10,11,12,14,21];

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#0b0b12;}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
@keyframes dot{0%,80%,100%{opacity:.2;transform:scale(.8);}40%{opacity:1;transform:scale(1);}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(200,169,110,.2);}50%{box-shadow:0 0 40px rgba(200,169,110,.45);}}

.chip{padding:5px 12px;border-radius:100px;cursor:pointer;transition:all .18s ease;
  font-size:12px;font-weight:500;border:1px solid rgba(200,169,110,.18);
  background:rgba(200,169,110,.04);color:rgba(255,255,255,.55);
  display:inline-flex;align-items:center;gap:4px;white-space:nowrap;font-family:'DM Sans',sans-serif;}
.chip:hover{border-color:rgba(200,169,110,.4);color:rgba(255,255,255,.9);background:rgba(200,169,110,.09);}
.chip.on{background:rgba(200,169,110,.15);border-color:#c8a96e;color:#c8a96e;}
.chip.region{font-size:13px;padding:7px 15px;}
.chip.city{font-size:11px;padding:4px 10px;}

.sbtn{background:linear-gradient(135deg,#c8a96e,#9a7040);border:none;color:white;
  padding:15px 46px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:2px;
  cursor:pointer;transition:all .3s ease;font-family:'DM Sans',sans-serif;animation:glow 3s ease-in-out infinite;}
.sbtn:hover{transform:translateY(-2px) scale(1.02);filter:brightness(1.1);}
.sbtn:disabled{opacity:.4;cursor:not-allowed;transform:none;animation:none;}

.tab-btn{padding:8px 20px;border-radius:100px;cursor:pointer;font-size:12px;font-weight:600;
  letter-spacing:1px;transition:all .2s;border:none;font-family:'DM Sans',sans-serif;}
.tab-btn.on{background:rgba(200,169,110,.12);color:#c8a96e;border:1px solid rgba(200,169,110,.28);}
.tab-btn.off{background:transparent;color:rgba(255,255,255,.28);border:1px solid transparent;}

.mode-btn{flex:1;padding:12px;border-radius:12px;cursor:pointer;transition:all .2s;
  font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;text-align:center;border:1px solid rgba(255,255,255,.08);}
.mode-btn.on{background:rgba(200,169,110,.12);border-color:#c8a96e;color:#c8a96e;}
.mode-btn.off{background:rgba(255,255,255,.03);color:rgba(255,255,255,.45);}

input[type=date]{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
  color:white;padding:10px 14px;border-radius:10px;font-family:'DM Sans',sans-serif;
  font-size:13px;outline:none;width:100%;color-scheme:dark;}
select{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:white;
  padding:9px 12px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;outline:none;cursor:pointer;}
select option{background:#1a1a2e;}

.badge-real{display:inline-flex;align-items:center;gap:4px;background:rgba(0,200,150,.1);
  border:1px solid rgba(0,200,150,.25);color:#00c896;border-radius:6px;padding:2px 7px;font-size:10px;font-weight:600;}
.country-section{margin-bottom:14px;}
.country-label{color:rgba(255,255,255,.45);font-size:10px;letter-spacing:1.5px;font-weight:600;margin-bottom:6px;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:rgba(200,169,110,.2);border-radius:2px;}
`;

const P = { background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.07)", borderRadius:"18px", padding:"20px", marginBottom:"12px" };
const LBL = { color:"#c8a96e", fontSize:"10px", letterSpacing:"2.5px", fontWeight:"600", marginBottom:"12px" };

// ─── SPINNER ─────────────────────────────────────────────────────────────────
function Spinner({ isMonth }) {
  return (
    <div style={{ textAlign:"center", padding:"80px 20px" }}>
      <div style={{ position:"relative", width:"64px", height:"64px", margin:"0 auto 22px" }}>
        <div style={{ position:"absolute", inset:0, border:"2px solid rgba(200,169,110,.1)", borderTop:"2px solid #c8a96e", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
        <div style={{ position:"absolute", inset:"14px", border:"2px solid rgba(200,169,110,.06)", borderBottom:"2px solid rgba(200,169,110,.4)", borderRadius:"50%", animation:"spin 1.6s linear infinite reverse" }} />
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>✈</div>
      </div>
      <div style={{ fontFamily:"'Playfair Display',serif", color:"#c8a96e", fontSize:"17px", marginBottom:"8px" }}>
        {isMonth ? "Analyse du mois entier…" : "Recherche en cours…"}
      </div>
      <div style={{ color:"rgba(255,255,255,.35)", fontSize:"12px", lineHeight:"1.7" }}>
        {isMonth ? "Comparaison de plusieurs dates pour trouver le meilleur prix" : "Interrogation de l'API Amadeus en temps réel"}
      </div>
      <div style={{ display:"flex", gap:"6px", justifyContent:"center", marginTop:"16px" }}>
        {[0,1,2].map(i => <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#c8a96e", animation:`dot 1.4s ease-in-out ${i*.16}s infinite` }} />)}
      </div>
    </div>
  );
}

// ─── FLIGHT CARD ─────────────────────────────────────────────────────────────
function FlightCard({ f, rank }) {
  const [open, setOpen] = useState(false);
  const BADGE = { "🔥 MEILLEUR PRIX":"linear-gradient(135deg,#ff6b35,#f7931e)", "⚡ BON PLAN":"linear-gradient(135deg,#2193b0,#6dd5ed)" };
  return (
    <div onClick={() => setOpen(v=>!v)} style={{
      background:"linear-gradient(135deg,rgba(255,255,255,.04),rgba(200,169,110,.02))",
      border:`1px solid ${open?"rgba(200,169,110,.42)":"rgba(200,169,110,.14)"}`,
      borderRadius:"16px", padding:"18px", marginBottom:"9px", cursor:"pointer",
      transition:"all .22s ease", animation:`fadeInUp .4s ease ${rank*.05}s both`, position:"relative"
    }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(200,169,110,.4)";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(200,169,110,.07)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=open?"rgba(200,169,110,.42)":"rgba(200,169,110,.14)";}}
    >
      <div style={{ position:"absolute", top:"13px", left:"13px", width:"25px", height:"25px", borderRadius:"50%", background:rank===1?"linear-gradient(135deg,#c8a96e,#9a7040)":"rgba(255,255,255,.06)", border:rank===1?"none":"1px solid rgba(255,255,255,.09)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:"700", color:rank===1?"white":"rgba(255,255,255,.3)" }}>#{rank}</div>
      {f.badge && <div style={{ position:"absolute", top:"13px", right:"13px", background:BADGE[f.badge]||BADGE["🔥 MEILLEUR PRIX"], color:"white", padding:"3px 10px", borderRadius:"20px", fontSize:"10px", fontWeight:"700" }}>{f.badge}</div>}

      <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", justifyContent:"space-between", paddingLeft:"36px" }}>
        <div style={{ flex:1, minWidth:"180px" }}>
          <div style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom:"9px" }}>
            <div style={{ width:"42px", height:"42px", borderRadius:"11px", background:"rgba(200,169,110,.08)", border:"1px solid rgba(200,169,110,.14)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", flexShrink:0 }}>{f.destinationIcon}</div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", color:"white", fontSize:"17px", fontWeight:"700" }}>{f.destination}</div>
              <div style={{ display:"flex", gap:"5px", alignItems:"center", marginTop:"1px" }}>
                <span style={{ color:"#c8a96e", fontSize:"11px" }}>{f.airline}</span>
                <span className="badge-real">✓ Amadeus</span>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
            {[["⏱",f.duration],["🔄",f.stops],["🌙",`${f.nights} nuits`],["📅",f.dates]].map(([ic,val])=>(
              <div key={ic} style={{ display:"flex", alignItems:"center", gap:"3px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.05)", borderRadius:"6px", padding:"3px 7px" }}>
                <span style={{ fontSize:"10px", opacity:.6 }}>{ic}</span>
                <span style={{ color:"rgba(255,255,255,.6)", fontSize:"11px" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ color:"rgba(255,255,255,.28)", fontSize:"9px" }}>à partir de</div>
          <div style={{ color:"#c8a96e", fontFamily:"'Playfair Display',serif", fontSize:"clamp(22px,4vw,30px)", fontWeight:"800", lineHeight:1, marginTop:"1px" }}>{f.price}€</div>
          <div style={{ color:"rgba(255,255,255,.35)", fontSize:"9px", marginTop:"2px" }}>/ pers · A/R</div>
          <div style={{ color:"rgba(255,255,255,.7)", fontSize:"12px", marginTop:"4px" }}>Total: <strong style={{ color:"white" }}>{f.totalPrice}€</strong></div>
          <div style={{ marginTop:"6px", fontSize:"10px", color:open?"#c8a96e":"rgba(255,255,255,.25)", transition:"color .2s" }}>{open?"▲ Masquer":"▼ Détails"}</div>
        </div>
      </div>

      {open && (
        <div style={{ marginTop:"16px", paddingTop:"16px", borderTop:"1px solid rgba(200,169,110,.1)", animation:"fadeIn .22s ease" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:"7px", marginBottom:"12px" }}>
            {(f.details||[]).map((d,k) => (
              <div key={k} style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)", borderRadius:"9px", padding:"9px" }}>
                <div style={{ color:"rgba(255,255,255,.28)", fontSize:"9px", letterSpacing:"1px", marginBottom:"3px" }}>{(d.label||"").toUpperCase()}</div>
                <div style={{ color:"rgba(255,255,255,.8)", fontSize:"11px" }}>{d.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:"7px", flexWrap:"wrap" }}>
            {[["Google Flights →",`https://www.google.com/flights`,true],["Kayak","https://www.kayak.fr",false],["Skyscanner","https://www.skyscanner.fr",false],["Momondo","https://www.momondo.fr",false]].map(([lbl,url,p]) => (
              <button key={lbl} onClick={e=>{e.stopPropagation();window.open(url,"_blank");}} style={{ flex:p?"2":"1", minWidth:"100px", background:p?"linear-gradient(135deg,#c8a96e,#a07840)":"rgba(255,255,255,.05)", border:p?"none":"1px solid rgba(255,255,255,.09)", color:"white", padding:"9px 12px", borderRadius:"9px", fontSize:"11px", fontWeight:p?"700":"400", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>{lbl}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [origin,       setOrigin]       = useState("MRS");
  const [selectedCodes,setSelectedCodes]= useState(["LON","AMS","DXB","BKK"]);
  const [activeRegion, setActiveRegion] = useState(ALL_REGIONS[0]);
  const [searchMode,   setSearchMode]   = useState("dates"); // "dates" | "month"
  const [departDate,   setDepartDate]   = useState("");
  const [returnDate,   setReturnDate]   = useState("");
  const [tripDays,     setTripDays]     = useState(7);
  const [searchMonth,  setSearchMonth]  = useState(new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2);
  const [searchYear,   setSearchYear]   = useState(new Date().getMonth() + 2 > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear());
  const [adults,       setAdults]       = useState(2);
  const [children,     setChildren]     = useState(1);
  const [infants,      setInfants]      = useState(0);
  const [tab,          setTab]          = useState("search");
  const [loading,      setLoading]      = useState(false);
  const [results,      setResults]      = useState(null);
  const [error,        setError]        = useState(null);
  const resultsRef = useRef(null);

  const toggleCity = code => setSelectedCodes(p => p.includes(code) ? p.filter(c=>c!==code) : [...p,code]);
  const toggleCountry = cities => {
    const codes = cities.map(c=>c.code);
    const allOn = codes.every(c=>selectedCodes.includes(c));
    setSelectedCodes(p => allOn ? p.filter(c=>!codes.includes(c)) : [...new Set([...p,...codes])]);
  };
  const toggleRegion = region => {
    const codes = WORLD.filter(g=>g.region===region).flatMap(g=>g.cities.map(c=>c.code));
    const allOn = codes.every(c=>selectedCodes.includes(c));
    setSelectedCodes(p => allOn ? p.filter(c=>!codes.includes(c)) : [...new Set([...p,...codes])]);
  };

  const regionGroups = WORLD.filter(g => g.region === activeRegion);
  const minDate = new Date().toISOString().split("T")[0];
  const nights = departDate && returnDate ? Math.round((new Date(returnDate)-new Date(departDate))/86400000) : null;

  const paxLabel = `${adults} adulte${adults>1?"s":""}${children>0?`, ${children} enfant${children>1?"s":""}` : ""}${infants>0?`, ${infants} bébé${infants>1?"s":""}` : ""}`;

  const search = async () => {
    if (searchMode === "dates" && (!departDate || !returnDate)) { setError("Veuillez sélectionner vos dates."); setTab("results"); return; }
    if (selectedCodes.length === 0) { setError("Veuillez sélectionner au moins une destination."); setTab("results"); return; }
    setLoading(true); setError(null); setResults(null); setTab("results");
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior:"smooth" }), 60);
    try {
      const res = await fetch("/api/search", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ originCode:origin, destinations:selectedCodes, departureDate:departDate, returnDate, adults, children, infants, searchMode, year:searchYear, month:searchMonth, tripDays }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
      if (!data.flights?.length) throw new Error("Aucun vol trouvé. Essayez d'autres destinations ou dates.");
      setResults(data);
    } catch(err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0b0b12", color:"white", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", background:"radial-gradient(ellipse 90% 55% at 50% -5%,rgba(200,169,110,.09) 0%,transparent 68%)" }} />

      <div style={{ position:"relative", zIndex:1, maxWidth:"880px", margin:"0 auto", padding:"0 14px 80px" }}>

        {/* HEADER */}
        <div style={{ textAlign:"center", padding:"44px 0 26px", animation:"fadeInUp .7s ease" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"rgba(0,200,150,.07)", border:"1px solid rgba(0,200,150,.18)", borderRadius:"100px", padding:"4px 14px", marginBottom:"18px", fontSize:"10px", letterSpacing:"2px", color:"#00c896" }}>
            <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#00c896", display:"inline-block", animation:"dot 2s ease-in-out infinite" }} />
            AMADEUS · TEMPS RÉEL
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,7vw,58px)", fontWeight:"800", lineHeight:1.05, letterSpacing:"-1px", marginBottom:"12px", background:"linear-gradient(135deg,#fff 20%,#c8a96e 55%,#fff 85%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Comparateur de vols
          </h1>
          <p style={{ color:"rgba(255,255,255,.38)", fontSize:"13px", maxWidth:"380px", margin:"0 auto" }}>
            Vrais prix en temps réel — <strong style={{ color:"rgba(255,255,255,.65)" }}>{paxLabel}</strong>
          </p>
        </div>

        {/* TABS */}
        <div style={{ display:"flex", gap:"7px", justifyContent:"center", marginBottom:"22px" }}>
          <button className={`tab-btn ${tab==="search"?"on":"off"}`} onClick={()=>setTab("search")}>RECHERCHE</button>
          <button className={`tab-btn ${tab==="results"?"on":"off"}`} onClick={()=>setTab("results")} disabled={!results&&!loading}>
            RÉSULTATS {results?`(${results.flights?.length??0})`:""}
          </button>
        </div>

        {/* ══════ RECHERCHE ══════ */}
        {tab === "search" && (
          <div style={{ animation:"fadeInUp .4s ease" }}>

            {/* Départ */}
            <div style={P}>
              <div style={LBL}>✈ AÉROPORT DE DÉPART</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"7px" }}>
                {AIRPORTS.map(a => (
                  <button key={a.code} className={`chip ${origin===a.code?"on":""}`} onClick={()=>setOrigin(a.code)}>
                    {a.emoji} {a.name} <span style={{ opacity:.38, fontSize:"10px" }}>{a.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode de recherche */}
            <div style={P}>
              <div style={LBL}>🔍 MODE DE RECHERCHE</div>
              <div style={{ display:"flex", gap:"10px", marginBottom: searchMode==="dates" ? "16px" : "16px" }}>
                <button className={`mode-btn ${searchMode==="dates"?"on":"off"}`} onClick={()=>setSearchMode("dates")}>
                  📅 Dates précises
                  <div style={{ fontSize:"11px", opacity:.6, marginTop:"3px" }}>Je connais mes dates</div>
                </button>
                <button className={`mode-btn ${searchMode==="month"?"on":"off"}`} onClick={()=>setSearchMode("month")}>
                  📆 Meilleur prix du mois
                  <div style={{ fontSize:"11px", opacity:.6, marginTop:"3px" }}>Je suis flexible</div>
                </button>
              </div>

              {searchMode === "dates" && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                  <div>
                    <div style={{ color:"rgba(255,255,255,.3)", fontSize:"10px", letterSpacing:"1px", marginBottom:"7px" }}>DÉPART</div>
                    <input type="date" min={minDate} value={departDate} onChange={e=>setDepartDate(e.target.value)} />
                  </div>
                  <div>
                    <div style={{ color:"rgba(255,255,255,.3)", fontSize:"10px", letterSpacing:"1px", marginBottom:"7px" }}>RETOUR</div>
                    <input type="date" min={departDate||minDate} value={returnDate} onChange={e=>setReturnDate(e.target.value)} />
                  </div>
                  {nights && <div style={{ gridColumn:"1/-1", color:"#c8a96e", fontSize:"12px" }}>🌙 {nights} nuit{nights>1?"s":""} sur place</div>}
                </div>
              )}

              {searchMode === "month" && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px" }}>
                  <div>
                    <div style={{ color:"rgba(255,255,255,.3)", fontSize:"10px", letterSpacing:"1px", marginBottom:"7px" }}>MOIS</div>
                    <select value={searchMonth} onChange={e=>setSearchMonth(+e.target.value)}>
                      {MONTHS.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ color:"rgba(255,255,255,.3)", fontSize:"10px", letterSpacing:"1px", marginBottom:"7px" }}>ANNÉE</div>
                    <select value={searchYear} onChange={e=>setSearchYear(+e.target.value)}>
                      {[2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ color:"rgba(255,255,255,.3)", fontSize:"10px", letterSpacing:"1px", marginBottom:"7px" }}>DURÉE</div>
                    <select value={tripDays} onChange={e=>setTripDays(+e.target.value)}>
                      {TRIP_DAYS_OPTIONS.map(d => <option key={d} value={d}>{d} nuits</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn:"1/-1", background:"rgba(200,169,110,.06)", border:"1px solid rgba(200,169,110,.15)", borderRadius:"9px", padding:"10px 14px", color:"rgba(255,255,255,.55)", fontSize:"12px" }}>
                    💡 L'IA teste plusieurs dates dans le mois pour trouver le prix le plus bas pour chaque destination.
                  </div>
                </div>
              )}
            </div>

            {/* Passagers */}
            <div style={P}>
              <div style={LBL}>👥 PASSAGERS</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
                {[["Adultes","12+ ans",adults,setAdults,1,9],["Enfants","2-11 ans",children,setChildren,0,8],["Bébés","-2 ans",infants,setInfants,0,4]].map(([lbl,note,val,set,mn,mx]) => (
                  <div key={lbl} style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:"11px", padding:"12px", textAlign:"center" }}>
                    <div style={{ color:"white", fontSize:"12px", fontWeight:"600", marginBottom:"1px" }}>{lbl}</div>
                    <div style={{ color:"rgba(255,255,255,.3)", fontSize:"10px", marginBottom:"10px" }}>{note}</div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
                      <button onClick={()=>set(v=>Math.max(mn,v-1))} style={{ width:"26px",height:"26px",borderRadius:"50%",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",color:"white",cursor:"pointer",fontSize:"15px",display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                      <span style={{ color:"#c8a96e",fontSize:"18px",fontWeight:"700",fontFamily:"'Playfair Display',serif",minWidth:"20px" }}>{val}</span>
                      <button onClick={()=>set(v=>Math.min(mx,v+1))} style={{ width:"26px",height:"26px",borderRadius:"50%",background:"rgba(200,169,110,.14)",border:"1px solid rgba(200,169,110,.28)",color:"#c8a96e",cursor:"pointer",fontSize:"15px",display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destinations */}
            <div style={P}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px", flexWrap:"wrap", gap:"8px" }}>
                <div style={LBL}>🌍 DESTINATIONS ({selectedCodes.length} ville{selectedCodes.length>1?"s":""} sélectionnée{selectedCodes.length>1?"s":""})</div>
                {selectedCodes.length > 0 && (
                  <button className="chip" style={{ fontSize:"11px", color:"rgba(255,100,100,.7)", borderColor:"rgba(255,100,100,.2)" }} onClick={()=>setSelectedCodes([])}>
                    ✕ Tout effacer
                  </button>
                )}
              </div>

              {/* Régions */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"14px" }}>
                {ALL_REGIONS.map(r => {
                  const codes = WORLD.filter(g=>g.region===r).flatMap(g=>g.cities.map(c=>c.code));
                  const count = codes.filter(c=>selectedCodes.includes(c)).length;
                  return (
                    <button key={r} className={`chip region ${activeRegion===r?"on":""}`} onClick={()=>setActiveRegion(r)}>
                      {r} {count>0 && <span style={{ background:"rgba(200,169,110,.3)", borderRadius:"100px", padding:"0 5px", fontSize:"10px" }}>{count}</span>}
                    </button>
                  );
                })}
              </div>

              {/* Pays et villes */}
              <div style={{ maxHeight:"320px", overflowY:"auto", paddingRight:"4px" }}>
                {regionGroups.map(g => {
                  const allOn = g.cities.every(c=>selectedCodes.includes(c.code));
                  return (
                    <div key={g.country} className="country-section">
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
                        <div className="country-label">{g.country.toUpperCase()}</div>
                        <button className="chip" style={{ fontSize:"10px", padding:"2px 8px" }} onClick={()=>toggleCountry(g.cities)}>
                          {allOn ? "Désélectionner tout" : "Sélectionner tout"}
                        </button>
                      </div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"5px", marginBottom:"10px" }}>
                        {g.cities.map(c => (
                          <button key={c.code} className={`chip city ${selectedCodes.includes(c.code)?"on":""}`} onClick={()=>toggleCity(c.code)}>
                            {c.name} <span style={{ opacity:.38, fontSize:"9px" }}>{c.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sélectionner toute la région */}
              <div style={{ marginTop:"10px", paddingTop:"10px", borderTop:"1px solid rgba(255,255,255,.05)" }}>
                <button className="chip" style={{ fontSize:"11px" }} onClick={()=>toggleRegion(activeRegion)}>
                  {WORLD.filter(g=>g.region===activeRegion).flatMap(g=>g.cities.map(c=>c.code)).every(c=>selectedCodes.includes(c))
                    ? `✕ Désélectionner toute la région ${activeRegion}`
                    : `+ Sélectionner toute la région ${activeRegion}`}
                </button>
              </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign:"center", paddingTop:"6px" }}>
              <div style={{ color:"rgba(255,255,255,.25)", fontSize:"11px", marginBottom:"16px" }}>
                {origin} → {selectedCodes.length} ville{selectedCodes.length>1?"s":""} · {paxLabel}
                {searchMode==="dates" && departDate && returnDate ? ` · ${departDate} → ${returnDate}` : ""}
                {searchMode==="month" ? ` · ${MONTHS[searchMonth-1]} ${searchYear} · ${tripDays} nuits` : ""}
              </div>
              <button className="sbtn" onClick={search} disabled={loading}>
                {loading ? "Recherche…" : "🔍 RECHERCHER LES VOLS"}
              </button>
            </div>
          </div>
        )}

        {/* ══════ RÉSULTATS ══════ */}
        {tab === "results" && (
          <div ref={resultsRef} style={{ animation:"fadeInUp .4s ease" }}>
            {loading && <Spinner isMonth={searchMode==="month"} />}

            {error && !loading && (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <div style={{ fontSize:"40px", marginBottom:"14px" }}>⚠️</div>
                <div style={{ color:"rgba(255,255,255,.55)", marginBottom:"6px" }}>Une erreur est survenue</div>
                <div style={{ color:"rgba(255,255,255,.3)", fontSize:"12px", marginBottom:"24px", maxWidth:"480px", margin:"0 auto 24px" }}>{error}</div>
                <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap" }}>
                  <button className="sbtn" onClick={search}>Réessayer</button>
                  <button className="chip on" onClick={()=>setTab("search")}>← Modifier</button>
                </div>
              </div>
            )}

            {!loading && !error && !results && (
              <div style={{ textAlign:"center", padding:"80px 20px" }}>
                <div style={{ fontSize:"56px", marginBottom:"18px", animation:"float 3s ease-in-out infinite" }}>✈️</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"22px", color:"rgba(255,255,255,.45)", marginBottom:"8px" }}>Prêt pour l'aventure ?</div>
                <div style={{ color:"rgba(255,255,255,.25)", fontSize:"13px", marginBottom:"24px" }}>Configurez votre recherche et lancez</div>
                <button className="chip on" onClick={()=>setTab("search")}>← Retour à la recherche</button>
              </div>
            )}

            {results && !loading && (
              <>
                <div style={{ background:"linear-gradient(135deg,rgba(0,200,150,.06),rgba(200,169,110,.03))", border:"1px solid rgba(0,200,150,.16)", borderRadius:"16px", padding:"16px 20px", marginBottom:"14px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ color:"#00c896", fontSize:"9px", letterSpacing:"2px", marginBottom:"5px" }}>✓ RÉSULTATS EN TEMPS RÉEL</div>
                    <div style={{ color:"rgba(255,255,255,.75)", fontSize:"13px", lineHeight:"1.5" }}>{results.summary}</div>
                    <div style={{ marginTop:"7px", display:"inline-flex", alignItems:"center", gap:"5px", background:"rgba(200,169,110,.07)", border:"1px solid rgba(200,169,110,.16)", borderRadius:"7px", padding:"2px 9px" }}>
                      <span style={{ color:"#c8a96e", fontSize:"10px" }}>↑</span>
                      <span style={{ color:"rgba(255,255,255,.45)", fontSize:"10px" }}>Triés par prix croissant</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:"18px", flexShrink:0 }}>
                    {[[results.priceRange?.min+"€","Min/pers"],[results.priceRange?.max+"€","Max/pers"],[results.flights?.length??0,"Vols"]].map(([v,l]) => (
                      <div key={l} style={{ textAlign:"center" }}>
                        <div style={{ color:"#c8a96e", fontFamily:"'Playfair Display',serif", fontSize:"20px", fontWeight:"700" }}>{v}</div>
                        <div style={{ color:"rgba(255,255,255,.28)", fontSize:"9px" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {results.errors?.length > 0 && (
                  <div style={{ background:"rgba(255,150,0,.04)", border:"1px solid rgba(255,150,0,.12)", borderRadius:"9px", padding:"9px 13px", marginBottom:"12px", color:"rgba(255,200,100,.6)", fontSize:"11px" }}>
                    ⚠️ {results.errors.length} destination(s) sans résultat (route non disponible depuis {origin} ou hors quota)
                  </div>
                )}

                {results.flights?.map((f,i) => <FlightCard key={f.id??i} f={f} rank={i+1} />)}

                <div style={{ marginTop:"24px", padding:"14px 18px", background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.04)", borderRadius:"12px", textAlign:"center" }}>
                  <div style={{ color:"rgba(255,255,255,.22)", fontSize:"11px", lineHeight:"1.7", marginBottom:"10px" }}>
                    ✓ Prix fournis par l'API Amadeus (environnement test). Vérifiez la disponibilité finale avant de réserver.
                  </div>
                  <div style={{ display:"flex", gap:"8px", justifyContent:"center", flexWrap:"wrap" }}>
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
