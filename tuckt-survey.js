import { useState, useEffect, useRef } from "react";

// ── Brand tokens ──────────────────────────────────────────────
const T = {
  navy:   "#1B2D5B",
  navyD:  "#111E3C",
  navyL:  "#E8EDF7",
  teal:   "#2EC4A5",
  tealD:  "#1A9E85",
  tealL:  "#D6F5EF",
  gold:   "#F5A623",
  goldL:  "#FEF3DC",
  white:  "#FFFFFF",
  text:   "#1A1A2E",
  muted:  "#5C5C7A",
  border: "#C8CDD8",
  lgrey:  "#F2F4F8",
  red:    "#E53E3E",
};

// ── Survey data ───────────────────────────────────────────────
const SECTIONS = [
  {
    id: "home",
    title: "About Your Home",
    color: T.navy,
    icon: "🏠",
  },
  {
    id: "pain",
    title: "Space & Storage Pain",
    color: T.tealD,
    icon: "📦",
  },
  {
    id: "wtp",
    title: "Willingness to Pay",
    color: "#6B46C1",
    icon: "💳",
  },
  {
    id: "service",
    title: "Service Expectations",
    color: T.gold,
    icon: "🚚",
  },
  {
    id: "resale",
    title: "Resale Interest",
    color: T.tealD,
    icon: "💰",
  },
  {
    id: "you",
    title: "About You",
    color: T.navy,
    icon: "👤",
  },
];

