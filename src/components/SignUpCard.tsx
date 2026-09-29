import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AuthInput } from './AuthInput';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, Check, Sparkles } from 'lucide-react';

interface SignUpCardProps {
  onSwitchToSignIn: () => void;
  onSuccessNavigate: () => void;
}

export const SignUpCard: React.FC<SignUpCardProps> = ({
  onSwitchToSignIn,
  onSuccessNavigate,
}) => {
  const { signUp, signInWithGoogle, showNotification, setIsAuthSubmitting } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Field error states
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Animation stages: 'idle' | 'loading' | 'success' | 'cinematic_exit'
  const [stage, setStage] = useState<'idle' | 'loading' | 'success' | 'cinematic_exit'>('idle');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-neutral-200' };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-cyan-500', text: 'text-cyan-600' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
      default:
        return { score: 0, label: 'Too short', color: 'bg-neutral-300', text: 'text-neutral-500' };
    }
  }, [password]);

  const validate = () => {
    let valid = true;
    setFullNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setTermsError(null);
    setGeneralError(null);

    if (!fullName.trim()) {
      setFullNameError('Full name is required.');
      valid = false;
    } else if (fullName.trim().length < 2) {
      setFullNameError('Name must be at least 2 characters.');
      valid = false;
    }

    if (!email.trim()) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      valid = false;
    }

    if (!agreeTerms) {
      setTermsError('You must agree to the Terms and Privacy Policy to continue.');
      valid = false;
    }

    return valid;
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stage !== 'idle') return;

    if (!validate()) {
      triggerShake();
      return;
    }

    setStage('loading');
    setIsAuthSubmitting(true);

    try {
      const res = await signUp(fullName, email, password);

      if (res.error) {
        setStage('idle');
        setIsAuthSubmitting(false);
        setGeneralError(res.error);
        triggerShake();
      } else {
        setStage('success');
        setTimeout(() => {
          setStage('cinematic_exit');
          setTimeout(() => {
            setIsAuthSubmitting(false);
            onSuccessNavigate();
          }, 450);
        }, 650);
      }
    } catch {
      setStage('idle');
      setIsAuthSubmitting(false);
      setGeneralError('Registration failed. Please try again.');
      triggerShake();
    }
  };

  const handleGoogleSignUp = async () => {
    if (isGoogleLoading || stage !== 'idle') return;
    setIsGoogleLoading(true);
    setGeneralError(null);

    try {
      const res = await signInWithGoogle();
      if (res.error) {
        setIsGoogleLoading(false);
        setGeneralError(res.error);
        triggerShake();
      } else {
        setStage('success');
        setTimeout(() => {
          setStage('cinematic_exit');
          setTimeout(() => {
            onSuccessNavigate();
          }, 450);
        }, 600);
      }
    } catch {
      setIsGoogleLoading(false);
      setGeneralError('Google registration was interrupted.');
      triggerShake();
    }
  };

  return (
    <div
      className={`w-full max-w-[460px] transition-all duration-500 ease-out will-change-[transform,opacity] ${
        stage === 'cinematic_exit'
          ? 'scale-95 opacity-0 -translate-y-4'
          : 'scale-100 opacity-100 translate-y-0'
      }`}
    >
      <div
        className={`glass-auth-card rounded-3xl p-6 sm:p-8 animate-float-auth relative overflow-hidden transition-all duration-300 ${
          isShaking ? 'animate-card-shake border-rose-300 shadow-[0_0_35px_rgba(244,63,94,0.25)]' : ''
        }`}
      >
        {/* Subtle decorative gradient top edge line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

        {/* Success Overlay View */}
        {stage === 'success' ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-neutral-950">Account Created!</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Setting up your personalized EngageEd hub...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header: Logo, Tag, Title */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 mb-3 group transition-transform hover:scale-105">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-neutral-950 tracking-tight flex items-center justify-center gap-1.5">
                <span>Create an Account</span>
                <span className="text-xl">🚀</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Join EngageEd to shape the services you love
              </p>
            </div>

            {/* Quick Toggle Tabs */}
            <div className="flex p-1 bg-neutral-100/90 rounded-xl mb-5 border border-neutral-200/60 text-xs font-semibold">
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="flex-1 py-1.5 rounded-lg text-neutral-600 hover:text-neutral-950 transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                className="flex-1 py-1.5 rounded-lg bg-white text-neutral-950 shadow-xs font-bold transition-all cursor-default"
              >
                Sign Up
              </button>
            </div>

            {/* General Error Banner */}
            {generalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50/80 border border-rose-200/90 text-2xs text-rose-700 font-medium flex items-center gap-2 animate-in fade-in duration-150">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Full Name */}
              <AuthInput
                id="signup-name"
                name="name"
                type="text"
                label="Full Name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (fullNameError) setFullNameError(null);
                  if (generalError) setGeneralError(null);
                }}
                icon={User}
                error={fullNameError}
                isValid={fullName.trim().length >= 2}
                autoComplete="name"
                placeholder="Alex Rivera"
              />

              {/* Email Address */}
              <AuthInput
                id="signup-email"
                name="email"
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                  if (generalError) setGeneralError(null);
                }}
                icon={Mail}
                error={emailError}
                isValid={email.includes('@') && email.includes('.')}
                autoComplete="email"
                placeholder="alex.rivera@example.com"
              />

              {/* Password with Strength Indicator */}
              <div className="space-y-1.5">
                <AuthInput
                  id="signup-password"
                  name="password"
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                    if (generalError) setGeneralError(null);
                  }}
                  icon={Lock}
                  error={passwordError}
                  isValid={password.length >= 6}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                />

                {/* Password Strength Meter */}
                {password.length > 0 && (
                  <div className="pt-1 px-1 space-y-1 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-3xs">
                      <span className="text-neutral-500 font-medium">Strength:</span>
                      <span className={`font-bold ${passwordStrength.text}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full rounded-full transition-all duration-300 ${
                            passwordStrength.score >= step
                              ? passwordStrength.color
                              : 'bg-neutral-200/80'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <AuthInput
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) setConfirmPasswordError(null);
                  if (generalError) setGeneralError(null);
                }}
                icon={ShieldCheck}
                error={confirmPasswordError}
                isValid={confirmPassword.length >= 6 && confirmPassword === password}
                autoComplete="new-password"
                placeholder="Re-enter password"
              />

              {/* Terms & Privacy Agreement */}
              <div className="pt-1 space-y-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-600 select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (termsError) setTermsError(null);
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                  />
                  <span className="text-2xs sm:text-xs leading-snug">
                    I agree to EngageEd's{' '}
                    <span className="text-indigo-600 font-semibold hover:underline">
                      Terms of Service
                    </span>{' '}
                    and{' '}
                    <span className="text-indigo-600 font-semibold hover:underline">
                      Privacy Policy
                    </span>
                  </span>
                </label>
                {termsError && (
                  <p className="text-2xs text-rose-600 font-medium pl-6">{termsError}</p>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={stage !== 'idle'}
                className="group relative w-full overflow-hidden rounded-xl p-[1px] font-semibold text-white transition-all duration-300 active:scale-[0.98] hover:shadow-[0_8px_25px_rgba(168,85,247,0.35)] hover:-translate-y-0.5 cursor-pointer disabled:opacity-75 disabled:hover:translate-y-0 mt-2"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 transition-all duration-300 group-hover:opacity-100 animate-gradient-move" />

                <span className="relative flex items-center justify-center gap-2 rounded-[11px] bg-gradient-to-r from-purple-600 to-indigo-600 py-3 px-4 text-xs sm:text-sm font-semibold transition-all duration-200 group-hover:bg-opacity-90">
                  {stage === 'loading' ? (
                    <>
                      <span>Creating Account</span>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200/80" />
              </div>
              <div className="relative flex justify-center text-3xs uppercase tracking-wider">
                <span className="bg-white/80 px-2.5 text-neutral-400 font-bold backdrop-blur-xs">
                  Or Continue With
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || stage !== 'idle'}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white/90 border border-neutral-200/90 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-white hover:border-neutral-300 hover:shadow-xs hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Switch to Sign In */}
            <div className="text-center mt-5 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="font-bold text-purple-600 hover:text-purple-800 hover:underline transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
