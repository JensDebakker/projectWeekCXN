/**
 * Quiz Script - Phishing Awareness Quiz
 * 13 high-quality email scenarios, 6 questions per game, max 30 points
 */

class Email {
    constructor(from, subject, body, isReal, tactics = []) {
        this.from = from;
        this.subject = subject;
        this.body = body;
        this.isReal = isReal;
        this.tactics = tactics; // Array of { label, correct } objects
    }
}

// ─── EMAIL DATABASE ────────────────────────────────────────────────────────────
const emails = [

    // ── REAL EMAILS ──────────────────────────────────────────────────────────

    new Email(
        "no-reply@github.com",
        "[GitHub] A new public key was added to your account",
        "Hi alexdev,\n\nA new SSH public key was added to your GitHub account.\n\nKey fingerprint: SHA256:uNiVztksCsDhcc0u9e8BujQXVUpKZIDTMczCvj3tD2s\nAdded: February 26, 2026 at 09:14 UTC\nDevice: MacBook Pro — Berlin, Germany\n\nIf you added this key yourself, no action is required.\n\nIf you did NOT add this key, please remove it immediately from your account settings and consider changing your password and enabling two-factor authentication.\n\nYou can manage your SSH keys at: github.com/settings/keys\n\n— The GitHub Team",
        true
    ),

    new Email(
        "receipts@stripe.com",
        "Your receipt from Stripe, Inc.",
        "Hello Jamie,\n\nThank you for your payment. Here is your receipt.\n\nReceipt #: 1023-4892\nDate: February 25, 2026\nDescription: Stripe Pro Plan — Monthly\nAmount: $59.00 USD\n\nThis charge will appear on your statement as STRIPE*INVOICE.\n\nYou can view and download this receipt from your Stripe Dashboard under Billing > Invoices.\n\nIf you have any questions about this charge, please contact our support team at support.stripe.com.\n\nThank you,\nStripe, Inc.",
        true
    ),

    new Email(
        "noreply@linkedin.com",
        "You appeared in 14 searches this week",
        "Hi Sophie,\n\nGreat news — your profile is getting attention!\n\nYou appeared in 14 searches this week. Recruiters and professionals are looking at your profile.\n\nHere's a summary of your profile activity:\n• Search appearances: 14\n• Profile views: 7\n• Post impressions: 312\n\nWant to see who viewed your profile? Upgrade to LinkedIn Premium to unlock full viewer details and stand out to recruiters.\n\nView your full dashboard: linkedin.com/me/profile-views\n\nThe LinkedIn Team",
        true
    ),

    new Email(
        "support@paypal.com",
        "You sent a payment of €120.00 to Marcus Becker",
        "Hello Chris,\n\nYou sent a payment of €120.00 to Marcus Becker (m.becker@gmail.com) on February 26, 2026 at 11:02 AM CET.\n\nTransaction ID: 9BG47283PX1234562\nNote: \"Rent — February\"\n\nIf you authorised this payment, you don't need to do anything.\n\nIf you didn't authorise this payment, please open a dispute in the PayPal Resolution Centre immediately. Acting quickly gives us the best chance of recovering your funds.\n\nResolution Centre: paypal.com/disputes\n\nThank you,\nPayPal Customer Support",
        true
    ),

    new Email(
        "no-reply@accounts.google.com",
        "Security alert: New sign-in on Windows",
        "Hi Tom,\n\nYour Google Account (tom.harrison@gmail.com) was signed in to on a new Windows device.\n\nWednesday, February 26, 2026 — 08:53 AM (CET)\nBrowser: Chrome 122\nLocation: Amsterdam, Netherlands\n\nIf this was you, you don't need to take any action.\n\nIf this wasn't you, your account may be compromised. We recommend you:\n1. Change your password immediately\n2. Review your recent activity at myaccount.google.com/security\n3. Enable 2-Step Verification if you haven't already\n\nThe Google Accounts team",
        true
    ),

    new Email(
        "info@notion.so",
        "Your Notion workspace is running low on storage",
        "Hi Clara,\n\nYour Notion workspace \"Clara's Projects\" has used 90% of its available storage (9.1 GB of 10 GB).\n\nWhen your workspace reaches 100%, you'll no longer be able to upload files or attachments.\n\nTo keep your workflow running smoothly, you can:\n• Upgrade to Notion Plus for 250 GB of storage\n• Delete unused files and attachments from your pages\n• Export and archive older workspaces\n\nManage your storage: notion.so/settings/account\n\nHave questions? Reply to this email or visit our help centre at notion.so/help.\n\nThanks,\nThe Notion Team",
        true
    ),

    // ── PHISHING EMAILS ───────────────────────────────────────────────────────

    new Email(
        "security-alert@paypa1-support.com",
        "Urgent: Unusual Login Detected — Verify Your Account Now",
        "Dear PayPal Member,\n\nWe have detected an unauthorised login attempt on your PayPal account from an unrecognised device located in Romania.\n\nTo protect your account, we have temporarily limited your access. You will not be able to send or receive payments until your identity is verified.\n\nPlease verify your account within 24 hours to restore full access:\n[Verify My Account — paypa1-support.com/verify]\n\nIf you do not complete verification, your account will be permanently suspended and any pending balance may be held for up to 180 days.\n\nThank you for your cooperation,\nPayPal Account Security Team",
        false,
        [
            { label: "The sender's email address looks suspicious or unexpected", correct: true },
            { label: "The email creates extreme urgency and threatens severe consequences", correct: true },
            { label: "You are not addressed by your real name", correct: true },
            { label: "The email asks you to click a link to verify or log in", correct: true },
            { label: "Mentioning a foreign country in a security alert is always a sign of phishing", correct: false }
        ]
    ),

    new Email(
        "hr-department@your-company-portal.net",
        "Action Required: Update Your Payroll Bank Details Before Friday",
        "Dear Employee,\n\nAs part of our quarterly payroll system upgrade, all staff are required to re-confirm their bank account details by this Friday, 28 February 2026.\n\nFailure to do so may result in a delay to your next salary payment.\n\nPlease log in to the employee portal using your company credentials and update your information:\n[Update Bank Details — your-company-portal.net/payroll]\n\nThis process takes less than 2 minutes. If you have any issues accessing the portal, please contact HR directly.\n\nKind regards,\nHuman Resources Department",
        false,
        [
            { label: "The sender's email domain does not match the expected organisation", correct: true },
            { label: "The email requests sensitive financial information via a link", correct: true },
            { label: "A deadline is used to pressure you into acting quickly", correct: true },
            { label: "Good grammar and a professional tone means the email is safe", correct: false },
            { label: "Organisations never send emails asking you to update personal details", correct: false }
        ]
    ),

    new Email(
        "noreply@micros0ft-account.com",
        "Your Microsoft 365 subscription has expired",
        "Dear Microsoft Customer,\n\nYour Microsoft 365 subscription expired on February 24, 2026. As a result, your access to Word, Excel, Outlook, and OneDrive has been suspended.\n\nTo avoid permanent data loss, please renew your subscription within 72 hours. After this period, your files stored in OneDrive may be deleted.\n\nRenew Now to restore access:\n[Renew Subscription — micros0ft-account.com/renew]\n\nIf you have already renewed your subscription, please disregard this notice.\n\nThank you,\nMicrosoft Account Team",
        false,
        [
            { label: "The sender's email address does not come from the official company domain", correct: true },
            { label: "The email threatens data loss to cause panic", correct: true },
            { label: "No account-specific details (name, account ID) are included", correct: true },
            { label: "Mentioning well-known software products proves the email is real", correct: false },
            { label: "All subscription expiry emails are sent with a 72-hour warning", correct: false }
        ]
    ),

    new Email(
        "awards@google-rewards-2026.com",
        "Congratulations! You Have Been Selected for a Google Reward",
        "Dear Google User,\n\nYou have been randomly selected as one of our February 2026 loyalty reward winners!\n\nAs a valued Google user, you are entitled to claim a €750 Google Play gift card as a thank-you for your continued use of Google services.\n\nTo claim your reward, simply complete a short 3-question survey and provide your delivery details:\n[Claim Your Reward — google-rewards-2026.com/claim]\n\nThis offer expires in 48 hours. Only one claim per person is permitted.\n\nCongratulations once again,\nThe Google Rewards Team",
        false,
        [
            { label: "Unexpected prize or reward offers are a common trick to lure victims", correct: true },
            { label: "The sender's email address does not belong to the company it claims to be", correct: true },
            { label: "The email creates time pressure with a strict deadline", correct: true },
            { label: "You are not addressed by your personal name", correct: true },
            { label: "Completing an online survey is always a safe activity", correct: false }
        ]
    ),

    new Email(
        "it-helpdesk@corp-it-support.org",
        "IT Notice: Your Password Expires in 2 Hours — Reset Required",
        "Hello,\n\nOur system has detected that your company account password will expire in approximately 2 hours. Once expired, you will lose access to all company systems, including email, SharePoint, and the VPN.\n\nPlease reset your password immediately using the link below before you are locked out:\n[Reset Password Now — corp-it-support.org/reset]\n\nIf you have already reset your password in the last 24 hours, please ignore this message.\n\nFor assistance, contact the IT Helpdesk.\n\nThank you,\nCorporate IT Support",
        false,
        [
            { label: "The sender's email domain does not match the expected organisation", correct: true },
            { label: "An extremely short deadline is designed to stop you from thinking carefully", correct: true },
            { label: "The email does not address you by your name", correct: true },
            { label: "Internal IT emails are always trustworthy and safe to act on", correct: false }
        ]
    ),

    new Email(
        "billing@netfl1x-accounts.com",
        "Your Netflix Membership Has Been Paused",
        "Dear Netflix Member,\n\nWe were unable to process your latest payment and your Netflix membership has been paused.\n\nStreaming will remain unavailable until your billing information is updated. To avoid losing your profile, viewing history, and My List, please update your payment method as soon as possible.\n\nUpdate Your Payment Details:\n[Update Now — netfl1x-accounts.com/billing]\n\nIf you believe this is an error, please contact Netflix Support.\n\nWarm regards,\nThe Netflix Billing Team",
        false,
        [
            { label: "The sender's email address does not come from the official company domain", correct: true },
            { label: "The email threatens loss of personal data to create fear", correct: true },
            { label: "You are not addressed by your real account name", correct: true },
            { label: "Billing-related emails are always sent by real companies", correct: false }
        ]
    ),

    new Email(
        "support@dh1-mail.org",
        "DHL Shipment On Hold — Customs Fee Required",
        "Dear Customer,\n\nYour DHL parcel (Tracking: JD014600014414792) is currently on hold at our customs facility.\n\nA customs clearance fee of €2.99 is required before your parcel can be released and delivered. This is a standard customs processing charge applied to international shipments.\n\nPlease pay the fee within 3 days to avoid the parcel being returned to the sender:\n[Pay Customs Fee — dh1-mail.org/customs-pay]\n\nDelivery Details:\nEstimated Delivery: March 1 – 3, 2026\nDestination: Your registered address\n\nThank you for choosing DHL,\nDHL Customer Services",
        false,
        [
            { label: "The sender's email address does not match the official company domain", correct: true },
            { label: "Asking you to pay a small unexpected fee via a link is a common trick", correct: true },
            { label: "A deadline is used to rush you into paying without checking", correct: true },
            { label: "No personal details (name, address) are included in the email", correct: true },
            { label: "Small payment amounts (under €5) are never part of a scam", correct: false }
        ]
    )
];

