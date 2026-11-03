/* =====================================================================
   All portfolio content lives here — edit this file to update the site.
   Sources: CV_Dr. Deviprasad_Sahoo_2026, Google Sites page, Google Scholar profile.
   ===================================================================== */

/* Profile links. Paste your real URLs; entries with an empty url are hidden. */
window.PROFILE_LINKS = [
  { name: "Personal website", icon: "🌐", color: "i-blue",   url: "https://sites.google.com/view/dr-deviprasad-sahoo/home" },
  { name: "Google Scholar",   icon: "🎓", color: "i-blue",   url: "https://scholar.google.co.in/citations?user=Yt-PWOQAAAAJ&hl=en" },
  { name: "ORCID",            icon: "iD", color: "i-green",  url: "https://orcid.org/0000-0002-4767-0269" },
  { name: "LinkedIn",         icon: "in", color: "i-blue",   url: "https://www.linkedin.com/in/dr-deviprasad-sahoo-26189b235" },
  { name: "Scopus",           icon: "S",  color: "i-orange", url: "https://www.scopus.com/authid/detail.uri?authorId=56089384100" },
  { name: "Web of Science",   icon: "W",  color: "i-purple", url: "https://www.webofscience.com/wos/author/record/GVR-7795-2022" },
  
];

window.EXPERIENCE = [
  {
    role: "Postdoctoral Researcher — Attosecond Photonics",
    org: "HUN-REN Wigner Research Centre for Physics, Budapest, Hungary",
    when: "Mar 2026 – present", icon: "⏱", color: "i-purple", current: true,
    points: [
      "Built a TIPTOE field-sampling setup for attosecond metrology, driven by a sub-5.5 fs CEP-stable Ti:sapphire oscillator.",
      "Performed attosecond spectroscopy using tunnelling-ionization mechanisms in III–V semiconductors.",
      "Optimised time- and field-resolved nonlinear-optical metrology: Z-scan, chirp correction and CEP-dependent measurements for petahertz photonics.",
      "Current focus: field-resolved observation of second-harmonic generation and pulse-energy shifting in a birefringent crystal."
    ]
  },
  {
    role: "Postdoctoral Fellow — Femtosecond Photonics",
    org: "Indian Institute of Technology Madras, Department of Physics, India",
    when: "Oct 2025 – Mar 2026", icon: "∿", color: "i-blue",
    points: [
      "Developed a custom pump–probe setup for transient-absorption spectroscopy to characterise 2D MXenes.",
      "Performed high-harmonic generation experiments in an ultra-high-vacuum beamline driven by a 30 fs CPA Ti:sapphire laser."
    ]
  },
  {
    role: "Postdoctoral Research Associate — Energy Materials & Devices",
    org: "CIPET: SARP – LARPM (R&D), Bhubaneswar, India",
    when: "Dec 2023 – Oct 2025", icon: "⌬", color: "i-green",
    points: [
      "Fabricated wearable PVDF–MXene nanofibre self-powered sensors (TENG/PENG); benchmarked 2D nanofillers (MXene, hBN, rGO). Published in Advanced Materials Technologies (2025).",
      "Synthesised and characterised MXene 2D materials (Ti₃C₂, Nb₂C, Ti₂N, Ti₃CN) via etching routes (HF, LiF, hydrothermal) for HER, OER and photodetection.",
      "Built a YOLO + ByteTrack computer-vision pipeline (Python, Ultralytics, PyTorch, OpenCV) with pixel-to-mm calibration for automated bubble detection.",
      "Synthesised 3 polymer-composite systems (PDMS, PEDOT:PSS, cellulose aerogel) for TENG/PENG energy harvesting; simulated and prototyped devices in COMSOL Multiphysics and CAD."
    ]
  },
  {
    role: "Postdoctoral Research Associate",
    org: "Fakir Mohan University, Balasore, India",
    when: "Jul 2023 – Dec 2023", icon: "⚗", color: "i-orange",
    points: ["Characterised energy-storage materials by LSV, CV and electrochemical impedance spectroscopy."]
  }
];

