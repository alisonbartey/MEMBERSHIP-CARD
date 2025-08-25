import React, { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { createRoot } from "react-dom/client";
import * as qrcode from "qrcode";

// Safe, novelty-only badge generator. Does NOT mimic any government ID.
// Big watermark + banned keywords filter. No barcodes/MRZ/official seals.

const bannedWords = [
  "passport", "driver", "licence", "license", "national id", "nin", "voter",
  "immigration", "police", "military", "army", "navy", "airforce", "nia",
  "customs", "frsc", "nia", "nigerian id", "ssn", "social security",
];

function containsBanned(text) {
  const t = (text || "").toLowerCase();
  return bannedWords.some((w) => t.includes(w));
}

export default function NoveltyBadgeGenerator() {
  const canvasRef = useRef(null);
  const [form, setForm] = useState({
    fullName: "Chris Savaj",
    role: "Club Member",
    org: "Tech2Learn Club",
    department: "General",
    batch: "2025",
    expiry: "12/2026",
    theme: "#1e88e5",
    accent: "#e3f2fd",
    layout: "horizontal",
    bgStyle: "solid",
  });
  const [photo, setPhoto] = useState(null);
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState("");

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const isVertical = form.layout === "vertical";
    const w = isVertical ? 440 : 720;
    const h = isVertical ? 720 : 440;
    canvas.width = w;
    canvas.height = h;

    // === background ===
    if (form.bgStyle === "solid") {
      ctx.fillStyle = "#f8fafc"; // solid
      ctx.fillRect(0, 0, w, h);
    } else if (form.bgStyle === "gradient") {
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, form.theme);
      gradient.addColorStop(1, form.accent);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = form.accent;
      for (let i = 0; i < w; i += 40) {
        ctx.fillRect(i, 0, 20, h);
      }
    }

    // === card container ===
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

    // === header band ===
    ctx.save();
    ctx.beginPath();
    drawRoundRect(20, 20, w - 40, isVertical ? 150 : 120, radius);
    ctx.clip();
    ctx.fillStyle = form.theme;
    ctx.fillRect(20, 20, w - 40, isVertical ? 150 : 120);
    ctx.restore();

    // === org/title text ===
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 28px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText(form.org || "Organization", 40, isVertical ? 100 : 90);

    // === org logo if available ===
    if (logo) {
      ctx.drawImage(logo, w - 140, 30, 100, 100);
    }

    // === avatar circle ===
    const avatarX = isVertical ? w / 2 : 100;
    const avatarY = isVertical ? 280 : 240;
    const avatarR = 70;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (photo) {
      const { img, ratio } = photo;
      const size = avatarR * 2;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (ratio > 1) {
        const newW = img.height * 1;
        sx = (img.width - newW) / 2;
        sw = newW;
      } else {
        const newH = img.width / 1;
        sy = (img.height - newH) / 2;
        sh = newH;
      }
      ctx.drawImage(img, sx, sy, sw, sh, avatarX - avatarR, avatarY - avatarR, size, size);
    } else {
      ctx.fillStyle = form.accent;
      ctx.fillRect(avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
      ctx.fillStyle = form.theme;
      ctx.font = "600 18px system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillText("Photo", avatarX - 22, avatarY + 6);
    }
    ctx.restore();

    // === name & role ===
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 30px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText(form.fullName || "Full Name", isVertical ? 60 : 200, isVertical ? 420 : 230);

    ctx.fillStyle = "#334155";
    ctx.font = "500 22px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText(form.role || "Role", isVertical ? 60 : 200, isVertical ? 460 : 268);

    // === extra fields ===
    ctx.font = "500 18px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText("Dept: " + form.department, isVertical ? 60 : 200, isVertical ? 500 : 300);
    ctx.fillText("Batch: " + form.batch, isVertical ? 60 : 200, isVertical ? 530 : 330);
    ctx.fillText("Expiry: " + form.expiry, isVertical ? 60 : 200, isVertical ? 560 : 360);

const draw = async () => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const cardWidth = canvas.width;
  const cardHeight = canvas.height;

  // Clear canvas first
  ctx.clearRect(0, 0, cardWidth, cardHeight);

  // Draw card background
  ctx.fillStyle = "#f8f9fa";
  ctx.fillRect(0, 0, cardWidth, cardHeight);

  // Write text (example)
  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.fillText(form.fullName || "N/A", 20, 40);

   // === Generate QR ===
const qrCanvas = document.createElement("canvas");

// first generate QR inside qrCanvas
await qrcode.toCanvas(qrCanvas, form.fullName || "N/A", {
  margin: 1,
  width: 100,
});

// now turn that qrCanvas into image
const qrImg = new Image();
qrImg.src = qrCanvas.toDataURL();

// once image load, draw am to main card
qrImg.onload = () => {
  const qrX = cardWidth - 120;  // middle-right
  const qrY = cardHeight / 2 - 50;
  ctx.drawImage(qrImg, qrX, qrY, 100, 100);
};

  // Calculate middle-right position
  const qrX = cardWidth - 120; // padding from right
  const qrY = cardHeight / 2 - 50; // center vertically
  ctx.drawImage(qrCanvas, qrX, qrY, 100, 100);
};

    // === watermark ===
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

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, photo, logo]);

  const onFile = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      if (type === "photo") setPhoto({ img, ratio: img.width / img.height });
      if (type === "logo") setLogo(img);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validateSafe = () => {
    const fields = [form.fullName, form.role, form.org];
    if (fields.some((f) => containsBanned(f))) {
      setError(
        "Abeg no use words wey resemble real government ID (e.g., passport, license, NIN)."
      );
      return false;
    }
    setError("");
    return true;
  };

  const downloadPNG = () => {
    if (!validateSafe()) return;
    const a = document.createElement("a");
    a.download = `${(form.fullName || "badge").replace(/\s+/g, "_")}_novelty.png`;
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  };

    return (
  <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-6">
    <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-8">
      
      {/* === Left Column: Form === */}
      <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6 overflow-y-auto max-h-[90vh] border border-slate-200">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900">Membership Card Generator</h1>
          <p className="text-sm text-slate-600">
            For clubs, events, or demos only. <strong>NOT</strong> a government ID.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4">
          {/* Full name */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Full name</span>
            <input
              name="fullName"
              className="border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:outline-none"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Ada Lovelace"
            />
          </label>

          {/* Role */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Role / Title</span>
            <input
              name="role"
              className="border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:outline-none"
              value={form.role}
              onChange={handleChange}
              placeholder="Member"
            />
          </label>

          {/* Organization */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Organization</span>
            <input
              name="org"
              className="border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:outline-none"
              value={form.org}
              onChange={handleChange}
              placeholder="My Club"
            />
          </label>

          {/* Dept + Batch */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Department</span>
              <input
                name="department"
                className="border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                value={form.department}
                onChange={handleChange}
                placeholder="Science"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Batch</span>
              <input
                name="batch"
                className="border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                value={form.batch}
                onChange={handleChange}
                placeholder="2025"
              />
            </label>
          </div>

          {/* Expiry */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Expiry Date</span>
            <input
              name="expiry"
              className="border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:outline-none"
              value={form.expiry}
              onChange={handleChange}
              placeholder="12/2026"
            />
          </label>

          {/* Theme + Accent */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Theme color</span>
              <input
                type="color"
                name="theme"
                value={form.theme}
                onChange={handleChange}
                className="h-10 w-full border rounded-xl cursor-pointer"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Accent color</span>
              <input
                type="color"
                name="accent"
                value={form.accent}
                onChange={handleChange}
                className="h-10 w-full border rounded-xl cursor-pointer"
              />
            </label>
          </div>

          {/* Layout */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Layout</span>
            <select
              name="layout"
              value={form.layout}
              onChange={handleChange}
              className="border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:outline-none"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </label>

          {/* Background Style */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Background Style</span>
            <select
              name="bgStyle"
              value={form.bgStyle}
              onChange={handleChange}
              className="border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:outline-none"
            >
              <option value="solid">Solid</option>
              <option value="gradient">Gradient</option>
              <option value="stripes">Stripes</option>
            </select>
          </label>

          {/* Photo */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Photo</span>
            <input type="file" accept="image/*" onChange={(e) => onFile(e, "photo")} />
          </label>

          {/* Logo */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Organization Logo</span>
            <input type="file" accept="image/*" onChange={(e) => onFile(e, "logo")} />
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-2">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => {
              if (validateSafe()) draw();
            }}
            className="px-4 py-2 rounded-2xl bg-slate-900 text-white shadow hover:bg-slate-800 transition"
          >
            Refresh Preview
          </button>
          <button
            onClick={downloadPNG}
            className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-900 border hover:bg-slate-200 transition"
          >
            Download PNG
          </button>
        </div>
      </div>

      {/* === Right Column: Canvas Preview === */}
      <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center justify-center border border-slate-200">
        <canvas ref={canvasRef} className="w-full h-auto" />
      </div>
    </div>

    {/* Disclaimer */}
    <p className="text-xs text-slate-500 mt-6 max-w-3xl text-center">
      Disclaimer: This tool is for novelty purposes only and must not be used to impersonate,
      deceive, or replicate any government or official identification.
    </p>
  </div>
);
}