// ─── GAME VARIABLES ────────────────────────────────────────────────────────────
const QUIZ_LENGTH = 6;
const MAX_SCORE = QUIZ_LENGTH * 5; // 30 points total

let currentEmailIndex = 0;
let score = 0;
let quizEmails = [];
let clueSubmitted = false;

// ─── DOM ELEMENTS ──────────────────────────────────────────────────────────────
const welcomeEl             = document.getElementById("welcome");
const scoreDisplayEl        = document.getElementById("score-display");
const fromEl                = document.getElementById("from");
const subjectEl             = document.getElementById("subject");
const bodyEl                = document.getElementById("body");
const feedbackEl            = document.getElementById("feedback");
const nextBtnEl             = document.getElementById("next-btn");
const finalScoreContainerEl = document.getElementById("final-score-container");
const finalScoreEl          = document.getElementById("final-score");
const emailCardEl           = document.querySelector(".email-card");
const buttonsEl             = document.querySelector(".buttons");
const progressFillEl        = document.getElementById("progress-fill");

// ─── INIT ──────────────────────────────────────────────────────────────────────
function init() {
    const playerName = localStorage.getItem("playerName");
    if (!playerName) {
        window.location.href = "index.html";
        return;
    }

    quizEmails = [...emails];
    shuffleArray(quizEmails);
    quizEmails = quizEmails.slice(0, QUIZ_LENGTH);

    currentEmailIndex = 0;
    score = 0;

    // Apply saved language, wire up the slider, and refresh dynamic text on switch
    i18n.initSwitches();
    document.addEventListener("i18n:change", () => {
        welcomeEl.textContent = `${i18n.t("welcomePrefix")} ${playerName}`;
        updateScoreDisplay();
    });

    welcomeEl.textContent = `${i18n.t("welcomePrefix")} ${playerName}`;
    updateScoreDisplay();
    loadEmail();
}