const QUESTIONS = [
  // ── Section 1: Home ──────────────────────────────────────────
  {
    id: "q1", section: "home",
    type: "single",
    label: "What type of home do you live in?",
    sub: "This helps us understand your storage context.",
    options: [
      "Owned apartment (₹2–4 Crore range)",
      "Owned apartment (₹4–8 Crore range)",
      "Owned apartment (₹8 Crore+)",
      "Rented apartment (₹40,000–80,000/month)",
      "Rented apartment (₹80,000+/month)",
      "Independent house / villa",
    ],
  },
  {
    id: "q2", section: "home",
    type: "single",
    label: "How large is your home?",
    options: [
      "Under 1,000 sq ft",
      "1,000 – 1,500 sq ft",
      "1,500 – 2,200 sq ft",
      "2,200 – 3,500 sq ft",
      "3,500 sq ft +",
    ],
  },
  {
    id: "q3", section: "home",
    type: "single",
    label: "Which city do you live in?",
    options: [
      "Gurgaon (Gurugram)",
      "Bengaluru",
      "Mumbai",
      "Delhi / NCR (not Gurgaon)",
      "Hyderabad",
      "Pune",
      "Chennai",
      "Other",
    ],
  },
  {
    id: "q4", section: "home",
    type: "single",
    label: "How many people live in your household?",
    options: ["1 person", "2 people", "3–4 people", "5+ people"],
  },

  // ── Section 2: Pain ──────────────────────────────────────────
  {
    id: "q5", section: "pain",
    type: "scale",
    label: "How much of a problem is storage space in your home?",
    sub: "1 = No problem at all, 10 = Severe, daily frustration",
    min: 1, max: 10,
    minLabel: "No problem",
    maxLabel: "Severe problem",
  },
  {
    id: "q6", section: "pain",
    type: "multi",
    label: "Which items take up the most space in your home that you rarely use?",
    sub: "Select all that apply.",
    options: [
      "Seasonal clothing (winter / monsoon)",
      "Festival décor (Diwali, Christmas, Holi)",
      "Baby / children's gear (pram, cot, toys)",
      "Sports / hobby equipment",
      "Inherited furniture or heirlooms",
      "Old electronics / appliances",
      "Wedding items (lehenga, décor, gifts)",
      "Luggage / suitcases",
      "Books and media",
      "Art / collectibles",
    ],
  },
  {
    id: "q7", section: "pain",
    type: "single",
    label: "How often do you buy something you already own because you forgot about it?",
    options: [
      "Never",
      "Once or twice a year",
      "3–5 times a year",
      "More than 5 times a year",
      "Regularly — it's a real problem",
    ],
  },
  {
    id: "q8", section: "pain",
    type: "single",
    label: "Have you ever rented external storage space?",
    options: [
      "Yes — currently using self-storage",
      "Yes — tried it but stopped (too inconvenient)",
      "No — couldn't find a trustworthy option",
      "No — didn't know it was available",
      "No — not interested",
    ],
  },

  // ── Section 3: WTP ───────────────────────────────────────────
  {
    id: "q9", section: "wtp",
    type: "concept",
    label: "We'd like your reaction to this service concept.",
    concept: {
      name: "Tuckt",
      tagline: "Your home. Lighter.",
      bullets: [
        "We pick up belongings from your home in a scheduled window",
        "Every item is photographed and catalogued via AI — visible on your app",
        "Items stored in a secure, insured, CCTV-monitored warehouse",
        "Request any item back via app — delivered to your door next day",
        "AI notifies you before you need seasonal items (quilts before winter, rain gear before monsoon)",
        "List any stored item for resale directly from the app",
      ],
    },
    question: "How interested are you in a service like this?",
    options: [
      "Extremely interested — I need this now",
      "Very interested — I'd sign up within a month",
      "Interested — I'd consider it",
      "Somewhat interested — depends on price",
      "Not interested",
    ],
  },
  {
    id: "q10", section: "wtp",
    type: "single",
    label: "At ₹1,999/month for storing up to 10 items with pickup and 2 deliveries per quarter — how likely are you to subscribe?",
    sub: "This is our entry plan.",
    options: [
      "Definitely would subscribe",
      "Probably would subscribe",
      "Not sure",
      "Probably would not",
      "Definitely would not",
    ],
    highlight: "₹1,999/month",
  },
  {
    id: "q11", section: "wtp",
    type: "single",
    label: "At ₹3,499/month for storing up to 25 items with all features — how likely are you to subscribe?",
    sub: "This is our Standard plan — the plan we recommend for most households.",
    options: [
      "Definitely would subscribe",
      "Probably would subscribe",
      "Not sure",
      "Probably would not",
      "Definitely would not",
    ],
    highlight: "₹3,499/month",
  },
  {
    id: "q12", section: "wtp",
    type: "single",
    label: "At ₹5,999/month for unlimited items, climate-controlled storage, priority delivery, and premium insurance — how likely are you to subscribe?",
    sub: "This is our Premium plan.",
    options: [
      "Definitely would subscribe",
      "Probably would subscribe",
      "Not sure",
      "Probably would not",
      "Definitely would not",
    ],
    highlight: "₹5,999/month",
  },
  {
    id: "q13", section: "wtp",
    type: "single",
    label: "Which plan would you most likely choose if you signed up today?",
    options: [
      "Entry — ₹1,999/month (10 items)",
      "Standard — ₹3,499/month (25 items) — Best value",
      "Premium — ₹5,999/month (unlimited items)",
      "I wouldn't subscribe at any of these prices",
    ],
  },

  // ── Section 4: Service Expectations ─────────────────────────
  {
    id: "q14", section: "service",
    type: "single",
    label: "How many times per year would you expect to request items back from storage?",
    sub: "This is critical for us to understand. Please be honest — it helps us design the right plan for you.",
    options: [
      "1–2 times (very infrequently)",
      "3–4 times (seasonal items)",
      "5–8 times (regular retrieval)",
      "9–12 times (monthly roughly)",
      "More than 12 times",
    ],
  },
  {
    id: "q15", section: "service",
    type: "multi",
    label: "What would make you most comfortable handing your belongings to a storage company?",
    sub: "Select your top 3.",
    max: 3,
    options: [
      "Detailed photo documentation of every item",
      "Insurance coverage for all stored items",
      "Background-verified staff with ID badges",
      "Ability to see my items on an app anytime",
      "CCTV-monitored warehouse",
      "Well-known brand / strong reputation",
      "Recommendation from someone I trust",
      "Clear damage compensation policy",
      "Founder's personal guarantee / contact",
    ],
  },
  {
    id: "q16", section: "service",
    type: "single",
    label: "How quickly would you expect an item to be delivered after you request it?",
    options: [
      "Same day (within hours)",
      "Next day — this is perfectly fine",
      "Within 2 days",
      "Within a week — I plan ahead",
      "Timing doesn't matter much to me",
    ],
  },
  {
    id: "q17", section: "service",
    type: "single",
    label: "How useful would proactive AI reminders be for you?",
    sub: "Example: \"Diwali is 3 weeks away — your festival décor is in storage. Retrieve now?\"",
    options: [
      "Extremely useful — this alone would make me subscribe",
      "Very useful — I'd love this feature",
      "Useful — nice to have",
      "Not very useful — I'll request items myself",
      "Not useful at all",
    ],
  },

  // ── Section 5: Resale ────────────────────────────────────────
  {
    id: "q18", section: "resale",
    type: "single",
    label: "How interested would you be in selling stored items directly from the app?",
    sub: "You'd tap 'List for Sale', set a price, and Tuckt handles photography, listing, and delivery to the buyer — for a 15% commission.",
    options: [
      "Very interested — I have items I'd sell immediately",
      "Interested — I'd consider it",
      "Neutral",
      "Not interested — I'd rather donate or keep items",
      "I'd never sell second-hand items",
    ],
  },
  {
    id: "q19", section: "resale",
    type: "multi",
    label: "Which of these items do you currently own that you'd consider selling?",
    sub: "Select all that apply.",
    options: [
      "Baby / children's gear (pram, cot, bicycle)",
      "Clothes / ethnic wear",
      "Sports equipment",
      "Electronics / gadgets",
      "Furniture",
      "Artwork / collectibles",
      "Luggage / bags",
      "Books",
      "Nothing — I wouldn't sell",
    ],
  },
  {
    id: "q20", section: "resale",
    type: "single",
    label: "At 15% commission, how fair does Tuckt's resale fee feel?",
    sub: "You get 85% of the sale price. Tuckt handles all photography, listing, buyer queries, payment, and delivery.",
    options: [
      "Very fair — great value for the effort saved",
      "Fair enough",
      "Slightly high — I'd prefer 10%",
      "Too high — I'd rather list myself",
    ],
  },

  // ── Section 6: About You ─────────────────────────────────────
  {
    id: "q21", section: "you",
    type: "multi",
    label: "Which home services do you currently subscribe to?",
    sub: "Select all that apply.",
    options: [
      "Swiggy / Zomato",
      "Urban Company (cleaning, repairs)",
      "Netflix / Prime / Hotstar",
      "Amazon Prime",
      "Swiggy Instamart / Blinkit / Zepto",
      "Cult.fit / fitness app",
      "None of the above",
    ],
  },
  {
    id: "q22", section: "you",
    type: "single",
    label: "How did you hear about this survey?",
    options: [
      "WhatsApp group / RWA group",
      "Friend or family referral",
      "Instagram / social media",
      "LinkedIn",
      "Email",
      "Other",
    ],
  },
  {
    id: "q23", section: "you",
    type: "text",
    label: "Is there anything you'd want from a storage service that we haven't mentioned?",
    sub: "Optional — but your answer could shape our product.",
    placeholder: "Type your thoughts here...",
    optional: true,
  },
  {
    id: "q24", section: "you",
    type: "contact",
    label: "Would you like to be one of our 20 founding beta customers?",
    sub: "Beta customers get 3 months free, a personal onboarding call with the founder, and direct input into the product. We'll reach out before launch.",
    placeholder: "Your name and phone / email",
    optional: true,
  },
];

