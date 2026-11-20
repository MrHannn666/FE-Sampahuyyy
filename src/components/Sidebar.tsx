'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

interface NavLink {
  href: string;
  label: string;
  icon: ReactNode;
}

interface NavSection {
  title: string;
  links: NavLink[];
}

const icons = {
  chart: (
    <svg {...iconProps}>
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  machine: (
    <svg {...iconProps}>
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  file: (
    <svg {...iconProps}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  camera: (
    <svg {...iconProps}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
    </svg>
  ),
  book: (
    <svg {...iconProps}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  ),
  globe: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
    </svg>
  ),
  users: (
    <svg {...iconProps}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  grid: (
    <svg {...iconProps}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  optic: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  token: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" />
    </svg>
  ),
  truck: (
    <svg {...iconProps}>
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  phone: (
    <svg {...iconProps}>
      <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
};

const adminSections: NavSection[] = [
  {
    title: 'Mesin Vending',
    links: [
      { href: '/admin', label: 'Dashboard Analitik', icon: icons.chart },
      { href: '/admin/mesin', label: 'Kelola Mesin & Reward', icon: icons.machine },
      { href: '/admin/transaksi', label: 'Transaksi & Export', icon: icons.file },
    ],
  },
];

const wargaSections: NavSection[] = [];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const sections = isAdmin ? adminSections : wargaSections;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">♻</div>
        <div className="sidebar-logo-text">
          <h1>EcoSort AI</h1>
          <p>Smart Waste Vending</p>
        </div>
      </div>

      {sections.map((section) => (
        <div className="sidebar-section" key={section.title}>
          <div className="sidebar-section-title">{section.title}</div>
          <nav className="sidebar-nav">
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ))}

      <div className="sidebar-footer">
        <span className="status-dot" />
        STATUS MODEL &nbsp; AKTIF
      </div>
    </aside>
  );
}
