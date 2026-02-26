/**
 * Quiz Script - Handles phishing awareness quiz logic
 * Includes real and fake emails with various phishing tactics
 */

class Email {
    constructor(from, subject, body, isReal, tactics = []) {
        this.from = from;
        this.subject = subject;
        this.body = body;
        this.isReal = isReal;
        this.tactics = tactics;
    }
}

// Database of emails - Challenging mix with varied patterns
const emails = [
    // REAL EMAILS
    new Email(
        "notifications@github.com",
        "You have a new follower",
        "Hi there,\n\nuser123 started following you on GitHub!\n\nCheck out their profile:\nhttps://github.com/user123",
        true
    ),

    new Email(
        "apple-noreply@apple.com",
        "Your app has been approved",
        "Congratulations! Your app \"TaskMaster\" has been approved for the App Store.\n\nIt will be available to download in approximately 30 minutes.\n\nVisit App Store Connect to manage your app.",
        true
    ),

    new Email(
        "support@dropbox.com",
        "New device sign-in",
        "Your Dropbox account was recently accessed from a new device:\n\nDevice: MacBook Pro\nLocation: San Francisco, CA\nTime: Feb 26 at 2:30 PM\n\nIf this was you, you can ignore this message. If not, secure your account and change your password.",
        true
    ),

    new Email(
        "noreply@stackoverflow.com",
        "Weekly digest: Your top questions",
        "Hello Developer,\n\nHere's your weekly summary of Stack Overflow activity. You received 45 upvotes this week.\n\nTop question:\n\"How to center a div with CSS?\"\n\nView your activity here: https://stackoverflow.com/users/dashboard",
        true
    ),

    new Email(
        "billing@stripe.com",
        "Your Stripe balance is ready to payout",
        "Your account balance of $2,450 is ready to transfer. Payouts occur every Friday to your connected bank account ending in 4242.\n\nNo action needed.",
        true
    ),

    new Email(
        "no-reply@twitch.tv",
        "A channel you follow is now live",
        "TechStreamer is now streaming \"Coding in Rust\"\n\nWatch now: https://twitch.tv/TechStreamer",
        true
    ),

    new Email(
        "account@zoom.us",
        "Your meeting recording is ready",
        "Your Zoom meeting from Feb 25 has been successfully recorded and is now available.\n\nAccess your recording: https://zoom.us/recording/mymeeting123\n\nRecordings are kept for 1 month.",
        true
    ),

    new Email(
        "community@slack.com",
        "You're invited to a beta feature",
        "We're testing a new feature for power users. Click below to join the beta:\n\nhttps://slack.com/beta/feature-test",
        true
    ),

    // PHISHING EMAILS - Varied and challenging
    new Email(
        "support@appel-id.com",
        "Your Apple ID requires attention",
        "Click here to update your Apple ID security settings:\n\nhttp://appel-id-secure.com/verify",
        false,
        ["Misspelled domain (appel)", "Suspicious link"]
    ),

    new Email(
        "paypa1support@email.com",
        "Update Your Account",
        "Please verify your account by clicking the link below:\nhttp://paypal-secure-verify.tk/account",
        false,
        ["Generic greeting", "Suspicious TLD", "Generic subject"]
    ),

    new Email(
        "noreply@micr0soft.com",
        "Your Microsoft account activity",
        "We noticed a sign-in from Ukraine at 3:45 AM.\n\nWas this you? http://microsoft-verify.info/check-activity\n\nIf not, secure your account immediately.",
        false,
        ["Domain typo (micr0soft)", "Fake location threat", "Urgent tone"]
    ),

    new Email(
        "admin@co1npany.net",
        "HR Department: Updated Benefits",
        "Employee,\n\nWe have updated the benefits portal. Please log in to view your new health insurance options:\n\nhttp://company-benefits-portal.tk\n\nLogin credentials are the same as before.",
        false,
        ["Typo domain (co1mpany)", "Credential request", "Generic greeting"]
    ),

    new Email(
        "service@bank-of-amrica.com",
        "Suspicious Account Activity",
        "We detected an unauthorized transaction of $599.99 to \"StreamingService\" charged to your account 2 days ago.\n\nReview the transaction:\nhttp://boa-verify-transaction.net/review\n\nYour account may be frozen pending verification.",
        false,
        ["Domain typo (amrica)", "Real-sounding incident", "Creates urgency"]
    ),

    new Email(
        "linkedin.verification@verify-linkedin.net",
        "Confirm Your Professional Information",
        "To maintain your LinkedIn premium access, please re-verify your professional identity.\n\nVerify now: http://linkedin-verify-pro.tk",
        false,
        ["Fake subdomain structure", "Unusual TLD"]
    ),

    new Email(
        "noreply@amazn.com",
        "Your package has arrived",
        "Your Amazon delivery from today is waiting at your door!\n\nTrack your package: http://amazon-track.tk/order123",
        false,
        ["Subtle domain typo (amazn)", "Seems legitimate", "Tracking link phishing"]
    ),

    new Email(
        "verify@g00gle.com",
        "Google Account Security Alert",
        "Someone just used your password to try to sign in to your Google Account.\n\nSecure your account now: http://google-verify-security.com",
        false,
        ["Zero instead of O", "Security threat theme"]
    ),

    new Email(
        "noreply@netflix.com",
        "Your payment method is expiring",
        "Update your payment method",
        true
    ),

    new Email(
        "billing@steam-communnity.com",
        "Confirm your Steam Guard settings",
        "Steam detected a new device attempt. To protect your account:\n\nClick here: http://steam-guard-verify.tk/confirm",
        false,
        ["Misspelled domain (communnity)", "Device security threat"]
    ),

    new Email(
        "support@adobe.io",
        "Your Creative Cloud subscription expires next month",
        "Your Adobe Creative Cloud membership will expire on March 26, 2026.\n\nRenew your subscription to keep using Photoshop, Illustrator, and more.\n\nhttps://account.adobe.com/plans\n\nBest regards,\nAdobe Support Team",
        true
    ),

    new Email(
        "no-reply@instagram.com",
        "Someone liked your photo",
        "jessica_smith liked your photo.\n\nhttps://instagram.com/p/ABC123",
        true
    ),

    new Email(
        "admin@yourcompny.internal",
        "Password update required",
        "Due to security policies, Windows domain passwords must be updated every 90 days. Your password is expiring.\n\nUpdate here: http://compny-password-reset.local\n\nUse your current username and password to reset it.",
        false,
        ["Internal-looking domain", "Legitimate-sounding policy", "Current credentials request"]
    ),

    new Email(
        "rewards@amz0n-exclusive.net",
        "Exclusive Member Reward",
        "As an Amazon Prime member, you've been selected for our rewards program!\n\nClaim $250 in Amazon credit:\nhttp://amazon-rewards-exclusive.tk\n\nOffer valid for 48 hours only!",
        false,
        ["Typo domain (amz0n)", "Reward/prize scam", "Time-limited offer"]
    ),

    new Email(
        "noreply@reddit.com",
        "Top post in r/programming",
        "Hi,\n\nYour post received 15k upvotes in r/programming.\n\nView your post: https://reddit.com/r/programming/comments/abc123",
        true
    ),

    new Email(
        "uber@uberinc.net",
        "Your account has unusual activity",
        "We noticed your Uber account was used for rides in a different city.\n\nWas this you? Verify here: http://uber-verify-activity.tk\n\nIf not, change your password immediately.",
        false,
        ["Suspicious domain (uberinc.net)", "Unusual activity alarm", "Urgency tactic"]
    ),

    new Email(
        "docusign-electronicsignature@verify-account.com",
        "Your DocuSign signature required",
        "A document requires your electronic signature.\n\nSign the document: http://docusign-verify-signature.tk\n\nThis request expires in 24 hours.",
        false,
        ["Fake DocuSign domain", "Time pressure", "Signature request phishing"]
    ),

    new Email(
        "alert@coinbase.co",
        "Your account is temporarily limited",
        "Due to suspicious activity, your Coinbase account has been limited.\n\nRestore access:\nhttp://coinbase-restore-access.net/verify",
        false,
        ["Cryptocurrency scam", "Account limitation threat", "Restoration prompt"]
    ),

    new Email(
        "noreply@wordpress.com",
        "Your blog post was scheduled",
        "Your scheduled post \"10 Web Design Tips\" will be published tomorrow at 9 AM.\n\nView settings: https://wordpress.com/dashboard",
        true
    ),

    new Email(
        "payroll@company.org",
        "Current month payslip attached",
        "Please find your payslip for February 2026 attached. Contact HR if you have any questions.\n\nGross Pay: $5,250\nNet Pay: $3,890",
        true
    ),

    new Email(
        "verify@face-book.com",
        "Verify your Facebook account",
        "We've detected unusual activity. Please verify your identity:\n\nhttp://facebook-verify-id.tk\n\nEnter your email and password to continue.",
        false,
        ["Domain typo (face-book)", "Credential harvesting", "Verification demand"]
    ),

    new Email(
        "noreply@canva.design",
        "Your design is ready to share",
        "Your Canva design \"Social Media Post\" is complete and ready to download.\n\nDownload: https://canva.design/download/xyz123",
        true
    ),

    new Email(
        "support@wellsfargo-online.com",
        "Review your recent transactions",
        "We have detected 3 transactions from your Wells Fargo account that may need review:\n\n1. $199 - Target\n2. $45 - Shell Gas\n3. $1,200 - Wire Transfer (Suspicious)\n\nReview transactions: http://wf-review-secure.tk",
        false,
        ["Misspelled domain (wellsfargo-online)", "Legitimate-sounding transaction list", "One suspicious item to trigger action"]
    ),

    new Email(
        "noreply@evernote.com",
        "You shared a note",
        "You shared the note \"Meeting Notes - Q1 Planning\" with john@company.com\n\nThey can now view and edit the note.",
        true
    ),

    new Email(
        "security.alert@goggle.com",
        "Suspicious sign-in attempt blocked",
        "We detected and blocked a sign-in attempt from Russia using your password.\n\nIf this wasn't you, change your password: http://google-security-change-pwd.tk",
        false,
        ["Domain typo (goggle)", "Fake geography threat", "Password change link"]
    ),

    new Email(
        "noreply@airbnb.com",
        "Your reservation is confirmed",
        "Great news! Your reservation for \"Cozy Apartment in NYC\" has been confirmed.\n\nCheck-in: March 1, 2026\nHost: Maria G.\nPrice: $280 total\n\nView reservation: https://airbnb.com/reservations/abc123",
        true
    )
];

