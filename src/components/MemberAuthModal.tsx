"use client";

import { useState, useRef } from "react";
import { type Locale, getDictionary } from "@/lib/i18n";

interface MemberAuthModalProps {
  locale: Locale;
  onClose: () => void;
  onLogin: (user: { name: string; email: string; role: string; studentCardPhoto?: string }) => void;
}

export function MemberAuthModal({ locale, onClose, onLogin }: MemberAuthModalProps) {
  const t = getDictionary(locale);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "student" as string,
    facultyId: "",
    academicYear: "",
    studentCardPhoto: "",
  });
  const [cardPreview, setCardPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm({ ...form, studentCardPhoto: base64 });
      setCardPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: form.name || "Utilisateur",
      email: form.email,
      role: form.role,
      studentCardPhoto: form.studentCardPhoto || undefined,
    });
    onClose();
  };

  const handleDemoLogin = (role: string, name: string) => {
    onLogin({ name, email: `${role}@aephat.tg`, role });
    onClose();
  };

  const isStudent = form.role === "student";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t.memberModal.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{t.memberModal.subtitle}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                !isRegister ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.memberModal.tabLogin}
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                isRegister ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.memberModal.tabRegister}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.memberModal.fullName}</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.memberModal.email}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.memberModal.password}</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.memberModal.phone}</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.memberModal.roleLabel}</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="student">{t.memberModal.roleStudent}</option>
                    <option value="doctor">{t.memberModal.roleDoctor}</option>
                    <option value="healthcare_pro">{t.memberModal.roleHealthcarePro}</option>
                    <option value="citizen">{t.memberModal.roleCitizen}</option>
                  </select>
                </div>

                {isStudent && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.memberModal.facultyIdLabel}</label>
                      <input
                        value={form.facultyId}
                        onChange={(e) => setForm({ ...form, facultyId: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.memberModal.yearLabel}</label>
                      <input
                        value={form.academicYear}
                        onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {locale === "fr" ? "Photo de la carte d'étudiant" : "Student card photo"}
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCardUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg px-3 py-4 text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                      >
                        {cardPreview ? (
                          <div className="flex items-center gap-3">
                            <img src={cardPreview} alt="Carte" className="h-16 w-24 object-cover rounded" />
                            <span>{locale === "fr" ? "Changer la photo" : "Change photo"}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{locale === "fr" ? "Cliquer pour uploader" : "Click to upload"}</span>
                          </div>
                        )}
                      </button>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {locale === "fr" ? "Requis pour les étudiants en pharmacie" : "Required for pharmacy students"}
                      </p>
                    </div>
                  </>
                )}

                {!isStudent && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg px-3 py-2">
                    {locale === "fr"
                      ? "Vous pouvez vous connecter directement avec votre adresse e-mail."
                      : "You can sign in directly with your email address."}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg px-3 py-2">
                  {t.memberModal.pendingNotice}
                </div>
              </>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
            >
              {isRegister ? t.memberModal.submitRegister : t.memberModal.submitLogin}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-3">{t.memberModal.loginAsTestUser}</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleDemoLogin("student", "Kofi Mensah")}
                className="px-3 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer text-left"
              >
                <span className="font-semibold">{t.memberModal.demoStudent}</span>
                <span className="block text-emerald-500 mt-0.5">Kofi Mensah — 4ème Pharmacie</span>
              </button>
              <button
                onClick={() => handleDemoLogin("doctor", "Dr. Ayélé Lawson")}
                className="px-3 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors cursor-pointer text-left"
              >
                <span className="font-semibold">{t.memberModal.demoDoctor}</span>
                <span className="block text-blue-500 mt-0.5">Dr. Ayélé Lawson — Diplômée</span>
              </button>
              <button
                onClick={() => handleDemoLogin("citizen", "Ablam Doe")}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-left"
              >
                <span className="font-semibold">{t.memberModal.demoVisitor}</span>
                <span className="block text-gray-400 mt-0.5">Ablam Doe — Citoyen</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
