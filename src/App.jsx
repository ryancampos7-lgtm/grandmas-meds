import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import TodayTab from './components/TodayTab';
import FeelingTab from './components/FeelingTab';
import SummaryTab from './components/SummaryTab';
import SettingsTab from './components/SettingsTab';
import OnboardingModal from './components/OnboardingModal';
import { storage } from './utils/storage';
import { scheduleDaily, requestNotificationPermission } from './utils/notifications';

const Shell = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #f0f6ff;
  max-width: 480px;
  margin: 0 auto;
  box-shadow: 0 0 40px rgba(4, 44, 83, 0.3);
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px));
`;


export default function App() {
  const [tab, setTab] = useState('today');
  const [meds, setMeds] = useState(() => storage.getMeds());
  const [todayDoses, setTodayDoses] = useState(() => storage.getTodayDoses());
  const [settings, setSettingsState] = useState(() => storage.getSettings());
  const [family, setFamilyState] = useState(() => storage.getFamily());
  const [medHistory, setMedHistory] = useState(() => storage.getMedHistory());
  const [feelings, setFeelings] = useState(() => storage.getFeelings());
  const [streak, setStreak] = useState(() => storage.getStreak());
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const s = storage.getSettings();
    if (!s.onboardingDone) setShowOnboarding(true);
    scheduleDailyReminders(s);
  }, []);

  function scheduleDailyReminders(s) {
    if (s.notificationsEnabled && s.morningTime) scheduleDaily(s.morningTime, 'morning');
    if (s.notificationsEnabled && s.eveningTime) scheduleDaily(s.eveningTime, 'evening');
  }

  function updateSettings(updates) {
    storage.setSettings(updates);
    const s = storage.getSettings();
    setSettingsState(s);
    scheduleDailyReminders(s);
  }

  function updateMeds(newMeds) {
    storage.setMeds(newMeds);
    setMeds(newMeds);
  }

  function addMedHistoryEntry(entry) {
    storage.addMedHistory(entry);
    setMedHistory(storage.getMedHistory());
  }

  function markDose(medId, session, hasVideo = false) {
    storage.markDose(medId, session, hasVideo);
    const updated = storage.getTodayDoses();
    setTodayDoses(updated);
    setStreak(storage.getStreak());
    // Log
    const med = meds.find(m => m.id === medId);
    if (med) {
      storage.addLog({
        medId, medName: med.name, dose: med.dose,
        session, action: 'taken', hasVideo
      });
    }
  }

  function unmarkDose(medId, session) {
    storage.unmarkDose(medId, session);
    setTodayDoses(storage.getTodayDoses());
  }

  function addFeeling(entry) {
    storage.addFeeling(entry);
    setFeelings(storage.getFeelings());
  }

  function updateFamily(newFamily) {
    storage.setFamily(newFamily);
    setFamilyState(newFamily);
  }

  function handleOnboardingDone(data) {
    if (data.name) updateSettings({ userName: data.name, onboardingDone: true });
    else updateSettings({ onboardingDone: true });
    if (data.enableNotifications) {
      requestNotificationPermission().then(granted => {
        if (granted) {
          updateSettings({ notificationsEnabled: true });
        }
      });
    }
    setShowOnboarding(false);
    setRefreshKey(k => k + 1);
  }

  const sharedProps = {
    meds, updateMeds, addMedHistoryEntry,
    todayDoses, markDose, unmarkDose,
    settings, updateSettings,
    family, updateFamily,
    medHistory, setMedHistory,
    feelings, addFeeling,
    streak, setTab,
    refreshKey,
  };

  return (
    <Shell>
      <TopBar tab={tab} streak={streak} userName={settings.userName} />
      <ContentArea key={tab}>
        {tab === 'today'    && <TodayTab    {...sharedProps} />}
        {tab === 'feeling'  && <FeelingTab  {...sharedProps} />}
        {tab === 'summary'  && <SummaryTab  {...sharedProps} />}
        {tab === 'settings' && <SettingsTab {...sharedProps} />}
      </ContentArea>
      <BottomNav tab={tab} setTab={setTab} />
      {showOnboarding && <OnboardingModal onDone={handleOnboardingDone} />}
    </Shell>
  );
}