window.EDUCATION = [
  {
    role: "Ph.D. in Physics", org: "Institute of Chemical Technology, Mumbai, India", when: "2019 – 2023", icon: "🎓", color: "i-purple",
    points: [
      "Thesis: Structural, morphological and optical study of doped As–Se films under different energy treatments.",
      "Fabricated As–Se chalcogenide semiconductor thin films by thermal and e-beam evaporation, and characterised their structure, morphology and nonlinear optics.",
      "Engineered defects through controlled energy–matter routes: laser irradiation, low-energy ion implantation and thermal annealing.",
      "Performed pump–probe and fluence-dependent ion-irradiation experiments, measured nonlinear optical parameters, and designed optical setups.",
      "Studied frequency- and temperature-dependent dielectric and impedance response of hydrothermally synthesised Cu–Ni–Sn–S chalcopyrite materials."
    ]
  },
  { role: "M.Sc. in Physics", org: "Fakir Mohan University, Balasore, India", when: "2016 – 2018", icon: "Σ", color: "i-blue", points: [] },
  { role: "B.Sc. (Hons.) in Physics", org: "Maharishi College of Natural Law, Utkal University, Bhubaneswar, India", when: "2013 – 2016", icon: "∫", color: "i-teal", points: [] }
];

window.SKILLS = [
  { tab: "Ultrafast optics", icon: "⚡", items: ["Few-cycle CEP-stable Ti:sapphire oscillators (sub-5.5 fs, 800 nm, 80 MHz)", "CPA amplifiers (800 nm, 30 fs)", "TIPTOE field sampling", "High-harmonic generation in gases", "Transient-absorption spectroscopy", "Pump–probe & autocorrelation", "Z-scan", "Femtosecond beam metrology & alignment"] },
  { tab: "Synthesis", icon: "⚗", items: ["Thermal evaporation", "E-beam evaporation", "Electrospinning", "Hydro/solvothermal synthesis", "MXene etching (HF, LiF, hydrothermal)"] },
  { tab: "Characterisation", icon: "🔬", items: ["XRD", "Raman", "UV-Vis-NIR", "FTIR", "FESEM", "HR-TEM", "TGA", "Electrochemical workstation (CV, LSV, EIS)", "Low-energy ion implantation"] },
  { tab: "Devices", icon: "⌬", items: ["Triboelectric nanogenerators", "Piezoelectric nanogenerators", "Wearable pulse sensors", "Photodetectors", "Supercapacitors", "FDM 3D printing"] },
  { tab: "Electronics", icon: "〰", items: ["Transimpedance amplification", "Low-noise preamplification", "Source-meter", "Electrometer", "LCR meter"] },
  { tab: "Code & modelling", icon: "</>", items: ["Python", "MATLAB", "Machine learning", "Computer vision (YOLO, ByteTrack, OpenCV, PyTorch)", "COMSOL Multiphysics", "Ansys", "Fusion 360", "SolidWorks", "C/C++"] },
  { tab: "Lab build-out", icon: "🛠", items: ["Specifying optical & electronic instruments", "Procurement", "Commissioning", "Custom ultrafast setups from scratch"] }
];

/* Google Scholar metrics (profile user=Yt-PWOQAAAAJ, retrieved 3 Nov 2026) — update when they change */
window.SCHOLAR = {
  asOf: "Nov 2026",
  citations: 988, citationsSince2021: 983,
  hIndex: 18, i10Index: 21,
  interests: ["Semiconductors", "Ultrafast Photonics", "Attosecond Spectroscopy", "MXene", "Energy Device"],
  perYear: { 2020: 4, 2021: 27, 2022: 149, 2023: 196, 2024: 170, 2025: 231, 2026: 209 },
  underReview: 2,
  cumulativeIF: ">100"
};

/* 28 publications (titles, authors, venues and "cited by" from Google Scholar).
   type: article | review | proc | chapter ; first: first-author ; cites: Scholar "cited by" (null = not listed).
   Counts shown on the site (total, first-author, per type) are computed from this list.
   Not counted (Scholar artefacts): the RSC Advances 2023 Correction (13, 29342) and a duplicate
   Scholar entry of the 2021 in-situ laser-irradiation paper. */
