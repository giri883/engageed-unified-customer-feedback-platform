import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthInputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password';
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ComponentType<{ className?: string }>;
  error?: string | null;
  isValid?: boolean;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  icon: Icon,
  error,
  isValid,
  required = true,
  autoComplete,
  placeholder,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const hasValue = value.length > 0;
  const isElevated = isFocused || hasValue;

  return (
    <div className="w-full space-y-1.5">
      <div className="relative group">
        {/* Glow border background */}
        <div
          className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r transition-all duration-300 pointer-events-none ${
            error
              ? 'from-rose-500/50 to-pink-500/50 opacity-100 blur-[2px]'
              : isFocused
              ? 'from-indigo-500 via-purple-500 to-cyan-400 opacity-90 blur-[3px]'
              : 'from-transparent to-transparent opacity-0'
          }`}
        />

        <div
          className={`relative flex items-center w-full rounded-xl transition-all duration-200 backdrop-blur-md ${
            error
              ? 'bg-rose-50/20 border border-rose-300/80 shadow-[0_0_12px_rgba(244,63,94,0.15)] animate-card-shake'
              : isValid && hasValue
              ? 'bg-white/85 border border-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
              : isFocused
              ? 'bg-white/95 border border-indigo-400 shadow-[0_4px_20px_rgba(99,102,241,0.15)] scale-[1.01]'
              : 'bg-white/70 border border-white/60 hover:border-indigo-200 hover:bg-white/80 shadow-2xs'
          }`}
        >
          {/* Leading Icon */}
          <div className="pl-3.5 pr-2 flex items-center pointer-events-none">
            <Icon
              className={`w-4 h-4 transition-colors duration-200 ${
                error
                  ? 'text-rose-500'
                  : isFocused
                  ? 'text-indigo-600 scale-110'
                  : isValid && hasValue
                  ? 'text-emerald-500'
                  : 'text-neutral-400'
              }`}
            />
          </div>

          {/* Floating Label & Text Input */}
          <div className="relative flex-1 py-1">
            <label
              htmlFor={id}
              className={`absolute left-0 transition-all duration-200 pointer-events-none font-medium select-none ${
                isElevated
                  ? '-top-2 text-3xs tracking-wider uppercase font-bold text-indigo-600'
                  : 'top-1/2 -translate-y-1/2 text-xs text-neutral-500'
              } ${error ? '!text-rose-600' : ''}`}
            >
              {label}
            </label>

            <input
              id={id}
              name={name}
              type={effectiveType}
              required={required}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoComplete={autoComplete}
              placeholder={isFocused && !hasValue ? placeholder : ''}
              className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 font-medium focus:outline-none pt-2.5 pb-1 placeholder:text-neutral-400"
            />
          </div>

          {/* Right Controls: Password Toggle & Validation Status */}
          <div className="pr-3 flex items-center gap-1.5">
            {/* Valid Checkmark Icon */}
            {isValid && hasValue && !error && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-in zoom-in duration-150" />
            )}

            {/* Error Exclamation */}
            {error && (
              <AlertCircle className="w-4 h-4 text-rose-500 animate-in zoom-in duration-150" />
            )}

            {/* Password show/hide toggle */}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-neutral-400 hover:text-neutral-700 transition-transform active:scale-90 focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-indigo-600 transition-all duration-200 rotate-0" />
                ) : (
                  <Eye className="w-4 h-4 transition-all duration-200 rotate-0" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Field Error Message */}
      {error && (
        <p className="text-2xs text-rose-600 font-medium pl-1 flex items-center gap-1 animate-in fade-in duration-150">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
