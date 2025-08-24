import React, { useEffect, useRef, useState } from "react";

// Safe, novelty-only badge generator. Does NOT mimic any government ID. // Big watermark + banned keywords filter. No barcodes/MRZ/official seals.

const bannedWords = [ "passport", "driver", "licence", "license", "national id", "nin", "voter", "immigration", "police", "military", "army", "navy", "airforce", "nia", "customs", "frsc", "nia", "nigerian id", "ssn", "social security", ];

function containsBanned(text) { const t = (text || "").toLowerCase(); return bannedWords.some((w) => t.includes(w)); }

export default function NoveltyBadgeGenerator() { const canvasRef = useRef(null); const [form, setForm] = useState({ fullName: "Chris Savaj", role: "Club Member", org: "Tech2Learn Club", theme: "#1e88e5", accent: "#e3f2fd", }); const [photo, setPhoto] = useState(null); const [error, setError] = useState("");

const draw = () => { const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext("2d"); const w = 720; const h = 440; canvas.width = w; canvas.height = h;

// background
ctx.fillStyle = "#f8fafc"; // slate-50
ctx.fillRect(0, 0, w, h);

// card container with rounded corners
const radius = 28;
const drawRoundRect = (x, y, width, height, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

drawRoundRect(20, 20, w - 40, h - 40, radius);
ctx.fillStyle = "#ffffff";
ctx.fill();

// header band
ctx.save();
ctx.beginPath();
drawRoundRect(20, 20, w - 40, 120, radius);
ctx.clip();
ctx.fillStyle = form.theme;
ctx.fillRect(20, 20, w - 40, 120);
ctx.restore();

// org/title text
ctx.fillStyle = "#ffffff";
ctx.font = "700 28px system-ui, -apple-system, Segoe UI, Roboto";
ctx.fillText(form.org || "Organization", 40, 90);

// avatar circle
const avatarX = 100;
const avatarY = 240;
const avatarR = 70;

ctx.save();
ctx.beginPath();
ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
ctx.closePath();
ctx.clip();
// photo or placeholder
if (photo) {
  const { img, ratio } = photo;
  // cover
  const size = avatarR * 2;
  let sx = 0, sy = 0, sw = img.width, sh = img.height;
  const targetRatio = 1; // circle square box
  if (ratio > targetRatio) {
    // wider than tall
    const newW = img.height * targetRatio;
    sx = (img.width - newW) / 2;
    sw = newW;
  } else {
    const newH = img.width / targetRatio;
    sy = (img.height - newH) / 2;
    sh = newH;
  }
  ctx.drawImage(img, sx, sy, sw, sh, avatarX - avatarR, avatarY - avatarR, size, size);
} else {
  // placeholder
  ctx.fillStyle = form.accent;
  ctx.fillRect(avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
  ctx.fillStyle = form.theme;
  ctx.font = "600 18px system-ui, -apple-system, Segoe UI, Roboto";
  ctx.fillText("Photo", avatarX - 22, avatarY + 6);
}
ctx.restore();

// name & role
ctx.fillStyle = "#0f172a"; // slate-900
ctx.font = "700 30px system-ui, -apple-system, Segoe UI, Roboto";
ctx.fillText(form.fullName || "Full Name", 200, 230);

ctx.fillStyle = "#334155"; // slate-700
ctx.font = "500 22px system-ui, -apple-system, Segoe UI, Roboto";
ctx.fillText(form.role || "Role", 200, 268);

// decorative accent strip
ctx.fillStyle = form.accent;
ctx.fillRect(40, h - 100, w - 80, 14);

// footer info
ctx.fillStyle = "#475569"; // slate-600
ctx.font = "500 16px system-ui, -apple-system, Segoe UI, Roboto";
ctx.fillText("Member #" + String(Math.abs(hash(form.fullName + form.org))).slice(0, 8), 40, h - 40);

// BIG watermark
ctx.save();
ctx.translate(w / 2, h / 2);
ctx.rotate(-Math.PI / 6);
ctx.globalAlpha = 0.12;
ctx.fillStyle = "#0f172a";
ctx.font = "900 72px system-ui, -apple-system, Segoe UI, Roboto";
ctx.textAlign = "center";
ctx.fillText("NOT A REAL ID", 0, 0);
ctx.restore();

};

useEffect(() => { draw(); // eslint-disable-next-line react-hooks/exhaustive-deps }, [form, photo]);

const onFile = (e) => { const file = e.target.files?.[0]; if (!file) return; const img = new Image(); const url = URL.createObjectURL(file); img.onload = () => { setPhoto({ img, ratio: img.width / img.height }); URL.revokeObjectURL(url); }; img.src = url; };

const handleChange = (e) => { const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value })); };

const validateSafe = () => { const fields = [form.fullName, form.role, form.org]; if (fields.some((f) => containsBanned(f))) { setError( "Abeg no use words wey resemble real government ID (e.g., passport, license, NIN)." ); return false; } setError(""); return true; };

const downloadPNG = () => { if (!validateSafe()) return; const a = document.createElement("a"); a.download = ${(form.fullName || "badge").replace(/\s+/g, "_")}_novelty.png; a.href = canvasRef.current.toDataURL("image/png"); a.click(); };

return ( <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6"> <div className="max-w-5xl w-full grid md:grid-cols-2 gap-6"> <div className="bg-white rounded-2xl shadow p-5 space-y-4"> <h1 className="text-2xl font-bold">Novelty Badge (Safe Alternative)</h1> <p className="text-sm text-slate-600"> For events, clubs, or demos only. <strong>NOT</strong> a government ID. Don’t use official names, logos, or formats. </p>

<div className="grid grid-cols-1 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Full name</span>
          <input
            name="fullName"
            className="border rounded-xl px-3 py-2"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Ada Lovelace"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Role / Title</span>
          <input
            name="role"
            className="border rounded-xl px-3 py-2"
            value={form.role}
            onChange={handleChange}
            placeholder="Member"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Organization (fictional)</span>
          <input
            name="org"
            className="border rounded-xl px-3 py-2"
            value={form.org}
            onChange={handleChange}
            placeholder="My Club"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Theme color</span>
            <input
              type="color"
              name="theme"
              value={form.theme}
              onChange={handleChange}
              className="h-10 w-full border rounded-xl"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Accent color</span>
            <input
              type="color"
              name="accent"
              value={form.accent}
              onChange={handleChange}
              className="h-10 w-full border rounded-xl"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Photo (optional)</span>
          <input type="file" accept="image/*" onChange={onFile} />
        </label>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-2">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => {
            if (validateSafe()) draw();
          }}
          className="px-4 py-2 rounded-2xl bg-slate-900 text-white shadow"
        >
          Refresh Preview
        </button>
        <button
          onClick={downloadPNG}
          className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-900 border"
        >
          Download PNG
        </button>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-auto" />
    </div>
  </div>

  <p className="text-xs text-slate-500 mt-6 max-w-3xl text-center">
    Disclaimer: This tool is for novelty purposes only and must not be used to impersonate, 
    deceive, or replicate any government or official identification. No official names, logos, 
    symbols, barcodes, MRZ, or security features are allowed.
  </p>
</div>

); }

// Simple non-crypto hash for a fun member number function hash(str) { let h = 0; for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; } return h; }

