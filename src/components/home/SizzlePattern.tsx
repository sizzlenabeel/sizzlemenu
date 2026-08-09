export function SizzlePattern() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <pattern id="sizzle-organic" width="520" height="360" patternUnits="userSpaceOnUse">
          <path
            d="M34 88C58 24 151 11 205 45c45 28 37 85-7 107-52 26-144 16-166-24-7-13-6-27 2-40Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.17"
          />
          <path
            d="M302 38c43-24 119-10 145 28 22 32 2 72-40 83-51 14-116-10-126-52-6-24 3-47 21-59Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.13"
          />
          <path
            d="M20 266c50-65 118-78 177-51 42 19 65 60 112 69 60 12 91-42 142-45 26-1 43 9 49 27"
            fill="none"
            stroke="#ffffff"
            strokeWidth="24"
            strokeLinecap="round"
            opacity="0.15"
          />
          <path
            d="M16 320c62-39 114-40 168-7 45 28 92 34 139 4 57-36 115-34 177 5"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.08"
          />
          <path
            d="M238 178c13-19 45-23 64-9 15 11 16 31 2 44-18 16-51 13-66-5-8-10-8-21 0-30Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.07"
          />
        </pattern>
        <linearGradient id="sizzle-pattern-fade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#10458d" stopOpacity="0.14" />
          <stop offset="0.5" stopColor="#10458d" stopOpacity="0" />
          <stop offset="1" stopColor="#10458d" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#sizzle-organic)" />
      <rect width="100%" height="100%" fill="url(#sizzle-pattern-fade)" />
    </svg>
  );
}
