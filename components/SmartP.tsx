import React from "react";

function extractText(node: React.ReactNode): string {
    if (node == null) return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (React.isValidElement(node)) return extractText(((node.props) as any).children);
    return "";
}

// Unicode ranges covering Arabic/Persian scripts and presentation forms.
const persianRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

export default function SmartP({ children, className, lang, dir, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
    const text = extractText(children);
    const isPersian = persianRegex.test(text);
    const resolvedLang = isPersian ? "fa" : (lang as string | undefined);
    const resolvedDir = isPersian ? "rtl" : ((dir as "rtl" | "ltr" | undefined) ?? "ltr");

    return (
        <p lang={resolvedLang} dir={resolvedDir} className={className} {...rest}>
            {children}
        </p>
    );
}