// ─── LOAD EMAIL ────────────────────────────────────────────────────────────────
function loadEmail() {
    const email = quizEmails[currentEmailIndex];

    fromEl.textContent     = email.from;
    subjectEl.textContent  = email.subject;
    bodyEl.textContent     = email.body;

    updateProgressBar();

    // Reset feedback & UI
    feedbackEl.textContent  = "";
    feedbackEl.className    = "feedback";
    nextBtnEl.style.display = "none";
    clueSubmitted           = false;

    removeExtras();

    // Re-enable answer buttons
    document.querySelectorAll(".btn-real, .btn-phishing").forEach(btn => {
        btn.disabled  = false;
        btn.style.opacity = "1";
    });
}

// ─── ANSWER ───────────────────────────────────────────────────────────────────
function answer(choice) {
    const email     = quizEmails[currentEmailIndex];
    const isCorrect = (choice === "real" && email.isReal) || (choice === "phishing" && !email.isReal);

    // Disable answer buttons
    document.querySelectorAll(".btn-real, .btn-phishing").forEach(btn => {
        btn.disabled      = true;
        btn.style.opacity = "0.5";
    });

    removeExtras();

    // ── Scenario 1: Correctly identified as real ─────────────────────────────
    if (isCorrect && email.isReal) {
        score += 5;
        updateScoreDisplay();
        showFeedback(i18n.t("correctReal"), "correct");
        nextBtnEl.style.display = "inline-block";
        return;
    }

    // ── Scenario 2: Called real but it was phishing ──────────────────────────
    if (!isCorrect && !email.isReal) {
        showFeedback(i18n.t("incorrectPhishing"), "incorrect");
        buildChecklist(email, false);
        return;
    }

    // ── Scenario 3: Called phishing but it was real ──────────────────────────
    if (!isCorrect && email.isReal) {
        showFeedback(i18n.t("incorrectReal"), "incorrect");
        nextBtnEl.style.display = "inline-block";
        return;
    }

    // ── Scenario 4: Correctly identified as phishing (+1 for the ID, +4 from checklist) ──
    if (isCorrect && !email.isReal) {
        score += 1; // 1 point for correctly spotting it's phishing
        updateScoreDisplay();
        showFeedback(i18n.t("correctPhishing"), "correct");
        buildChecklist(email, true);
    }
}

