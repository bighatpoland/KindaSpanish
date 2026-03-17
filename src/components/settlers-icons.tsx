type IconProps = {
  className?: string;
};

function frameClassName(className?: string) {
  return className ?? "h-5 w-5";
}

export function ScrollIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={frameClassName(className)} aria-hidden="true">
      <path d="M7 5.5h9.6a2.4 2.4 0 0 1 0 4.8H8.8a1.8 1.8 0 1 0 0 3.7h7.6v3.1H9.7A4.7 4.7 0 0 1 5 12.3V8a2.5 2.5 0 0 1 2-2.5Z" fill="#e9d3a1" />
      <path d="M16.2 5h1.2a2.6 2.6 0 0 1 0 5.2h-1.2V5Zm-8.1 5.2H6.9A2.6 2.6 0 0 0 6.9 15h1.2v-4.8Z" fill="#a6712b" />
      <path d="M8.4 8.1h6.5M8.4 11h5.4M8.4 13.9h6.5" stroke="#6d4725" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M7 5.5h9.6a2.4 2.4 0 0 1 0 4.8H8.8a1.8 1.8 0 1 0 0 3.7h7.6v3.1H9.7A4.7 4.7 0 0 1 5 12.3V8a2.5 2.5 0 0 1 2-2.5Z" fill="none" stroke="#59381c" strokeWidth="1" />
    </svg>
  );
}

export function CompassIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={frameClassName(className)} aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="#1e2b3b" stroke="#d0ad61" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="5.2" fill="#32465f" stroke="#8a6835" strokeWidth="1" />
      <path d="m13.4 10-4 1.6L10.9 16l3.7-2.2L13.4 10Z" fill="#d68152" />
      <path d="m10.7 8 4-1.6-1.5 4.4-3.7 2.2L10.7 8Z" fill="#f0e1bb" />
      <circle cx="12" cy="12" r="1.2" fill="#f1c76f" stroke="#644223" strokeWidth="0.8" />
    </svg>
  );
}

export function CoinStackIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={frameClassName(className)} aria-hidden="true">
      <ellipse cx="9" cy="15.8" rx="4.2" ry="2.1" fill="#b98531" />
      <ellipse cx="9" cy="13.9" rx="4.2" ry="2.1" fill="#dfbe71" />
      <ellipse cx="15.2" cy="11.7" rx="4" ry="2" fill="#b98531" />
      <ellipse cx="15.2" cy="9.9" rx="4" ry="2" fill="#ebce82" />
      <path d="M5 13.9v1.9c0 1.2 8.3 1.2 8.3 0v-1.9M11.3 9.9v1.8c0 1.1 7.9 1.1 7.9 0V9.9" fill="none" stroke="#6b4722" strokeWidth="1" />
    </svg>
  );
}

export function TowerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={frameClassName(className)} aria-hidden="true">
      <path d="M8.2 19.5h7.6l-1-8.5h-5.6l-1 8.5Z" fill="#b99661" />
      <path d="M7.5 9.4h9L15.1 6H8.9L7.5 9.4Z" fill="#8a6335" />
      <path d="M10.3 11.2h3.4v5.8h-3.4z" fill="#30445b" />
      <path d="M9.1 7.2h1.6v2.2H9.1zm4.2 0h1.6v2.2h-1.6z" fill="#e9d8af" />
      <path d="M8.2 19.5h7.6l-1-8.5h-5.6l-1 8.5Z" fill="none" stroke="#5f3d1f" strokeWidth="1" />
    </svg>
  );
}

export function CrateIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={frameClassName(className)} aria-hidden="true">
      <path d="M6 9.4 12 6l6 3.4v7.2L12 20l-6-3.4V9.4Z" fill="#b0793f" />
      <path d="M12 6v14M6 9.4l6 3.4 6-3.4M8.4 8.1l7.2 4.1" stroke="#6b4522" strokeWidth="1" />
      <path d="M6 9.4 12 6l6 3.4v7.2L12 20l-6-3.4V9.4Z" fill="none" stroke="#563618" strokeWidth="1" />
    </svg>
  );
}

export function HouseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={frameClassName(className)} aria-hidden="true">
      <path d="M5.5 11.1 12 6l6.5 5.1v7.1h-13v-7.1Z" fill="#c59b63" />
      <path d="M4.8 11.4 12 5.6l7.2 5.8-1.5 1.8L12 8.7l-5.7 4.5-1.5-1.8Z" fill="#8f5130" />
      <path d="M10.2 13h3.6v5.2h-3.6z" fill="#41556a" />
      <path d="M6.8 12.2h2.5v2.2H6.8zm7.9 0h2.5v2.2h-2.5z" fill="#efe2b8" />
      <path d="M5.5 11.1 12 6l6.5 5.1v7.1h-13v-7.1Z" fill="none" stroke="#59381c" strokeWidth="1" />
    </svg>
  );
}

export function HammerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={frameClassName(className)} aria-hidden="true">
      <path d="M14.4 5.4h3.9l.9 1.8-2.3 2.2H13.8l-1.1-1.1 1.7-2.9Z" fill="#a7b3c1" />
      <path d="m12.8 8.6 2.6 2.6-5.8 7.4-2.1-2.1 5.3-7.9Z" fill="#8a5b31" />
      <path d="M14.4 5.4h3.9l.9 1.8-2.3 2.2H13.8l-1.1-1.1 1.7-2.9Z" fill="none" stroke="#4b5a68" strokeWidth="1" />
    </svg>
  );
}