// Game variables
let currentEmailIndex = 0;
let score = 0;
let quizEmails = []; // Will be populated with 10 random emails
const QUIZ_LENGTH = 10;

// DOM elements
const welcomeEl = document.getElementById("welcome");
const scoreDisplayEl = document.getElementById("score-display");
const fromEl = document.getElementById("from");
const subjectEl = document.getElementById("subject");
const bodyEl = document.getElementById("body");
const feedbackEl = document.getElementById("feedback");
const nextBtnEl = document.getElementById("next-btn");
const finalScoreContainerEl = document.getElementById("final-score-container");
const finalScoreEl = document.getElementById("final-score");
const restartBtnEl = document.getElementById("restart-btn");
const emailCardEl = document.querySelector(".email-card");
const buttonsEl = document.querySelector(".buttons");
const progressFillEl = document.getElementById("progress-fill");

/**
 * Initialize the quiz
 */
function init() {
    const playerName = localStorage.getItem("playerName");

    if (!playerName) {
        window.location.href = "index.html";
        return;
    }

    // Create a copy of all emails and shuffle
    quizEmails = [...emails];
    shuffleArray(quizEmails);
    
    // Select only first 10 emails
    quizEmails = quizEmails.slice(0, QUIZ_LENGTH);

    welcomeEl.textContent = `🎮 Player: ${playerName}`;
    loadEmail();
}