window.PUBLICATIONS = [
  // ---- Journal articles & reviews (22) ----
  { type: "review",  first: true,  year: 2022, cites: 96, authors: "Sahoo D, Naik R", title: "GSST phase change materials and its utilization in optoelectronic devices: A review", venue: "Materials Research Bulletin", details: "148, 111679" },
  { type: "article", first: true,  year: 2022, cites: 93, authors: "Sahoo D, Sahoo S, Alagarasan D, Ganesan R, Varadharajaperumal S, Naik R", title: "Proton ion irradiation on As<sub>40</sub>Se<sub>50</sub>Sb<sub>10</sub> thin films: fluence-dependent tuning of linear–nonlinear optical properties for photonic applications", venue: "ACS Applied Electronic Materials", details: "4 (2), 856–868" },
  { type: "article", first: true,  year: 2020, cites: 87, authors: "Sahoo D, Priyadarshini P, Aparimita A, Alagarasan D, Ganesan R, Varadharajaperumal S, Naik R", title: "Role of annealing temperature on optimizing the linear and nonlinear optical properties of As<sub>40</sub>Se<sub>50</sub>Ge<sub>10</sub> films", venue: "RSC Advances", details: "10 (45), 26675–26685" },
  { type: "article", first: true,  year: 2021, cites: 75, authors: "Sahoo D, Priyadarshini P, Dandela R, Alagarasan D, Ganesan R, Varadharajaperumal S, Naik R", title: "In situ laser irradiation: the kinetics of the changes in the nonlinear/linear optical parameters of As<sub>50</sub>Se<sub>40</sub>Sb<sub>10</sub> thin films for photonic applications", venue: "RSC Advances", details: "11 (26), 16015–16025 · Correction: 13 (42), 29342 (2023)" },
  { type: "article", first: false, year: 2021, cites: 69, authors: "Priyadarshini P, Sahoo D, Alagarasan D, Ganesan R, Varadharajaperumal S, Naik R", title: "Structural and optoelectronic properties change in Bi/In<sub>2</sub>Se<sub>3</sub> heterostructure films by thermal annealing and laser irradiation", venue: "Journal of Applied Physics", details: "129 (22), 223101" },
  { type: "article", first: false, year: 2022, cites: 65, authors: "Parida A, Sahoo D, Alagarasan D, Vardhrajaperumal S, Ganesan R, Naik R", title: "Increase in nonlinear susceptibility and refractive index in quaternary In<sub>15</sub>Sb<sub>10</sub>S<sub>15</sub>Se<sub>60</sub> thin films upon annealing at different temperature for photonic applications", venue: "Journal of Alloys and Compounds", details: "905, 164143" },
  { type: "article", first: true,  year: 2021, cites: 65, authors: "Sahoo D, Priyadarshini P, Aparimita A, Alagarasan D, Ganesan R, Varadharajaperumal S, Naik R", title: "Optimization of linear and nonlinear optical parameters of As<sub>40</sub>Se<sub>50</sub>Te<sub>10</sub> thin films by thermal annealing", venue: "Optics & Laser Technology", details: "140, 107036" },
  { type: "article", first: true,  year: 2020, cites: 54, authors: "Sahoo D, Priyadarshini P, Dandela R, Alagarasan D, Ganesan R, Varadharajaperumal S, Naik R", title: "Optimization of linear and nonlinear optical parameters in As<sub>40</sub>Se<sub>60</sub> film by annealing at different temperature", venue: "Optik", details: "219, 165286" },
  { type: "review",  first: true,  year: 2022, cites: 51, authors: "Sahoo D, Naik R", title: "A review on the linear/nonlinear optical properties of Se doped chalcogenide thin films as potential optoelectronic applications", venue: "Journal of Non-Crystalline Solids", details: "597, 121934" },
  { type: "review",  first: true,  year: 2022, cites: 34, authors: "Sahoo D, Senapati S, Naik R", title: "Progress and prospects of 2D VS<sub>2</sub> transition metal dichalcogenides", venue: "FlatChem", details: "36, 100455" },
  { type: "article", first: true,  year: 2022, cites: 29, authors: "Sahoo D, Alagarasan D, Ganesan R, Varadharajaperumal S, Naik R", title: "Impact of irradiation doses on the structural, morphological, and linear–nonlinear optical properties of Ge<sub>10</sub>Sb<sub>25</sub>Se<sub>65</sub> thin films for optoelectronic applications", venue: "The European Physical Journal Plus", details: "137 (6), 707" },
  { type: "article", first: true,  year: 2023, cites: 28, authors: "Sahoo D, Senapati S, Samal S, Varadharajaperumal S, Naik R", title: "Optical and dielectric characterization of nanoparticle-based Cu<sub>2</sub>Ni<sub>1+x</sub>Sn<sub>1−x</sub>S<sub>4</sub> nanosphere synthesized by facile solvothermal method", venue: "ACS Applied Engineering Materials", details: "1 (3), 1001–1012" },
  { type: "article", first: false, year: 2022, cites: 27, authors: "Parida A, Sahoo D, Alagarasan D, Varadharajaperumal S, Ganesan R, Naik R", title: "Impact on nonlinear/linear optical and structural parameters in quaternary In<sub>15</sub>Ag<sub>10</sub>S<sub>15</sub>Se<sub>60</sub> thin films upon annealing at different temperatures", venue: "Ceramics International", details: "48 (11), 15380–15389" },
  { type: "article", first: true,  year: 2021, cites: 26, authors: "Sahoo D, Priyadarshini P, Dandela R, Alagarasan D, Ganesan R, et al.", title: "Investigation of amorphous-crystalline transformation induced optical and electronic properties change in annealed As<sub>50</sub>Se<sub>50</sub> thin films", venue: "Optical and Quantum Electronics", details: "53 (4), 197" },
  { type: "review",  first: false, year: 2022, cites: 24, authors: "Priyadarshini P, Sahoo D, Naik R", title: "A review on the optical properties of some germanium based chalcogenide thin films and their applications", venue: "Optical and Quantum Electronics", details: "54 (3), 166" },
  { type: "article", first: false, year: 2022, cites: 21, authors: "Parida A, Sahoo D, Alagarasan D, Vardhrajaperumal S, Ganesan R, Naik R", title: "Enhancing the third-order nonlinearity and crystallinity by selenium incorporation in tin sulfide films (SnS<sub>1−x</sub>Se<sub>x</sub>) for optoelectronic applications", venue: "Materials Advances", details: "3 (14), 5930–5940" },
  { type: "article", first: true,  year: 2023, cites: 20, authors: "Sahoo D, Senapati S, Samal S, Bisoyi S, Naik R", title: "Facile hydrothermally synthesized nanosheets-based Cu<sub>0.06−x</sub>Ni<sub>0.03</sub>Sn<sub>0.03+x</sub>S<sub>0.12</sub> flower for optoelectronic and dielectric applications", venue: "Materials Today Electronics", details: "3, 100030" },
  { type: "article", first: true,  year: 2022, cites: 12, authors: "Sahoo D, Priyadarshini P, Alagarasan D, Ganesan R, et al.", title: "Influence of top layer on the linear and nonlinear optical parameters of Ag(Te)/As<sub>50</sub>Se<sub>50</sub> bilayer thin films", venue: "Indian Journal of Physics", details: "96 (1), 267–274" },
  { type: "article", first: true,  year: 2025, cites: 10, authors: "Sahoo D, Sahoo S, Nayak D, Mohanty S, Naik R", title: "Enhancing triboelectric performance through 2D nanofillers (MXene, hBN, rGO) in PVDF nanofiber for self-powered sensing", venue: "Advanced Materials Technologies", details: "e01141", doi: "10.1002/admt.202501141" },
  { type: "article", first: false, year: 2020, cites: 9,  authors: "Priyadarshini P, Sahoo D, Aparimita A, Alagarasan D, Ganesan R, Varadharajaperumal S, Naik R", title: "Switching of linear and nonlinear optical parameters in As<sub>35</sub>Se<sub>65</sub> thin films upon annealing at both above and below T<sub>g</sub>", venue: "Applied Physics A", details: "126 (11), 910" },
  { type: "article", first: false, year: 2025, cites: 6,  authors: "Nayak D, Mohanty S, Nayak T, Sahoo D, Palai AK, Kumar S, Panigrahi P", title: "ZnO-enhanced FRET-sensitized PMMA nanocomposites for efficient photocatalysis and antibacterial study in water purification", venue: "Surfaces and Interfaces", details: "64, 106354" },
  { type: "article", first: true,  year: 2023, cites: 6,  authors: "Sahoo D, Naik R", title: "Phase-change-driven tuning of linear and nonlinear optical properties of Te/As<sub>2</sub>Se<sub>3</sub> bilayer thin films for optoelectronic applications", venue: "Materials Science and Engineering: B", details: "297, 116750" },

  // ---- Conference proceedings (2) ----
  { type: "proc",    first: true,  year: 2023, cites: null, authors: "Sahoo D, Naik R", title: "Amorphous-crystalline phase transformation induced changes in linear and non-linear optical properties of Te/As<sub>2</sub>Se<sub>3</sub> bilayer thin films", venue: "Materials Today: Proceedings", details: "2023" },
  { type: "proc",    first: true,  year: 2020, cites: null, authors: "Sahoo D, Aparimita A, Alagarasan D, Varadharajaperumal S, Ganesan R, et al.", title: "Effect of annealing temperature on the optical and structural properties of As<sub>40</sub>Se<sub>50</sub>Ge<sub>10</sub> thin films", venue: "AIP Conference Proceedings", details: "2265 (1), 030236" },

  // ---- Book chapters (4) ----
  { type: "chapter", first: true,  year: 2021, cites: 62, authors: "Sahoo D, Bandaru R, Samal SK, Naik R, Kumar P, Kesharwani P, et al.", title: "Oral drug delivery of nanomedicine", venue: "Theory and Applications of Nonparenteral Nanomedicines (Academic Press)", details: "181–207" },
  { type: "chapter", first: false, year: 2020, cites: 11, authors: "Bandaru R, Sahoo D, Naik R, Kesharwani P, Dandela R", title: "Pathogenesis, biology, and immunology of tuberculosis", venue: "Nanotechnology Based Approaches for Tuberculosis Treatment (Academic Press)", details: "1–25" },
  { type: "chapter", first: true,  year: 2026, cites: 1,  authors: "Sahoo D, Naik R", title: "Nanoscience and nanotechnologies for photovoltaics", venue: "Handbook of Energy Materials (Springer)", details: "1273–1308" },
  { type: "chapter", first: true,  year: null, cites: null, authors: "Sahoo D, Naik R", title: "Chapter in Smart Nanomaterials", venue: "Smart Nanomaterials (Cambridge Scholars)", details: "accepted" }
];

