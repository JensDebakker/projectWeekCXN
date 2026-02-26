/**
 * nav.js — Shared ConXion module navigation bar
 *
 * Usage: add ONE line inside <body> of any module page:
 *   <script src="../nav.js"></script>
 *
 * The script figures out which module is current from the URL path,
 * injects a sticky top bar with links to every module, and adds the
 * required CSS automatically — no extra stylesheet needed.
 */
(function () {

    const MODULES = [
        { id: 1, label: "Phishing",        path: "Module1-EmailPhishing/index.html" },
        { id: 2, label: "AI",              path: "Module2-AI/index.html" },
        { id: 3, label: "Passwords",       path: "Module3-Password/index.html" },
        { id: 4, label: "Social Eng.",     path: "Module4-XXX/index.html" },
        { id: 5, label: "Safe Browsing",   path: "Module5-XXX/index.html" },
    ];

    // ── Detect current module number from the URL ──────────────────────────
    const urlPath = window.location.pathname.replace(/\\/g, "/");
    const moduleMatch = urlPath.match(/Module(\d+)-/i);
    const currentId = moduleMatch ? parseInt(moduleMatch[1], 10) : null;

    // ── Root path relative to the current page (go up one directory if in module) ──
    const isModule = currentId !== null;
    const rootPath = isModule ? "../" : "./";

    function rootHref(relPath) {
        return rootPath + relPath;
    }

    // ── Build the nav HTML ─────────────────────────────────────────────────
    const homeHref = rootPath + "index.html";

    const moduleLinks = MODULES.map(m => {
        const isCurrent = m.id === currentId;
        const href = rootHref(m.path);
        return `
            <a href="${href}" class="cxn-nav-link ${isCurrent ? "cxn-nav-link--active" : ""}">
                <span class="cxn-nav-num">0${m.id}</span>
                <span class="cxn-nav-label">${m.label}</span>
            </a>`;
    }).join("");

    const navHTML = `
        <nav class="cxn-nav" id="cxn-nav">
            <div class="cxn-nav-inner">

                <!-- Logo / Home -->
                <a href="${homeHref}" class="cxn-nav-logo" title="Back to main menu">
                    <img src="${rootPath}vives.png" alt="VIVES" style="height: 28px; width: auto;">
                    <span class="cxn-nav-logo-text">Con<span>X</span>ion</span>
                </a>

                <!-- Module links -->
                <div class="cxn-nav-links">
                    ${moduleLinks}
                </div>

                <!-- Home button on the right -->
                <a href="${homeHref}" class="cxn-nav-home">
                    ⌂ Menu
                </a>

            </div>
        </nav>
    `;

    // ── Inject CSS ─────────────────────────────────────────────────────────
    const style = document.createElement("style");
    style.textContent = `
        /* Push page content below the nav */
        body { padding-top: 52px !important; }

        .cxn-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 9999;
            background: rgba(243, 244, 246, 0.95);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            height: 52px;
        }

        .cxn-nav-inner {
            max-width: 1100px;
            margin: 0 auto;
            height: 100%;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 16px;
        }

        .cxn-nav-logo {
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            flex-shrink: 0;
            margin-right: 8px;
        }

        .cxn-nav-logo-text {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            font-size: 16px;
            font-weight: 800;
            color: #1e293b;
            letter-spacing: -0.4px;
        }

        .cxn-nav-logo-text span {
            background: linear-gradient(135deg, #38bdf8, #818cf8);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .cxn-nav-links {
            display: flex;
            align-items: center;
            gap: 2px;
            flex: 1;
            overflow-x: auto;
            scrollbar-width: none;
        }

        .cxn-nav-links::-webkit-scrollbar { display: none; }

        .cxn-nav-link {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px 12px;
            border-radius: 8px;
            text-decoration: none;
            color: #475569;
            font-family: 'Inter', 'Segoe UI', sans-serif;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            transition: background .2s, color .2s;
        }

        .cxn-nav-link:hover {
            background: rgba(0, 0, 0, 0.05);
            color: #0f172a;
        }

        .cxn-nav-link--active {
            background: rgba(56, 189, 248, 0.1);
            color: #0284c7;
            font-weight: 600;
        }

        .cxn-nav-num {
            font-size: 10px;
            font-weight: 700;
            opacity: .55;
        }

        .cxn-nav-home {
            flex-shrink: 0;
            margin-left: auto;
            padding: 5px 12px;
            border-radius: 8px;
            text-decoration: none;
            color: #475569;
            font-family: 'Inter', 'Segoe UI', sans-serif;
            font-size: 13px;
            font-weight: 500;
            border: 1px solid rgba(0, 0, 0, 0.1);
            transition: background .2s, color .2s, border-color .2s;
            white-space: nowrap;
        }

        .cxn-nav-home:hover {
            background: rgba(0, 0, 0, 0.04);
            color: #0f172a;
            border-color: rgba(0, 0, 0, 0.2);
        }

        /* On small screens hide the module numbers to save space */
        @media (max-width: 600px) {
            .cxn-nav-num { display: none; }
            .cxn-nav-link { padding: 5px 8px; font-size: 12px; }
        }
    `;
    document.head.appendChild(style);

    // ── Inject the nav as the very first child of <body> ───────────────────
    document.body.insertAdjacentHTML("afterbegin", navHTML);

})();
