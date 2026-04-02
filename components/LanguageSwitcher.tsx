"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");
  const [isPending, startTransition] = useTransition();
  const { setTheme, theme } = useTheme();

  const languages = [
    { code: "en", label: t("english") },
    { code: "fr", label: t("french") },
    { code: "ar", label: t("arabic") },
  ];

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleTheme}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors subtle-scale"
        aria-label={t("toggleTheme")}
      >
        <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute inset-0 m-auto w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </button>
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        disabled={isPending}
        className="px-3 py-2 rounded-lg bg-card text-foreground border border-border hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer text-sm"
        aria-label={t("label")}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