// ─── BUILD CHECKLIST ──────────────────────────────────────────────────────────
function buildChecklist(email, canScore) {
    const cluesDiv = document.createElement("div");
    cluesDiv.id        = "phishing-clues";
    cluesDiv.className = "glass-panel clues-panel";

    const heading = document.createElement("p");
    heading.className = "clues-heading";

    // ── No-score path: user said real but it was phishing ─────────────────────
    // Only show the ACTUAL red flags (correct: true) — not the distractors.
    if (!canScore) {
        heading.textContent = i18n.t("clueHeadingReveal");
        cluesDiv.appendChild(heading);

        email.tactics
            .filter(tactic => tactic.correct)   // ← only real red flags
            .forEach(tactic => {
                const item = document.createElement("div");
                item.className = "clue-item clue-right";

                const badge = document.createElement("span");
                badge.className   = "clue-badge";
                badge.textContent = i18n.t("badgeRedFlag");

                item.appendChild(document.createTextNode(tactic.label));
                item.appendChild(badge);
                cluesDiv.appendChild(item);
            });

        feedbackEl.parentNode.insertBefore(cluesDiv, nextBtnEl);
        nextBtnEl.style.display = "inline-block";
        return;
    }

    // ── Scoring path: user correctly identified phishing ──────────────────────
    heading.textContent = i18n.t("clueHeadingScore");
    cluesDiv.appendChild(heading);

    const form = document.createElement("form");
    form.id = "clue-form";

    email.tactics.forEach((tactic, i) => {
        const item = document.createElement("div");
        item.className = "clue-item";

        const label = document.createElement("label");
        label.className = "clue-label";

        const cb = document.createElement("input");
        cb.type  = "checkbox";
        cb.name  = "clue";
        cb.value = i;

        label.appendChild(cb);
        label.appendChild(document.createTextNode(" " + tactic.label));
        item.appendChild(label);
        form.appendChild(item);
    });

    cluesDiv.appendChild(form);

    const submitBtn = document.createElement("button");
    submitBtn.id          = "clue-submit-btn";
    submitBtn.textContent = i18n.t("clueSubmit");
    submitBtn.className   = "btn btn-primary";
    submitBtn.onclick     = function(e) {
        e.preventDefault();
        submitChecklist(email, cluesDiv, submitBtn);
    };
    cluesDiv.appendChild(submitBtn);

    feedbackEl.parentNode.insertBefore(cluesDiv, nextBtnEl);
}

