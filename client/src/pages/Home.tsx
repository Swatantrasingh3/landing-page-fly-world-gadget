// Precision Atelier style reminder: editorial-industrial composition, documentary imagery, signal-red actions, calm technical voice.
import { useMemo, useState } from "react";
import { ArrowUpRight, Check, ChevronDown, CircleDot, Menu, MessageCircle, Phone, ShieldCheck, X } from "lucide-react";
import { BUSINESS, IMAGES, PROBLEMS, SERVICES } from "@/lib/siteConfig";
import { trpc } from "@/lib/trpc";

const navItems = [["Services", "services"], ["Process", "process"], ["Brands", "brands"], ["Gallery", "gallery"], ["FAQ", "faq"], ["Contact", "contact"]];
const models = ["Mini", "Mavic", "Air", "Avata / FPV", "Enterprise", "Autel", "Other"];
const faqs = [
  ["Can you repair drones from different brands?", "Yes. We provide multi-brand inspection, diagnosis, and repair support. If you do not see your brand or model, contact the team before sending it in."],
  ["Do you provide free inspection?", "The initial inspection and diagnosis discussion are free. Any repair work, parts, or service terms are confirmed with you before proceeding."],
  ["Can I send my drone for pickup?", "Pickup and delivery support is available. WhatsApp the team to discuss your location and the best arrangement."],
  ["How do I book a repair?", "Use the booking form on this page, or call/WhatsApp the repair team directly. The form prepares a WhatsApp enquiry so your details do not get lost."],
  ["Do you repair crash-damaged drones?", "Crash damage can be assessed across the body, arms, motors, camera, gimbal, and electronics. A repair path is recommended after inspection."],
  ["Is there a warranty on repairs?", "Warranty terms depend on the repair or service and should be confirmed with the team by phone before work begins."],
];

function WhatsAppLink({ children = "WhatsApp Us", className = "" }: { children?: React.ReactNode; className?: string }) {
  return <a className={className} href={BUSINESS.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} />{children}</a>;
}

function readPhotoAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected photo."));
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState("Drone not turning on");
  const [activeFaq, setActiveFaq] = useState(0);
  const [modelFilter, setModelFilter] = useState("All");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const createRepair = trpc.repair.create.useMutation();
  const filteredModels = useMemo(() => modelFilter === "All" ? models : models.filter((m) => m === modelFilter), [modelFilter]);

  const submitRepair = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitError("");
    setSubmitted(false);
    try {
      const photos = await Promise.all(
        form.getAll("photos")
          .filter((value): value is File => value instanceof File && value.size > 0)
          .slice(0, 5)
          .map(async (file) => ({
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            fileSize: file.size,
            data: (await readPhotoAsBase64(file)).split(",")[1] || "",
          })),
      );
      await createRepair.mutateAsync({
        fullName: String(form.get("name") || ""),
        phone: String(form.get("phone") || ""),
        email: String(form.get("email") || ""),
        droneBrand: String(form.get("brand") || ""),
        droneModel: String(form.get("model") || ""),
        problemType: String(form.get("problem") || ""),
        problemDescription: String(form.get("description") || ""),
        repairRequirement: String(form.get("requirement") || ""),
        pickupPreference: String(form.get("pickup") || ""),
        photos,
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not save your request. Please try again or contact us directly on WhatsApp.");
      return;
    }
    const msg = `Hello Fly World Gadget,\nI want to book a drone repair.\n\nName: ${form.get("name")}\nPhone: ${form.get("phone")}\nEmail: ${form.get("email")}\nDrone Brand: ${form.get("brand")}\nDrone Model: ${form.get("model")}\nProblem: ${form.get("problem")}\nPickup/Drop-off: ${form.get("pickup")}\nDescription: ${form.get("description")}\n\nPlease guide me with the repair process.`;
    setSubmitted(true);
    window.open(`${BUSINESS.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return <div className="site-shell">
    {(submitError || submitted) && <p className="form-note" role={submitError ? "alert" : "status"} aria-live="polite">{submitError || "Your repair request was saved successfully. WhatsApp is opening with your details."}</p>}
    <header className="nav-wrap"><nav className="nav" aria-label="Main navigation">
      <a href="#top" className="brand" onClick={() => setMenuOpen(false)}><img src="/assets/logo.png" alt="Flyworld Gadgets" /></a>
      <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>{navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}<a className="nav-cta" href="#book" onClick={() => setMenuOpen(false)}>Book a Repair <ArrowUpRight size={15} /></a></div>
      <button className="menu-btn" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </nav></header>

    <main id="top">
      <section className="hero">
        <div className="hero-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(10,11,12,.94) 0%, rgba(10,11,12,.72) 42%, rgba(10,11,12,.18) 100%), url(${IMAGES.hero})` }} />
        <div className="hero-scan-grid" aria-hidden="true" />
        <div className="hero-drone" aria-hidden="true"><img src={IMAGES.droneFly} alt="" /><span /></div>
        <div className="hero-grid page-width"><div className="hero-copy reveal"><p className="eyebrow light">FLY WORLD GADGET <i /> DRONE REPAIR CENTRE</p><h1>Professional drone repair.<br /><em>Get back in the air.</em></h1><p className="hero-lede">Expert inspection, diagnosis and repair for drones of all major brands — from everyday consumer drones to professional platforms.</p><div className="hero-actions"><a className="btn btn-red" href="#book">Book a Repair <ArrowUpRight size={17} /></a><WhatsAppLink className="btn btn-glass" /><a className="phone-link" href={BUSINESS.tel}><Phone size={16} /> Call {BUSINESS.phone}</a></div></div><div className="hero-meta"><div className="tech-tag">01 / DIAGNOSTICS</div><div className="tech-tag">02 / PRECISION SERVICE</div><div className="tech-tag">03 / FLIGHT TESTING</div><div className="tech-tag tech-tag-funny">04 / NO PANIC, WE'VE GOT THIS</div><div className="hero-corner">NOIDA · NCR<br /><span>EST. REPAIR DESK</span></div></div></div>
      </section>

      <section className="trust-strip"><div className="page-width trust-items">{["Free Inspection", "Multi-Brand Support", "Pickup & Delivery", "Professional Diagnosis", "Repair Support"].map((t, i) => <div key={t}><span>0{i + 1}</span>{t}</div>)}</div></section>

      <section className="section page-width problem-section" id="services"><div className="section-heading"><div><p className="eyebrow">DIAGNOSTIC DESK / 01</p><h2>What’s wrong<br /><em>with your drone?</em></h2></div><p className="section-intro">Start with the symptom. We’ll help you understand the next step, beginning with a free inspection.</p></div><div className="problem-layout"><div className="problem-grid">{PROBLEMS.map((problem, i) => <button className={`problem-card ${selectedProblem === problem ? "selected" : ""}`} key={problem} onClick={() => setSelectedProblem(problem)}><span>{String(i + 1).padStart(2, "0")}</span><b>{problem}</b><ArrowUpRight size={16} /></button>)}</div><div className="diagnostic-note"><CircleDot size={18} /><p className="eyebrow">CURRENT SYMPTOM</p><h3>{selectedProblem}</h3><p>That’s a useful place to start. Our team can inspect the likely cause and advise whether repair, calibration, or part replacement is appropriate.</p><a className="text-link" href="#book">Book a Free Inspection <ArrowUpRight size={15} /></a></div></div></section>

      <section className="dark-section services-section"><div className="page-width"><div className="section-heading light-heading"><div><p className="eyebrow light">REPAIR CAPABILITIES / 02</p><h2>Complete drone<br /><em>repair services.</em></h2></div><p className="section-intro">A multi-brand repair desk for the components that keep your aircraft safe, stable, and ready to fly.</p></div><div className="service-list">{SERVICES.map(([num, title, body]) => <div className="service-row" key={num}><span>{num}</span><h3>{title}</h3><p>{body}</p><ArrowUpRight size={18} /></div>)}</div></div></section>

      <section className="section page-width workshop" id="process"><div className="workshop-images"><img src={IMAGES.technician} alt="Technician working on electronics at a repair bench" /><img className="workshop-small" src={IMAGES.bench} alt="Close-up of an electronics circuit board" /><div className="image-label">FIELD NOTE / 03<br /><strong>PRECISION WORK</strong></div></div><div className="workshop-copy"><p className="eyebrow">THE REPAIR BENCH / 03</p><h2>Precision work.<br /><em>Careful repair.</em></h2><p>Every drone problem is different. We inspect the issue, identify the likely cause and help you choose the right repair solution.</p><div className="stat-line"><strong>FREE</strong><span>initial inspection<br />before repair decisions</span></div><a className="btn btn-dark" href="#book">Talk to the repair team <ArrowUpRight size={17} /></a></div></section>

      <section className="process-band"><div className="page-width"><div className="section-heading light-heading"><div><p className="eyebrow light">HOW IT WORKS / 04</p><h2>From grounded<br /><em>to flight ready.</em></h2></div><p className="section-intro">A clear six-step path from first message to collection or delivery.</p></div><div className="steps">{[["01", "Book your repair"], ["02", "Free inspection"], ["03", "Diagnosis & estimate"], ["04", "Repair"], ["05", "Testing & calibration"], ["06", "Collection / delivery"]].map(([n, t]) => <div className="step" key={n}><span>{n}</span><b>{t}</b></div>)}</div></div></section>

      <section className="section page-width brands" id="brands"><div className="brands-copy"><p className="eyebrow">MULTI-BRAND SUPPORT / 05</p><h2>We repair drones<br /><em>across brands.</em></h2><p>Don’t see your brand? Contact us. We’ll discuss your model and the best way to inspect it.</p><WhatsAppLink className="text-link" /></div><div className="brand-tile-wrap">{["DJI", "AUTEL", "LITO", "OTHER"].map((brand, i) => <div className="brand-tile" key={brand}><span>0{i + 1}</span><strong>{brand}</strong><small>{brand === "OTHER" ? "MAJOR BRANDS" : "SUPPORT"}</small></div>)}</div></section>

      <section className="models-section" id="gallery"><div className="page-width"><div className="section-heading"><div><p className="eyebrow">MODEL DESK / 06</p><h2>Drone models<br /><em>we can help with.</em></h2></div><p className="section-intro">Choose a category to start. Have a different model? Contact our repair team.</p></div><div className="filter-row"><button className={modelFilter === "All" ? "active" : ""} onClick={() => setModelFilter("All")}>All</button>{models.map((m) => <button className={modelFilter === m ? "active" : ""} key={m} onClick={() => setModelFilter(m)}>{m}</button>)}</div><div className="model-result"><div className="model-photo" style={{ backgroundImage: `url(${IMAGES.drone})` }} /><div><p className="eyebrow">SELECTED CATEGORY</p><h3>{filteredModels.join(" / ")}</h3><p>Bring the aircraft, controller, and any relevant accessories or photos so the team can inspect the full system.</p><WhatsAppLink className="btn btn-dark" children="Ask about my model" /></div></div><p className="parts-kicker">PARTS WE INSPECT / LIVE BENCH REEL</p><div className="model-gallery parts-gallery" aria-label="Drone parts slideshow">{[...IMAGES.parts, ...IMAGES.parts].map(([label, image], index) => <figure key={`${image}-${index}`}><img src={image} alt={label} /><figcaption>{label}</figcaption></figure>)}</div></div></section>

      <section className="gallery-section"><div className="page-width"><div className="section-heading light-heading"><div><p className="eyebrow light">INSIDE THE PROCESS / 07</p><h2>A closer look<br /><em>at careful work.</em></h2></div><p className="section-intro">A repair dossier in images: inspection benches, precision tools, electronics, and the details that guide a careful handoff.</p></div><div className="gallery-grid">{IMAGES.repairGallery.map((image, index) => <img key={image} src={image} alt={`Drone repair workshop photo ${index + 1}`} />)}<div className="gallery-caption"><span>WORKSHOP DOSSIER / 07</span><strong>Inspection first.<br />Repair with intent.</strong></div></div></div></section>

      <section className="section page-width booking" id="book"><div className="booking-intro"><p className="eyebrow">REPAIR INTAKE / 08</p><h2>Book your<br /><em>drone repair.</em></h2><p>Tell us what happened. We’ll start with a free inspection and guide you through the next step.</p><div className="booking-facts"><div><Check size={16} /> Free inspection</div><div><Check size={16} /> WhatsApp follow-up</div><div><Check size={16} /> Pickup support available</div></div></div><form className="repair-form" onSubmit={submitRepair}><div className="form-grid"><label>Full name<input name="name" required placeholder="Your name" /></label><label>Phone number<input name="phone" required type="tel" placeholder="+91" /></label><label>Email<input name="email" type="email" placeholder="you@example.com" /></label><label>Drone brand<select name="brand" defaultValue="DJI"><option>DJI</option><option>Autel</option><option>Lito</option><option>Other</option></select></label><label>Drone model<input name="model" placeholder="e.g. Mavic Air 2" /></label><label>Problem type<select name="problem" defaultValue={selectedProblem}>{PROBLEMS.map((p) => <option key={p}>{p}</option>)}</select></label><label className="wide">Problem description<textarea name="description" required placeholder="What happened? What changed?" /></label><label>Repair requirement<select name="requirement" defaultValue="Inspection first"><option>Inspection first</option><option>Repair estimate</option><option>Part replacement</option><option>Not sure</option></select></label><label>Pickup / drop-off<select name="pickup" defaultValue="I will visit the centre"><option>I will visit the centre</option><option>Discuss pickup</option><option>Discuss delivery</option></select></label></div><label className="upload-label">Upload drone damage photos<input type="file" name="photos" accept="image/*" multiple /><span>Optional · JPG, PNG or HEIC</span></label><button className="btn btn-red submit-btn" type="submit">{submitted ? "Opening WhatsApp…" : "Submit Repair Request"} <ArrowUpRight size={17} /></button><p className="form-note">Your details are validated in the browser and prepared for WhatsApp. No database connection is claimed on this page.</p></form></section>

      <section className="faq-section" id="faq"><div className="page-width"><div className="section-heading"><div><p className="eyebrow">COMMON QUESTIONS / 09</p><h2>Before you<br /><em>send it in.</em></h2></div><p className="section-intro">Straight answers, with service terms confirmed by the repair team where needed.</p></div><div className="faq-list">{faqs.map(([q, a], i) => <div className={`faq-item ${activeFaq === i ? "open" : ""}`} key={q}><button onClick={() => setActiveFaq(activeFaq === i ? -1 : i)} aria-expanded={activeFaq === i}><span>{String(i + 1).padStart(2, "0")}</span><b>{q}</b><ChevronDown size={18} /></button>{activeFaq === i && <p>{a}</p>}</div>)}</div></div></section>

      <section className="final-cta" id="contact"><div className="final-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(15,16,18,.94), rgba(15,16,18,.5)), url(${IMAGES.hero})` }} /><div className="page-width final-content"><p className="eyebrow light">READY WHEN YOU ARE / 10</p><h2>Your drone is grounded.<br /><em>Let’s get it flying again.</em></h2><p>Book a free inspection or speak directly with our repair team.</p><div className="hero-actions"><a className="btn btn-red" href="#book">Book a Repair <ArrowUpRight size={17} /></a><WhatsAppLink className="btn btn-glass" /><a className="btn btn-outline-light" href={BUSINESS.tel}><Phone size={16} /> Call Now</a></div></div></section>
    </main>

    <footer className="footer"><div className="page-width footer-grid"><div><a href="#top" className="brand footer-brand"><img src="/assets/logo.png" alt="Flyworld Gadgets" /></a><p>Professional multi-brand drone repair in Noida.</p></div><div><p className="footer-label">Explore</p><a href="#services">Repair Services</a><a href="#book">Book Repair</a><a href="#faq">FAQ</a></div><div><p className="footer-label">Contact</p><a href={BUSINESS.tel}>{BUSINESS.phone}</a><a href={BUSINESS.emailLink}>{BUSINESS.email}</a><a href={BUSINESS.mapsUrl} target="_blank" rel="noreferrer">Get directions</a></div><div><p className="footer-label">Visit</p>{BUSINESS.address.map((line) => <span key={line}>{line}</span>)}<p className="footer-label footer-label-secondary">Registered Office</p>{BUSINESS.registeredOffice.map((line) => <span key={line}>{line}</span>)}</div></div><div className="page-width footer-bottom"><span>© {new Date().getFullYear()} Fly World Gadget</span><span>Repair warranty — discuss on call</span></div></footer><a className="floating-wa" href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle size={22} /></a>
  </div>;
}
