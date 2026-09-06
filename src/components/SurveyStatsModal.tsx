"use client";

import { type Locale, getDictionary } from "@/lib/i18n";
import type { Survey } from "@/modules/content/types";

interface SurveyStatsModalProps {
  locale: Locale;
  survey: Survey;
  onClose: () => void;
}

export function SurveyStatsModal({ locale, survey, onClose }: SurveyStatsModalProps) {
  const t = getDictionary(locale);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">{t.surveys.statsModalTitle}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">{survey.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{survey.description}</p>
          </div>

          {survey.resultsSummary && (
            <div className="space-y-3">
              {survey.resultsSummary.options.map((option) => (
                <div key={option.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{option.label}</span>
                    <span className="text-gray-500">{option.percent}% ({option.votesCount})</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${option.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <span>{survey.resultsSummary?.total || survey.responsesCount} {t.surveys.statsTotalVotes}</span>
            {survey.deadline && (
              <span>
                {locale === "fr" ? "Échéance" : "Deadline"}:{" "}
                {new Date(survey.deadline).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}
              </span>
            )}
          </div>

          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">
              <span className="font-semibold">{t.surveys.emailAccessNotice}</span>{" "}
              {survey.resultsAccessEmail}
            </p>
          </div>

          <div className="mt-4 flex gap-3">
            <a
              href={survey.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors text-center cursor-pointer"
            >
              {t.surveys.btnParticipate}
            </a>
            {survey.googleSpreadsheetStatsUrl && (
              <a
                href={survey.googleSpreadsheetStatsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {t.surveys.btnViewStats}
              </a>
            )}
          </div>

          <p className="mt-4 text-[10px] text-gray-400 text-center">
            {t.surveys.statsModalDisclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
