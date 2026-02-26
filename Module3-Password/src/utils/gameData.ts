export interface PasswordAnalysis {
  time: string;
  seconds: number;
  color: string;
  entropy: number;
  score: number;
  findings: { label: string; severity: 'low' | 'medium' | 'high' | 'secure'; message: string }[];
}

export const analyzePassword = (password: string): PasswordAnalysis => {
  if (!password) return { time: "N/A", seconds: 0, color: "text-zinc-500", entropy: 0, score: 0, findings: [] };

  const findings: PasswordAnalysis['findings'] = [];
  let score = 0;

  if (password.length < 8) {
    findings.push({ label: "Lengte", severity: 'high', message: "Veel te kort. Binnen seconden gekraakt." });
  } else if (password.length < 12) {
    findings.push({ label: "Lengte", severity: 'medium', message: "Acceptabel, maar kwetsbaar voor moderne GPU's." });
    score += 20;
  } else {
    findings.push({ label: "Lengte", severity: 'secure', message: "Uitstekende lengte." });
    score += 40;
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  
  const diversityCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
  if (diversityCount >= 3) score += 20;

  const commonPatterns = [
    { reg: /123|abc|qwerty|asdf/i, msg: "Toetsenbordpatroon gedetecteerd." },
    { reg: /(.)\1{2,}/, msg: "Herhalende tekens gedetecteerd." },
    { reg: /password|wachtwoord|welkom|admin/i, msg: "Bevat een veelgebruikt basiswoord." },
    { reg: /(19|20)\d{2}/, msg: "Jaartal gedetecteerd." }
  ];

  commonPatterns.forEach(p => {
    if (p.reg.test(password)) {
      findings.push({ label: "Patroon", severity: 'high', message: p.msg });
      score -= 15;
    }
  });

  let charsetSize = 0;
  if (hasLower) charsetSize += 26;
  if (hasUpper) charsetSize += 26;
  if (hasNumber) charsetSize += 10;
  if (hasSymbol) charsetSize += 32;

  const entropy = Math.log2(Math.pow(charsetSize, password.length));
  const guessesPerSecond = 10_000_000_000;
  const seconds = Math.pow(2, entropy) / guessesPerSecond;

  let timeStr = "";
  let color = "";

  if (seconds < 1) { timeStr = "Direct"; color = "text-red-600"; }
  else if (seconds < 60) { timeStr = `${Math.floor(seconds)} sec`; color = "text-red-500"; }
  else if (seconds < 3600) { timeStr = `${Math.floor(seconds / 60)} min`; color = "text-orange-500"; }
  else if (seconds < 86400) { timeStr = `${Math.floor(seconds / 3600)} uur`; color = "text-yellow-500"; }
  else if (seconds < 31536000) { timeStr = `${Math.floor(seconds / 86400)} dagen`; color = "text-yellow-400"; }
  else if (seconds < 3153600000) { timeStr = `${Math.floor(seconds / 31536000)} jaar`; color = "text-green-400"; }
  else { timeStr = "Eeuwen"; color = "text-emerald-500"; score += 40; }

  return { time: timeStr, seconds, color, entropy, score: Math.max(0, Math.min(100, score)), findings };
};

export interface Challenge {
  id: number;
  type: 'structure' | 'habit' | 'analysis' | 'technical';
  question: string;
  options: { text: string; correct: boolean; feedback: string }[];
}

export const challenges: Challenge[] = [
  {
    id: 1,
    question: "Wat is de belangrijkste factor voor een onkraakbaar wachtwoord?",
    type: 'structure',
    options: [
      { text: "Complexiteit", correct: false, feedback: "Fout! Lengte is belangrijker." },
      { text: "Lengte (12+ tekens)", correct: true, feedback: "Correct! Lengte verhoogt de entropie exponentieel." },
      { text: "Regelmatige wijziging", correct: false, feedback: "Achterhaald advies." }
    ]
  },
  {
    id: 2,
    question: "Waarom is 'P@ssw0rd123!' een slecht wachtwoord?",
    type: 'analysis',
    options: [
      { text: "Te kort", correct: false, feedback: "Niet het hoofdprobleem." },
      { text: "Voorspelbaar patroon", correct: true, feedback: "Juist! Hackers kennen 'leetspeak' patronen." },
      { text: "Geen spaties", correct: false, feedback: "Spaties zijn goed, maar niet de reden." }
    ]
  },
  {
    id: 3,
    question: "Wat is een 'Wachtzin' (Passphrase)?",
    type: 'structure',
    options: [
      { text: "Wachtwoord dat je uitspreekt", correct: false, feedback: "Nee." },
      { text: "Reeks willekeurige woorden", correct: true, feedback: "Correct! Bijv: 'Koffie-Zon-Fiets-2025'." },
      { text: "Zin uit een boek", correct: false, feedback: "Te voorspelbaar." }
    ]
  },
  {
    id: 4,
    question: "Welke verbetering maakt een wachtwoord ECHT sterker?",
    type: 'analysis',
    options: [
      { text: "Een '1' aan het einde", correct: false, feedback: "Eerste wat een hacker probeert." },
      { text: "Willekeurig symbool in het midden", correct: false, feedback: "Helpt weinig." },
      { text: "Extra willekeurige woorden", correct: true, feedback: "Absoluut! Meer lengte = meer veiligheid." }
    ]
  },
  {
    id: 5,
    question: "Wat is 'Brute Force'?",
    type: 'technical',
    options: [
      { text: "Fysiek geweld gebruiken", correct: false, feedback: "Nee, het is een digitale aanval." },
      { text: "Alle mogelijke combinaties proberen", correct: true, feedback: "Juist. Computers proberen miljarden opties per seconde." },
      { text: "Iemand dwingen zijn wachtwoord te geven", correct: false, feedback: "Dat is social engineering." }
    ]
  },
  {
    id: 6,
    question: "Wat is het gevaar van hetzelfde wachtwoord overal gebruiken?",
    type: 'habit',
    options: [
      { text: "Je vergeet het sneller", correct: false, feedback: "Juist niet, maar het is onveilig." },
      { text: "Credential Stuffing", correct: true, feedback: "Correct! Eén lek betekent dat al je accounts gevaar lopen." },
      { text: "Het systeem wordt traag", correct: false, feedback: "Heeft geen invloed op snelheid." }
    ]
  },
  {
    id: 7,
    question: "Wat doet een 'Password Manager'?",
    type: 'technical',
    options: [
      { text: "Wachtwoorden opschrijven in een boekje", correct: false, feedback: "Nee, dat is onveilig." },
      { text: "Unieke, sterke wachtwoorden genereren en opslaan", correct: true, feedback: "Juist! Je hoeft alleen nog maar één hoofdwachtwoord te onthouden." },
      { text: "Wachtwoorden naar je mail sturen", correct: false, feedback: "Mail is vaak onveilig." }
    ]
  },
  {
    id: 8,
    question: "Wat is MFA (Multi-Factor Authenticatie)?",
    type: 'technical',
    options: [
      { text: "Meerdere wachtwoorden achter elkaar", correct: false, feedback: "Nee." },
      { text: "Een extra code via app of SMS", correct: true, feedback: "Correct! Een tweede laag beveiliging naast je wachtwoord." },
      { text: "Inloggen met meerdere personen", correct: false, feedback: "Zeker niet!" }
    ]
  },
  {
    id: 9,
    question: "Is een vingerafdruk veiliger dan een wachtwoord?",
    type: 'technical',
    options: [
      { text: "Ja, altijd", correct: false, feedback: "Biometrie kan ook worden nagemaakt of geforceerd." },
      { text: "Het is een goede aanvulling (MFA)", correct: true, feedback: "Juist. Gebruik het als extra factor, niet als enige." },
      { text: "Nee, nooit", correct: false, feedback: "Het is handig, maar heeft beperkingen." }
    ]
  },
  {
    id: 10,
    question: "Wat is 'Social Engineering'?",
    type: 'habit',
    options: [
      { text: "Programmeren voor sociale media", correct: false, feedback: "Nee." },
      { text: "Mensen manipuleren om info te geven", correct: true, feedback: "Correct! Hackers bellen vaak als 'IT-support'." },
      { text: "Een virus verspreiden via Facebook", correct: false, feedback: "Dat is malware." }
    ]
  },
  {
    id: 11,
    question: "Waarom zijn openbare Wi-Fi netwerken gevaarlijk voor wachtwoorden?",
    type: 'technical',
    options: [
      { text: "Ze zijn te traag", correct: false, feedback: "Niet het beveiligingsrisico." },
      { text: "Man-in-the-Middle aanvallen", correct: true, feedback: "Juist! Hackers kunnen je data onderscheppen." },
      { text: "Je batterij gaat sneller leeg", correct: false, feedback: "Irrelevant." }
    ]
  },
  {
    id: 12,
    question: "Wat moet je doen als je een 'data breach' melding krijgt?",
    type: 'habit',
    options: [
      { text: "Negeren, het is vast spam", correct: false, feedback: "Gevaarlijk! Controleer de bron." },
      { text: "Direct je wachtwoord wijzigen op dat platform", correct: true, feedback: "Correct! En overal waar je hetzelfde wachtwoord gebruikte." },
      { text: "Je computer formatteren", correct: false, feedback: "Meestal niet nodig voor een account-lek." }
    ]
  },
  {
    id: 13,
    question: "Wat is een 'Honeytoken'?",
    type: 'technical',
    options: [
      { text: "Een nep-wachtwoord om hackers te lokken", correct: true, feedback: "Correct! Als dit gebruikt wordt, weet IT dat er een indringer is." },
      { text: "Een digitale munt voor hackers", correct: false, feedback: "Nee." },
      { text: "Een heel zoet wachtwoord", correct: false, feedback: "Grapjas." }
    ]
  },
  {
    id: 14,
    question: "Wat is 'Shoulder Surfing'?",
    type: 'habit',
    options: [
      { text: "Surfen op het web via je schouder", correct: false, feedback: "Nee." },
      { text: "Iemand die over je schouder meekijkt", correct: true, feedback: "Juist! Let op in de trein of op kantoor." },
      { text: "Een nieuwe sport voor hackers", correct: false, feedback: "Nee." }
    ]
  },
  {
    id: 15,
    question: "Welke browser-functie is riskant voor wachtwoorden?",
    type: 'technical',
    options: [
      { text: "Incognito modus", correct: false, feedback: "Juist veiliger in sommige gevallen." },
      { text: "Wachtwoorden opslaan zonder hoofdwachtwoord", correct: true, feedback: "Correct! Iedereen met toegang tot je PC kan ze dan zien." },
      { text: "Bladwijzers", correct: false, feedback: "Onschadelijk." }
    ]
  },
  {
    id: 16,
    question: "Wat is 'Salting' in database-beveiliging?",
    type: 'technical',
    options: [
      { text: "Wachtwoorden zouter maken", correct: false, feedback: "Nee." },
      { text: "Willekeurige data toevoegen voor het hashen", correct: true, feedback: "Juist! Dit maakt 'rainbow table' aanvallen onmogelijk." },
      { text: "Wachtwoorden bewaren in een zoutmijn", correct: false, feedback: "Nee." }
    ]
  },
  {
    id: 17,
    question: "Wat is een 'Dictionary Attack'?",
    type: 'technical',
    options: [
      { text: "Iemand slaan met een woordenboek", correct: false, feedback: "Nee." },
      { text: "Lijsten met veelgebruikte woorden proberen", correct: true, feedback: "Correct! Daarom zijn simpele woorden onveilig." },
      { text: "Wachtwoorden vertalen", correct: false, feedback: "Nee." }
    ]
  },
  {
    id: 18,
    question: "Mag je je wachtwoord delen met de IT-afdeling?",
    type: 'habit',
    options: [
      { text: "Ja, zij moeten overal bij kunnen", correct: false, feedback: "Nee! Echte IT vraagt NOOIT om je wachtwoord." },
      { text: "Nee, nooit", correct: true, feedback: "Juist. Houd je geheimen voor jezelf." },
      { text: "Alleen via een beveiligde chat", correct: false, feedback: "Nog steeds niet doen." }
    ]
  },
  {
    id: 19,
    question: "Wat is 'Credential Harvesting'?",
    type: 'technical',
    options: [
      { text: "Wachtwoorden oogsten via nep-inlogpagina's", correct: true, feedback: "Correct! Vaak via phishing mails." },
      { text: "Wachtwoorden verkopen op de markt", correct: false, feedback: "Dat is de stap erna." },
      { text: "Wachtwoorden planten in een database", correct: false, feedback: "Nee." }
    ]
  },
  {
    id: 20,
    question: "Wat is de beste manier om MFA te gebruiken?",
    type: 'technical',
    options: [
      { text: "SMS codes", correct: false, feedback: "Beter dan niets, maar SMS kan onderschept worden (SIM-swapping)." },
      { text: "Authenticator Apps of Hardware Keys", correct: true, feedback: "Juist! Dit zijn de veiligste methodes." },
      { text: "E-mail codes", correct: false, feedback: "Minder veilig als je mail ook gehackt is." }
    ]
  }
];