// ─── SUBMIT CHECKLIST ─────────────────────────────────────────────────────────
// Scoring: checklist is worth 4 points (the 5th point was awarded for identifying phishing).
// Each item is worth 4/totalItems points. Perfect score on checklist = exactly 4pts → total 5/5.
// Picking a distractor cancels one correct answer point.
function submitChecklist(email, cluesDiv, submitBtn) {
    if (clueSubmitted) return;
    clueSubmitted = true;
    submitBtn.disabled = true;

    const form       = document.getElementById("clue-form");
    const checkboxes = Array.from(form.elements["clue"]);
    const totalItems = checkboxes.length;

    let correctActions  = 0; // checked a real flag OR skipped a distractor
    let incorrectActions = 0; // checked a distractor OR missed a real flag

    // Reveal results per item
    checkboxes.forEach((cb, i) => {
        const tactic  = email.tactics[i];
        const checked = cb.checked;
        const item    = cb.closest(".clue-item");

        cb.disabled = true;

        const badge = document.createElement("span");
        badge.className = "clue-badge";

        if (tactic.correct && checked) {
            // ✅ Spotted a real red flag
            item.classList.add("clue-right");
            badge.textContent = i18n.t("badgeCorrectFlag");
            correctActions++;
        } else if (tactic.correct && !checked) {
            // ❌ Missed a real red flag
            item.classList.add("clue-missed");
            badge.textContent = i18n.t("badgeMissed");
            incorrectActions++;
        } else if (!tactic.correct && checked) {
            // ❌ Selected a distractor
            item.classList.add("clue-wrong");
            badge.textContent = i18n.t("badgeWrong");
            incorrectActions++;
        } else {
            // ✅ Correctly skipped a distractor
            item.classList.add("clue-neutral");
            badge.textContent = i18n.t("badgeCorrectSkip");
            correctActions++;
        }

        item.appendChild(badge);
    });

    // Scale checklist to always be worth 4 points.
    // Perfect = all totalItems correct → 4pts. Each wrong action reduces proportionally.
    const rawScore = Math.max(0, correctActions - incorrectActions);
    const checklistPoints = Math.round((rawScore / totalItems) * 4);
    score += checklistPoints;
    updateScoreDisplay();

    // Show clue score summary
    const totalScore = 1 + checklistPoints; // 1 for phishing ID + checklist bonus
    const resultDiv  = document.createElement("div");
    resultDiv.className = "clue-result";
    resultDiv.innerHTML = i18n.t("clueResultScore")(checklistPoints, totalScore, correctActions, totalItems);
    cluesDiv.appendChild(resultDiv);

    nextBtnEl.style.display = "inline-block";
}

