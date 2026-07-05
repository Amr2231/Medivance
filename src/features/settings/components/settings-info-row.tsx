type SettingsInfoRowProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

export function SettingsInfoRow({
  label,
  value,
  valueClassName,
}: SettingsInfoRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/10 last:border-0 rounded-md px-2 -mx-2 transition-colors duration-200 hover:bg-emerald-600/5">
      <span className="text-sm text-emerald-700 dark:text-emerald-400">{label}</span>
      <span
        className={`text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums ${valueClassName ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
}
