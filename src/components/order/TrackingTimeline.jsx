import { Check } from "lucide-react";

export default function TrackingTimeline({ timeline }) {
  return (
    <div>
      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-start">
        {timeline.map((step, idx) => (
          <div key={step.key} className="flex-1 flex flex-col items-center text-center relative">
            {idx > 0 && (
              <div
                className={`absolute top-4 right-1/2 w-full h-0.5 -z-0 ${
                  timeline[idx - 1].done ? "bg-leaf-deep" : "bg-ink/15"
                }`}
              />
            )}
            <div
              className={`relative z-10 w-8 h-8 rounded-full border-3 border-ink flex items-center justify-center shrink-0 ${
                step.done ? (step.active ? "bg-yellow" : "bg-leaf") : "bg-paper"
              }`}
            >
              {step.done && !step.active && <Check size={14} strokeWidth={3} />}
              {step.active && <span className="w-2 h-2 rounded-full bg-ink" />}
            </div>
            <p className={`mt-2 text-xs font-display font-bold max-w-[110px] ${step.done ? "text-ink" : "text-muted"}`}>
              {step.label}
            </p>
            {step.time && <p className="text-[11px] text-muted mt-0.5 max-w-[120px]">{step.time}</p>}
          </div>
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="md:hidden flex flex-col">
        {timeline.map((step, idx) => (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full border-3 border-ink flex items-center justify-center shrink-0 ${
                  step.done ? (step.active ? "bg-yellow" : "bg-leaf") : "bg-paper"
                }`}
              >
                {step.done && !step.active && <Check size={12} strokeWidth={3} />}
                {step.active && <span className="w-1.5 h-1.5 rounded-full bg-ink" />}
              </div>
              {idx < timeline.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[28px] ${step.done ? "bg-leaf-deep" : "bg-ink/15"}`} />
              )}
            </div>
            <div className="pb-5">
              <p className={`text-sm font-display font-bold ${step.done ? "text-ink" : "text-muted"}`}>{step.label}</p>
              {step.time && <p className="text-xs text-muted mt-0.5">{step.time}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