const TOTAL = QUESTIONS.length;

// ── Helpers ───────────────────────────────────────────────────
const getSectionIndex = (sectionId) =>
  SECTIONS.findIndex(s => s.id === sectionId);

const getSectionColor = (sectionId) =>
  SECTIONS.find(s => s.id === sectionId)?.color ?? T.navy;

// ── Sub-components ────────────────────────────────────────────
function ProgressBar({ current, total, color }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ padding: "0 0 0 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: T.muted, fontFamily: "Georgia, serif" }}>
          Question {current} of {total}
        </span>
        <span style={{ fontSize: 12, color, fontWeight: 700, fontFamily: "Georgia, serif" }}>
          {pct}% complete
        </span>
      </div>
      <div style={{ height: 3, background: T.lgrey, borderRadius: 2 }}>
        <div style={{
          height: 3, borderRadius: 2, background: color,
          width: `${pct}%`, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)"
        }} />
      </div>
    </div>
  );
}

function SectionPill({ sectionId }) {
  const s = SECTIONS.find(sec => sec.id === sectionId);
  if (!s) return null;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 14px", borderRadius: 20,
      background: s.color + "18", border: `1px solid ${s.color}44`,
      marginBottom: 20,
    }}>
      <span style={{ fontSize: 14 }}>{s.icon}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: s.color, letterSpacing: "0.3px" }}>
        {s.title}
      </span>
    </div>
  );
}

