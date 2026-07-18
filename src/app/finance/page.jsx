"use client";

import React, { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // --- Starfield Animation ---
    const canvas = document.getElementById("starfield");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      let W, H, stars = [];

      const resize = () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      };

      const init = () => {
        stars = [];
        for (let i = 0; i < 180; i++) {
          stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.2 + 0.2,
            a: Math.random() * 0.12 + 0.02,
            twinkle: Math.random() * Math.PI * 2,
          });
        }
      };

      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        stars.forEach((s) => {
          s.twinkle += 0.012;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240,237,230,${
            s.a * (0.7 + 0.3 * Math.sin(s.twinkle))
          })`;
          ctx.fill();
        });
        requestAnimationFrame(draw);
      };

      window.addEventListener("resize", () => {
        resize();
        init();
      });
      resize();
      init();
      draw();
    }

    // --- Custom Cursor Tracking ---
    const cursor = document.getElementById("cursor");
    const cursorRing = document.getElementById("cursor-ring");
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursor) {
        cursor.style.left = mx - 5 + "px";
        cursor.style.top = my - 5 + "px";
      }
    };

    document.addEventListener("mousemove", onMouseMove);

    let animFrameId;
    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (cursorRing) {
        cursorRing.style.left = rx - 18 + "px";
        cursorRing.style.top = ry - 18 + "px";
      }
      animFrameId = requestAnimationFrame(animRing);
    };
    animRing();

    // --- Progress Bar ---
    const bar = document.getElementById("progress");
    const onScrollProgress = () => {
      if (bar) {
        bar.style.width =
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
            100 +
          "%";
      }
    };
    window.addEventListener("scroll", onScrollProgress);

    // --- Intersection Observer for Scroll Reveals ---
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // --- Active Nav Link Highlighter ---
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");
    const onScrollHighlight = () => {
      let cur = "";
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 100) cur = s.id;
      });
      navLinks.forEach((a) => {
        a.style.color =
          a.getAttribute("href") === "#" + cur ? "var(--gold)" : "";
      });
    };
    window.addEventListener("scroll", onScrollHighlight, { passive: true });

    // Cleanup functions on unmount
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("scroll", onScrollProgress);
      window.removeEventListener("scroll", onScrollHighlight);
      io.disconnect();
    };
  }, []);

  // --- Tier Switching Logics ---
  const switchTier = (id, e) => {
    document
      .querySelectorAll(".tier-panel")
      .forEach((p) => p.classList.remove("active"));
    document
      .querySelectorAll(".tier-tab")
      .forEach((t) => t.classList.remove("active"));
    
    const targetPanel = document.getElementById("panel-" + id);
    if (targetPanel) targetPanel.classList.add("active");
    if (e && e.currentTarget) e.currentTarget.classList.add("active");
  };

  // --- Copy Email to Clipboard ---
  const copyEmail = () => {
    navigator.clipboard.writeText("financeteam.conscientia@gmail.com").then(() => {
      const t = document.getElementById("toast");
      if (t) {
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 2500);
      }
    });
  };

  return (
    <>
      {/* Dynamic Embedded Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg: #060a10;
          --surface: #0d1420;
          --surface2: #111a2a;
          --ink: #f0ede6;
          --ink-dim: rgba(240,237,230,0.55);
          --gold: #c8a84b;
          --gold-dim: rgba(200,168,75,0.18);
          --gold-glow: rgba(200,168,75,0.35);
          --blue: #2A3F6B;
          --rule: rgba(30,42,61,0.9);
          --rule-bright: rgba(200,168,75,0.25);
          --muted: #6B7A94;
          --ff-display: 'Syne', sans-serif;
          --ff-body: 'EB Garamond', serif;
          --ff-mono: 'IBM Plex Mono', monospace;
        }
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--ink); font-family: var(--ff-body); overflow-x: hidden; cursor: none; }

        #cursor { position:fixed; width:10px; height:10px; background:var(--gold); border-radius:50%; pointer-events:none; z-index:9999; transition:transform 0.15s ease,opacity 0.3s; mix-blend-mode:screen; }
        #cursor-ring { position:fixed; width:36px; height:36px; border:1px solid rgba(200,168,75,0.5); border-radius:50%; pointer-events:none; z-index:9998; transition:transform 0.4s cubic-bezier(0.23,1,0.32,1),width 0.3s,height 0.3s,opacity 0.3s; }
        body:has(a:hover) #cursor,body:has(button:hover) #cursor { transform:scale(2.5); }
        body:has(a:hover) #cursor-ring,body:has(button:hover) #cursor-ring { width:56px; height:56px; opacity:0.4; }

        #starfield { position:fixed; inset:0; z-index:0; pointer-events:none; }

        #nav { position:fixed; top:0; left:0; right:0; z-index:500; height:56px; display:flex; align-items:center; justify-content:space-between; padding:0 48px; border-bottom:0.5px solid var(--rule); background:rgba(6,10,16,0.75); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); transition:background 0.4s; }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--ff-display);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: var(--gold);
          text-transform: uppercase;
        }

        .nav-icon {
          height: 50px;
          width: auto;
          object-fit: contain;
        }
        .nav-divider {
          height: 20px;
          width: 1px;
          background: var(--rule-bright);
          opacity: 0.5;
          margin: 0 4px; 
        }
        .nav-links { display:flex; gap:32px; list-style:none; }
        .nav-links a { font-family:var(--ff-mono); font-size:0.58rem; color:var(--muted); text-decoration:none; letter-spacing:0.12em; text-transform:uppercase; transition:color 0.25s; }
        .nav-links a:hover { color:var(--gold); }
        .nav-pill { font-family:var(--ff-mono); font-size:0.55rem; color:var(--bg); background:var(--gold); padding:6px 16px; letter-spacing:0.12em; text-transform:uppercase; text-decoration:none; transition:opacity 0.2s; }
        .nav-pill:hover { opacity:0.8; }

        #progress { position:fixed; top:0; left:0; height:2px; background:linear-gradient(90deg,var(--gold),#e8c870); z-index:600; width:0%; transition:width 0.1s linear; }

        section { position:relative; z-index:10; min-height:100vh; display:flex; flex-direction:column; justify-content:center; overflow:hidden; }
        .inner { max-width:1080px; margin:0 auto; padding:0 48px; width:100%; }
        .vline { position:absolute; top:0; bottom:0; width:0.5px; background:var(--rule); z-index:1; }
        .label { font-family:var(--ff-mono); font-size:0.6rem; color:var(--gold); letter-spacing:0.2em; text-transform:uppercase; margin-bottom:16px; }
        .label-muted { color:var(--muted); }
        .hr { width:100%; height:0.5px; background:var(--rule); margin:24px 0; }
        .hr-gold { background:var(--rule-bright); }

        .reveal { opacity:0; transform:translateY(32px); transition:opacity 0.8s cubic-bezier(0.23,1,0.32,1),transform 0.8s cubic-bezier(0.23,1,0.32,1); }
        .reveal.visible { opacity:1; transform:translateY(0); }
        .reveal-delay-1 { transition-delay:0.1s; }
        .reveal-delay-2 { transition-delay:0.2s; }
        .reveal-delay-3 { transition-delay:0.3s; }
        .reveal-delay-4 { transition-delay:0.4s; }
        .reveal-delay-5 { transition-delay:0.5s; }
        .reveal-delay-6 { transition-delay:0.6s; }

        #hero { min-height:100vh; justify-content:flex-end; padding-bottom:80px; }
        .hero-bg { position:absolute; inset:0; background:radial-gradient(ellipse 60% 50% at 80% 30%,rgba(200,168,75,0.06) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 20% 80%,rgba(42,63,107,0.15) 0%,transparent 60%); }
        .hero-orbit { position:absolute; border-radius:50%; border:0.5px solid rgba(200,168,75,0.06); animation:spin 60s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .hero-orbit-1 { width:900px; height:900px; top:-300px; right:-200px; animation-duration:80s; }
        .hero-orbit-2 { width:600px; height:600px; top:-100px; right:50px; animation-duration:50s; animation-direction:reverse; border-color:rgba(200,168,75,0.04); }
        .hero-eyebrow { font-family:var(--ff-mono); font-size:0.6rem; color:var(--muted); letter-spacing:0.3em; text-transform:uppercase; margin-bottom:20px; }
        .hero-title { font-family:var(--ff-display); font-size:clamp(4.5rem,12vw,9rem); font-weight:800; line-height:0.85; letter-spacing:-0.04em; color:var(--ink); margin-bottom:24px; overflow:hidden; }
        .hero-title span { display:block; }
        .hero-title .gold-word { color:var(--gold); }
        .hero-sub { font-family:var(--ff-display); font-size:1rem; letter-spacing:0.4em; color:var(--muted); text-transform:uppercase; margin-bottom:40px; }
        .hero-bottom { display:flex; align-items:flex-end; justify-content:space-between; margin-top:40px; }
        .hero-desc { font-family:var(--ff-body); font-size:1rem; color:var(--ink-dim); line-height:1.7; max-width:380px; }
        .hero-badge { font-family:var(--ff-mono); font-size:0.55rem; color:var(--muted); letter-spacing:0.15em; text-align:right; line-height:2; text-transform:uppercase; }
        .cta-btn { display:inline-flex; align-items:center; gap:12px; margin-top:32px; font-family:var(--ff-mono); font-size:0.65rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--gold); text-decoration:none; border:0.5px solid var(--gold-dim); padding:14px 28px; transition:background 0.25s,border-color 0.25s; position:relative; overflow:hidden; }
        .cta-btn::before { content:''; position:absolute; inset:0; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform 0.35s cubic-bezier(0.23,1,0.32,1); z-index:0; }
        .cta-btn:hover::before { transform:scaleX(1); }
        .cta-btn:hover { color:var(--bg); border-color:var(--gold); }
        .cta-btn span { position:relative; z-index:1; }
        .arrow { display:inline-block; transition:transform 0.25s; }
        .cta-btn:hover .arrow { transform:translateX(6px); }

        .ticker-wrap { background:var(--gold); overflow:hidden; height:40px; display:flex; align-items:center; position:relative; z-index:20; }
        .ticker { display:flex; white-space:nowrap; animation:ticker 25s linear infinite; }
        .ticker span { font-family:var(--ff-mono); font-size:0.6rem; font-weight:500; letter-spacing:0.15em; color:var(--bg); padding:0 32px; text-transform:uppercase; }
        .ticker-dot { color:var(--bg); opacity:0.4; }
        @keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-50%); } }

        #institution { padding:120px 0; }
        .inst-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
        .inst-heading { font-family:var(--ff-display); font-size:clamp(2rem,4vw,3.2rem); font-weight:700; letter-spacing:-0.03em; color:var(--ink); line-height:1.05; margin-bottom:24px; }
        .inst-body { font-family:var(--ff-body); font-size:1.05rem; color:var(--ink-dim); line-height:1.75; margin-bottom:32px; }
        .inst-right { display:flex; flex-direction:column; gap:12px; }
        .fact-card { background:var(--surface); border:0.5px solid var(--rule); border-left:2px solid var(--gold); padding:16px 20px; display:flex; align-items:center; gap:20px; transition:background 0.25s,transform 0.25s; }
        .fact-card:hover { background:var(--surface2); transform:translateX(4px); }
        .fact-num { font-family:var(--ff-display); font-size:1.8rem; font-weight:800; color:var(--gold); letter-spacing:-0.04em; min-width:72px; line-height:1; }
        .fact-text { font-family:var(--ff-mono); font-size:0.62rem; color:var(--muted); letter-spacing:0.08em; text-transform:uppercase; line-height:1.5; }
        .guides-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:24px; }
        .guide-item { font-family:var(--ff-body); font-size:0.88rem; color:var(--ink); padding:8px 0; border-bottom:0.5px solid var(--rule); display:flex; align-items:center; gap:8px; }
        .guide-item::before { content:''; width:4px; height:4px; border-radius:50%; background:var(--gold); flex-shrink:0; }

        #stats { padding:100px 0; background:linear-gradient(180deg,transparent,rgba(13,20,32,0.8),transparent); }
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:0; }
        .stat-item { padding:48px 32px; border-right:0.5px solid var(--rule); border-top:0.5px solid var(--rule); position:relative; overflow:hidden; transition:background 0.3s; }
        .stat-item:first-child { border-left:0.5px solid var(--rule); }
        .stat-item::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform 0.4s cubic-bezier(0.23,1,0.32,1); }
        .stat-item:hover { background:var(--surface); }
        .stat-item:hover::after { transform:scaleX(1); }
        .stat-num { font-family:var(--ff-display); font-size:clamp(3rem,5vw,5rem); font-weight:800; color:var(--gold); letter-spacing:-0.05em; line-height:0.9; margin-bottom:12px; }
        .stat-label { font-family:var(--ff-mono); font-size:0.58rem; color:var(--muted); letter-spacing:0.15em; text-transform:uppercase; }

        #legacy { padding:120px 0; }
        .legacy-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:var(--rule); margin-top:40px; }
        .legacy-card { background:var(--bg); padding:36px 32px; position:relative; overflow:hidden; transition:background 0.3s; }
        .legacy-card::before { content:''; position:absolute; top:0; left:0; width:100%; height:2px; background:linear-gradient(90deg,var(--gold),transparent); opacity:0; transition:opacity 0.3s; }
        .legacy-card:hover { background:var(--surface); }
        .legacy-card:hover::before { opacity:1; }
        .legacy-role { font-family:var(--ff-mono); font-size:0.55rem; color:var(--muted); letter-spacing:0.15em; text-transform:uppercase; margin-bottom:8px; }
        .legacy-name { font-family:var(--ff-display); font-size:1.1rem; font-weight:700; color:var(--ink); margin-bottom:4px; }
        .legacy-desc { font-family:var(--ff-body); font-size:0.85rem; font-style:italic; color:var(--muted); line-height:1.5; }
        .legacy-num { position:absolute; bottom:20px; right:24px; font-family:var(--ff-display); font-size:4rem; font-weight:800; color:var(--ink); opacity:0.04; line-height:1; }

        #why { padding:120px 0; }
        .why-intro { display:grid; grid-template-columns:1fr 1.6fr; gap:80px; align-items:start; margin-bottom:56px; }
        .why-heading { font-family:var(--ff-display); font-size:clamp(2.5rem,5vw,4rem); font-weight:800; letter-spacing:-0.04em; line-height:0.92; color:var(--ink); position:sticky; top:100px; }
        .why-heading .accent { color:var(--gold); }
        .why-benefits { display:flex; flex-direction:column; gap:0; }
        .benefit-row { display:grid; grid-template-columns:56px 1fr; gap:24px; align-items:start; padding:20px 0; border-bottom:0.5px solid var(--rule); transition:padding-left 0.3s; }
        .benefit-row:hover { padding-left:8px; }
        .benefit-num { font-family:var(--ff-mono); font-size:0.55rem; color:var(--gold); letter-spacing:0.1em; padding-top:4px; }
        .benefit-title { font-family:var(--ff-display); font-size:0.92rem; font-weight:600; color:var(--ink); margin-bottom:4px; }
        .benefit-desc { font-family:var(--ff-body); font-size:0.85rem; font-style:italic; color:var(--muted); line-height:1.55; }

        #tiers { padding:120px 0; }
        .tiers-heading { font-family:var(--ff-display); font-size:clamp(2rem,4vw,3.2rem); font-weight:800; letter-spacing:-0.04em; color:var(--ink); margin-bottom:12px; }
        .tier-tabs { display:flex; gap:0; border:0.5px solid var(--rule); margin:32px 0 48px; overflow-x:auto; }
        .tier-tab { flex:1; padding:14px 20px; font-family:var(--ff-mono); font-size:0.58rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted); background:none; border:none; border-right:0.5px solid var(--rule); cursor:pointer; transition:background 0.2s,color 0.2s; white-space:nowrap; }
        .tier-tab:last-child { border-right:none; }
        .tier-tab:hover { color:var(--ink); background:var(--surface); }
        .tier-tab.active { background:var(--gold); color:var(--bg); font-weight:600; }
        .tier-panel { display:none; }
        .tier-panel.active { display:block; animation:fadeUp 0.4s ease; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .tier-panel-header { display:flex; align-items:baseline; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:32px; padding-bottom:24px; border-bottom:0.5px solid var(--rule-bright); }
        .tier-name { font-family:var(--ff-display); font-size:clamp(1.8rem,4vw,2.8rem); font-weight:800; color:var(--ink); letter-spacing:-0.04em; }
        .tier-price { font-family:var(--ff-mono); font-size:2rem; color:var(--gold); letter-spacing:-0.02em; }
        .tier-slots { font-family:var(--ff-mono); font-size:0.6rem; color:var(--muted); letter-spacing:0.15em; text-transform:uppercase; margin-bottom:24px; }
        .tier-benefits-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .tier-benefit { display:flex; gap:16px; padding:16px; background:var(--surface); border:0.5px solid var(--rule); border-left:2px solid var(--gold-dim); transition:border-left-color 0.2s,background 0.2s; }
        .tier-benefit:hover { border-left-color:var(--gold); background:var(--surface2); }
        .tb-num { font-family:var(--ff-mono); font-size:0.55rem; color:var(--gold); min-width:24px; margin-top:2px; }
        .tb-title { font-family:var(--ff-display); font-size:0.82rem; color:var(--ink); margin-bottom:3px; }
        .tb-desc { font-family:var(--ff-body); font-size:0.78rem; font-style:italic; color:var(--muted); line-height:1.4; }

        .tier-table-wrap { margin-top:56px; overflow:hidden; border:0.5px solid var(--rule); }
        .tier-table { width:100%; border-collapse:collapse; }
        .tier-table thead tr { background:var(--gold); }
        .tier-table thead th { font-family:var(--ff-mono); font-size:0.62rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--bg); padding:12px 16px; text-align:left; }
        .tier-table thead th:last-child { text-align:right; }
        .tier-table tbody tr { border-bottom:0.5px solid var(--rule); transition:background 0.2s; }
        .tier-table tbody tr:nth-child(even) { background:var(--surface); }
        .tier-table tbody tr:hover { background:rgba(200,168,75,0.05); }
        .tier-table td { font-family:var(--ff-mono); font-size:0.65rem; padding:11px 16px; color:var(--ink); }
        .tier-table td:last-child { text-align:right; color:var(--gold); }
        .tier-table .tier-tag { font-size:0.52rem; letter-spacing:0.12em; padding:3px 8px; border:0.5px solid currentColor; }
        .t1 { color:var(--gold); border-left:2px solid var(--gold); }
        .t2 { color:#7B8EA8; border-left:2px solid #7B8EA8; }
        .t3 { color:#3A4F6A; border-left:2px solid #3A4F6A; }
        .t4 { color:var(--muted); border-left:2px solid var(--rule); }

        #sponsors { padding:80px 0; border-top:0.5px solid var(--rule); }
        .sponsors-marquee-wrap {
          overflow: hidden;
          margin-top: 32px;
          width: 100%;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
        }
        .marquee-belt {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .marquee-belt--left  { animation: marqLeft  36s linear infinite; }
        .marquee-belt--right { animation: marqRight 28s linear infinite; }
        .sponsors-marquee-wrap:hover .marquee-belt { animation-play-state: paused; }
        .marquee-track {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-right: 10px;
          flex-shrink: 0;
        }
        @keyframes marqLeft  { 0% { transform: translateX(0); }    100% { transform: translateX(-50%); } }
        @keyframes marqRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); }    }

        .sponsor-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          min-width: 168px;
          max-width: 400px;
          padding: 0 22px;
          background: var(--surface);
          border: 0.5px solid rgba(30,42,61,0.95);
          flex-shrink: 0;
          transition: border-color 0.22s, background 0.22s, transform 0.22s;
        }
        .sponsor-chip:hover {
          border-color: rgba(200,168,75,0.35);
          background: var(--surface2);
          transform: translateY(-3px);
        }
        .sponsor-chip img {
          display: block;
          max-height: 180px;
          max-width: 300px;
          width: auto;
          height: auto;
          object-fit: contain;
          opacity: 0.9;
          transition: opacity 0.22s;
        }
        .sponsor-chip:hover img { opacity: 1; }
        .sponsor-chip.keep-colour img {
          filter: none;
          opacity: 0.80;
        }
        .sponsor-chip.keep-colour:hover img { opacity: 1; }

        #contact { padding:120px 0; }
        .contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start; }
        .contact-heading { font-family:var(--ff-display); font-size:clamp(3rem,6vw,5.5rem); font-weight:800; letter-spacing:-0.05em; line-height:0.88; color:var(--ink); margin-bottom:32px; }
        .contact-heading .gold { color:var(--gold); }
        .contact-body { font-family:var(--ff-body); font-size:1rem; color:var(--ink-dim); line-height:1.7; margin-bottom:32px; }
        .contact-email { font-family:var(--ff-mono); font-size:0.75rem; color:var(--gold); letter-spacing:0.08em; padding:16px 0; border-top:0.5px solid var(--rule-bright); border-bottom:0.5px solid var(--rule-bright); margin-top:8px; }
        .contact-cards { display:flex; flex-direction:column; gap:12px; }
        .contact-card { background:var(--surface); border:0.5px solid var(--rule); padding:24px; position:relative; overflow:hidden; transition:background 0.25s,transform 0.25s; }
        .contact-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:var(--gold); }
        .contact-card:hover { background:var(--surface2); transform:translateX(4px); }
        .cc-role { font-family:var(--ff-mono); font-size:0.55rem; color:var(--gold); letter-spacing:0.2em; text-transform:uppercase; margin-bottom:8px; }
        .cc-name { font-family:var(--ff-display); font-size:1.1rem; font-weight:700; color:var(--ink); margin-bottom:6px; }
        .cc-phone { font-family:var(--ff-mono); font-size:0.78rem; color:var(--muted); letter-spacing:0.05em; }

        footer { position:relative; z-index:10; padding:64px 48px 40px; border-top:0.5px solid var(--rule); background:var(--surface); }
        .footer-top { display:flex; align-items:flex-start; justify-content:space-between; gap:40px; flex-wrap:wrap; margin-bottom:40px; }
        .footer-brand { font-family:var(--ff-display); font-size:3rem; font-weight:800; letter-spacing:-0.05em; color:var(--ink); opacity:0.08; line-height:1; }
        .footer-links { display:flex; flex-direction:column; gap:8px; }
        .footer-links a { font-family:var(--ff-mono); font-size:0.62rem; color:var(--muted); text-decoration:none; letter-spacing:0.08em; transition:color 0.2s; }
        .footer-links a:hover { color:var(--gold); }
        .footer-bottom { display:flex; align-items:center; justify-content:space-between; padding-top:24px; border-top:0.5px solid var(--rule); font-family:var(--ff-mono); font-size:0.55rem; color:var(--muted); letter-spacing:0.1em; flex-wrap:wrap; gap:8px; }

        .scroll-indicator { position:absolute; bottom:40px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:8px; animation:bobble 2s ease-in-out infinite; }
        @keyframes bobble { 0%,100% { transform:translateX(-50%) translateY(0); } 50% { transform:translateX(-50%) translateY(8px); } }
        .si-line { width:0.5px; height:40px; background:linear-gradient(to bottom,var(--gold),transparent); }
        .si-label { font-family:var(--ff-mono); font-size:0.5rem; color:var(--muted); letter-spacing:0.2em; text-transform:uppercase; }

        #toast { position:fixed; bottom:32px; right:32px; z-index:1000; background:var(--gold); color:var(--bg); font-family:var(--ff-mono); font-size:0.65rem; letter-spacing:0.12em; padding:12px 24px; transform:translateY(80px); opacity:0; transition:transform 0.4s cubic-bezier(0.23,1,0.32,1),opacity 0.4s; pointer-events:none; }
        #toast.show { transform:translateY(0); opacity:1; }

        @media (max-width:768px) {
          .inst-grid,.why-intro,.tier-benefits-grid,.contact-grid { grid-template-columns:1fr; }
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .legacy-grid { grid-template-columns:1fr; }
          .stat-item:nth-child(2n) { border-right:0.5px solid var(--rule); }
          .nav-links { display:none; }
          #nav { padding:0 24px; }
          .inner { padding:0 24px; }
          footer { padding:48px 24px 32px; }
        }
      `}} />

      {/* DOM Interactive Blocks */}
      <div id="cursor"></div>
      <div id="cursor-ring"></div>
      <div id="progress"></div>
      <canvas id="starfield"></canvas>
      <div id="toast">COPIED TO CLIPBOARD</div>

      {/* Navigation */}
      <nav id="nav">
        <div className="nav-logo">
          <img src="https://upload.wikimedia.org/wikipedia/en/e/ec/Indian_Institute_of_Space_Science_and_Technology_Logo.svg" alt="IIST" className="nav-icon" />
          <div className="nav-divider"></div>
          <img src="https://media.licdn.com/dms/image/v2/D5603AQEIgCfyJRaDQQ/profile-displayphoto-scale_400_400/B56Z4RtIGIH8Ag-/0/1778413504054?e=1781740800&v=beta&t=Lwo8KFCM8mjhEXzHqzkRINunM6TN_cg-YRK7qdJAB2M" alt="C" className="nav-icon" />
          <span>Conscientia 2026</span>
        </div>
        <ul className="nav-links">
          <li><a href="#institution">Institute</a></li>
          <li><a href="#stats">Numbers</a></li>
          <li><a href="#why">Opportunity</a></li>
          <li><a href="#tiers">Tiers</a></li>
          <li><a href="#sponsors">Past Sponsors</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a href="mailto:financeteam.conscientia@gmail.com" className="nav-pill">Get in Touch</a>
      </nav>

      {/* Hero Section */}
      <section id="hero">
        <div className="hero-bg"></div>
        <div className="hero-orbit hero-orbit-1"></div>
        <div className="hero-orbit hero-orbit-2"></div>
        <div className="vline" style={{ left: "48px" }}></div>
        <div className="inner" style={{ paddingTop: "56px" }}>
          <p className="hero-eyebrow reveal">17th Edition &nbsp;·&nbsp; Indian Institute of Space Science & Technology &nbsp;·&nbsp; Dept. of Space, Govt. of India</p>
          <div className="hero-title reveal reveal-delay-1">
            <span>CON</span>
            <span className="gold-word">SCIEN</span>
            <span>TIA</span>
          </div>
          <p className="hero-sub reveal reveal-delay-2">Finance Brochure &nbsp;—&nbsp; 2026</p>
          <div className="hero-bottom reveal reveal-delay-3">
            <div>
              <p className="hero-desc">India's only space-dedicated technical festival. Your brand, in the orbit of the future.</p>
              <a href="#tiers" className="cta-btn"><span>View Sponsorship Tiers</span><span className="arrow">→</span></a>
            </div>
            <div className="hero-badge reveal reveal-delay-4">
              NAAC A++ Accredited<br />First Space Uni in Asia<br />Third in the World<br />
              <span style={{ color: "var(--gold)" }}>8.5°N 76.9°E — Thiruvananthapuram</span>
            </div>
          </div>
        </div>
        <div className="scroll-indicator"><div className="si-line"></div><div className="si-label">Scroll</div></div>
      </section>

      {/* Marquee Ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          <span>6,000+ Footfall</span><span className="ticker-dot">◆</span>
          <span>30+ Events</span><span className="ticker-dot">◆</span>
          <span>50K+ Social Reach</span><span className="ticker-dot">◆</span>
          <span>10+ Workshops</span><span className="ticker-dot">◆</span>
          <span>100+ Colleges</span><span className="ticker-dot">◆</span>
          <span>15 States</span><span className="ticker-dot">◆</span>
          <span>17th Edition</span><span className="ticker-dot">◆</span>
          <span>IIST · Dept. of Space</span><span className="ticker-dot">◆</span>
          <span>6,000+ Footfall</span><span className="ticker-dot">◆</span>
          <span>30+ Events</span><span className="ticker-dot">◆</span>
          <span>50K+ Social Reach</span><span className="ticker-dot">◆</span>
          <span>10+ Workshops</span><span className="ticker-dot">◆</span>
          <span>100+ Colleges</span><span className="ticker-dot">◆</span>
          <span>15 States</span><span className="ticker-dot">◆</span>
          <span>17th Edition</span><span className="ticker-dot">◆</span>
          <span>IIST · Dept. of Space</span><span className="ticker-dot">◆</span>
        </div>
      </div>

      {/* Institution */}
      <section id="institution">
        <div className="inner">
          <div className="inst-grid">
            <div>
              <p className="label reveal">01 — Institution</p>
              <h2 className="inst-heading reveal reveal-delay-1">India's only<br />space university.</h2>
              <div className="hr reveal reveal-delay-2"></div>
              <p className="inst-body reveal reveal-delay-2">Established in 2007 by the Department of Space, Government of India, with full support from ISRO. IIST is India's premier institute dedicated entirely to space science and technology.</p>
              <div className="guides-grid reveal reveal-delay-3">
                <div className="guide-item">Dr. APJ Abdul Kalam</div>
                <div className="guide-item">Dr. S. Somanath</div>
                <div className="guide-item">Dr. V. Narayanan</div>
                <div className="guide-item">Dr. BN Suresh</div>
                <div className="guide-item">Dr. S. Unnikrishnan Nair</div>
                <div className="guide-item">Dr. Dipankar Banerjee</div>
              </div>
            </div>
            <div className="inst-right reveal reveal-delay-2">
              <div className="fact-card"><div className="fact-num">2007</div><div className="fact-text">Founded by Dept. of Space,<br />Govt. of India</div></div>
              <div className="fact-card"><div className="fact-num">A++</div><div className="fact-text">NAAC Accredited — Highest Grade</div></div>
              <div className="fact-card"><div className="fact-num">#1</div><div className="fact-text">First space-dedicated university in Asia</div></div>
              <div className="fact-card"><div className="fact-num">#3</div><div className="fact-text">Third space university in the world</div></div>
              <div className="fact-card"><div className="fact-num">17th</div><div className="fact-text">Edition of Conscientia — Annual Tech Fest</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers Stats */}
      <section id="stats">
        <div className="inner">
          <p className="label reveal">04 — By the Numbers</p>
          <div className="stats-grid">
            <div className="stat-item reveal"><div className="stat-num">6K+</div><div className="stat-label">Footfall</div></div>
            <div className="stat-item reveal reveal-delay-1"><div className="stat-num">30+</div><div className="stat-label">Events</div></div>
            <div className="stat-item reveal reveal-delay-2"><div className="stat-num">50K+</div><div className="stat-label">Social Media Reach</div></div>
            <div className="stat-item reveal reveal-delay-3"><div className="stat-num">10+</div><div className="stat-label">Workshops</div></div>
          </div>
        </div>
      </section>

      {/* Legacy */}
      <section id="legacy">
        <div className="inner">
          <p className="label reveal">02 — Legacy</p>
          <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: "8px" }} className="reveal reveal-delay-1">India's Space Legacy</h2>
          <p style={{ fontFamily: "var(--ff-body)", fontStyle: "italic", color: "var(--muted)", marginBottom: 0 }} className="reveal reveal-delay-2">The shoulders on which India's space programme stands.</p>
          <div className="legacy-grid reveal reveal-delay-2">
            <div className="legacy-card"><div className="legacy-role">External Affairs Minister</div><div className="legacy-name">Dr. S. Jaishankar</div><div className="legacy-desc">India's Space Diplomacy — champion of international space cooperation</div><div className="legacy-num">01</div></div>
            <div className="legacy-card"><div className="legacy-role">NASA Astronaut</div><div className="legacy-name">Sunita Williams</div><div className="legacy-desc">ISS Commander — Indian-origin pioneer of human spaceflight</div><div className="legacy-num">02</div></div>
            <div className="legacy-card"><div className="legacy-role">India's First Astronaut</div><div className="legacy-name">Rakesh Sharma</div><div className="legacy-desc">Soyuz T-11, 1984 — first Indian citizen to travel to space</div><div className="legacy-num">03</div></div>
            <div className="legacy-card"><div className="legacy-role">ISRO-Axiom Mission</div><div className="legacy-name">Shubhanshu Shukla</div><div className="legacy-desc">Ax-4, 2025 — India's newest face in human spaceflight</div><div className="legacy-num">04</div></div>
          </div>
          <p style={{ fontFamily: "var(--ff-body)", fontSize: "0.88rem", fontStyle: "italic", color: "var(--muted)", marginTop: "24px", paddingLeft: "16px", borderLeft: "1px solid var(--rule)" }} className="reveal">IIST alumni now work directly alongside these figures in India's space programme.</p>
        </div>
      </section>

      {/* Opportunity */}
      <section id="why" style={{ background: "linear-gradient(180deg,transparent,rgba(13,20,32,0.6),transparent)" }}>
        <div className="inner">
          <div className="why-intro">
            <div>
              <p className="label reveal">05 — The Opportunity</p>
              <h2 className="why-heading reveal reveal-delay-1">Why<br />sponsor<br /><span className="accent">us?</span></h2>
            </div>
            <div>
              <p style={{ fontFamily: "var(--ff-body)", fontSize: "1.05rem", color: "var(--ink-dim)", lineHeight: 1.75, marginBottom: "40px" }} className="reveal">Conscientia is the only technical festival in India hosted inside an active space research ecosystem. Your brand reaches students who will work at ISRO, HAL, and India's emerging private space companies.</p>
              <div className="why-benefits">
                <div className="benefit-row reveal"><div className="benefit-num">01.</div><div><div className="benefit-title">Talent Pipeline Access</div><div className="benefit-desc">Direct recruitment reach into India's only space-dedicated talent pool.</div></div></div>
                <div className="benefit-row reveal reveal-delay-1"><div className="benefit-num">02.</div><div><div className="benefit-title">Brand Authority in Space Sector</div><div className="benefit-desc">Association with a Dept. of Space institution is unmatched in the engineering market.</div></div></div>
                <div className="benefit-row reveal reveal-delay-2"><div className="benefit-num">03.</div><div><div className="benefit-title">Dedicated Promo Content</div><div className="benefit-desc">Title sponsors receive a dedicated video on our YouTube channel and social media.</div></div></div>
                <div className="benefit-row reveal reveal-delay-3"><div className="benefit-num">04.</div><div><div className="benefit-title">Live Product Demos & Kiosks</div><div className="benefit-desc">Set up branded stalls and experiential zones on IIST campus during the 3-day fest.</div></div></div>
                <div className="benefit-row reveal reveal-delay-4"><div className="benefit-num">05.</div><div><div className="benefit-title">Opening Ceremony Speech</div><div className="benefit-desc">Address 1,000+ engineers, faculty, and guests at the inaugural event.</div></div></div>
                <div className="benefit-row reveal reveal-delay-5"><div className="benefit-num">06.</div><div><div className="benefit-title">CSR Recognition</div><div className="benefit-desc">IIST qualifies as an eligible partner under Schedule VII CSR mandates for STEM education.</div></div></div>
                <div className="benefit-row reveal"><div className="benefit-num">07.</div><div><div className="benefit-title">Measurable Post-Event Report</div><div className="benefit-desc">Engagement data, footfall stats, and photo documentation within 15 days.</div></div></div>
                <div className="benefit-row reveal reveal-delay-1"><div className="benefit-num">08.</div><div><div className="benefit-title">National Media Coverage</div><div className="benefit-desc">Press coverage in The Hindu, regional STEM media, and IIST communications.</div></div></div>
                <div className="benefit-row reveal reveal-delay-2"><div className="benefit-num">09.</div><div><div className="benefit-title">Webinar Hosting</div><div className="benefit-desc">Reach registered participants directly via Conscientia's YouTube channel.</div></div></div>
                <div className="benefit-row reveal reveal-delay-3"><div className="benefit-num">10.</div><div><div className="benefit-title">Event Co-Naming Rights</div><div className="benefit-desc">Your brand attached to a named event — 'Presented by [Company]'.</div></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section id="tiers">
        <div className="inner">
          <p className="label reveal">06 — Sponsorship Tiers</p>
          <h2 className="tiers-heading reveal reveal-delay-1">Sponsorship Tiers</h2>
          <p style={{ fontFamily: "var(--ff-body)", fontStyle: "italic", color: "var(--muted)", fontSize: "0.9rem" }} className="reveal reveal-delay-2">Select a tier below to explore benefits. Prices to be confirmed shortly.</p>
          <div className="tier-tabs reveal reveal-delay-2">
            <button className="tier-tab active" onClick={(e) => switchTier('title', e)}>Title</button>
            <button className="tier-tab" onClick={(e) => switchTier('associate', e)}>Associate</button>
            <button className="tier-tab" onClick={(e) => switchTier('hackathon', e)}>Hackathon</button>
            <button className="tier-tab" onClick={(e) => switchTier('cansat', e)}>CanSat</button>
            <button className="tier-tab" onClick={(e) => switchTier('workshop', e)}>Workshop</button>
            <button className="tier-tab" onClick={(e) => switchTier('social', e)}>Social Cause</button>
            <button className="tier-tab" onClick={(e) => switchTier('expo', e)}>Expo</button>
          </div>

          <div className="tier-panel active" id="panel-title">
            <div className="tier-panel-header"><div><div className="tier-name">Title Sponsor</div><div className="tier-slots">Tier I &nbsp;·&nbsp; Exclusive — 1 Slot Only</div></div><div className="tier-price">₹ [TBC]</div></div>
            <div className="tier-benefits-grid">
              <div className="tier-benefit"><div className="tb-num">01.</div><div><div className="tb-title">Festival Name Rights</div><div className="tb-desc">Event recognized as co-presented by your company.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">02.</div><div><div className="tb-title">Priority Logo Placement</div><div className="tb-desc">Logo position #1 across all physical and digital collateral.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">03.</div><div><div className="tb-title">Opening Ceremony Speech</div><div className="tb-desc">Dedicated address slot at inaugural event.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">04.</div><div><div className="tb-title">Dedicated Promo Video</div><div className="tb-desc">Produced and published on our YouTube channel.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">05.</div><div><div className="tb-title">2 Webinar Slots</div><div className="tb-desc">Host 2 sessions on your product/technology via Conscientia's platform.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">06.</div><div><div className="tb-title">Campus Kiosk Rights</div><div className="tb-desc">Full-assistance stall setup inside IIST campus.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">07.</div><div><div className="tb-title">Judging Rights</div><div className="tb-desc">Nominate a representative as event judge.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">08.</div><div><div className="tb-title">Swag Distribution</div><div className="tb-desc">Distribute branded merchandise to all participants.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">09.</div><div><div className="tb-title">Website & Social Listing</div><div className="tb-desc">Prominently listed as Title and Leading Sponsor.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">10.</div><div><div className="tb-title">Social Media Mentions</div><div className="tb-desc">Dedicated posts across all Conscientia channels.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">11.</div><div><div className="tb-title">Post-Event Report</div><div className="tb-desc">Full engagement data within 15 days of festival.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">12.</div><div><div className="tb-title">CSR Recognition</div><div className="tb-desc">Eligible for CSR credit under Schedule VII STEM education mandate.</div></div></div>
            </div>
          </div>

          <div className="tier-panel" id="panel-associate">
            <div className="tier-panel-header"><div><div className="tier-name">Associate Sponsor</div><div className="tier-slots">Tier II &nbsp;·&nbsp; 2 Slots Available</div></div><div className="tier-price">₹ [TBC]</div></div>
            <div className="tier-benefits-grid">
              <div className="tier-benefit"><div className="tb-num">01.</div><div><div className="tb-title">Website & Social Listing</div><div className="tb-desc">Listed as Associate Sponsor across all collaterals.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">02.</div><div><div className="tb-title">Dedicated Promo Video</div><div className="tb-desc">Produced and published on our YouTube channel.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">03.</div><div><div className="tb-title">1 Webinar Slot</div><div className="tb-desc">Host a session via Conscientia's platform.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">04.</div><div><div className="tb-title">Opening Ceremony Speech</div><div className="tb-desc">Dedicated address slot at inaugural event.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">05.</div><div><div className="tb-title">Stall Setup Rights</div><div className="tb-desc">Branded stall on IIST campus during the festival.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">06.</div><div><div className="tb-title">Judging Rights</div><div className="tb-desc">Nominate a representative as event judge.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">07.</div><div><div className="tb-title">Swag Distribution</div><div className="tb-desc">Distribute branded merchandise to participants.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">08.</div><div><div className="tb-title">Social Media Mentions</div><div className="tb-desc">Dedicated posts across all Conscientia channels.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">09.</div><div><div className="tb-title">Post-Event Engagement Report</div><div className="tb-desc">Full engagement data within 15 days.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">10.</div><div><div className="tb-title">CSR Recognition</div><div className="tb-desc">Eligible under Schedule VII CSR mandates for STEM education.</div></div></div>
            </div>
          </div>

          <div className="tier-panel" id="panel-hackathon">
            <div className="tier-panel-header"><div><div className="tier-name">Hackathon Sponsor</div><div className="tier-slots">Tier II &nbsp;·&nbsp; 3 Slots Available</div></div><div className="tier-price">₹ [TBC]</div></div>
            <div className="tier-benefits-grid">
              <div className="tier-benefit"><div className="tb-num">01.</div><div><div className="tb-title">Customised Event Segment</div><div className="tb-desc">Branded hackathon challenge tailored to your company's domain.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">02.</div><div><div className="tb-title">Problem Statement Co-Creation</div><div className="tb-desc">Problem designed in collaboration with IIST faculty.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">03.</div><div><div className="tb-title">Website & Social Listing</div><div className="tb-desc">Listed as Hackathon Sponsor across all collaterals.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">04.</div><div><div className="tb-title">1 Webinar Slot</div><div className="tb-desc">Host a session via Conscientia's platform.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">05.</div><div><div className="tb-title">Stall Setup Rights</div><div className="tb-desc">Branded presence on IIST campus during the festival.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">06.</div><div><div className="tb-title">Judging Rights</div><div className="tb-desc">Nominate a representative as hackathon judge.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">07.</div><div><div className="tb-title">Swag Distribution</div><div className="tb-desc">Distribute branded merchandise to hackathon participants.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">08.</div><div><div className="tb-title">Social Media Mentions</div><div className="tb-desc">Dedicated posts across all Conscientia channels.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">09.</div><div><div className="tb-title">Post-Event Report</div><div className="tb-desc">Full engagement data delivered within 15 days.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">10.</div><div><div className="tb-title">CSR Recognition</div><div className="tb-desc">Eligible under Schedule VII CSR mandates for STEM education.</div></div></div>
            </div>
          </div>

          <div className="tier-panel" id="panel-cansat">
            <div className="tier-panel-header"><div><div className="tier-name">CanSat Sponsor</div><div className="tier-slots">Tier II &nbsp;·&nbsp; 1 Slot Available</div></div><div className="tier-price">₹ [TBC]</div></div>
            <div className="tier-benefits-grid">
              <div className="tier-benefit"><div className="tb-num">01.</div><div><div className="tb-title">CanSat Event Co-Naming</div><div className="tb-desc">Your brand attached to India's premier student satellite competition.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">02.</div><div><div className="tb-title">Website & Social Listing</div><div className="tb-desc">Listed as CanSat Sponsor across all collaterals.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">03.</div><div><div className="tb-title">Judging Rights</div><div className="tb-desc">Nominate a representative as CanSat judge.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">04.</div><div><div className="tb-title">Stall Setup Rights</div><div className="tb-desc">Branded presence on IIST campus during the festival.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">05.</div><div><div className="tb-title">Swag Distribution</div><div className="tb-desc">Distribute branded merchandise to CanSat participants.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">06.</div><div><div className="tb-title">Social Media Mentions</div><div className="tb-desc">Dedicated posts across all Conscientia channels.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">07.</div><div><div className="tb-title">Post-Event Report</div><div className="tb-desc">Full engagement data within 15 days.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">08.</div><div><div className="tb-title">CSR Recognition</div><div className="tb-desc">Eligible under Schedule VII STEM education mandate.</div></div></div>
            </div>
          </div>

          <div className="tier-panel" id="panel-workshop">
            <div className="tier-panel-header"><div><div className="tier-name">Workshop Sponsor</div><div className="tier-slots">Tier III &nbsp;·&nbsp; Multiple Slots</div></div><div className="tier-price">₹ [TBC]</div></div>
            <div className="tier-benefits-grid">
              <div className="tier-benefit"><div className="tb-num">01.</div><div><div className="tb-title">Workshop Co-Naming</div><div className="tb-desc">Your brand on a dedicated workshop session.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">02.</div><div><div className="tb-title">Logo on Collaterals</div><div className="tb-desc">Listed across banners, posts, and campaign materials.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">03.</div><div><div className="tb-title">Stall Rights at Workshop</div><div className="tb-desc">Branded presence at workshop sessions.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">04.</div><div><div className="tb-title">Social Media Mentions</div><div className="tb-desc">Dedicated posts across all Conscientia channels.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">05.</div><div><div className="tb-title">Post-Event Report</div><div className="tb-desc">Engagement data within 15 days.</div></div></div>
            </div>
          </div>

          <div className="tier-panel" id="panel-social">
            <div className="tier-panel-header"><div><div className="tier-name">Social Cause Sponsor</div><div className="tier-slots">Tier III &nbsp;·&nbsp; Open Slots</div></div><div className="tier-price">₹ [TBC]</div></div>
            <div className="tier-benefits-grid">
              <div className="tier-benefit"><div className="tb-num">01.</div><div><div className="tb-title">Official Social Impact Partner</div><div className="tb-desc">Listed across all collaterals as Official Social Impact Partner.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">02.</div><div><div className="tb-title">Panel Discussion & Booth</div><div className="tb-desc">Dedicated space for awareness building and outreach.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">03.</div><div><div className="tb-title">Cause-Focused Event/Workshop</div><div className="tb-desc">Dedicated cause-focused event or workshop.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">04.</div><div><div className="tb-title">Logo on All Materials</div><div className="tb-desc">Logo on banners, posts, campaign materials.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">05.</div><div><div className="tb-title">Student Club Collaboration</div><div className="tb-desc">Collaborative initiative with IIST student clubs.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">06.</div><div><div className="tb-title">On-Ground Activation Space</div><div className="tb-desc">CSR mandate aligned activation on campus.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">07.</div><div><div className="tb-title">Speaking Slot</div><div className="tb-desc">Address audience at cause-related sessions.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">08.</div><div><div className="tb-title">Co-Branded Outreach</div><div className="tb-desc">Co-branded outreach across Conscientia's platforms.</div></div></div>
            </div>
          </div>

          <div className="tier-panel" id="panel-expo">
            <div className="tier-panel-header"><div><div className="tier-name">Expo Sponsor</div><div className="tier-slots">Tier IV &nbsp;·&nbsp; Open Slots</div></div><div className="tier-price">₹ [TBC]</div></div>
            <div className="tier-benefits-grid">
              <div className="tier-benefit"><div className="tb-num">01.</div><div><div className="tb-title">Branded Booth in Expo Zone</div><div className="tb-desc">Full setup support in the main expo area.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">02.</div><div><div className="tb-title">Website & Social Listing</div><div className="tb-desc">Listed as Expo Sponsor across all collaterals.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">03.</div><div><div className="tb-title">Social Media Mentions</div><div className="tb-desc">Dedicated posts across Conscientia channels.</div></div></div>
              <div className="tier-benefit"><div className="tb-num">04.</div><div><div className="tb-title">Post-Event Report</div><div className="tb-desc">Engagement data within 15 days.</div></div></div>
            </div>
          </div>

          <div className="tier-table-wrap reveal" style={{ marginTop: "56px" }}>
            <table className="tier-table">
              <thead><tr><th>Sponsorship Type</th><th>Slots</th><th>Tier</th><th>Amount</th></tr></thead>
              <tbody>
                <tr className="t1"><td>Title Sponsor</td><td>1</td><td><span className="tier-tag">TIER I</span></td><td>₹ [TBC]</td></tr>
                <tr className="t2"><td>Associate Sponsor</td><td>2</td><td><span className="tier-tag">TIER II</span></td><td>₹ [TBC]</td></tr>
                <tr className="t2"><td>Hackathon Sponsor</td><td>3</td><td><span className="tier-tag">TIER II</span></td><td>₹ [TBC]</td></tr>
                <tr className="t2"><td>CanSat Sponsor</td><td>1</td><td><span className="tier-tag">TIER II</span></td><td>₹ [TBC]</td></tr>
                <tr className="t3"><td>Workshop Sponsor</td><td>—</td><td><span className="tier-tag">TIER III</span></td><td>₹ [TBC]</td></tr>
                <tr className="t3"><td>Event Sponsor</td><td>—</td><td><span className="tier-tag">TIER III</span></td><td>₹ [TBC]</td></tr>
                <tr className="t3"><td>Social Cause</td><td>—</td><td><span className="tier-tag">TIER III</span></td><td>₹ [TBC]</td></tr>
                <tr className="t4"><td>Expo Sponsor</td><td>—</td><td><span className="tier-tag">TIER IV</span></td><td>₹ [TBC]</td></tr>
                <tr className="t4"><td>Travel Sponsor</td><td>—</td><td><span className="tier-tag">TIER IV</span></td><td>₹ [TBC]</td></tr>
                <tr className="t4"><td>Hospitality Sponsor</td><td>—</td><td><span className="tier-tag">TIER IV</span></td><td>₹ [TBC]</td></tr>
                <tr className="t4"><td>Media Partner</td><td>—</td><td><span className="tier-tag">TIER IV</span></td><td>₹ [TBC]</td></tr>
                <tr className="t4"><td>Logistics Sponsor</td><td>—</td><td><span className="tier-tag">TIER IV</span></td><td>₹ [TBC]</td></tr>
                <tr className="t4"><td>Educational Partner</td><td>—</td><td><span className="tier-tag">TIER IV</span></td><td>₹ [TBC]</td></tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontFamily: "var(--ff-body)", fontStyle: "italic", fontSize: "0.82rem", color: "var(--muted)", marginTop: "16px" }} className="reveal">All sponsorships include a post-event engagement report delivered within 15 days of the festival.</p>
        </div>
      </section>

      {/* Past Sponsors Marquees */}
      <section id="sponsors" style={{ padding: "100px 0" }}>
        <div className="inner">
          <p className="label reveal">11 — Previous Sponsors</p>
          <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: "8px" }} className="reveal reveal-delay-1">They trusted us.</h2>
          <p style={{ fontFamily: "var(--ff-body)", fontStyle: "italic", color: "var(--muted)", marginBottom: "40px" }} className="reveal reveal-delay-2">Brands from space, auto, gaming, FMCG, and finance.</p>
        </div>

        {/* Row 1 */}
        <div className="sponsors-marquee-wrap reveal">
          <div className="marquee-belt marquee-belt--left">
            <div className="marquee-track">
              <div className="sponsor-chip"><img src="https://cdn.prod.website-files.com/67fd1716df7556ab97191c1c/67ff42c9251ae6b792c9cfc4_Skyroot%20Logo.webp" alt="Skyroot Aerospace" /></div>
              <div className="sponsor-chip"><img src="https://framerusercontent.com/assets/ovw9sGfYYEv4xyzpXgGSMAvwQ.png" alt="Bellatrix Aerospace" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxbV1uRvUNiuhfUAaYN_a0ngtobRyayGv4IQ&s" alt="CDAC" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSldTOwKw3HL0UIYEXr9Qqogplm5oBAX0ztYg&s" alt="Satsure" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjta2-T6dd9T9Q0HWtogyzq1DSumo6EPu-8A&s" alt="NSIL" /></div>
              <div className="sponsor-chip"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d2/Logo_SKIFI.png" alt="SkyFi" /></div>
              <div className="sponsor-chip"><img src="https://rocketeers.in/wp-content/uploads//5-02-1.png" alt="Rocketeers" /></div>
              <div className="sponsor-chip"><img src="https://d502jbuhuh9wk.cloudfront.net/logos/643fcab0e4b0dacc7ae246bf.png?v=12" alt="Pacelab" /></div>
              <div className="sponsor-chip"><img src="https://www.aeronsystems.com/assets/images/resources/aeron%20Logo%20white.webp" alt="Aeron" /></div>
              <div className="sponsor-chip"><img src="https://quadratech.in/logo.png" alt="Quadratech" /></div>
              <div className="sponsor-chip"><img src="https://static.wixstatic.com/media/b99f19_971ff836cb0a491180f8bc81bff40442~mv2.png/v1/fill/w_376,h_212,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/NOPO(White).png" alt="Nobo Nanotechnologies" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgGNeDpEjlLIawpPBPe2NfjfVv_MfkuKNDxQ&s" alt="Aeronautical Society of India" /></div>
            </div>
            <div className="marquee-track">
              <div className="sponsor-chip"><img src="https://cdn.prod.website-files.com/67fd1716df7556ab97191c1c/67ff42c9251ae6b792c9cfc4_Skyroot%20Logo.webp" alt="Skyroot Aerospace" /></div>
              <div className="sponsor-chip"><img src="https://framerusercontent.com/assets/ovw9sGfYYEv4xyzpXgGSMAvwQ.png" alt="Bellatrix Aerospace" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxbV1uRvUNiuhfUAaYN_a0ngtobRyayGv4IQ&s" alt="CDAC" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSldTOwKw3HL0UIYEXr9Qqogplm5oBAX0ztYg&s" alt="Satsure" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjta2-T6dd9T9Q0HWtogyzq1DSumo6EPu-8A&s" alt="NSIL" /></div>
              <div className="sponsor-chip"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d2/Logo_SKIFI.png" alt="SkyFi" /></div>
              <div className="sponsor-chip"><img src="https://rocketeers.in/wp-content/uploads//5-02-1.png" alt="Rocketeers" /></div>
              <div className="sponsor-chip"><img src="https://d502jbuhuh9wk.cloudfront.net/logos/643fcab0e4b0dacc7ae246bf.png?v=12" alt="Pacelab" /></div>
              <div className="sponsor-chip"><img src="https://www.aeronsystems.com/assets/images/resources/aeron%20Logo%20white.webp" alt="Aeron" /></div>
              <div className="sponsor-chip"><img src="https://quadratech.in/logo.png" alt="Quadratech" /></div>
              <div className="sponsor-chip"><img src="https://static.wixstatic.com/media/b99f19_971ff836cb0a491180f8bc81bff40442~mv2.png/v1/fill/w_376,h_212,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/NOPO(White).png" alt="Nobo Nanotechnologies" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgGNeDpEjlLIawpPBPe2NfjfVv_MfkuKNDxQ&s" alt="Aeronautical Society of India" /></div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="sponsors-marquee-wrap reveal" style={{ marginTop: "12px" }}>
          <div className="marquee-belt marquee-belt--right">
            <div className="marquee-track">
              <div className="sponsor-chip"><img src="https://cimg1.ibsrv.net/ibimg/hgm/1920x1080-1/100/715/vw-logo_100715297.jpg" alt="Volkswagen" /></div>
              <div className="sponsor-chip"><img src="https://images.indianexpress.com/2022/07/Krafton_Logo1.jpg?w=1200" alt="Krafton" /></div>
              <div className="sponsor-chip"><img src="https://nodwingaming.com/wp-content/uploads/2024/10/Nodwin-logonew-1.png" alt="Nodwin Gaming" /></div>
              <div className="sponsor-chip"><img src="https://www.wowmomo.com/wp-content/uploads/2019/09/Wow_logo_website.png" alt="WOW Momo" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjIlDTuzKjg_d9bt16VCspqhfppIyx0okuYg&s" alt="Domino's" /></div>
              <div className="sponsor-chip"><img src="https://images.financialexpressdigital.com/2026/01/Copy-of-Copy-of-Gallery-25.jpg" alt="Union Bank of India" /></div>
              <div className="sponsor-chip"><img src="https://healthinsurancesahihai.com/wp-content/uploads/2024/02/nialogo-org.jpg" alt="New India Assurance" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxXVq2v1csTZcJ_gYS0hl61j5vwq_Rl1o6yw&s" alt="Grahaa" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT057NUUlpukJQj_robp-4H58anDeAR7tHw5A&s" alt="SPACE Empowering Life" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7vGH8eWqpj5tbJcftP7rhssHZhJbjBBuFRQ&s" alt="TDI" /></div>
            </div>
            <div className="marquee-track">
              <div className="sponsor-chip"><img src="https://cimg1.ibsrv.net/ibimg/hgm/1920x1080-1/100/715/vw-logo_100715297.jpg" alt="Volkswagen" /></div>
              <div className="sponsor-chip"><img src="https://images.indianexpress.com/2022/07/Krafton_Logo1.jpg?w=1200" alt="Krafton" /></div>
              <div className="sponsor-chip"><img src="https://nodwingaming.com/wp-content/uploads/2024/10/Nodwin-logonew-1.png" alt="Nodwin Gaming" /></div>
              <div className="sponsor-chip"><img src="https://www.wowmomo.com/wp-content/uploads/2019/09/Wow_logo_website.png" alt="WOW Momo" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjIlDTuzKjg_d9bt16VCspqhfppIyx0okuYg&s" alt="Domino's" /></div>
              <div className="sponsor-chip"><img src="https://images.financialexpressdigital.com/2026/01/Copy-of-Copy-of-Gallery-25.jpg" alt="Union Bank of India" /></div>
              <div className="sponsor-chip"><img src="https://healthinsurancesahihai.com/wp-content/uploads/2024/02/nialogo-org.jpg" alt="New India Assurance" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxXVq2v1csTZcJ_gYS0hl61j5vwq_Rl1o6yw&s" alt="Grahaa" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT057NUUlpukJQj_robp-4H58anDeAR7tHw5A&s" alt="SPACE Empowering Life" /></div>
              <div className="sponsor-chip"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7vGH8eWqpj5tbJcftP7rhssHZhJbjBBuFRQ&s" alt="TDI" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <div className="inner">
          <div className="contact-grid">
            <div>
              <p className="label reveal">12 — Contact</p>
              <h2 className="contact-heading reveal reveal-delay-1">Let's<br /><span className="gold">talk.</span></h2>
              <p className="contact-body reveal reveal-delay-2">Ready to be part of India's most exciting space-tech festival? Reach out to our finance team and we'll get back to you within 24 hours.</p>
              <div className="contact-email reveal reveal-delay-3" style={{ cursor: "pointer" }} onClick={copyEmail}>
                financeteam.conscientia@gmail.com <span style={{ fontSize: "0.5rem", opacity: 0.5, marginLeft: "12px" }}>CLICK TO COPY</span>
              </div>
              <div style={{ marginTop: "32px" }} className="reveal reveal-delay-4">
                <p className="label label-muted">Find us online</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                  <a href="https://conscientiaiist.co.in" style={{ fontFamily: "var(--ff-mono)", fontSize: "0.65rem", color: "var(--muted)", textDecoration: "none", letterSpacing: "0.08em", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color='var(--gold)'} onMouseOut={(e) => e.currentTarget.style.color='var(--muted)'}>↗ www.conscientiaiist.co.in</a>
                  <a href="#" style={{ fontFamily: "var(--ff-mono)", fontSize: "0.65rem", color: "var(--muted)", textDecoration: "none", letterSpacing: "0.08em", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color='var(--gold)'} onMouseOut={(e) => e.currentTarget.style.color='var(--muted)'}>↗ instagram.com/conscientia.iist</a>
                  <a href="#" style={{ fontFamily: "var(--ff-mono)", fontSize: "0.65rem", color: "var(--muted)", textDecoration: "none", letterSpacing: "0.08em", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color='var(--gold)'} onMouseOut={(e) => e.currentTarget.style.color='var(--muted)'}>↗ youtube.com/Conscientia IIST</a>
                  <a href="#" style={{ fontFamily: "var(--ff-mono)", fontSize: "0.65rem", color: "var(--muted)", textDecoration: "none", letterSpacing: "0.08em", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color='var(--gold)'} onMouseOut={(e) => e.currentTarget.style.color='var(--muted)'}>↗ linkedin.com/conscientia-iist</a>
                </div>
              </div>
            </div>
            <div className="contact-cards reveal reveal-delay-2">
              <div className="contact-card"><div className="cc-role">Finance Head</div><div className="cc-name">Gaurav Gill</div><div className="cc-phone">+91 70156 07428</div></div>
              <div className="contact-card"><div className="cc-role">Finance Head</div><div className="cc-name">Saatwik Chatkara</div><div className="cc-phone">+91 84483 27803</div></div>
              <div className="contact-card"><div className="cc-role">Finance Head</div><div className="cc-name">Sajan U</div><div className="cc-phone">+91 88388 64694</div></div>
              <div className="contact-card"><div className="cc-role" style={{ color: "var(--muted)" }}>Vice Chief Coordinator</div><div className="cc-name">Chirag</div><div className="cc-phone">+91 98677 71460</div></div>
              <div className="contact-card"><div className="cc-role" style={{ color: "var(--muted)" }}>Chief Coordinator</div><div className="cc-name">Niranjan Patil</div><div className="cc-phone">+91 98814 16709</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">CONSCIENTIA</div>
          <div className="footer-links">
            <a href="#institution">Institution</a>
            <a href="#stats">Numbers</a>
            <a href="#why">Opportunity</a>
            <a href="#tiers">Tiers</a>
            <a href="#contact">Contact</a>
            <a href="mailto:financeteam.conscientia@gmail.com">Email Us</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Indian Institute of Space Science and Technology · Thiruvananthapuram, Kerala · 8.5°N 76.9°E</span>
          <span>Department of Space, Govt. of India · 17th Edition · 2026</span>
        </div>
      </footer>
    </>
  );
}