/**
 * Load current email
 */
function loadEmail() {
    const email = quizEmails[currentEmailIndex];

    fromEl.textContent = email.from;
    subjectEl.textContent = email.subject;
    bodyEl.textContent = email.body;

    // Update progress bar
    updateProgressBar();

    // Reset feedback
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
    nextBtnEl.style.display = "none";

    // Enable buttons
    document.querySelectorAll(".btn-real, .btn-phishing").forEach(btn => {
        btn.disabled = false;
    });
}

/**
 * Handle answer selection
 */
function answer(choice) {
    const email = quizEmails[currentEmailIndex];
    const isCorrect = (choice === "real" && email.isReal) || (choice === "phishing" && !email.isReal);

    // Disable buttons
    document.querySelectorAll(".btn-real, .btn-phishing").forEach(btn => {
        btn.disabled = true;
    });

    if (isCorrect) {
        feedbackEl.textContent = "✅ Correct!";
        feedbackEl.className = "feedback correct";
        score++;
    } else {
        const correct = email.isReal ? "REAL" : "PHISHING";
        feedbackEl.textContent = "❌ Incorrect! This was " + correct + ".";
        feedbackEl.className = "feedback incorrect";
    }

    // Update score display
    updateScoreDisplay();

    nextBtnEl.style.display = "inline-block";
}