function OptionButton({ label, selected, onClick, color, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", textAlign: "left", padding: "14px 18px",
        borderRadius: 12, cursor: disabled ? "default" : "pointer",
        border: `1.5px solid ${selected ? color : T.border}`,
        background: selected ? color + "12" : T.white,
        color: selected ? color : T.text,
        fontWeight: selected ? 700 : 400,
        fontSize: 15, fontFamily: "Georgia, serif",
        transition: "all 0.15s",
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: 8,
        boxShadow: selected ? `0 0 0 3px ${color}22` : "none",
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        border: `2px solid ${selected ? color : T.border}`,
        background: selected ? color : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.white }} />}
      </div>
      {label}
    </button>
  );
}

function MultiOptionButton({ label, selected, onClick, color, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", textAlign: "left", padding: "13px 18px",
        borderRadius: 12, cursor: disabled ? "default" : "pointer",
        border: `1.5px solid ${selected ? color : T.border}`,
        background: selected ? color + "12" : T.white,
        color: selected ? color : T.text,
        fontWeight: selected ? 700 : 400,
        fontSize: 14, fontFamily: "Georgia, serif",
        transition: "all 0.15s",
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: 8,
        boxShadow: selected ? `0 0 0 3px ${color}22` : "none",
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 5, flexShrink: 0,
        border: `2px solid ${selected ? color : T.border}`,
        background: selected ? color : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}>
        {selected && <span style={{ color: T.white, fontSize: 12, fontWeight: 800 }}>✓</span>}
      </div>
      {label}
    </button>
  );
}

function ScaleSelector({ min, max, value, onChange, color, minLabel, maxLabel }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 12 }}>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              width: 48, height: 48, borderRadius: 12, fontSize: 16,
              fontWeight: value === n ? 800 : 400,
              border: `2px solid ${value === n ? color : T.border}`,
              background: value === n ? color : T.white,
              color: value === n ? T.white : T.text,
              cursor: "pointer", transition: "all 0.15s",
              fontFamily: "Georgia, serif",
              boxShadow: value === n ? `0 4px 12px ${color}44` : "none",
            }}
          >{n}</button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: T.muted, fontFamily: "Georgia, serif" }}>{minLabel}</span>
        <span style={{ fontSize: 12, color: T.muted, fontFamily: "Georgia, serif" }}>{maxLabel}</span>
      </div>
    </div>
  );
}

