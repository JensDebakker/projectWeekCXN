import { SocialPost, PhishingStep } from "./types";

export const EMPLOYEES = [
  { name: "Tom De Smet", role: "Systeembeheerder" },
  { name: "Jan Peeters", role: "Finance Manager" },
  { name: "Sarah Wouters", role: "Accountant" },
  { name: "Anouk Maes", role: "HR Director" },
  { name: "Kevin Vandevelde", role: "Helpdesk Medewerker" }
];

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 1,
    platform: "LinkedIn",
    author: "Tom De Smet",
    role: "Systeembeheerder bij ConXioN",
    avatar: "TS",
    timestamp: "2u geleden",
    content: [
      { text: "Eerste werkdag bij " },
      { text: "ConXioN", isDangerous: true, type: "company", reason: "Bevestigt je werkplek en doelwit.", severity: "orange", tip: "Wees voorzichtig met het taggen van je bedrijf in elke post." },
      { text: "! Super blij met mijn nieuwe rol als " },
      { text: "Systeembeheerder", isDangerous: true, type: "role", reason: "Aanvallers zoeken naar IT-personeel voor admin-toegang.", severity: "red", tip: "Specifieke functietitels maken je een 'high-value target'." },
      { text: ". Nu nog even wachten tot mijn admin-rechten voor de " },
      { text: "Azure-omgeving", isDangerous: true, type: "tech", reason: "Specifieke technologie helpt bij het kiezen van de juiste aanvalsmethode.", severity: "red", tip: "Noem nooit specifieke software of cloud-omgevingen." },
      { text: " zijn goedgekeurd. #nieuwebaan #IT" }
    ]
  },
  {
    id: 2,
    platform: "Twitter",
    author: "Jan Peeters",
    role: "@JanFinance",
    avatar: "JP",
    timestamp: "4u geleden",
    content: [
      { text: "Kan iemand van de helpdesk me helpen? Mijn " },
      { text: "VPN verbinding", isDangerous: true, type: "tech", reason: "Onthult hoe medewerkers van buitenaf inloggen.", severity: "orange", tip: "Vraag technische hulp via interne kanalen, niet publiek." },
      { text: " via " },
      { text: "Cisco AnyConnect", isDangerous: true, type: "tech", reason: "Specifieke softwareversies hebben vaak bekende kwetsbaarheden.", severity: "red", tip: "Het noemen van specifieke tools geeft aanvallers een blauwdruk." },
      { text: " valt steeds weg als ik thuiswerk. Groetjes, Jan (Finance)." }
    ]
  },
  {
    id: 3,
    platform: "LinkedIn",
    author: "Sarah Wouters",
    role: "Accountant bij ConXioN",
    avatar: "SW",
    timestamp: "1d geleden",
    content: [
      { text: "Heerlijk, twee weken offline! Ik ben " },
      { text: "op vakantie tot 3 maart", isDangerous: true, type: "absence", reason: "Ideaal moment voor aanvallers om zich als jou voor te doen.", severity: "red", tip: "Deel vakantieplannen pas nadat je terug bent." },
      { text: ". Voor dringende facturen van leverancier " },
      { text: "Combell", isDangerous: true, type: "vendor", reason: "Aanvallers kunnen nu een valse factuur sturen namens deze partij.", severity: "red", tip: "Noem geen namen van leveranciers of partners." },
      { text: " kunnen jullie bij mijn collega " },
      { text: "Sarah", isDangerous: true, type: "name", reason: "Geeft de aanvaller een nieuwe naam om te misbruiken.", severity: "orange", tip: "Verwijs naar een algemene mailbox in plaats van een persoon." },
      { text: " terecht." }
    ]
  },
  {
    id: 4,
    platform: "X",
    author: "Anouk Maes",
    role: "@AnoukHR",
    avatar: "AM",
    timestamp: "3u geleden",
    content: [
      { text: "Trots op ons team! Vandaag een geweldige workshop gehad over " },
      { text: "Microsoft 365 beveiliging", isDangerous: true, type: "tech", reason: "Onthult de productiviteitsstack van het bedrijf.", severity: "orange", tip: "Houd interne trainingen en tools privé." },
      { text: ". Dank aan de trainers van " },
      { text: "CyberSafe", isDangerous: true, type: "vendor", reason: "Geeft inzicht in wie jullie security regelt.", severity: "orange", tip: "Partners hoeven niet altijd getagd te worden." },
      { text: "!" }
    ]
  },
  {
    id: 5,
    platform: "LinkedIn",
    author: "Kevin Vandevelde",
    role: "Helpdesk bij ConXioN",
    avatar: "KV",
    timestamp: "5u geleden",
    content: [
      { text: "Drukke dag bij de " },
      { text: "IT-helpdesk", isDangerous: true, type: "role", reason: "Helpdeskmedewerkers zijn de perfecte vermomming voor phishing.", severity: "red", tip: "Wees discreet over je specifieke dagelijkse taken." },
      { text: " van ConXioN. Veel vragen over de nieuwe " },
      { text: "multi-factor authenticatie", isDangerous: true, type: "tech", reason: "Aanvallers kunnen nu een 'MFA fatigue' aanval voorbereiden.", severity: "red", tip: "Beveiligingsmaatregelen bespreken we alleen intern." },
      { text: " uitrol." }
    ]
  }
];

