/**
 * i18n.js — Language toggle for EN / NL
 * Usage: include this script, then call i18n.applyLanguage() after DOM load.
 * All translatable elements use  data-i18n="key"  or  data-i18n-placeholder="key".
 */

const i18n = (() => {

    const translations = {
        en: {
            // ── Index page ──────────────────────────────────────────────────────
            pageTitle:          "Phishing Awareness Game",
            heading:            "Phishing Awareness",
            subtitle:           "Test your email security skills",
            namePlaceholder:    "Enter your name",
            startBtn:           "Start Game",
            alertEmpty:         "⚠️ Please enter your name to continue",
            alertShort:         "⚠️ Name must be at least 2 characters long",

            // ── Quiz page — static UI ────────────────────────────────────────
            quizTitle:          "Phishing Quiz",
            homeBtn:            "← Home",
            scoreLabel:         "Score: 0 / 0",
            questionText:       "Is this email real or phishing?",
            btnReal:            "✓ Real Email",
            btnPhishing:        "⚠ Phishing",
            nextQuestion:       "Next Question",
            playAgain:          "Play Again",
            finalMessage:       "Thank you for playing the ConXion Phishing Awareness Game.",
            fromLabel:          "From:",
            subjectLabel:       "Subject:",

            // ── Quiz page — dynamic feedback ─────────────────────────────────
            correctReal:        "✅ Correct! This was a real email. (+5 points)",
            incorrectPhishing:  "❌ Incorrect! This was a phishing email. Review the clues below. (0 points)",
            incorrectReal:      "❌ Incorrect! This was actually a real email. (0 points)",
            correctPhishing:    "✅ Correct! This is a phishing email. (+1 pt) Now spot the clues for up to +4 more!",

            // ── Checklist ────────────────────────────────────────────────────
            clueHeadingReveal:  "Here's what made this email suspicious:",
            clueHeadingScore:   "Which of the following are red flags in this email? Select all that apply:",
            clueSubmit:         "Submit Answers",
            badgeRedFlag:       "🚩 Red flag",
            badgeCorrectFlag:   "✅ Correct — this is a red flag",
            badgeMissed:        "❌ Missed — this was a red flag",
            badgeWrong:         "❌ Wrong — this is not actually a red flag",
            badgeCorrectSkip:   "✅ Correct — not a red flag",
            clueResultScore:    (pts, total, correct, totalItems) =>
                `<strong>Checklist: +${pts} pts &nbsp;|&nbsp; This question: ${total} / 5</strong><br><small>You correctly handled ${correct} of ${totalItems} checklist items.</small>`,

            // ── End game messages ─────────────────────────────────────────────
            endPerfect:         "🏆 Perfect Score! You're a cybersecurity expert!",
            endExcellent:       "🥇 Excellent! You have outstanding phishing detection skills!",
            endGood:            "🥈 Good Work! You caught most of the phishing attempts.",
            endNotBad:          "📚 Not Bad! Keep practising to sharpen your skills.",
            endKeepLearning:    "💪 Keep Learning! Phishing emails are designed to be deceptive.",
            endDetail:          (q, max, pct) => `${q} questions &nbsp;·&nbsp; max ${max} points &nbsp;·&nbsp; ${pct}% achieved`,

            // ── Misc ──────────────────────────────────────────────────────────
            homeConfirm:        "Are you sure? Your progress will be lost.",
            welcomePrefix:      "🎮 Player:",
            scorePrefix:        "Score:",
        },

        nl: {
            // ── Index page ──────────────────────────────────────────────────────
            pageTitle:          "Phishing Bewustzijnsspel",
            heading:            "Phishing Bewustzijn",
            subtitle:           "Test je e-mailbeveiligingsvaardigheden",
            namePlaceholder:    "Voer je naam in",
            startBtn:           "Spel starten",
            alertEmpty:         "⚠️ Voer je naam in om door te gaan",
            alertShort:         "⚠️ Je naam moet minimaal 2 tekens lang zijn",

            // ── Quiz page — static UI ────────────────────────────────────────
            quizTitle:          "Phishing Quiz",
            homeBtn:            "← Startpagina",
            scoreLabel:         "Score: 0 / 0",
            questionText:       "Is deze e-mail echt of phishing?",
            btnReal:            "✓ Echte e-mail",
            btnPhishing:        "⚠ Phishing",
            nextQuestion:       "Volgende vraag",
            playAgain:          "Opnieuw spelen",
            finalMessage:       "Bedankt voor het spelen van het ConXion Phishing Bewustzijnsspel.",
            fromLabel:          "Van:",
            subjectLabel:       "Onderwerp:",

            // ── Quiz page — dynamic feedback ─────────────────────────────────
            correctReal:        "✅ Juist! Dit was een echte e-mail. (+5 punten)",
            incorrectPhishing:  "❌ Onjuist! Dit was een phishing e-mail. Bekijk de aanwijzingen hieronder. (0 punten)",
            incorrectReal:      "❌ Onjuist! Dit was eigenlijk een echte e-mail. (0 punten)",
            correctPhishing:    "✅ Juist! Dit is een phishing e-mail. (+1 pt) Spot nu de aanwijzingen voor maximaal +4 extra!",

            // ── Checklist ────────────────────────────────────────────────────
            clueHeadingReveal:  "Dit maakte deze e-mail verdacht:",
            clueHeadingScore:   "Welke van de volgende zijn rode vlaggen in deze e-mail? Selecteer alles wat van toepassing is:",
            clueSubmit:         "Antwoorden indienen",
            badgeRedFlag:       "🚩 Rode vlag",
            badgeCorrectFlag:   "✅ Juist — dit is een rode vlag",
            badgeMissed:        "❌ Gemist — dit was een rode vlag",
            badgeWrong:         "❌ Fout — dit is geen rode vlag",
            badgeCorrectSkip:   "✅ Juist — geen rode vlag",
            clueResultScore:    (pts, total, correct, totalItems) =>
                `<strong>Checklist: +${pts} pt &nbsp;|&nbsp; Deze vraag: ${total} / 5</strong><br><small>Je hebt ${correct} van de ${totalItems} checklistitems correct beantwoord.</small>`,

            // ── End game messages ─────────────────────────────────────────────
            endPerfect:         "🏆 Perfecte score! Je bent een cyberbeveiligingsexpert!",
            endExcellent:       "🥇 Uitstekend! Je hebt geweldige phishing-detectievaardigheden!",
            endGood:            "🥈 Goed gedaan! Je hebt de meeste phishingpogingen ontdekt.",
            endNotBad:          "📚 Niet slecht! Blijf oefenen om je vaardigheden aan te scherpen.",
            endKeepLearning:    "💪 Blijf leren! Phishing e-mails zijn ontworpen om te misleiden.",
            endDetail:          (q, max, pct) => `${q} vragen &nbsp;·&nbsp; max ${max} punten &nbsp;·&nbsp; ${pct}% behaald`,

            // ── Misc ──────────────────────────────────────────────────────────
            homeConfirm:        "Weet je het zeker? Je voortgang gaat verloren.",
            welcomePrefix:      "🎮 Speler:",
            scorePrefix:        "Score:",
        }
    };

    // ── Active language (persisted) ──────────────────────────────────────────
    let currentLang = localStorage.getItem("lang") || "en";

    function t(key) {
        return (translations[currentLang] || translations.en)[key] || key;
    }

    function setLang(lang) {
        currentLang = lang;
        localStorage.setItem("lang", lang);
        applyLanguage();
        // Notify any page-specific listeners (e.g. quiz page needs to refresh dynamic text)
        document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang } }));
    }

    function getLang() { return currentLang; }

    /**
     * Apply translations to all elements with data-i18n or data-i18n-placeholder.
     * Also updates the document title if a <title data-i18n="..."> exists.
     */
    function applyLanguage() {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            const val = t(key);
            if (typeof val === "string") el.textContent = val;
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.getAttribute("data-i18n-placeholder");
            const val = t(key);
            if (typeof val === "string") el.placeholder = val;
        });
        // Update <title>
        const titleEl = document.querySelector("title[data-i18n]");
        if (titleEl) document.title = t(titleEl.getAttribute("data-i18n"));

        // Drive the slider state via CSS classes
        document.querySelectorAll(".lang-switch").forEach(sw => {
            sw.classList.toggle("active-en", currentLang === "en");
            sw.classList.toggle("active-nl", currentLang === "nl");
        });
    }

    /**
     * Wire up all .lang-switch elements on the page, then apply the current language.
     * Call once after DOMContentLoaded.
     */
    function initSwitches() {
        document.querySelectorAll(".lang-switch").forEach(sw => {
            sw.querySelectorAll(".lang-opt").forEach(opt => {
                opt.addEventListener("click", () => setLang(opt.dataset.val));
            });
        });
        applyLanguage();
    }

    return { t, setLang, getLang, applyLanguage, initSwitches };
})();