function ConceptCard({ concept }) {
  return (
    <div style={{
      borderRadius: 16, overflow: "hidden", marginBottom: 24,
      border: `1px solid ${T.border}`, background: T.white,
      boxShadow: "0 4px 24px rgba(27,45,91,0.10)",
    }}>
      {/* Header */}
      <div style={{
        background: T.navyD, padding: "20px 24px",
        backgroundImage: "radial-gradient(ellipse at top right, #2EC4A520 0%, transparent 60%)",
      }}>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 26, fontWeight: 700,
                      color: T.white, letterSpacing: "-0.5px" }}>Tuckt</div>
        <div style={{ fontSize: 14, color: T.teal, fontStyle: "italic",
                      marginTop: 4, fontFamily: "Georgia, serif" }}>
          {concept.tagline}
        </div>
      </div>
      {/* Bullets */}
      <div style={{ padding: "18px 24px" }}>
        {concept.bullets.map((b, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            padding: "9px 0", borderBottom: i < concept.bullets.length - 1 ? `1px solid ${T.lgrey}` : "none",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", background: T.tealL,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
            }}>
              <span style={{ color: T.tealD, fontSize: 11, fontWeight: 800 }}>✓</span>
            </div>
            <span style={{ fontSize: 13, color: T.text, lineHeight: 1.6, fontFamily: "Georgia, serif" }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Thank You screen ──────────────────────────────────────────
function ThankYou({ answers }) {
  const interest = answers["q9"];
  const plan = answers["q13"];
  const isInterested = interest && !interest.includes("Not interested");
  const isBeta = answers["q24"] && answers["q24"].trim().length > 3;

  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>
        {isInterested ? "🎉" : "🙏"}
      </div>
      <div style={{
        fontSize: 28, fontWeight: 700, color: T.navy, marginBottom: 12,
        fontFamily: "Georgia, serif", letterSpacing: "-0.5px",
      }}>
        {isInterested ? "Thank you — and welcome." : "Thank you for your honesty."}
      </div>
      <div style={{ fontSize: 15, color: T.muted, marginBottom: 32, maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.7, fontFamily: "Georgia, serif" }}>
        {isInterested
          ? "Your responses will directly shape how we build Tuckt. We're aiming to launch in Gurgaon in Q3 2026."
          : "Your candid feedback is exactly what we need. Building the right product starts with understanding what doesn't work."}
      </div>

      {isBeta && (
        <div style={{
          background: T.tealL, border: `1.5px solid ${T.teal}`,
          borderRadius: 16, padding: "20px 24px", marginBottom: 24,
          maxWidth: 440, margin: "0 auto 24px",
        }}>
          <div style={{ fontWeight: 700, color: T.tealD, marginBottom: 6, fontFamily: "Georgia, serif" }}>
            ✅ You're on the beta list
          </div>
          <div style={{ fontSize: 13, color: T.muted, fontFamily: "Georgia, serif" }}>
            The founder will reach out personally before launch. You'll get 3 months free, a personal onboarding call, and your feedback will directly influence the product.
          </div>
        </div>
      )}

      <div style={{
        background: T.navyL, borderRadius: 16, padding: "20px 24px",
        maxWidth: 440, margin: "0 auto",
      }}>
        <div style={{ fontWeight: 700, color: T.navy, marginBottom: 12, fontFamily: "Georgia, serif" }}>
          What happens next
        </div>
        {[
          ["Survey closes", "30 April 2026"],
          ["Results analysed", "May 2026"],
          ["Beta customer outreach", "June 2026"],
          ["Gurgaon pilot launch", "Q3 2026"],
        ].map(([step, date]) => (
          <div key={step} style={{
            display: "flex", justifyContent: "space-between",
            padding: "8px 0", borderBottom: `1px solid ${T.border}`,
            fontSize: 13, fontFamily: "Georgia, serif",
          }}>
            <span style={{ color: T.text }}>{step}</span>
            <span style={{ color: T.tealD, fontWeight: 600 }}>{date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Survey Component ─────────────────────────────────────
export default function TucktSurvey() {
  const [current, setCurrent] = useState(0); // 0 = welcome screen
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const scrollRef = useRef(null);

  const q = QUESTIONS[current - 1];
  const color = q ? getSectionColor(q.section) : T.navy;
  const isWelcome = current === 0;
  const isComplete = current > TOTAL;

  const answer = q ? answers[q.id] : null;

  const canAdvance = !q || q.optional ||
    (q.type === "single" && answer) ||
    (q.type === "scale" && answer !== undefined) ||
    (q.type === "multi" && Array.isArray(answer) && answer.length > 0) ||
    (q.type === "concept" && answer) ||
    (q.type === "text" && q.optional) ||
    (q.type === "contact" && q.optional);

  const setAnswer = (val) => setAnswers(a => ({ ...a, [q.id]: val }));

  const advance = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(c => c + 1);
      setAnimating(false);
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 220);
  };

  const goBack = () => {
    if (animating || current === 0) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(c => c - 1);
      setAnimating(false);
    }, 220);
  };

 const submit = async () => {
  try {
    console.log("Submitting:", answers);

    const res = await fetch("YOUR_GOOGLE_SCRIPT_URL", {
      method: "POST",
      body: JSON.stringify(answers),
    });

    const text = await res.text();
    console.log("Response:", text);

    advance();
  } catch (err) {
    console.error("Submission error:", err);
    alert("Submission failed. Try again.");
  }
};
    // In production: POST to your backend / Airtable / Tally webhook
    advance();
  };

  useEffect(() => {
    // Auto-advance on single select after brief delay
    if (q && (q.type === "single" || q.type === "concept") && answer) {
      const t = setTimeout(advance, 400);
      return () => clearTimeout(t);
    }
  }, [answer]);

  return (
    <div style={{
      minHeight: "100vh",
      background: isWelcome ? T.navyD : T.lgrey,
      display: "flex", flexDirection: "column",
      fontFamily: "Georgia, serif",
      backgroundImage: isWelcome
        ? "radial-gradient(ellipse at 80% 20%, #2EC4A515 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, #F5A62310 0%, transparent 50%)"
        : "none",
    }}>

      {/* Top bar */}
      {!isWelcome && !isComplete && (
        <div style={{
          background: T.white, borderBottom: `1px solid ${T.border}`,
          padding: "14px 24px",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
              <button
                onClick={goBack}
                disabled={current <= 1}
                style={{
                  background: "none", border: "none", cursor: current > 1 ? "pointer" : "default",
                  color: current > 1 ? T.muted : T.border, fontSize: 20, padding: 0,
                }}
              >←</button>
              <div style={{ flex: 1 }}>
                <ProgressBar current={current} total={TOTAL} color={color} />
              </div>
              <div style={{
                padding: "3px 10px", borderRadius: 20,
                background: color + "18", color: color,
                fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
              }}>
                {SECTIONS.find(s => s.id === q?.section)?.icon} {SECTIONS.find(s => s.id === q?.section)?.title}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, overflowY: "auto",
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.2s, transform 0.2s",
        }}
      >
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "0 20px" }}>

          {/* ── Welcome screen ─────────────────────────────── */}
          {isWelcome && (
            <div style={{ padding: "60px 0", textAlign: "center" }}>
              {/* Logo */}
              <div style={{ marginBottom: 40 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 14,
                  background: "rgba(255,255,255,0.06)", borderRadius: 20,
                  padding: "12px 28px", border: "1px solid rgba(255,255,255,0.12)",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: T.teal,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, fontWeight: 800, color: T.white,
                  }}>T</div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: T.white, letterSpacing: "-0.5px" }}>Tuckt</div>
                    <div style={{ fontSize: 12, color: T.teal, fontStyle: "italic" }}>Your home. Lighter.</div>
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: 38, fontWeight: 700, color: T.white,
                letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 20,
              }}>
                Help us build the storage<br />
                <span style={{ color: T.teal }}>service India deserves.</span>
              </div>

              <div style={{ fontSize: 16, color: "#AABBCC", lineHeight: 1.8, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
                We're building Tuckt — India's first intelligent, white-glove storage subscription for premium urban homes.
                This survey takes <strong style={{ color: T.white }}>4–6 minutes</strong> and will directly shape what we build.
              </div>

              {/* Stats */}
              <div style={{
                display: "flex", gap: 1, marginBottom: 48, justifyContent: "center",
              }}>
                {[
                  ["24", "questions"],
                  ["4–6", "minutes"],
                  ["100%", "anonymous"],
                ].map(([v, l], i) => (
                  <div key={i} style={{
                    flex: 1, maxWidth: 140,
                    background: "rgba(255,255,255,0.05)", borderRadius: i === 0 ? "12px 0 0 12px" : i === 2 ? "0 12px 12px 0" : 0,
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: "18px 12px",
                    borderRight: i < 2 ? "none" : "1px solid rgba(255,255,255,0.08)",
                  }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: T.teal }}>{v}</div>
                    <div style={{ fontSize: 12, color: "#8899BB", marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={advance}
                style={{
                  padding: "18px 56px", borderRadius: 16, border: "none",
                  background: T.teal, color: T.white,
                  fontSize: 17, fontWeight: 700, cursor: "pointer",
                  fontFamily: "Georgia, serif",
                  boxShadow: `0 8px 32px ${T.teal}55`,
                  letterSpacing: "0.3px",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 12px 40px ${T.teal}77`; }}
                onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = `0 8px 32px ${T.teal}55`; }}
              >
                Start Survey →
              </button>

              <div style={{ marginTop: 20, fontSize: 12, color: "#5566788", color: "#667788" }}>
                Your responses are anonymous unless you choose to share contact details at the end.
              </div>
            </div>
          )}

          {/* ── Thank you ─────────────────────────────────── */}
          {isComplete && (
            <div style={{ padding: "40px 0" }}>
              <ThankYou answers={answers} />
            </div>
          )}

          {/* ── Question card ──────────────────────────────── */}
          {!isWelcome && !isComplete && q && (
            <div style={{ padding: "28px 0 100px" }}>
              <SectionPill sectionId={q.section} />

              {/* Question label */}
              <div style={{
                fontSize: 22, fontWeight: 700, color: T.navy,
                lineHeight: 1.35, marginBottom: 10, letterSpacing: "-0.3px",
              }}>
                {q.label}
              </div>
              {q.sub && (
                <div style={{ fontSize: 14, color: T.muted, marginBottom: 24, lineHeight: 1.6 }}>
                  {q.sub}
                </div>
              )}
              {q.max && (
                <div style={{
                  display: "inline-block", padding: "4px 12px", borderRadius: 20,
                  background: color + "18", color, fontSize: 12, fontWeight: 700, marginBottom: 20,
                }}>Select up to {q.max}</div>
              )}

              {/* Concept card */}
              {q.type === "concept" && (
                <ConceptCard concept={q.concept} />
              )}
              {q.type === "concept" && (
                <div style={{ fontSize: 16, fontWeight: 700, color: T.navy, marginBottom: 16 }}>
                  {q.question}
                </div>
              )}

              {/* Price highlight */}
              {q.highlight && (
                <div style={{
                  padding: "16px 20px", borderRadius: 14, marginBottom: 20,
                  background: color + "10", border: `1.5px solid ${color}44`,
                  display: "flex", alignItems: "center", gap: 16,
                }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: "-1px" }}>
                    {q.highlight}
                  </div>
                  <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
                    Billed monthly. Cancel anytime.
                  </div>
                </div>
              )}

              {/* Single choice */}
              {(q.type === "single" || q.type === "concept") && (
                <div>
                  {q.options.map((opt, i) => (
                    <OptionButton
                      key={i}
                      label={opt}
                      selected={answer === opt}
                      onClick={() => setAnswer(opt)}
                      color={color}
                    />
                  ))}
                </div>
              )}

              {/* Multi choice */}
              {q.type === "multi" && (
                <div>
                  {q.options.map((opt, i) => {
                    const sel = Array.isArray(answer) && answer.includes(opt);
                    const atMax = q.max && Array.isArray(answer) && answer.length >= q.max && !sel;
                    return (
                      <MultiOptionButton
                        key={i}
                        label={opt}
                        selected={sel}
                        disabled={atMax}
                        onClick={() => {
                          if (atMax) return;
                          const cur = Array.isArray(answer) ? answer : [];
                          setAnswer(sel ? cur.filter(o => o !== opt) : [...cur, opt]);
                        }}
                        color={color}
                      />
                    );
                  })}
                </div>
              )}

              {/* Scale */}
              {q.type === "scale" && (
                <ScaleSelector
                  min={q.min} max={q.max}
                  value={answer}
                  onChange={setAnswer}
                  color={color}
                  minLabel={q.minLabel}
                  maxLabel={q.maxLabel}
                />
              )}

              {/* Text */}
              {(q.type === "text" || q.type === "contact") && (
                <textarea
                  value={answer || ""}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder={q.placeholder}
                  rows={4}
                  style={{
                    width: "100%", padding: "16px", borderRadius: 14,
                    border: `1.5px solid ${answer ? color : T.border}`,
                    fontSize: 15, color: T.text, resize: "vertical",
                    fontFamily: "Georgia, serif", outline: "none",
                    boxSizing: "border-box", lineHeight: 1.6,
                    background: T.white,
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = answer ? color : T.border}
                />
              )}

              {/* Navigation */}
              <div style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                background: T.white, borderTop: `1px solid ${T.border}`,
                padding: "16px 24px",
                display: "flex", gap: 12, maxWidth: 620, margin: "0 auto",
              }}>
                {current === TOTAL ? (
                  <button
                    onClick={submit}
                    disabled={!canAdvance}
                    style={{
                      flex: 1, padding: "16px", borderRadius: 14, border: "none",
                      background: canAdvance ? T.teal : T.lgrey,
                      color: canAdvance ? T.white : T.border,
                      fontSize: 16, fontWeight: 700, cursor: canAdvance ? "pointer" : "default",
                      fontFamily: "Georgia, serif",
                      boxShadow: canAdvance ? `0 4px 16px ${T.teal}44` : "none",
                    }}
                  >Submit Survey 🎉</button>
                ) : (
                  <>
                    {q.type !== "single" && q.type !== "concept" && (
                      <button
                        onClick={advance}
                        disabled={!canAdvance}
                        style={{
                          flex: 1, padding: "16px", borderRadius: 14, border: "none",
                          background: canAdvance ? color : T.lgrey,
                          color: canAdvance ? T.white : T.border,
                          fontSize: 16, fontWeight: 700, cursor: canAdvance ? "pointer" : "default",
                          fontFamily: "Georgia, serif",
                          boxShadow: canAdvance ? `0 4px 16px ${color}44` : "none",
                          transition: "all 0.2s",
                        }}
                      >
                        {q.optional ? "Skip →" : "Continue →"}
                      </button>
                    )}
                    {(q.type === "single" || q.type === "concept") && !answer && (
                      <div style={{
                        flex: 1, padding: "16px", borderRadius: 14,
                        background: T.lgrey, color: T.border,
                        fontSize: 15, textAlign: "center", fontFamily: "Georgia, serif",
                      }}>Select an option to continue</div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
