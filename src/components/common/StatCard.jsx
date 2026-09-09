import React from "react";

export default function StatCard({ title, value, subtitle, icon: Icon, color = "blue", trend }) {
  const schemes = {
    blue: {
      wrap:  "bg-white border border-tau-border",
      icon:  "bg-tau-blue-pale text-tau-blue",
      val:   "text-tau-blue",
    },
    green: {
      wrap:  "bg-white border border-tau-border",
      icon:  "bg-green-50 text-green-700",
      val:   "text-green-700",
    },
    amber: {
      wrap:  "bg-white border border-tau-border",
      icon:  "bg-amber-50 text-amber-700",
      val:   "text-amber-700",
    },
    purple: {
      wrap:  "bg-white border border-tau-border",
      icon:  "bg-purple-50 text-purple-700",
      val:   "text-purple-700",
    },
  };

  const s = schemes[color] || schemes.blue;

  return (
    <div className={`card card-hover p-5 ${s.wrap}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="section-label">{title}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${s.val}`}>{value}</span>
            {trend && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-tau-muted leading-relaxed">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl shrink-0 ${s.icon}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
