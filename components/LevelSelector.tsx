import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

type Level = "junior" | "mid" | "senior" | "";

interface LevelSelectorProps {
  value: Level;
  onChange: (value: Level) => void;
}

const levels: { value: Level; label: string }[] = [
  { value: "", label: "anyLevel" },
  { value: "junior", label: "junior" },
  { value: "mid", label: "mid" },
  { value: "senior", label: "senior" },
];

export default function LevelSelector({
  value,
  onChange,
}: LevelSelectorProps) {
  const { language } = useLanguage();
  const t = (key: any) => getTranslation(language, key);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {t("experienceLevel")}
      </label>
      <div className="grid grid-cols-4 gap-2">
        {levels.map((lvl) => (
          <button
            key={lvl.value || "any"}
            onClick={() => onChange(lvl.value)}
            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
              value === lvl.value
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {t(lvl.label as any)}
          </button>
        ))}
      </div>
    </div>
  );
}
