import clsx from "clsx";
import { useTranslation } from "react-i18next";

export default function Unauthorized({ cn }: { cn?: string }) {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "rounded-lg text-red-500 border border-red-500 bg-red-500/10 px-3.5 py-2 inline-flex",
        cn,
      )}>
      {t("common.verify")}
    </div>
  );
}
