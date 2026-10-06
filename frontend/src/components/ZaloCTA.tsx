'use client';

import React from 'react';
import { COMPANY_INFO } from '@/data/companyInfo';

interface ZaloCTAProps {
  text?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

export function ZaloCTA({
  text = 'ỨNG TUYỂN QUA ZALO',
  className = '',
  variant = 'primary',
  size = 'md',
}: ZaloCTAProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
    secondary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
    outline: 'border-2 border-blue-600 text-blue-400 hover:bg-blue-600/10',
    gradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white shadow-blue-500/25',
  };

  return (
    <a
      href={COMPANY_INFO.zaloUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      <svg
        className="w-5 h-5 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.93.55 3.73 1.5 5.26L2.1 21.9l4.75-1.35C8.3 21.49 10.1 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z" />
      </svg>
      <span>{text}</span>
    </a>
  );
}
