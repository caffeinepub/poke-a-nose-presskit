import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import {
  useContent,
  useGetAdminStatus,
  useClaimAdmin,
  useUpdateAbout,
  useUpdateFeatures,
  useUpdateGameDetails,
  useUpdateInstagram,
  useUpdateYoutubeLink,
  useUpdateDeveloperWebsite,
  useUpdatePressEmail,
  useUpdateBodyTextColor,
  useEnablePasswordProtection,
  useDisablePasswordProtection,
} from '../hooks/useQueries';
import { useTheme } from '../contexts/ThemeContext';

interface SaveFeedback {
  field: string;
  status: 'saving' | 'saved' | 'error';
  errorMsg?: string;
}

export default function AdminDashboard() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { isDark, toggleTheme } = useTheme();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const [saveFeedback, setSaveFeedback] = useState<SaveFeedback | null>(null);

  // Content state
  const [aboutText, setAboutText] = useState('');
  const [features, setFeatures] = useState<string[]>(['', '', '', '']);
  const [genre, setGenre] = useState('');
  const [platforms, setPlatforms] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [developerWebsite, setDeveloperWebsite] = useState('');
  const [pressEmail, setPressEmail] = useState('');
  const [bodyTextColor, setBodyTextColor] = useState('#000000');
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [contentLoaded, setContentLoaded] = useState(false);

  const { data: content } = useContent();

  // Admin status — only fetch when authenticated
  const {
    data: adminStatus,
    isLoading: adminStatusLoading,
    isFetched: adminStatusFetched,
  } = useGetAdminStatus();

  const claimAdmin = useClaimAdmin();

  const updateAbout = useUpdateAbout();
  const updateFeatures = useUpdateFeatures();
  const updateGameDetails = useUpdateGameDetails();
  const updateInstagram = useUpdateInstagram();
  const updateYoutubeLinkMutation = useUpdateYoutubeLink();
  const updateDeveloperWebsite = useUpdateDeveloperWebsite();
  const updatePressEmail = useUpdatePressEmail();
  const updateBodyTextColor = useUpdateBodyTextColor();
  const enablePassword = useEnablePasswordProtection();
  const disablePassword = useDisablePasswordProtection();

  // Auto-claim admin if no admin has been claimed yet
  useEffect(() => {
    if (
      isAuthenticated &&
      adminStatusFetched &&
      adminStatus &&
      !adminStatus.adminClaimed &&
      !claimAdmin.isPending &&
      !claimAdmin.isSuccess &&
      !claimAdmin.isError
    ) {
      claimAdmin.mutate();
    }
  }, [isAuthenticated, adminStatusFetched, adminStatus, claimAdmin]);

  // Load content into form when available
  useEffect(() => {
    if (content && !contentLoaded) {
      setAboutText(content.aboutText || '');
      const featureArr = [...(content.features || [])];
      while (featureArr.length < 4) featureArr.push('');
      setFeatures(featureArr.slice(0, 4));
      setGenre(content.gameDetails?.genre || '');
      setPlatforms(content.gameDetails?.platforms || '');
      setReleaseDate(content.gameDetails?.releaseDate || '');
      setInstagramLink(content.instagramLink || '');
      setYoutubeLink(content.youtubeLink || '');
      setDeveloperWebsite(content.developerWebsite || '');
      setPressEmail(content.pressEmail || '');
      setBodyTextColor(content.bodyTextColorHex || '#000000');
      setPasswordEnabled(content.passwordEnabled || false);
      setContentLoaded(true);
    }
  }, [content, contentLoaded]);

  // Reset content loaded flag when user logs out so it reloads on next login
  useEffect(() => {
    if (!isAuthenticated) {
      setContentLoaded(false);
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    setContentLoaded(false);
  };

  const showFeedback = (field: string, status: 'saving' | 'saved' | 'error', errorMsg?: string) => {
    setSaveFeedback({ field, status, errorMsg });
    if (status === 'saved') {
      setTimeout(() => setSaveFeedback(null), 3000);
    }
    if (status === 'error') {
      setTimeout(() => setSaveFeedback(null), 4000);
    }
  };

  const handleSaveAbout = async () => {
    showFeedback('about', 'saving');
    try {
      await updateAbout.mutateAsync(aboutText);
      showFeedback('about', 'saved');
    } catch (err: unknown) {
      showFeedback('about', 'error', err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleSaveFeatures = async () => {
    showFeedback('features', 'saving');
    try {
      const filtered = features.filter(f => f.trim() !== '');
      await updateFeatures.mutateAsync(filtered);
      showFeedback('features', 'saved');
    } catch (err: unknown) {
      showFeedback('features', 'error', err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleSaveGameDetails = async () => {
    showFeedback('gameDetails', 'saving');
    try {
      await updateGameDetails.mutateAsync({ genre, platforms, releaseDate });
      showFeedback('gameDetails', 'saved');
    } catch (err: unknown) {
      showFeedback('gameDetails', 'error', err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleSaveInstagram = async () => {
    showFeedback('instagram', 'saving');
    try {
      await updateInstagram.mutateAsync(instagramLink);
      showFeedback('instagram', 'saved');
    } catch (err: unknown) {
      showFeedback('instagram', 'error', err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleSaveYoutubeLink = async () => {
    showFeedback('youtubeLink', 'saving');
    try {
      await updateYoutubeLinkMutation.mutateAsync(youtubeLink);
      showFeedback('youtubeLink', 'saved');
    } catch (err: unknown) {
      showFeedback('youtubeLink', 'error', err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleSaveDeveloperWebsite = async () => {
    showFeedback('developerWebsite', 'saving');
    try {
      await updateDeveloperWebsite.mutateAsync(developerWebsite);
      showFeedback('developerWebsite', 'saved');
    } catch (err: unknown) {
      showFeedback('developerWebsite', 'error', err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleSavePressEmail = async () => {
    showFeedback('pressEmail', 'saving');
    try {
      await updatePressEmail.mutateAsync(pressEmail);
      showFeedback('pressEmail', 'saved');
    } catch (err: unknown) {
      showFeedback('pressEmail', 'error', err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleSaveBodyTextColor = async () => {
    showFeedback('bodyTextColor', 'saving');
    try {
      await updateBodyTextColor.mutateAsync(bodyTextColor);
      showFeedback('bodyTextColor', 'saved');
    } catch (err: unknown) {
      showFeedback('bodyTextColor', 'error', err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleEnablePassword = async () => {
    if (!newPassword.trim()) return;
    showFeedback('password', 'saving');
    try {
      await enablePassword.mutateAsync(newPassword);
      setPasswordEnabled(true);
      setNewPassword('');
      showFeedback('password', 'saved');
    } catch (err: unknown) {
      showFeedback('password', 'error', err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleDisablePassword = async () => {
    showFeedback('password', 'saving');
    try {
      await disablePassword.mutateAsync();
      setPasswordEnabled(false);
      showFeedback('password', 'saved');
    } catch (err: unknown) {
      showFeedback('password', 'error', err instanceof Error ? err.message : 'Failed to disable');
    }
  };

  const renderFeedback = (field: string) => {
    if (!saveFeedback || saveFeedback.field !== field) return null;
    const { status, errorMsg } = saveFeedback;
    if (status === 'saving') return <span className="text-xs text-muted-foreground ml-2">Saving…</span>;
    if (status === 'saved') return <span className="text-xs text-green-600 ml-2">✓ Saved</span>;
    if (status === 'error') return <span className="text-xs text-red-500 ml-2">✗ {errorMsg || 'Error'}</span>;
    return null;
  };

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border rounded-lg p-8 max-w-sm w-full mx-4 shadow-lg">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">CMS Login</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in with your Internet Identity to access the CMS dashboard.
          </p>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-foreground text-background py-2.5 px-4 rounded font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {isLoggingIn ? 'Logging in…' : 'Login with Internet Identity'}
          </button>
        </div>
      </div>
    );
  }

  // ── Checking admin status / claiming admin ────────────────────────────────
  const isCheckingAdmin = adminStatusLoading || !adminStatusFetched || claimAdmin.isPending;

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border rounded-lg p-8 max-w-sm w-full mx-4 shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="animate-spin h-8 w-8 text-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm">
            {claimAdmin.isPending ? 'Registering you as admin…' : 'Checking admin status…'}
          </p>
        </div>
      </div>
    );
  }

  // ── Access denied — another principal is already admin ────────────────────
  if (adminStatus && adminStatus.adminClaimed && !adminStatus.callerIsAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border rounded-lg p-8 max-w-sm w-full mx-4 shadow-lg text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-xl font-heading font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground text-sm mb-6">
            This CMS is already claimed by another administrator. Only the registered admin can access the dashboard.
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-foreground text-background py-2.5 px-4 rounded font-medium hover:opacity-80 transition-opacity"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ── claimAdmin error (race condition — re-check showed we're not admin) ───
  if (claimAdmin.isError && adminStatus && !adminStatus.callerIsAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border rounded-lg p-8 max-w-sm w-full mx-4 shadow-lg text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-xl font-heading font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Another user claimed admin access just before you. Only the first registered admin can access the dashboard.
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-foreground text-background py-2.5 px-4 rounded font-medium hover:opacity-80 transition-opacity"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard (shown to the registered admin) ─────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-heading font-bold text-foreground">Press Kit CMS</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              title="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <span className="text-xs text-muted-foreground hidden sm:block">
              {identity?.getPrincipal().toString().slice(0, 12)}…
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* About */}
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-heading font-semibold text-foreground">About Text</h2>
            {renderFeedback('about')}
          </div>
          <textarea
            value={aboutText}
            onChange={e => setAboutText(e.target.value)}
            rows={5}
            className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground resize-vertical focus:outline-none focus:ring-1 focus:ring-foreground"
            placeholder="Describe your game…"
          />
          <button
            onClick={handleSaveAbout}
            disabled={updateAbout.isPending}
            className="mt-3 bg-foreground text-background text-sm py-1.5 px-4 rounded hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {updateAbout.isPending ? 'Saving…' : 'Save'}
          </button>
        </section>

        {/* Features */}
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-heading font-semibold text-foreground">
              Key Features <span className="text-xs font-normal text-muted-foreground">(max 4)</span>
            </h2>
            {renderFeedback('features')}
          </div>
          <div className="space-y-2">
            {features.map((f, i) => (
              <input
                key={i}
                value={f}
                onChange={e => {
                  const next = [...features];
                  next[i] = e.target.value;
                  setFeatures(next);
                }}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder={`Feature ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleSaveFeatures}
            disabled={updateFeatures.isPending}
            className="mt-3 bg-foreground text-background text-sm py-1.5 px-4 rounded hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {updateFeatures.isPending ? 'Saving…' : 'Save'}
          </button>
        </section>

        {/* Game Details */}
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-heading font-semibold text-foreground">Game Details</h2>
            {renderFeedback('gameDetails')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Genre</label>
              <input
                value={genre}
                onChange={e => setGenre(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="e.g. Puzzle"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Platforms</label>
              <input
                value={platforms}
                onChange={e => setPlatforms(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="e.g. PC, Mobile"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Release Date</label>
              <input
                value={releaseDate}
                onChange={e => setReleaseDate(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="e.g. Q2 2025"
              />
            </div>
          </div>
          <button
            onClick={handleSaveGameDetails}
            disabled={updateGameDetails.isPending}
            className="mt-3 bg-foreground text-background text-sm py-1.5 px-4 rounded hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {updateGameDetails.isPending ? 'Saving…' : 'Save'}
          </button>
        </section>

        {/* Instagram */}
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-heading font-semibold text-foreground">Instagram Link</h2>
            {renderFeedback('instagram')}
          </div>
          <input
            value={instagramLink}
            onChange={e => setInstagramLink(e.target.value)}
            className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            placeholder="https://instagram.com/yourgame"
          />
          <button
            onClick={handleSaveInstagram}
            disabled={updateInstagram.isPending}
            className="mt-3 bg-foreground text-background text-sm py-1.5 px-4 rounded hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {updateInstagram.isPending ? 'Saving…' : 'Save'}
          </button>
        </section>

        {/* YouTube Link */}
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-heading font-semibold text-foreground">YouTube Link</h2>
            {renderFeedback('youtubeLink')}
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            The YouTube video shown in the press kit. Accepts youtu.be short links or full youtube.com/watch URLs.
          </p>
          <input
            value={youtubeLink}
            onChange={e => setYoutubeLink(e.target.value)}
            className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            placeholder="https://youtu.be/XXXXXXXXXXX"
          />
          <button
            onClick={handleSaveYoutubeLink}
            disabled={updateYoutubeLinkMutation.isPending}
            className="mt-3 bg-foreground text-background text-sm py-1.5 px-4 rounded hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {updateYoutubeLinkMutation.isPending ? 'Saving…' : 'Save'}
          </button>
        </section>

        {/* Developer Website */}
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-heading font-semibold text-foreground">Developer Website</h2>
            {renderFeedback('developerWebsite')}
          </div>
          <input
            value={developerWebsite}
            onChange={e => setDeveloperWebsite(e.target.value)}
            className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            placeholder="https://yourstudio.com"
          />
          <button
            onClick={handleSaveDeveloperWebsite}
            disabled={updateDeveloperWebsite.isPending}
            className="mt-3 bg-foreground text-background text-sm py-1.5 px-4 rounded hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {updateDeveloperWebsite.isPending ? 'Saving…' : 'Save'}
          </button>
        </section>

        {/* Press Email */}
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-heading font-semibold text-foreground">Press Email</h2>
            {renderFeedback('pressEmail')}
          </div>
          <input
            value={pressEmail}
            onChange={e => setPressEmail(e.target.value)}
            type="email"
            className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            placeholder="press@yourstudio.com"
          />
          <button
            onClick={handleSavePressEmail}
            disabled={updatePressEmail.isPending}
            className="mt-3 bg-foreground text-background text-sm py-1.5 px-4 rounded hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {updatePressEmail.isPending ? 'Saving…' : 'Save'}
          </button>
        </section>

        {/* Body Text Color */}
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-heading font-semibold text-foreground">Body Text Color</h2>
            {renderFeedback('bodyTextColor')}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bodyTextColor}
              onChange={e => setBodyTextColor(e.target.value)}
              className="w-10 h-10 rounded border border-border cursor-pointer bg-background"
            />
            <input
              value={bodyTextColor}
              onChange={e => setBodyTextColor(e.target.value)}
              className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="#000000"
            />
          </div>
          <button
            onClick={handleSaveBodyTextColor}
            disabled={updateBodyTextColor.isPending}
            className="mt-3 bg-foreground text-background text-sm py-1.5 px-4 rounded hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {updateBodyTextColor.isPending ? 'Saving…' : 'Save'}
          </button>
        </section>

        {/* Password Protection */}
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-heading font-semibold text-foreground">
              Password Protection
              <span className={`ml-2 text-xs font-normal px-2 py-0.5 rounded-full ${passwordEnabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                {passwordEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </h2>
            {renderFeedback('password')}
          </div>

          {passwordEnabled ? (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                The press kit is currently password protected. Disable it to allow public access.
              </p>
              <button
                onClick={handleDisablePassword}
                disabled={disablePassword.isPending}
                className="bg-foreground text-background text-sm py-1.5 px-4 rounded hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {disablePassword.isPending ? 'Disabling…' : 'Disable Password Protection'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Set a password to restrict access to the press kit.
              </p>
              <input
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                type="password"
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="Enter new password…"
              />
              <button
                onClick={handleEnablePassword}
                disabled={enablePassword.isPending || !newPassword.trim()}
                className="bg-foreground text-background text-sm py-1.5 px-4 rounded hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {enablePassword.isPending ? 'Enabling…' : 'Enable Password Protection'}
              </button>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
