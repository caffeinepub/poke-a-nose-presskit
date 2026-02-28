import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useContent } from '../hooks/useQueries';
import {
  useUpdateAbout,
  useUpdateFeatures,
  useUpdateGameDetails,
  useUpdateInstagram,
  useUpdateDeveloperWebsite,
  useUpdatePressEmail,
  useUpdateBodyTextColor,
  useEnablePasswordProtection,
  useDisablePasswordProtection,
} from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { LogIn, LogOut, Check, AlertCircle, Lock, Unlock } from 'lucide-react';

type AdminStatus = 'idle' | 'checking' | 'authorized' | 'denied' | 'error';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SaveFeedbackProps {
  status: SaveStatus;
  errorMsg?: string;
}

function SaveFeedback({ status, errorMsg }: SaveFeedbackProps) {
  if (status === 'idle') return null;
  if (status === 'saving') return <span className="text-xs opacity-50 ml-2">Saving…</span>;
  if (status === 'saved') return <span className="text-xs text-green-600 ml-2 flex items-center gap-1"><Check size={12} /> Saved</span>;
  if (status === 'error') return <span className="text-xs text-red-500 ml-2">{errorMsg || 'Error'}</span>;
  return null;
}

export default function AdminDashboard() {
  const { identity, login, clear, isLoggingIn, isInitializing } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: content, isLoading: contentLoading } = useContent();

  const [adminStatus, setAdminStatus] = useState<AdminStatus>('idle');
  const [adminError, setAdminError] = useState('');

  // Form states
  const [about, setAbout] = useState('');
  const [features, setFeatures] = useState<string[]>(['', '', '', '']);
  const [genre, setGenre] = useState('');
  const [platforms, setPlatforms] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [instagram, setInstagram] = useState('');
  const [devWebsite, setDevWebsite] = useState('');
  const [pressEmail, setPressEmail] = useState('');
  const [bodyColor, setBodyColor] = useState('#111111');
  const [newPassword, setNewPassword] = useState('');

  // Save feedback states
  const [aboutStatus, setAboutStatus] = useState<SaveStatus>('idle');
  const [aboutErr, setAboutErr] = useState('');
  const [featuresStatus, setFeaturesStatus] = useState<SaveStatus>('idle');
  const [featuresErr, setFeaturesErr] = useState('');
  const [detailsStatus, setDetailsStatus] = useState<SaveStatus>('idle');
  const [detailsErr, setDetailsErr] = useState('');
  const [instagramStatus, setInstagramStatus] = useState<SaveStatus>('idle');
  const [instagramErr, setInstagramErr] = useState('');
  const [devStatus, setDevStatus] = useState<SaveStatus>('idle');
  const [devErr, setDevErr] = useState('');
  const [emailStatus, setEmailStatus] = useState<SaveStatus>('idle');
  const [emailErr, setEmailErr] = useState('');
  const [colorStatus, setColorStatus] = useState<SaveStatus>('idle');
  const [colorErr, setColorErr] = useState('');
  const [pwStatus, setPwStatus] = useState<SaveStatus>('idle');
  const [pwError, setPwError] = useState('');

  const updateAbout = useUpdateAbout();
  const updateFeatures = useUpdateFeatures();
  const updateGameDetails = useUpdateGameDetails();
  const updateInstagram = useUpdateInstagram();
  const updateDeveloperWebsite = useUpdateDeveloperWebsite();
  const updatePressEmail = useUpdatePressEmail();
  const updateBodyTextColor = useUpdateBodyTextColor();
  const enablePassword = useEnablePasswordProtection();
  const disablePassword = useDisablePasswordProtection();

  // Populate form from content
  useEffect(() => {
    if (content) {
      setAbout(content.aboutText || '');
      const f = [...(content.features || [])];
      while (f.length < 4) f.push('');
      setFeatures(f.slice(0, 4));
      setGenre(content.gameDetails?.genre || '');
      setPlatforms(content.gameDetails?.platforms || '');
      setReleaseDate(content.gameDetails?.releaseDate || '');
      setInstagram(content.instagramLink || '');
      setDevWebsite(content.developerWebsite || '');
      setPressEmail(content.pressEmail || '');
      setBodyColor(content.bodyTextColorHex || '#111111');
    }
  }, [content]);

  // Initialize admin after login
  useEffect(() => {
    if (!identity || !actor) return;
    if (adminStatus === 'authorized' || adminStatus === 'checking') return;

    setAdminStatus('checking');
    actor.initializeAdmin().then(result => {
      if (result.__kind__ === 'ok') {
        setAdminStatus('authorized');
      } else {
        setAdminStatus('denied');
        setAdminError(result.err);
      }
    }).catch((err: unknown) => {
      setAdminStatus('error');
      setAdminError(err instanceof Error ? err.message : 'Unknown error');
    });
  }, [identity, actor, adminStatus]);

  // Reset admin status on logout
  useEffect(() => {
    if (!identity) {
      setAdminStatus('idle');
      setAdminError('');
    }
  }, [identity]);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    setAdminStatus('idle');
    setAdminError('');
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const withFeedback = async (
    fn: () => Promise<void>,
    setStatus: (s: SaveStatus) => void,
    setErrMsg?: (e: string) => void
  ) => {
    setStatus('saving');
    try {
      await fn();
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err: unknown) {
      setStatus('error');
      setErrMsg?.(err instanceof Error ? err.message : 'Error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl">Admin Dashboard</h1>
        {isAuthenticated && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="rounded-none gap-2 text-xs uppercase tracking-widest"
          >
            <LogOut size={14} />
            Logout
          </Button>
        )}
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* ── Not logged in ── */}
        {!isAuthenticated && (
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-foreground/20 flex items-center justify-center">
              <Lock size={24} className="opacity-40" />
            </div>
            <div>
              <h2 className="font-heading text-3xl mb-2">Admin Access</h2>
              <p className="font-body text-sm opacity-60 max-w-xs">
                Login with Internet Identity to manage your press kit content.
                The first login will register you as the permanent admin.
              </p>
            </div>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn || isInitializing}
              className="rounded-none uppercase tracking-widest text-xs px-8 py-5 gap-2"
            >
              <LogIn size={14} />
              {isLoggingIn ? 'Logging in…' : isInitializing ? 'Initializing…' : 'Login with Internet Identity'}
            </Button>
          </div>
        )}

        {/* ── Checking admin status ── */}
        {isAuthenticated && adminStatus === 'checking' && (
          <div className="flex items-center justify-center py-16">
            <p className="font-body text-sm opacity-50">Verifying admin access…</p>
          </div>
        )}

        {/* ── Access denied ── */}
        {isAuthenticated && (adminStatus === 'denied' || adminStatus === 'error') && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <AlertCircle size={32} className="text-red-500" />
            <h2 className="font-heading text-2xl">Access Denied</h2>
            <p className="font-body text-sm text-red-500 max-w-sm">{adminError}</p>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="rounded-none text-xs uppercase tracking-widest gap-2 mt-2"
            >
              <LogOut size={14} />
              Logout
            </Button>
          </div>
        )}

        {/* ── CMS Dashboard ── */}
        {isAuthenticated && adminStatus === 'authorized' && (
          <div className="space-y-8">
            <p className="font-body text-xs opacity-40 uppercase tracking-widest">
              Content Management
            </p>

            {contentLoading ? (
              <p className="font-body text-sm opacity-50">Loading content…</p>
            ) : (
              <>
                {/* About */}
                <div className="admin-field-group">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-heading text-base">About the Game</Label>
                    <SaveFeedback status={aboutStatus} errorMsg={aboutErr} />
                  </div>
                  <Textarea
                    value={about}
                    onChange={e => setAbout(e.target.value)}
                    rows={5}
                    className="rounded-none text-sm font-body resize-none"
                    placeholder="Write about the game…"
                  />
                  <Button
                    size="sm"
                    className="mt-2 rounded-none text-xs uppercase tracking-widest"
                    disabled={updateAbout.isPending}
                    onClick={() => withFeedback(() => updateAbout.mutateAsync(about), setAboutStatus, setAboutErr)}
                  >
                    {updateAbout.isPending ? 'Saving…' : 'Save'}
                  </Button>
                </div>

                <Separator />

                {/* Features */}
                <div className="admin-field-group">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-heading text-base">Features <span className="text-xs font-body opacity-40">(max 4)</span></Label>
                    <SaveFeedback status={featuresStatus} errorMsg={featuresErr} />
                  </div>
                  <div className="space-y-2">
                    {features.map((f, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input
                          value={f}
                          onChange={e => {
                            const next = [...features];
                            next[i] = e.target.value;
                            setFeatures(next);
                          }}
                          className="rounded-none text-sm font-body"
                          placeholder={`Feature ${i + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="mt-2 rounded-none text-xs uppercase tracking-widest"
                    disabled={updateFeatures.isPending}
                    onClick={() => withFeedback(
                      () => updateFeatures.mutateAsync(features.filter(f => f.trim() !== '')),
                      setFeaturesStatus,
                      setFeaturesErr
                    )}
                  >
                    {updateFeatures.isPending ? 'Saving…' : 'Save'}
                  </Button>
                </div>

                <Separator />

                {/* Game Details */}
                <div className="admin-field-group">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-heading text-base">Game Details</Label>
                    <SaveFeedback status={detailsStatus} errorMsg={detailsErr} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs font-body opacity-50 uppercase tracking-widest mb-1 block">Genre</Label>
                      <Input value={genre} onChange={e => setGenre(e.target.value)} className="rounded-none text-sm" placeholder="e.g. Adventure" />
                    </div>
                    <div>
                      <Label className="text-xs font-body opacity-50 uppercase tracking-widest mb-1 block">Platforms</Label>
                      <Input value={platforms} onChange={e => setPlatforms(e.target.value)} className="rounded-none text-sm" placeholder="e.g. PC, Mac" />
                    </div>
                    <div>
                      <Label className="text-xs font-body opacity-50 uppercase tracking-widest mb-1 block">Release Date</Label>
                      <Input value={releaseDate} onChange={e => setReleaseDate(e.target.value)} className="rounded-none text-sm" placeholder="e.g. 2025" />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="mt-2 rounded-none text-xs uppercase tracking-widest"
                    disabled={updateGameDetails.isPending}
                    onClick={() => withFeedback(
                      () => updateGameDetails.mutateAsync({ genre, platforms, releaseDate }),
                      setDetailsStatus,
                      setDetailsErr
                    )}
                  >
                    {updateGameDetails.isPending ? 'Saving…' : 'Save'}
                  </Button>
                </div>

                <Separator />

                {/* Instagram */}
                <div className="admin-field-group">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-heading text-base">Instagram Link</Label>
                    <SaveFeedback status={instagramStatus} errorMsg={instagramErr} />
                  </div>
                  <Input
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                    className="rounded-none text-sm font-body"
                    placeholder="https://instagram.com/yourhandle"
                  />
                  <Button
                    size="sm"
                    className="mt-2 rounded-none text-xs uppercase tracking-widest"
                    disabled={updateInstagram.isPending}
                    onClick={() => withFeedback(() => updateInstagram.mutateAsync(instagram), setInstagramStatus, setInstagramErr)}
                  >
                    {updateInstagram.isPending ? 'Saving…' : 'Save'}
                  </Button>
                </div>

                <Separator />

                {/* Developer Website */}
                <div className="admin-field-group">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-heading text-base">Developer Website</Label>
                    <SaveFeedback status={devStatus} errorMsg={devErr} />
                  </div>
                  <Input
                    value={devWebsite}
                    onChange={e => setDevWebsite(e.target.value)}
                    className="rounded-none text-sm font-body"
                    placeholder="https://yourstudio.com"
                  />
                  <Button
                    size="sm"
                    className="mt-2 rounded-none text-xs uppercase tracking-widest"
                    disabled={updateDeveloperWebsite.isPending}
                    onClick={() => withFeedback(() => updateDeveloperWebsite.mutateAsync(devWebsite), setDevStatus, setDevErr)}
                  >
                    {updateDeveloperWebsite.isPending ? 'Saving…' : 'Save'}
                  </Button>
                </div>

                <Separator />

                {/* Press Email */}
                <div className="admin-field-group">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-heading text-base">Press &amp; Support Email</Label>
                    <SaveFeedback status={emailStatus} errorMsg={emailErr} />
                  </div>
                  <Input
                    value={pressEmail}
                    onChange={e => setPressEmail(e.target.value)}
                    className="rounded-none text-sm font-body"
                    placeholder="press@yourstudio.com"
                    type="email"
                  />
                  <Button
                    size="sm"
                    className="mt-2 rounded-none text-xs uppercase tracking-widest"
                    disabled={updatePressEmail.isPending}
                    onClick={() => withFeedback(() => updatePressEmail.mutateAsync(pressEmail), setEmailStatus, setEmailErr)}
                  >
                    {updatePressEmail.isPending ? 'Saving…' : 'Save'}
                  </Button>
                </div>

                <Separator />

                {/* Body Text Color */}
                <div className="admin-field-group">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-heading text-base">
                      Body Text Color{' '}
                      <span className="text-xs font-body opacity-40">(Light Mode Only)</span>
                    </Label>
                    <SaveFeedback status={colorStatus} errorMsg={colorErr} />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bodyColor}
                      onChange={e => setBodyColor(e.target.value)}
                      className="w-10 h-10 cursor-pointer border border-border rounded-none"
                    />
                    <Input
                      value={bodyColor}
                      onChange={e => setBodyColor(e.target.value)}
                      className="rounded-none text-sm font-body w-32"
                      placeholder="#111111"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="mt-2 rounded-none text-xs uppercase tracking-widest"
                    disabled={updateBodyTextColor.isPending}
                    onClick={() => withFeedback(() => updateBodyTextColor.mutateAsync(bodyColor), setColorStatus, setColorErr)}
                  >
                    {updateBodyTextColor.isPending ? 'Saving…' : 'Save'}
                  </Button>
                </div>

                <Separator />

                {/* Password Protection */}
                <div className="admin-field-group">
                  <Label className="font-heading text-base block mb-3">Password Protection</Label>

                  <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50">
                    {content?.passwordEnabled ? (
                      <>
                        <Lock size={16} className="text-foreground" />
                        <span className="font-body text-sm">
                          Status: <strong>Enabled</strong>
                        </span>
                      </>
                    ) : (
                      <>
                        <Unlock size={16} className="opacity-50" />
                        <span className="font-body text-sm opacity-60">
                          Status: <strong>Disabled</strong> — Press kit is publicly accessible
                        </span>
                      </>
                    )}
                  </div>

                  {content?.passwordEnabled ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-body opacity-50 uppercase tracking-widest mb-1 block">
                          Change Password
                        </Label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="rounded-none text-sm font-body"
                          placeholder="New password"
                        />
                      </div>
                      {pwStatus === 'error' && <p className="text-xs text-red-500">{pwError}</p>}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="rounded-none text-xs uppercase tracking-widest"
                          disabled={enablePassword.isPending || !newPassword}
                          onClick={() => withFeedback(
                            () => enablePassword.mutateAsync(newPassword).then(() => setNewPassword('')),
                            setPwStatus,
                            setPwError
                          )}
                        >
                          {enablePassword.isPending ? 'Saving…' : 'Change Password'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-none text-xs uppercase tracking-widest"
                          disabled={disablePassword.isPending}
                          onClick={() => withFeedback(
                            () => disablePassword.mutateAsync(),
                            setPwStatus,
                            setPwError
                          )}
                        >
                          {disablePassword.isPending ? 'Disabling…' : 'Disable Protection'}
                        </Button>
                      </div>
                      {pwStatus === 'saved' && <p className="text-xs text-green-600 flex items-center gap-1"><Check size={12} /> Saved</p>}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-body opacity-50 uppercase tracking-widest mb-1 block">
                          Set Password to Enable Protection
                        </Label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="rounded-none text-sm font-body"
                          placeholder="Enter a password"
                        />
                      </div>
                      {pwStatus === 'error' && <p className="text-xs text-red-500">{pwError}</p>}
                      <Button
                        size="sm"
                        className="rounded-none text-xs uppercase tracking-widest"
                        disabled={enablePassword.isPending || !newPassword}
                        onClick={() => withFeedback(
                          () => enablePassword.mutateAsync(newPassword).then(() => setNewPassword('')),
                          setPwStatus,
                          setPwError
                        )}
                      >
                        {enablePassword.isPending ? 'Enabling…' : 'Enable Password Protection'}
                      </Button>
                      {pwStatus === 'saved' && <p className="text-xs text-green-600 flex items-center gap-1"><Check size={12} /> Saved</p>}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-4 px-6 text-center border-t border-border mt-8">
        <p className="font-body text-xs opacity-30">
          © {new Date().getFullYear()} Poke A Nose &mdash; Built with{' '}
          <span className="text-red-400">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'poke-a-nose-presskit')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-70"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
