/* storage.js — persists all app data to localStorage */

const KEYS = {
  MEDS: 'gm_meds',
  MED_HISTORY: 'gm_med_history',
  LOGS: 'gm_logs',
  FEELINGS: 'gm_feelings',
  SETTINGS: 'gm_settings',
  FAMILY: 'gm_family',
};

function get(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}

function set(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

/* Default seed data */
const DEFAULT_MEDS = [
  { id: 1, name: 'Lisinopril', dose: '10mg', session: 'morning', active: true },
  { id: 2, name: 'Metformin', dose: '500mg', session: 'morning', active: true },
  { id: 3, name: 'Atorvastatin', dose: '20mg', session: 'evening', active: true },
];

const DEFAULT_SETTINGS = {
  morningTime: '08:00',
  eveningTime: '19:00',
  userName: 'Dorothy',
  notificationsEnabled: false,
};

const DEFAULT_FAMILY = [
  { id: 1, name: 'Sarah', relation: 'Daughter', contact: '' },
  { id: 2, name: 'Mike', relation: 'Son', contact: '' },
];

export const storage = {
  getMeds: () => get(KEYS.MEDS, DEFAULT_MEDS),
  setMeds: (v) => set(KEYS.MEDS, v),

  getMedHistory: () => get(KEYS.MED_HISTORY, []),
  addMedHistory: (entry) => {
    const hist = get(KEYS.MED_HISTORY, []);
    hist.unshift({ ...entry, id: Date.now(), timestamp: new Date().toISOString() });
    set(KEYS.MED_HISTORY, hist.slice(0, 200));
  },

  getLogs: () => get(KEYS.LOGS, []),
  addLog: (entry) => {
    const logs = get(KEYS.LOGS, []);
    logs.unshift({ ...entry, id: Date.now(), timestamp: new Date().toISOString() });
    set(KEYS.LOGS, logs.slice(0, 1000));
  },

  getFeelings: () => get(KEYS.FEELINGS, [
    {
      id: 1, date: new Date(Date.now() - 86400000).toISOString(),
      chips: ['😊 Felt great', '💪 Energized'], note: 'Best day in a while!'
    }
  ]),
  addFeeling: (entry) => {
    const feelings = get(KEYS.FEELINGS, []);
    feelings.unshift({ ...entry, id: Date.now(), timestamp: new Date().toISOString() });
    set(KEYS.FEELINGS, feelings.slice(0, 365));
  },

  getSettings: () => get(KEYS.SETTINGS, DEFAULT_SETTINGS),
  setSettings: (v) => set(KEYS.SETTINGS, { ...get(KEYS.SETTINGS, DEFAULT_SETTINGS), ...v }),

  getFamily: () => get(KEYS.FAMILY, DEFAULT_FAMILY),
  setFamily: (v) => set(KEYS.FAMILY, v),

  /* Daily dose tracking */
  getTodayKey: () => new Date().toISOString().slice(0, 10),
  getTodayDoses: () => {
    const key = `gm_doses_${new Date().toISOString().slice(0, 10)}`;
    return get(key, {});
  },
  markDose: (medId, session, hasVideo = false) => {
    const key = `gm_doses_${new Date().toISOString().slice(0, 10)}`;
    const doses = get(key, {});
    doses[`${medId}_${session}`] = { taken: true, hasVideo, time: new Date().toISOString() };
    set(key, doses);
  },
  unmarkDose: (medId, session) => {
    const key = `gm_doses_${new Date().toISOString().slice(0, 10)}`;
    const doses = get(key, {});
    delete doses[`${medId}_${session}`];
    set(key, doses);
  },
  getDateDoses: (dateStr) => {
    return get(`gm_doses_${dateStr}`, {});
  },

  /* Streak calculation */
  getStreak: () => {
    let streak = 0;
    const meds = get(KEYS.MEDS, DEFAULT_MEDS);
    if (!meds.length) return 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const doses = get(`gm_doses_${dateStr}`, {});
      const takenCount = Object.values(doses).filter(v => v.taken).length;
      if (i === 0 && takenCount === 0) continue; // today not yet complete
      if (takenCount > 0) streak++;
      else if (i > 0) break;
    }
    return streak;
  },
};
