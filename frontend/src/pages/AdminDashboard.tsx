import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import {
  useContent,
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
import { Loader2, Save, LogOut, Lock, Unlock, Eye, EyeOff } from 'lucide-react';

const ADMIN_PRINCIPAL = 'r423e-lboyg-thldn-64zao-ew2h3-bh3v6-uouit-khwus-vkwn2-afrmu-rqe';

export default function AdminDashboard() {
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const currentPrincipal = identity?.getPrincipal().toString();
  const isAdmin = currentPrincipal === ADMIN_PRINCIPAL;

  const { data: content, isLoading: contentLoading } = useContent();

  // Local form state
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
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Populate form when content loads
  useEffect(() => {
    if (content) {
      setAboutText(content.aboutText || '');
      const feats = [...(content.features || [])];
      while (feats.length < 4) feats.push('');
      setFeatures(feats.slice(0, 4));
      setGenre(content.gameDetails?.genre || '');
      setPlatforms(content.gameDetails?.platforms || '');
      setReleaseDate(content.gameDetails?.releaseDate || '');
      setInstagramLink(content.instagramLink || '');
      setYoutubeLink(content.youtubeLink || '');
      setDeveloperWebsite(content.developerWebsite || '');
      setPressEmail(content.pressEmail || '');
      setBodyTextColor(content.bodyTextColorHex || '#000000');
    }
  }, [content]);

  const showSuccess = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const updateAbout = useUpdateAbout();
  const updateFeatures = useUpdateFeatures();
  const updateGameDetails = useUpdateGameDetails();
  const updateInstagram = useUpdateInstagram();
  const updateYoutube = useUpdateYoutubeLink();
  const updateDeveloperWebsite = useUpdateDeveloperWebsite();
  const updatePressEmail = useUpdatePressEmail();
  const updateBodyTextColor = useUpdateBodyTextColor();
  const enablePassword = useEnablePasswordProtection();
  const disablePassword = useDisablePasswordProtection();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 p-8 max-w-md">
          <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Sign in to manage your press kit content.</p>
          <button
            onClick={login}
            disabled={isLoggingIn}
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {isLoggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoggingIn ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </div>
    );
  }

  // ── Actor still initializing ──────────────────────────────────────────────
  if (actorFetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-foreground" />
          <p className="text-muted-foreground">Initializing secure connection…</p>
        </div>
      </div>
    );
  }

  // ── Not admin ─────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 p-8 max-w-md">
          <h1 className="font-heading text-3xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            Your account (<span className="font-mono text-xs break-all">{currentPrincipal}</span>) does not have admin access.
          </p>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded font-medium hover:opacity-80 transition-opacity"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // ── Content loading ───────────────────────────────────────────────────────
  if (contentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-foreground" />
          <p className="text-muted-foreground">Loading content…</p>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          {saveSuccess && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">{saveSuccess}</span>
          )}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded text-sm hover:bg-muted transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">

        {/* About Text */}
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold">About Text</h2>
          <textarea
            value={aboutText}
            onChange={e => setAboutText(e.target.value)}
            rows={5}
            className="w-full border border-border rounded p-3 bg-background text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-foreground/30"
            placeholder="Describe your game…"
          />
          <button
            onClick={async () => {
              await updateAbout.mutateAsync(aboutText);
              showSuccess('About text saved!');
            }}
            disabled={updateAbout.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {updateAbout.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save About
          </button>
          {updateAbout.isError && (
            <p className="text-sm text-red-500">{String(updateAbout.error)}</p>
          )}
        </section>

        {/* Features */}
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold">Features (up to 4)</h2>
          {features.map((f, i) => (
            <input
              key={i}
              value={f}
              onChange={e => {
                const next = [...features];
                next[i] = e.target.value;
                setFeatures(next);
              }}
              className="w-full border border-border rounded p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
              placeholder={`Feature ${i + 1}`}
            />
          ))}
          <button
            onClick={async () => {
              const filtered = features.filter(f => f.trim() !== '');
              await updateFeatures.mutateAsync(filtered);
              showSuccess('Features saved!');
            }}
            disabled={updateFeatures.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {updateFeatures.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Features
          </button>
          {updateFeatures.isError && (
            <p className="text-sm text-red-500">{String(updateFeatures.error)}</p>
          )}
        </section>

        {/* Game Details */}
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold">Game Details</h2>
          <input
            value={genre}
            onChange={e => setGenre(e.target.value)}
            className="w-full border border-border rounded p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
            placeholder="Genre (e.g. Puzzle, Platformer)"
          />
          <input
            value={platforms}
            onChange={e => setPlatforms(e.target.value)}
            className="w-full border border-border rounded p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
            placeholder="Platforms (e.g. iOS, Android)"
          />
          <input
            value={releaseDate}
            onChange={e => setReleaseDate(e.target.value)}
            className="w-full border border-border rounded p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
            placeholder="Release Date (e.g. Q2 2025)"
          />
          <button
            onClick={async () => {
              await updateGameDetails.mutateAsync({ genre, platforms, releaseDate });
              showSuccess('Game details saved!');
            }}
            disabled={updateGameDetails.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {updateGameDetails.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Game Details
          </button>
          {updateGameDetails.isError && (
            <p className="text-sm text-red-500">{String(updateGameDetails.error)}</p>
          )}
        </section>

        {/* Social Links */}
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold">Social & Contact Links</h2>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Instagram URL</label>
            <input
              value={instagramLink}
              onChange={e => setInstagramLink(e.target.value)}
              className="w-full border border-border rounded p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
              placeholder="https://instagram.com/yourhandle"
            />
            <button
              onClick={async () => {
                await updateInstagram.mutateAsync(instagramLink);
                showSuccess('Instagram link saved!');
              }}
              disabled={updateInstagram.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
            >
              {updateInstagram.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Instagram
            </button>
            {updateInstagram.isError && (
              <p className="text-sm text-red-500">{String(updateInstagram.error)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">YouTube Link</label>
            <input
              value={youtubeLink}
              onChange={e => setYoutubeLink(e.target.value)}
              className="w-full border border-border rounded p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
              placeholder="https://youtu.be/..."
            />
            <button
              onClick={async () => {
                await updateYoutube.mutateAsync(youtubeLink);
                showSuccess('YouTube link saved!');
              }}
              disabled={updateYoutube.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
            >
              {updateYoutube.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save YouTube
            </button>
            {updateYoutube.isError && (
              <p className="text-sm text-red-500">{String(updateYoutube.error)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Developer Website</label>
            <input
              value={developerWebsite}
              onChange={e => setDeveloperWebsite(e.target.value)}
              className="w-full border border-border rounded p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
              placeholder="https://yourstudio.com"
            />
            <button
              onClick={async () => {
                await updateDeveloperWebsite.mutateAsync(developerWebsite);
                showSuccess('Developer website saved!');
              }}
              disabled={updateDeveloperWebsite.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
            >
              {updateDeveloperWebsite.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Website
            </button>
            {updateDeveloperWebsite.isError && (
              <p className="text-sm text-red-500">{String(updateDeveloperWebsite.error)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Press Email</label>
            <input
              value={pressEmail}
              onChange={e => setPressEmail(e.target.value)}
              className="w-full border border-border rounded p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
              placeholder="press@yourstudio.com"
            />
            <button
              onClick={async () => {
                await updatePressEmail.mutateAsync(pressEmail);
                showSuccess('Press email saved!');
              }}
              disabled={updatePressEmail.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
            >
              {updatePressEmail.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Email
            </button>
            {updatePressEmail.isError && (
              <p className="text-sm text-red-500">{String(updatePressEmail.error)}</p>
            )}
          </div>
        </section>

        {/* Body Text Color */}
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold">Body Text Color</h2>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={bodyTextColor}
              onChange={e => setBodyTextColor(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer border border-border"
            />
            <input
              value={bodyTextColor}
              onChange={e => setBodyTextColor(e.target.value)}
              className="flex-1 border border-border rounded p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
              placeholder="#000000"
            />
          </div>
          <button
            onClick={async () => {
              await updateBodyTextColor.mutateAsync(bodyTextColor);
              showSuccess('Body text color saved!');
            }}
            disabled={updateBodyTextColor.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {updateBodyTextColor.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Color
          </button>
          {updateBodyTextColor.isError && (
            <p className="text-sm text-red-500">{String(updateBodyTextColor.error)}</p>
          )}
        </section>

        {/* Password Protection */}
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold">Press Kit Password Protection</h2>
          <p className="text-sm text-muted-foreground">
            Current status:{' '}
            <span className={`font-medium ${content?.passwordEnabled ? 'text-amber-600' : 'text-green-600'}`}>
              {content?.passwordEnabled ? 'Password Protected' : 'Public Access'}
            </span>
          </p>

          {content?.passwordEnabled ? (
            <button
              onClick={async () => {
                await disablePassword.mutateAsync();
                showSuccess('Password protection disabled!');
              }}
              disabled={disablePassword.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
            >
              {disablePassword.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
              Disable Password Protection
            </button>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full border border-border rounded p-3 pr-10 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
                  placeholder="Set a password for the press kit"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={async () => {
                  if (!passwordInput.trim()) return;
                  await enablePassword.mutateAsync(passwordInput);
                  setPasswordInput('');
                  showSuccess('Password protection enabled!');
                }}
                disabled={enablePassword.isPending || !passwordInput.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
              >
                {enablePassword.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Enable Password Protection
              </button>
            </div>
          )}
          {(enablePassword.isError || disablePassword.isError) && (
            <p className="text-sm text-red-500">
              {String(enablePassword.error || disablePassword.error)}
            </p>
          )}
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Poke A Nose — Built with{' '}
        <span className="text-red-500">♥</span> using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
