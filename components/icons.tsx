/**
 * Direction B — Hoàng Kim Imperial icon set, transcribed from
 * docs/Icon Sheet.dc.html (32×32 viewBox, scale-free). Only icons with an
 * actual call site in the UI are implemented; IconPrestigeStar and
 * IconFloodAttack extend the set in the same circle-badge idiom where the
 * doc has no matching icon (prestige stat, water attack).
 */
interface IconProps {
  size?: number;
  className?: string;
}

function Icon({
  size = 20,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

// ── Resource & UI icons ──────────────────────────────────────────────

export function IconResourceGold({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="16" cy="16" r="13" fill="#1a1208" stroke="#d4a020" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="7" fill="none" stroke="#d4a020" strokeWidth="3" />
      <circle cx="16" cy="16" r="3" fill="#d4a020" />
      <rect x="14.5" y="6" width="3" height="4" rx="1" fill="#d4a020" />
      <rect x="14.5" y="22" width="3" height="4" rx="1" fill="#d4a020" />
      <rect x="6" y="14.5" width="4" height="3" rx="1" fill="#d4a020" />
      <rect x="22" y="14.5" width="4" height="3" rx="1" fill="#d4a020" />
      <rect x="8.5" y="8.5" width="3" height="3" rx="0.5" fill="#d4a020" transform="rotate(45 10 10)" />
      <rect x="20.5" y="8.5" width="3" height="3" rx="0.5" fill="#d4a020" transform="rotate(45 22 10)" />
      <rect x="8.5" y="20.5" width="3" height="3" rx="0.5" fill="#d4a020" transform="rotate(45 10 22)" />
      <rect x="20.5" y="20.5" width="3" height="3" rx="0.5" fill="#d4a020" transform="rotate(45 22 22)" />
    </Icon>
  );
}

export function IconGrain({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="16" cy="16" r="13" fill="#1a1208" stroke="#a07020" strokeWidth="1.5" />
      <ellipse cx="16" cy="18" rx="8" ry="5" fill="#8a6828" stroke="#d4a020" strokeWidth="1" />
      <ellipse cx="16" cy="16" rx="7" ry="4" fill="#a07838" stroke="#d4a020" strokeWidth="0.8" />
      <line x1="16" y1="6" x2="16" y2="14" stroke="#c0a030" strokeWidth="1.5" />
      <line x1="12" y1="8" x2="16" y2="10" stroke="#c0a030" strokeWidth="1.2" />
      <line x1="20" y1="8" x2="16" y2="10" stroke="#c0a030" strokeWidth="1.2" />
      <line x1="11" y1="10" x2="16" y2="12" stroke="#c0a030" strokeWidth="1" />
      <line x1="21" y1="10" x2="16" y2="12" stroke="#c0a030" strokeWidth="1" />
      <ellipse cx="16" cy="6" rx="2" ry="3" fill="#d4b040" stroke="#a07020" strokeWidth="0.8" />
      <ellipse cx="11" cy="8" rx="1.5" ry="2.5" fill="#c8a030" stroke="#a07020" strokeWidth="0.6" />
      <ellipse cx="21" cy="8" rx="1.5" ry="2.5" fill="#c8a030" stroke="#a07020" strokeWidth="0.6" />
    </Icon>
  );
}

export function IconTroops({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="16" cy="16" r="13" fill="#1a1208" stroke="#8a7040" strokeWidth="1.5" />
      <circle cx="10" cy="13" r="3" fill="#f5d5a0" stroke="#8a6030" strokeWidth="0.8" />
      <rect x="7.5" y="15" width="5" height="7" rx="1.5" fill="#1a1410" stroke="#5b9bd5" strokeWidth="0.8" />
      <circle cx="16" cy="11" r="3.5" fill="#f5d5a0" stroke="#8a6030" strokeWidth="0.8" />
      <rect x="13" y="13.5" width="6" height="8" rx="1.5" fill="#1a1410" stroke="#c0392b" strokeWidth="0.8" />
      <circle cx="22" cy="13" r="3" fill="#f5d5a0" stroke="#8a6030" strokeWidth="0.8" />
      <rect x="19.5" y="15" width="5" height="7" rx="1.5" fill="#1a1410" stroke="#d4880a" strokeWidth="0.8" />
    </Icon>
  );
}

export function IconPrestigeStar({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="16" cy="16" r="13" fill="#1a1208" stroke="#e8c040" strokeWidth="1.5" />
      <polygon
        points="16,7 18.2,12.9 24.6,13.2 19.6,17.2 21.3,23.3 16,19.8 10.7,23.3 12.4,17.2 7.4,13.2 13.8,12.9"
        fill="#e8c040"
        stroke="#a07020"
        strokeWidth="0.8"
      />
    </Icon>
  );
}

export function IconTrophy({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="16" cy="16" r="13" fill="#1a1208" stroke="#d4a020" strokeWidth="2" />
      <rect x="13" y="23" width="6" height="3" rx="1" fill="#d4a020" />
      <rect x="11" y="26" width="10" height="2" rx="1" fill="#d4a020" />
      <path d="M10,8 L22,8 L22,18 Q22,22 16,22 Q10,22 10,18 Z" fill="#d4a020" opacity="0.9" />
      <line x1="10" y1="12" x2="7" y2="12" stroke="#d4a020" strokeWidth="1.5" />
      <path d="M7,12 Q5,12 5,15 Q5,18 10,18" fill="none" stroke="#d4a020" strokeWidth="1.5" />
      <line x1="22" y1="12" x2="25" y2="12" stroke="#d4a020" strokeWidth="1.5" />
      <path d="M25,12 Q27,12 27,15 Q27,18 22,18" fill="none" stroke="#d4a020" strokeWidth="1.5" />
      <polygon
        points="16,10 17,13 20,13 17.5,14.5 18.5,17.5 16,16 13.5,17.5 14.5,14.5 12,13 15,13"
        fill="#f0c840"
        opacity="0.9"
      />
    </Icon>
  );
}

export function IconAttackPower({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="16" cy="16" r="13" fill="#200808" stroke="#c0392b" strokeWidth="1.5" />
      <rect x="9" y="12" width="14" height="10" rx="3" fill="#c0392b" opacity="0.8" />
      <rect x="10" y="9" width="4" height="5" rx="1.5" fill="#a02020" stroke="#c0392b" strokeWidth="0.8" />
      <rect x="14" y="9" width="4" height="5" rx="1.5" fill="#a02020" stroke="#c0392b" strokeWidth="0.8" />
      <rect x="18" y="9" width="4" height="5" rx="1.5" fill="#a02020" stroke="#c0392b" strokeWidth="0.8" />
      <rect x="8" y="15" width="3" height="5" rx="1.5" fill="#a02020" stroke="#c0392b" strokeWidth="0.8" />
    </Icon>
  );
}

export function IconDefensePower({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="16" cy="16" r="13" fill="#0a1820" stroke="#5b9bd5" strokeWidth="1.5" />
      <path d="M16,6 L24,10 L24,18 Q24,24 16,27 Q8,24 8,18 L8,10 Z" fill="#1a3050" stroke="#5b9bd5" strokeWidth="1.5" />
      <path d="M16,8 L22,11.5 L22,18 Q22,23 16,25 Q10,23 10,18 L10,11.5 Z" fill="#2a4870" stroke="#5b9bd5" strokeWidth="0.8" />
      <line x1="16" y1="11" x2="16" y2="23" stroke="#d4a020" strokeWidth="1.5" />
      <line x1="10" y1="17" x2="22" y2="17" stroke="#d4a020" strokeWidth="1.5" />
    </Icon>
  );
}

// ── Action icons ─────────────────────────────────────────────────────

export function IconMove({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="16" cy="16" r="13" fill="#0e1a26" stroke="#5b9bd5" strokeWidth="1.5" />
      <polygon points="16,6 20,14 16,12 12,14" fill="#5b9bd5" />
      <polygon points="16,26 12,18 16,20 20,18" fill="#5b9bd5" />
      <polygon points="6,16 14,12 12,16 14,20" fill="#5b9bd5" />
      <polygon points="26,16 18,20 20,16 18,12" fill="#5b9bd5" />
      <circle cx="16" cy="16" r="3" fill="#5b9bd5" opacity="0.4" />
    </Icon>
  );
}

export function IconAttack({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="16" cy="16" r="13" fill="#200808" stroke="#c0392b" strokeWidth="1.5" />
      <line x1="8" y1="24" x2="24" y2="8" stroke="#c0c8d0" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="24,8 20,9 23,12" fill="#c0c8d0" />
      <line x1="8" y1="24" x2="12" y2="26" stroke="#8a5a20" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="10" r="4" fill="#e05020" opacity="0.3" />
      <line x1="19" y1="7" x2="22" y2="10" stroke="#f0a020" strokeWidth="1" opacity="0.7" />
      <line x1="22" y1="7" x2="22" y2="10" stroke="#f0a020" strokeWidth="1" opacity="0.7" />
      <line x1="25" y1="7" x2="22" y2="10" stroke="#f0a020" strokeWidth="1" opacity="0.7" />
    </Icon>
  );
}

export function IconFireAttack({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="16" cy="16" r="13" fill="#2a0808" stroke="#e05020" strokeWidth="1.5" />
      <line x1="6" y1="24" x2="22" y2="10" stroke="#8a5a20" strokeWidth="2" strokeLinecap="round" />
      <polygon points="22,10 18,11 21,14" fill="#c0c8d0" />
      <ellipse cx="22" cy="9" rx="3" ry="4" fill="#e05020" opacity="0.9" />
      <ellipse cx="22" cy="7" rx="2" ry="3" fill="#f07020" />
      <ellipse cx="22" cy="5.5" rx="1.2" ry="2" fill="#f0d060" />
      <line x1="24" y1="8" x2="27" y2="6" stroke="#f0a020" strokeWidth="1" opacity="0.7" />
      <line x1="25" y1="10" x2="28" y2="11" stroke="#f0a020" strokeWidth="1" opacity="0.7" />
      <line x1="20" y1="7" x2="20" y2="4" stroke="#f0a020" strokeWidth="1" opacity="0.7" />
    </Icon>
  );
}

export function IconFloodAttack({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="16" cy="16" r="13" fill="#0a1620" stroke="#5b9bd5" strokeWidth="1.5" />
      <path d="M6,13 Q11,10 16,13 Q21,16 26,13" fill="none" stroke="#5b9bd5" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6,18 Q11,15 16,18 Q21,21 26,18" fill="none" stroke="#5b9bd5" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M6,23 Q11,20 16,23 Q21,26 26,23" fill="none" stroke="#5b9bd5" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
    </Icon>
  );
}

export function IconSupply({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="16" cy="16" r="13" fill="#1a1208" stroke="#d4a020" strokeWidth="1.5" />
      <ellipse cx="16" cy="17" rx="7" ry="8" fill="#8a6828" stroke="#d4a020" strokeWidth="1.2" />
      <ellipse cx="16" cy="13" rx="5" ry="3" fill="#a07838" stroke="#d4a020" strokeWidth="0.8" />
      <rect x="14" y="10" width="4" height="3" rx="1" fill="#6a4818" stroke="#d4a020" strokeWidth="0.8" />
      <line x1="24" y1="16" x2="29" y2="16" stroke="#d4a020" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="29,16 26,14 26,18" fill="#d4a020" />
    </Icon>
  );
}

// ── Weapon icons (unit types) ────────────────────────────────────────

export function IconSword({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <line x1="16" y1="3" x2="16" y2="26" stroke="#c0c8d0" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="16,3 18,8 16,7 14,8" fill="#d0d8e0" stroke="#a0a8b0" strokeWidth="0.8" />
      <rect x="11" y="22" width="10" height="3" rx="1" fill="#d4a020" stroke="#a07010" strokeWidth="0.8" />
      <line x1="8" y1="23" x2="24" y2="23" stroke="#d4a020" strokeWidth="2" strokeLinecap="round" />
      <rect x="14.5" y="25" width="3" height="4" rx="1" fill="#8a6010" stroke="#5a4010" strokeWidth="0.8" />
    </Icon>
  );
}

export function IconBow({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M10,4 Q20,16 10,28" fill="none" stroke="#8a5a20" strokeWidth="2.5" />
      <line x1="10" y1="4" x2="10" y2="28" stroke="#c8a060" strokeWidth="1" strokeDasharray="2,1" />
      <line x1="10" y1="16" x2="28" y2="10" stroke="#c0c8d0" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="28,10 24,9 25,12" fill="#c0c8d0" stroke="#909090" strokeWidth="0.5" />
      <line x1="10" y1="16" x2="12" y2="19" stroke="#8a5a20" strokeWidth="1.5" />
    </Icon>
  );
}

export function IconCavalrySpear({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <ellipse cx="18" cy="22" rx="10" ry="6" fill="#5a3a18" stroke="#3a2010" strokeWidth="1" />
      <ellipse cx="8" cy="19" rx="5" ry="4" fill="#5a3a18" stroke="#3a2010" strokeWidth="1" transform="rotate(-20 8 19)" />
      <line x1="12" y1="25" x2="12" y2="31" stroke="#4a2a10" strokeWidth="1.5" />
      <line x1="17" y1="26" x2="17" y2="31" stroke="#4a2a10" strokeWidth="1.5" />
      <line x1="22" y1="25" x2="22" y2="31" stroke="#4a2a10" strokeWidth="1.5" />
      <line x1="26" y1="25" x2="26" y2="31" stroke="#4a2a10" strokeWidth="1.5" />
      <line x1="15" y1="2" x2="15" y2="20" stroke="#8a5a20" strokeWidth="2" strokeLinecap="round" />
      <polygon points="15,2 17.5,7 15,6 12.5,7" fill="#c0c8d0" stroke="#909898" strokeWidth="0.8" />
      <circle cx="16" cy="13" r="4" fill="#f5d5a0" stroke="#8a6030" strokeWidth="0.8" />
      <path d="M12,13 Q16,8 20,13" fill="#1a1410" stroke="#d4a020" strokeWidth="0.8" />
    </Icon>
  );
}
