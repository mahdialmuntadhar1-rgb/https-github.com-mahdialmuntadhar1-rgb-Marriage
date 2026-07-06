import { useState, useCallback, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { AppLanguage, AppTab, UserProfile, MatchProfile, SearchFilters } from './types';
import { INITIAL_MATCHES } from './data/matches';
import LandingScreen from './screens/LandingScreen';
import MatchExplorerScreen from './screens/MatchExplorerScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import ProfilePreviewScreen from './screens/ProfilePreviewScreen';
import PrivacySettingsScreen from './screens/PrivacySettingsScreen';
import TrustPrivacyScreen from './screens/TrustPrivacyScreen';
import AuthScreen from './screens/AuthScreen';

const DEFAULT_USER_PROFILE: UserProfile = {
  name: '', age: 0, gender: undefined, country: 'Iraq', governorate: 'Baghdad',
  religion: 'islam', sect: 'none', ethnicity: 'arab', education: '', profession: '',
  languages: ['ar'], maritalStatus: 'single', intention: 'marriage', timeline: '6-12 months',
  wantsChildren: 'yes', relocation: 'maybe', communicationPreference: 'in_app', values: [],
  photoPrivacy: 'blurred', photoStatus: 'blurred', avatarUrl: '', savedMatches: [],
  partnerAgeRange: '25-35', partnerCountry: 'Iraq', partnerGovernorate: 'Baghdad',
  partnerReligion: 'islam', partnerSect: 'all', partnerEthnicity: 'all', partnerEducation: '',
  partnerProfession: '', partnerLanguage: ['ar'], partnerFamilyValues: '', partnerLifestyle: '',
  partnerSmoking: 'non_smoker', partnerWantsChildren: 'yes', partnerPersonality: '',
  partnerSeriousness: 'very_serious', partnerDealbreakers: [],
  locationSearchPreference: 'same_governorate',
};

const DEFAULT_FILTERS: SearchFilters = {
  gender: 'all', minAge: 18, maxAge: 50, locationSearchPreference: 'all', governorate: 'all',
  city: '', religion: 'all', sect: 'all', ethnicity: 'all', education: '', profession: '',
  seriousness: '', familyValues: '', wantsChildren: '', smoking: '', photoVisibility: 'all',
  verifiedOnly: false, timeline: '', sortBy: '',
};

export default function App() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const [activeScreen, setActiveScreen] = useState<AppTab>('landing');
  const [locale, setLocale] = useState<AppLanguage>('ar');
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [matches, setMatches] = useState<MatchProfile[]>(INITIAL_MATCHES);
  const [savedMatchIds, setSavedMatchIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login');

  useEffect(() => {
    const onboardingDone = localStorage.getItem('halal_onboarding_complete') === 'true';
    setHasOnboarded(onboardingDone);
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn && user) {
      setUserProfile(prev => ({
        ...prev,
        name: user.firstName || user.fullName || prev.name,
        avatarUrl: user.imageUrl || prev.avatarUrl,
      }));
    }
  }, [isSignedIn, user]);

  const handleSelectGender = useCallback((gender: 'male' | 'female') => {
    setUserProfile(prev => ({ ...prev, gender }));
    if (hasOnboarded || isSignedIn) setActiveScreen('landing');
    else setActiveScreen('onboarding');
  }, [hasOnboarded, isSignedIn]);

  const handleExploreWithoutOnboarding = useCallback(() => setActiveScreen('explorer'), []);
  const handleExploreMatches = useCallback(() => setActiveScreen('explorer'), []);
  const handleSetTab = useCallback((tab: AppTab) => setActiveScreen(tab), []);

  const handleSendRequest = useCallback((id: string) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, requestStatus: 'sent' as const } : m));
  }, []);

  const handleInitiateChat = useCallback((id: string) => console.log('Chat:', id), []);
  const handleToggleSaveMatch = useCallback((id: string) => {
    setSavedMatchIds(prev => prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]);
  }, []);

  const handleUpdateUserProfile = useCallback((updated: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updated }));
  }, []);

  const handleOnProfileSave = useCallback((v: Partial<UserProfile>) => handleUpdateUserProfile(v), [handleUpdateUserProfile]);

  const handleOnCompleteOnboarding = useCallback((updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('halal_onboarding_complete', 'true');
    setHasOnboarded(true);
    setActiveScreen('landing');
  }, []);

  const handleSkipOnboarding = useCallback(() => {
    localStorage.setItem('halal_onboarding_complete', 'true');
    setHasOnboarded(true);
    setActiveScreen('landing');
  }, []);

  const triggerToast = useCallback((msg: string) => console.log('Toast:', msg), []);
  const handleBackToOverview = useCallback(() => setActiveScreen('landing'), []);

  const openAuth = useCallback((mode: 'login' | 'register' | 'reset' = 'login') => {
    setAuthMode(mode); setShowAuth(true);
  }, []);

  const closeAuth = useCallback(() => setShowAuth(false), []);

  const handleAuthSuccess = useCallback(() => {
    setShowAuth(false);
    const done = localStorage.getItem('halal_onboarding_complete') === 'true';
    setActiveScreen(done ? 'landing' : 'onboarding');
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'landing': return (
        <LandingScreen locale={locale} onSelectGender={handleSelectGender} onExploreMatches={handleExploreMatches}
          setTab={handleSetTab} isAuthenticated={isSignedIn || false} userProfileName={userProfile.name}
          userProfile={userProfile} onExploreWithoutOnboarding={handleExploreWithoutOnboarding}
          onOpenAuth={openAuth} onSignOut={() => {}} />
      );
      case 'explorer': return (
        <MatchExplorerScreen locale={locale} matches={matches} onSendRequest={handleSendRequest}
          onInitiateChat={handleInitiateChat} userGender={userProfile.gender || 'male'}
          userGovernorate={userProfile.governorate} savedMatchIds={savedMatchIds}
          onToggleSaveMatch={handleToggleSaveMatch} userProfile={userProfile}
          onUpdateUserProfile={handleUpdateUserProfile} onNavigateToTab={handleSetTab} />
      );
      case 'onboarding': return (
        <OnboardingScreen locale={locale} userProfile={userProfile} onComplete={handleOnCompleteOnboarding}
          onSkip={handleSkipOnboarding} isAuthenticated={isSignedIn || false} />
      );
      case 'profile': {
        const strength = userProfile.name && userProfile.age && userProfile.education && userProfile.profession ? 85 : 45;
        return <ProfilePreviewScreen locale={locale} profile={userProfile} profileStrength={strength}
          onSaveProfile={handleOnProfileSave} triggerToast={triggerToast} />;
      }
      case 'privacy': return (
        <PrivacySettingsScreen locale={locale} profile={userProfile} onUpdatePrivacy={handleUpdateUserProfile} triggerToast={triggerToast} />
      );
      case 'trust_safety': return (
        <TrustPrivacyScreen locale={locale} onBackToOverview={handleBackToOverview} />
      );
      default: return (
        <LandingScreen locale={locale} onSelectGender={handleSelectGender} onExploreMatches={handleExploreMatches}
          setTab={handleSetTab} isAuthenticated={isSignedIn || false} userProfileName={userProfile.name}
          userProfile={userProfile} onExploreWithoutOnboarding={handleExploreWithoutOnboarding}
          onOpenAuth={openAuth} onSignOut={() => {}} />
      );
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-coral border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {renderScreen()}
      {showAuth && <AuthScreen locale={locale} initialMode={authMode} onClose={closeAuth} onSuccess={handleAuthSuccess} />}
    </div>
  );
}
