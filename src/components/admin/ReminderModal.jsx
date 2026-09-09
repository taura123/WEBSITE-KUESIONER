import React, { useState } from "react";
import { MessageSquare, Mail, Send, Copy, Check, X, Users, Sparkles } from "lucide-react";

export default function ReminderModal({ isOpen, onClose }) {
  const [activeChannel, setActiveChannel] = useState("wa"); // 'wa' | 'email' | 'blast'
  const [copied, setCopied] = useState(false);
  const [alumniName, setAlumniName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [blastEmails, setBlastEmails] = useState(
    "alumni1@tau.ac.id, alumni2@gmail.com, alumni3@yahoo.com"
  );
  const [subject, setSubject] = useState("[TAU Tracer Study 2026] Undangan Pengisian Kuesioner Resmi Alumni");

  if (!isOpen) return null;

  const surveyUrl = window.location.origin;

  const templateText = `Halo Rekan Alumni TAU ${alumniName ? `*${alumniName}*` : "*Alumni*"},
Salam hangat dari Biro Kemahasiswaan & Alumni Tanri Abeng University.

Kami mengundang Anda untuk berpartisipasi dalam *Kuesioner Tracer Study Alumni TAU 2026*. Data Anda sangat berharga bagi evaluasi kurikulum dan pelaporan IKU-1 Kemendiktisaintek.

🔗 Tautan Pengisian: ${surveyUrl}
⏱️ Estimasi Waktu: 3 - 5 Menit

Terima kasih atas kontribusi Anda untuk almamater tercinta.
_Biro Kemahasiswaan & Alumni Tanri Abeng University_`;

  const emailBodyText = `Yth. Rekan Alumni Tanri Abeng University,

Semoga Bapak/Ibu/Rekan Alumni dalam keadaan sehat dan sukses selalu.

Dalam rangka penjaminan mutu pendidikan serta pelaporan Indikator Kinerja Utama (IKU-1) Perguruan Tinggi ke Kemendiktisaintek RI, Biro Kemahasiswaan & Alumni Tanri Abeng University mengundang seluruh lulusan untuk mengisikan Kuesioner Tracer Study Alumni 2026.

Pengisian kuesioner dapat diakses langsung melalui tautan berikut:
${surveyUrl}

Waktu pengisian diperkirakan hanya memerlukan 3 - 5 menit.

Atas partisipasi dan kontribusi aktif Anda demi kemajuan almamater Tanri Abeng University, kami ucapkan terima kasih yang sebesar-besarnya.

Hormat kami,
Biro Kemahasiswaan & Alumni (BKHA)
Tanri Abeng University
Email: alumni@tau.ac.id | Telp: (021) 5890-8888`;

  const handleCopyText = (txt) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = recipientPhone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(templateText)}`;
    window.open(url, "_blank");
  };

  const handleSendGmailSingle = () => {
    const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      recipientEmail
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBodyText)}`;
    window.open(mailtoUrl, "_blank");
  };

  const handleSendEmailBlast = () => {
    const cleanList = blastEmails
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 3);
    const bccList = cleanList.join(",");
    // Set official 'to' email to alumni@tau.ac.id so recipient email providers do not mark it as headerless spam
    const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=alumni@tau.ac.id&bcc=${encodeURIComponent(
      bccList
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBodyText)}`;
    window.open(mailtoUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-[#0F2042] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Reminder & Broadcast Center</h3>
              <p className="text-xs text-slate-300">
                Kirim pesan pengingat tracer study via WhatsApp, Gmail, atau Email Blast.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Selection Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
          <button
            onClick={() => setActiveChannel("wa")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeChannel === "wa"
                ? "bg-green-700 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Direct</span>
          </button>

          <button
            onClick={() => setActiveChannel("email")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeChannel === "email"
                ? "bg-[#1B3A7A] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Gmail Personal</span>
          </button>

          <button
            onClick={() => setActiveChannel("blast")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeChannel === "blast"
                ? "bg-purple-700 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Email Blast (BCC)</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs text-slate-800">
          {/* Mode 1: WhatsApp */}
          {activeChannel === "wa" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700">Nama Alumni</label>
                  <input
                    type="text"
                    placeholder="Contoh: Aditya Pratama"
                    value={alumniName}
                    onChange={(e) => setAlumniName(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700">Nomor WhatsApp Alumni</label>
                  <input
                    type="text"
                    placeholder="Contoh: 081287654321"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="form-input text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Pratinjau Pesan WA:</label>
                  <button
                    type="button"
                    onClick={() => handleCopyText(templateText)}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Tersalin!" : "Salin Pesan"}</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  readOnly
                  value={templateText}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-sans text-xs text-slate-700 select-all"
                />
              </div>
            </>
          )}

          {/* Mode 2: Single Gmail */}
          {activeChannel === "email" && (
            <>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Alamat Email Alumni</label>
                <input
                  type="email"
                  placeholder="alumni@email.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Subjek Email</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-input text-xs font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Isi Email Gmail:</label>
                  <button
                    type="button"
                    onClick={() => handleCopyText(emailBodyText)}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Tersalin!" : "Salin Format"}</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  readOnly
                  value={emailBodyText}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed select-all"
                />
              </div>
            </>
          )}

          {/* Mode 3: Email Blast */}
          {activeChannel === "blast" && (
            <>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">
                  Daftar Email Banyak Alumni (Pisahkan dengan koma atau baris baru)
                </label>
                <textarea
                  rows={3}
                  placeholder="alumni1@tau.ac.id, alumni2@gmail.com, alumni3@yahoo.com"
                  value={blastEmails}
                  onChange={(e) => setBlastEmails(e.target.value)}
                  className="form-input text-xs font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  * Email akan dikirim menggunakan metode <strong>BCC (Blind Carbon Copy)</strong> agar antar alumni tidak saling melihat email alumni lainnya.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">Subjek Email</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-input text-xs font-medium"
                />
              </div>

              <div>
                <textarea
                  rows={5}
                  readOnly
                  value={emailBodyText}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed select-all"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button onClick={onClose} className="btn-ghost text-xs py-2 px-4">
            Batal
          </button>

          {activeChannel === "wa" && (
            <button
              disabled={!recipientPhone}
              onClick={handleOpenWhatsApp}
              className="btn-primary text-xs py-2 px-4 bg-green-700 hover:bg-green-800 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Buka WhatsApp Web</span>
            </button>
          )}

          {activeChannel === "email" && (
            <button
              disabled={!recipientEmail}
              onClick={handleSendGmailSingle}
              className="btn-primary text-xs py-2 px-4 bg-[#1B3A7A] hover:bg-[#0F2042] disabled:opacity-50"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Kirim via Gmail</span>
            </button>
          )}

          {activeChannel === "blast" && (
            <button
              disabled={!blastEmails.trim()}
              onClick={handleSendEmailBlast}
              className="btn-primary text-xs py-2 px-4 bg-purple-700 hover:bg-purple-800 disabled:opacity-50"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Kirim Email Blast (Gmail)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