/**
 * Load next question
 */
function nextQuestion() {
    currentEmailIndex++;

    if (currentEmailIndex < quizEmails.length) {
        loadEmail();
    } else {
        endGame();
    }
}

/**
 * End the game
 */
function endGame() {
    emailCardEl.style.display = "none";
    buttonsEl.style.display = "none";
    nextBtnEl.style.display = "none";

    const percentage = Math.round((score / quizEmails.length) * 100);
    let message = "";

    if (percentage === 100) {
        message = "🏆 Perfect Score! You're a phishing expert!";
    } else if (percentage >= 85) {
        message = "🥇 Excellent! Outstanding phishing detection skills!";
    } else if (percentage >= 70) {
        message = "🥈 Very Good! You caught most of the phishing attempts!";
    } else if (percentage >= 55) {
        message = "📚 Good Start! Keep practicing to improve your detection skills!";
    } else if (percentage >= 40) {
        message = "📖 Keep Learning! Phishing attacks are designed to be deceptive!";
    } else {
        message = "💪 Don't Give Up! Practice makes perfect in security awareness!";
    }

    finalScoreEl.innerHTML = `
        ${message}<br><br>
        Final Score: <strong>${score} / ${quizEmails.length}</strong><br>
        <span style="font-size: 16px;">${percentage}%</span>
    `;

    finalScoreContainerEl.style.display = "block";
}

/**
 * Restart the game
 */
function restartGame() {
    localStorage.removeItem("playerName");
    localStorage.removeItem("playerScore");
    window.location.href = "index.html";
}

/**
 * Go back to home/name page
 */
function goHome() {
    if (confirm("Are you sure? Your progress will be lost.")) {
        localStorage.removeItem("playerName");
        localStorage.removeItem("playerScore");
        window.location.href = "index.html";
    }
}

/**
 * Update score display in top bar
 */
function updateScoreDisplay() {
    scoreDisplayEl.textContent = `Score: ${score} / ${quizEmails.length}`;
}

/**
 * Update progress bar
 */
function updateProgressBar() {
    const percentage = ((currentEmailIndex + 1) / quizEmails.length) * 100;
    progressFillEl.style.width = percentage + "%";
}

/**
 * Shuffle array in place (Fisher-Yates)
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Initialize on page load
 */
init();