// ─── NEXT QUESTION ────────────────────────────────────────────────────────────
function nextQuestion() {
    currentEmailIndex++;
    if (currentEmailIndex < quizEmails.length) {
        loadEmail();
    } else {
        endGame();
    }
}

// ─── END GAME ─────────────────────────────────────────────────────────────────
function endGame() {
    emailCardEl.style.display  = "none";
    buttonsEl.style.display    = "none";
    nextBtnEl.style.display    = "none";
    feedbackEl.style.display   = "none";
    removeExtras();

    // Save score to leaderboard
    const playerName = localStorage.getItem("playerName") || "Guest";
    if (window.LeaderboardManager) {
        window.LeaderboardManager.saveScore(playerName, score, "Phishing");
    }

    const percentage = Math.round((score / MAX_SCORE) * 100);

    let message;
    if (percentage === 100)     message = i18n.t("endPerfect");
    else if (percentage >= 80)  message = i18n.t("endExcellent");
    else if (percentage >= 60)  message = i18n.t("endGood");
    else if (percentage >= 40)  message = i18n.t("endNotBad");
    else                        message = i18n.t("endKeepLearning");

    finalScoreEl.innerHTML = `
        <span class="end-message">${message}</span>
        <div class="end-scores">
            <div class="end-score-main">${score} <span>/ ${MAX_SCORE}</span></div>
            <div class="end-score-pct">${percentage}%</div>
        </div>
        <p class="end-detail">${i18n.t("endDetail")(QUIZ_LENGTH, MAX_SCORE, percentage)}</p>
    `;

    finalScoreContainerEl.style.display = "block";
}

// ─── RESTART / HOME ───────────────────────────────────────────────────────────
function restartGame() {
    localStorage.removeItem("playerName");
    localStorage.removeItem("playerScore");
    window.location.href = "index.html";
}

function goHome() {
    if (confirm(i18n.t("homeConfirm"))) {
        localStorage.removeItem("playerName");
        localStorage.removeItem("playerScore");
        window.location.href = "index.html";
    }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function showFeedback(msg, type) {
    feedbackEl.textContent = msg;
    feedbackEl.className   = `feedback ${type}`;
}

function removeExtras() {
    ["phishing-clues", "clue-submit-btn", "clue-score"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });
}

function updateScoreDisplay() {
    scoreDisplayEl.textContent = `${i18n.t("scorePrefix")} ${score} / ${MAX_SCORE}`;
}

function updateProgressBar() {
    const pct = ((currentEmailIndex + 1) / quizEmails.length) * 100;
    progressFillEl.style.width = pct + "%";
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// ─── START ────────────────────────────────────────────────────────────────────
init();