window.AWARDS = [
  { icon: "★", color: "i-yellow", app: "European Commission", when: "2025", title: "Marie Curie Postdoctoral Fellowship - European Commission (Seal of Excellence)", text: "Marie Skłodowska-Curie Actions Postdoctoral Fellowships 2025 · Seal of Excellence." },
  { icon: "✈", color: "i-blue", app: "ANRF / SERB · Govt. of India", when: "2024", title: "International Travel Support (ITS) grant", text: "For ICEAN 2024, University of Newcastle, Australia." },
  { icon: "🏆", color: "i-orange", app: "DAE SSPS · BARC", when: "2024", title: "Young Achiever Award presentation", text: "DAE Solid State Physics Symposium 2024, BARC, India." },
  { icon: "✎", color: "i-purple", app: "Peer review", when: "", title: "Reviewer: 2 manuscripts refereed", text: "Journal of Non-Crystalline Solids · Materials Letters." },
  { icon: "❖", color: "i-teal", app: "Editorial", when: "", title: "Guest Topical Editor", text: "The Open Biomedical Engineering Journal." },
  { icon: "⚗", color: "i-red", app: "Royal Society of Chemistry", when: "", title: "Affiliate Member", text: "Professional membership." },
  { icon: "👥", color: "i-green", app: "Mentoring", when: "", title: "Mentored 3 students", text: "Research supervision and training." }
];

