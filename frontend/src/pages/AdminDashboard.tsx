import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import {
  useGetContent,
  useIsAdmin,
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

export default function AdminDashboard() {
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: content, isLoading: contentLoading } = useGetContent();

  // Form state
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
  const [passwordEnabled, setPasswordEnabled] = useState(false);

  // Populate form when content loads
  useEffect(() => {
    if (content) {
      setAboutText(content.aboutText || '');
      const f = [...(content.features || [])];
      while (f.length < 4) f.push('');
      setFeatures(f.slice(0, 4));
      setGenre(content.gameDetails?.genre || '');
      setPlatforms(content.gameDetails?.platforms || '');
      setReleaseDate(content.gameDetails?.releaseDate || '');
      setInstagramLink(content.instagramLink || '');
      setYoutubeLink(content.youtubeLink || '');
      setDeveloperWebsite(content.developerWebsite || '');
      setPressEmail(content.pressEmail || '');
      setBodyTextColor(content.bodyTextColorHex || '#000000');
      setPasswordEnabled(content.passwordEnabled || false);
    }
  }, [content]);

  const updateAbout = useUpdateAbout();
  const updateFeatures = useUpdateFeatures();
  const updateGameDetails = useUpdateGameDetails();
  const updateInstagram = useUpdateInstagram();
  const updateYoutubeLink = useUpdateYoutubeLink();
  const updateDeveloperWebsite = useUpdateDeveloperWebsite();
  const updatePressEmail = useUpdatePressEmail();
  const updateBodyTextColor = useUpdateBodyTextColor();
  const enablePassword = useEnablePasswordProtection();
  const disablePassword = useDisablePasswordProtection();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error?.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const handleSaveAbout = () => {
    updateAbout.mutate(aboutText);
  };

  const handleSaveFeatures = () => {
    const filtered = features.filter(f => f.trim() !== '');
    updateFeatures.mutate(filtered);
  };

  const handleSaveGameDetails = () => {
    updateGameDetails.mutate({ genre, platforms, releaseDate });
  };

  const handleSaveInstagram = () => {
    updateInstagram.mutate(instagramLink);
  };

  const handleSaveYoutube = () => {
    updateYoutubeLink.mutate(youtubeLink);
  };

  const handleSaveDeveloperWebsite = () => {
    updateDeveloperWebsite.mutate(developerWebsite);
  };

  const handleSavePressEmail = () => {
    updatePressEmail.mutate(pressEmail);
  };

  const handleSaveBodyTextColor = () => {
    updateBodyTextColor.mutate(bodyTextColor);
  };

  const handleTogglePassword = () => {
    if (passwordEnabled) {
      disablePassword.mutate(undefined, {
        onSuccess: () => setPasswordEnabled(false),
      });
    } else {
      if (!passwordInput.trim()) return;
      enablePassword.mutate(passwordInput, {
        onSuccess: () => {
          setPasswordEnabled(true);
          setPasswordInput('');
        },
      });
    }
  };

  // Loading states
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Initializing...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border rounded-lg p-8 max-w-sm w-full mx-4 text-center shadow-lg">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Admin Login</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Sign in with your Internet Identity to access the CMS dashboard.
          </p>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-primary text-primary-foreground py-2.5 px-6 rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoggingIn ? 'Signing in...' : 'Sign in with Internet Identity'}
          </button>
        </div>
      </div>
    );
  }

  if (actorFetching || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border rounded-lg p-8 max-w-sm w-full mx-4 text-center shadow-lg">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Your account does not have admin privileges.
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-secondary text-secondary-foreground py-2.5 px-6 rounded font-medium hover:opacity-90 transition-opacity"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Loading content...</div>
      </div>
    );
  }

  const inputClass =
    'w-full bg-background border border-border rounded px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring';
  const labelClass = 'block text-sm font-medium text-foreground mb-1';
  const sectionClass = 'bg-card border border-border rounded-lg p-5 space-y-3';
  const sectionTitleClass = 'text-base font-heading font-semibold text-foreground';
  const saveButtonClass =
    'mt-2 bg-primary text-primary-foreground px-4 py-1.5 rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2';

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-heading font-bold text-foreground">CMS Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* About Text */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>About Text</h2>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={`${inputClass} min-h-[100px] resize-y`}
              value={aboutText}
              onChange={e => setAboutText(e.target.value)}
              placeholder="Enter about text..."
            />
          </div>
          <button
            className={saveButtonClass}
            onClick={handleSaveAbout}
            disabled={updateAbout.isPending}
          >
            {updateAbout.isPending && (
              <span className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            )}
            {updateAbout.isPending ? 'Saving...' : 'Save'}
          </button>
          {updateAbout.isSuccess && (
            <p className="text-xs text-green-600">Saved successfully!</p>
          )}
        </div>

        {/* Features */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Features (up to 4)</h2>
          {features.map((f, i) => (
            <div key={i}>
              <label className={labelClass}>Feature {i + 1}</label>
              <input
                className={inputClass}
                value={f}
                onChange={e => handleFeatureChange(i, e.target.value)}
                placeholder={`Feature ${i + 1}...`}
              />
            </div>
          ))}
          <button
            className={saveButtonClass}
            onClick={handleSaveFeatures}
            disabled={updateFeatures.isPending}
          >
            {updateFeatures.isPending && (
              <span className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            )}
            {updateFeatures.isPending ? 'Saving...' : 'Save'}
          </button>
          {updateFeatures.isSuccess && (
            <p className="text-xs text-green-600">Saved successfully!</p>
          )}
        </div>

        {/* Game Details */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Game Details</h2>
          <div>
            <label className={labelClass}>Genre</label>
            <input
              className={inputClass}
              value={genre}
              onChange={e => setGenre(e.target.value)}
              placeholder="e.g. Puzzle, Adventure"
            />
          </div>
          <div>
            <label className={labelClass}>Platforms</label>
            <input
              className={inputClass}
              value={platforms}
              onChange={e => setPlatforms(e.target.value)}
              placeholder="e.g. iOS, Android"
            />
          </div>
          <div>
            <label className={labelClass}>Release Date</label>
            <input
              className={inputClass}
              value={releaseDate}
              onChange={e => setReleaseDate(e.target.value)}
              placeholder="e.g. Q1 2025"
            />
          </div>
          <button
            className={saveButtonClass}
            onClick={handleSaveGameDetails}
            disabled={updateGameDetails.isPending}
          >
            {updateGameDetails.isPending && (
              <span className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            )}
            {updateGameDetails.isPending ? 'Saving...' : 'Save'}
          </button>
          {updateGameDetails.isSuccess && (
            <p className="text-xs text-green-600">Saved successfully!</p>
          )}
        </div>

        {/* Social Links */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Social Links</h2>
          <div>
            <label className={labelClass}>Instagram URL</label>
            <input
              className={inputClass}
              value={instagramLink}
              onChange={e => setInstagramLink(e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>
          <button
            className={saveButtonClass}
            onClick={handleSaveInstagram}
            disabled={updateInstagram.isPending}
          >
            {updateInstagram.isPending && (
              <span className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            )}
            {updateInstagram.isPending ? 'Saving...' : 'Save Instagram'}
          </button>
          {updateInstagram.isSuccess && (
            <p className="text-xs text-green-600">Saved successfully!</p>
          )}
        </div>

        {/* YouTube Link */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>YouTube Link</h2>
          <div>
            <label className={labelClass}>YouTube URL</label>
            <input
              className={inputClass}
              value={youtubeLink}
              onChange={e => setYoutubeLink(e.target.value)}
              placeholder="https://youtu.be/..."
            />
          </div>
          <button
            className={saveButtonClass}
            onClick={handleSaveYoutube}
            disabled={updateYoutubeLink.isPending}
          >
            {updateYoutubeLink.isPending && (
              <span className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            )}
            {updateYoutubeLink.isPending ? 'Saving...' : 'Save'}
          </button>
          {updateYoutubeLink.isSuccess && (
            <p className="text-xs text-green-600">Saved successfully!</p>
          )}
        </div>

        {/* Developer Website */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Developer Website</h2>
          <div>
            <label className={labelClass}>Website URL</label>
            <input
              className={inputClass}
              value={developerWebsite}
              onChange={e => setDeveloperWebsite(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <button
            className={saveButtonClass}
            onClick={handleSaveDeveloperWebsite}
            disabled={updateDeveloperWebsite.isPending}
          >
            {updateDeveloperWebsite.isPending && (
              <span className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            )}
            {updateDeveloperWebsite.isPending ? 'Saving...' : 'Save'}
          </button>
          {updateDeveloperWebsite.isSuccess && (
            <p className="text-xs text-green-600">Saved successfully!</p>
          )}
        </div>

        {/* Press Email */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Press Email</h2>
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              className={inputClass}
              value={pressEmail}
              onChange={e => setPressEmail(e.target.value)}
              placeholder="press@example.com"
            />
          </div>
          <button
            className={saveButtonClass}
            onClick={handleSavePressEmail}
            disabled={updatePressEmail.isPending}
          >
            {updatePressEmail.isPending && (
              <span className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            )}
            {updatePressEmail.isPending ? 'Saving...' : 'Save'}
          </button>
          {updatePressEmail.isSuccess && (
            <p className="text-xs text-green-600">Saved successfully!</p>
          )}
        </div>

        {/* Body Text Color */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Body Text Color</h2>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bodyTextColor}
              onChange={e => setBodyTextColor(e.target.value)}
              className="w-10 h-10 rounded border border-border cursor-pointer"
            />
            <input
              className={`${inputClass} flex-1`}
              value={bodyTextColor}
              onChange={e => setBodyTextColor(e.target.value)}
              placeholder="#000000"
            />
          </div>
          <button
            className={saveButtonClass}
            onClick={handleSaveBodyTextColor}
            disabled={updateBodyTextColor.isPending}
          >
            {updateBodyTextColor.isPending && (
              <span className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            )}
            {updateBodyTextColor.isPending ? 'Saving...' : 'Save'}
          </button>
          {updateBodyTextColor.isSuccess && (
            <p className="text-xs text-green-600">Saved successfully!</p>
          )}
        </div>

        {/* Password Protection */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Password Protection</h2>
          <p className="text-sm text-muted-foreground">
            Status:{' '}
            <span className={passwordEnabled ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
              {passwordEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </p>
          {!passwordEnabled && (
            <div>
              <label className={labelClass}>Set Password</label>
              <input
                className={inputClass}
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Enter password to enable..."
              />
            </div>
          )}
          <button
            className={`${saveButtonClass} ${passwordEnabled ? 'bg-destructive text-destructive-foreground' : ''}`}
            onClick={handleTogglePassword}
            disabled={enablePassword.isPending || disablePassword.isPending}
          >
            {(enablePassword.isPending || disablePassword.isPending) && (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {passwordEnabled ? 'Disable Password Protection' : 'Enable Password Protection'}
          </button>
          {(enablePassword.isSuccess || disablePassword.isSuccess) && (
            <p className="text-xs text-green-600">Saved successfully!</p>
          )}
        </div>
      </main>
    </div>
  );
}
