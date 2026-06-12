import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";

type Category = "behavioral" | "technical" | "situational" | "";

interface CategorySelectorProps {
  value: Category;
  onChange: (value: Category) => void;
}

const categories: { value: Category; label: string }[] = [
  { value: "", label: "questionType" },
  { value: "behavioral", label: "behavioral" },
  { value: "technical", label: "technical" },
  { value: "situational", label: "situational" },
];

export default function CategorySelector({
  value,
  onChange,
}: CategorySelectorProps) {
  const { language } = useLanguage();
  const t = (key: any) => getTranslation(language, key);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {t("questionType")}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value || "any"}
            onClick={() => onChange(cat.value)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              value === cat.value
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {t(cat.label === "questionType" ? "anyType" : (cat.label as any))}
          </button>
        ))}
      </div>
    </div>
  );
}