window.TALKS = [
  { title: "Extreme Light Infrastructure (ELI)", where: "Prague, Czech Republic", kind: "Presentation", icon: "◎", color: "i-purple" },
  { title: "ICEAN 2024", where: "University of Newcastle, Australia", kind: "Invited international presentation · ANRF/SERB travel grant", icon: "✈", color: "i-blue" },
  { title: "DAE Solid State Physics Symposium 2024", where: "BARC Mumbai", kind: "Young Achiever Award presentation", icon: "🏆", color: "i-orange" },
  { title: "DAE Solid State Physics Symposium 2021", where: "BARC Mumbai", kind: "Presentation", icon: "◇", color: "i-teal" },
  { title: "DAE Solid State Physics Symposium 2019", where: "IIT Jodhpur", kind: "Presentation", icon: "◇", color: "i-teal" },
  { title: "APA–EPNOE–GFL International Conference", where: "Jaipur, India", kind: "Invited presentation", icon: "✦", color: "i-green" },
  { title: "ISSMD 2022", where: "KIIT Bhubaneswar", kind: "Presentation", icon: "·", color: "i-red" },
  { title: "ORC 2023", where: "Sambalpur University", kind: "Presentation", icon: "·", color: "i-red" },
  { title: "Science and Technology of Functional Materials 2019", where: "SOA University, Odisha", kind: "Presentation", icon: "·", color: "i-red" }
];
