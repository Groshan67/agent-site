import type { formIconKey } from "@/lib/health-codes-helpers";

type IconKey = ReturnType<typeof formIconKey>;

export default function FormIcon({ formKey }: { formKey: IconKey }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
  } as const;

  switch (formKey) {
    case "tablet":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v16" />
        </svg>
      );
    case "capsule":
      return (
        <svg {...common}>
          <rect x="3" y="9" width="18" height="6" rx="3" />
          <path d="M12 9v6" />
        </svg>
      );
    case "liquid":
      return (
        <svg {...common}>
          <path d="M9 3h6l1 6-3 3v9h-2v-9L8 9z" />
        </svg>
      );
    case "injectable":
      return (
        <svg {...common}>
          <path d="M19 5 5 19M5 19l-1.5 4L8 21M14 4l6 6M12 6l6 6" />
        </svg>
      );
    case "inhalant":
      return (
        <svg {...common}>
          <rect x="8" y="3" width="8" height="12" rx="2" />
          <path d="M6 21h12M9 21v-6M15 21v-6" />
        </svg>
      );
    case "topical":
      return (
        <svg {...common}>
          <rect x="5" y="8" width="14" height="13" rx="1.5" />
          <path d="M9 8V5a3 3 0 0 1 6 0v3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h6M9 12h6M9 15h4" />
        </svg>
      );
  }
}