export const PHISHING_STEPS: PhishingStep[] = [
  {
    id: "victim",
    title: "Kies een slachtoffer",
    options: [
      { id: "v1", label: "Jan Peeters (Finance)", value: "Jan Peeters", isBest: true, requiredInfoType: "name" },
      { id: "v2", label: "Tom De Smet (IT)", value: "Tom De Smet", requiredInfoType: "role" },
      { id: "v3", label: "Anouk Maes (HR)", value: "Anouk Maes", requiredInfoType: "role" }
    ]
  },
  {
    id: "greeting",
    title: "Kies een aanhef",
    options: [
      { id: "g1", label: "Beste Jan,", value: "Beste Jan,", isBest: true, requiredInfoType: "name" },
      { id: "g2", label: "Geachte heer/mevrouw,", value: "Geachte heer/mevrouw," },
      { id: "g3", label: "Hallo Jan Janssen,", value: "Hallo Jan Janssen," }
    ]
  },
  {
    id: "subject",
    title: "Kies een onderwerp",
    options: [
      { id: "s1", label: "Dringende factuur Combell", value: "Dringende factuur Combell", isBest: true, requiredInfoType: "vendor" },
      { id: "s2", label: "Update Azure-omgeving", value: "Update Azure-omgeving", requiredInfoType: "tech" },
      { id: "s3", label: "VPN probleem oplossen", value: "VPN probleem oplossen", requiredInfoType: "tech" }
    ]
  },
  {
    id: "content",
    title: "Kies de inhoud",
    options: [
      { 
        id: "c1", 
        label: "Gepersonaliseerd (Combell + Vakantie)", 
        value: "Omdat Sarah momenteel op vakantie is tot 3 maart, sturen wij deze dringende factuur van Combell direct naar u. Gelieve deze voor morgen te voldoen via onderstaande link.", 
        isBest: true,
        requiredInfoType: "absence"
      },
      { 
        id: "c2", 
        label: "Technisch (VPN + Azure)", 
        value: "Er is een probleem gedetecteerd met uw Cisco AnyConnect VPN verbinding in de Azure-omgeving. Klik hier om uw inloggegevens te verifiëren.", 
        isBest: false,
        requiredInfoType: "tech"
      },
      { 
        id: "c3", 
        label: "Algemeen", 
        value: "Er staat een belangrijk document voor u klaar in het portaal. Log in om het te bekijken.", 
        isBest: false 
      }
    ]
  },
  {
    id: "sender",
    title: "Kies een valse afzender",
    options: [
      { id: "sn1", label: "administratie@combell-facturen.be", value: "administratie@combell-facturen.be", isBest: true, requiredInfoType: "vendor" },
      { id: "sn2", label: "it-support@conxion.be", value: "it-support@conxion.be", requiredInfoType: "company" },
      { id: "sn3", label: "no-reply@microsoft-azure.com", value: "no-reply@microsoft-azure.com", requiredInfoType: "tech" }
    ]
  }
];
