import React, { useState } from 'react';
import styled from 'styled-components';
import { Page, SectionTitle, Card, PrimaryBtn, TextArea, Label, Modal, ModalTitle } from './ui';

const FEELING_OPTIONS = [
  { label: '😊 Felt great',         cat: 'great' },
  { label: '😀 Good energy',         cat: 'great' },
  { label: '💪 Energized',           cat: 'great' },
  { label: '🙂 Okay, normal day',    cat: 'ok'    },
  { label: '😴 A little tired',      cat: 'ok'    },
  { label: '😌 Calm & relaxed',      cat: 'ok'    },
  { label: '🤕 Mild headache',        cat: 'bad'   },
  { label: '💫 Dizziness',            cat: 'bad'   },
  { label: '🥵 Overheating',         cat: 'bad'   },
  { label: '😵 Disorientation',      cat: 'bad'   },
  { label: '🤢 Nausea',              cat: 'bad'   },
  { label: '😰 Anxiety',             cat: 'bad'   },
  { label: '🌀 Brain fog',           cat: 'bad'   },
  { label: '😣 Body aches',          cat: 'severe'},
  { label: '😖 Strong dizziness',    cat: 'severe'},
  { label: '🫀 Heart palpitations',  cat: 'severe'},
  { label: '🌡️ Fever / chills',      cat: 'severe'},
  { label: '👁️ Vision changes',      cat: 'severe'},
];

const CAT_COLORS = {
  great:  { bg: 'var(--green-50)',  border: 'var(--green-400)',  text: 'var(--green-800)' },
  ok:     { bg: 'var(--blue-50)',   border: 'var(--blue-400)',   text: 'var(--blue-800)'  },
  bad:    { bg: 'var(--amber-50)',  border: 'var(--amber-400)',  text: 'var(--amber-600)' },
  severe: { bg: 'var(--red-50)',    border: 'var(--red-400)',    text: 'var(--red-600)'   },
};

const ChipGrid = styled.div`display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;`;

const Chip = styled.button`
  padding: 7px 13px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: ${p => p.$sel ? '700' : '500'};
  border: 1.5px solid ${p => p.$sel ? CAT_COLORS[p.$cat].border : 'var(--blue-100)'};
  background: ${p => p.$sel ? CAT_COLORS[p.$cat].bg : '#fff'};
  color: ${p => p.$sel ? CAT_COLORS[p.$cat].text : 'var(--gray-600)'};
  transition: all 0.15s;
  &:active { transform: scale(0.95); }
`;

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gray-600);
  margin: 10px 0 6px;
`;

const FeelingEntry = styled(Card)`
  margin-bottom: 10px;
`;

const EntryDate = styled.div`font-size: 12px; color: var(--blue-600); font-weight: 700; margin-bottom: 6px;`;
const EntryNote = styled.div`font-size: 13px; color: var(--gray-600); margin-top: 6px;`;

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function FeelingTab({ feelings, addFeeling }) {
  const [selected, setSelected] = useState([]);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  function toggleChip(label) {
    setSelected(s => s.includes(label) ? s.filter(x => x !== label) : [...s, label]);
  }

  function save() {
    if (!selected.length && !note.trim()) return;
    addFeeling({ date: new Date().toISOString(), chips: [...selected], note: note.trim() });
    setSelected([]);
    setNote('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const catGroups = ['great', 'ok', 'bad', 'severe'];
  const catLabels = { great: '😊 Feeling good', ok: '🙂 So-so', bad: '😔 Not great', severe: '⚠️ Concerning' };

  return (
    <Page>
      <Card>
        <SectionLabel style={{ marginTop: 0 }}>How are you feeling today?</SectionLabel>
        {catGroups.map(cat => (
          <div key={cat}>
            <SectionLabel>{catLabels[cat]}</SectionLabel>
            <ChipGrid>
              {FEELING_OPTIONS.filter(o => o.cat === cat).map(opt => (
                <Chip
                  key={opt.label}
                  $sel={selected.includes(opt.label)}
                  $cat={opt.cat}
                  onClick={() => toggleChip(opt.label)}
                >
                  {opt.label}
                </Chip>
              ))}
            </ChipGrid>
          </div>
        ))}

        <Label>Notes (optional)</Label>
        <TextArea
          rows={3}
          placeholder="e.g. 'Felt dizzy after breakfast, better by noon...'"
          value={note}
          onChange={e => setNote(e.target.value)}
        />

        {saved ? (
          <div style={{
            background: 'var(--green-50)', border: '1px solid var(--green-400)',
            borderRadius: 'var(--rad-sm)', padding: 12, textAlign: 'center',
            color: 'var(--green-800)', fontWeight: 700, fontSize: 14
          }}>
            ✅ Saved! Thank you for sharing, this helps track your health 💙
          </div>
        ) : (
          <PrimaryBtn onClick={save} disabled={!selected.length && !note.trim()}>
            Save Today's Feeling 💙
          </PrimaryBtn>
        )}
      </Card>

      <SectionTitle>Feeling History</SectionTitle>
      {feelings.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--gray-200)', padding: '20px 0', fontSize: 14 }}>
          No entries yet. How are you feeling today?
        </div>
      )}
      {feelings.map(entry => (
        <FeelingEntry key={entry.id || entry.date}>
          <EntryDate>{formatDate(entry.date || entry.timestamp)}</EntryDate>
          <ChipGrid style={{ marginBottom: entry.note ? 4 : 0 }}>
            {(entry.chips || entry.feelings || []).map(chip => {
              const opt = FEELING_OPTIONS.find(o => o.label === chip);
              const cat = opt ? opt.cat : 'ok';
              return (
                <Chip key={chip} $sel $cat={cat} style={{ cursor: 'default' }}>{chip}</Chip>
              );
            })}
          </ChipGrid>
          {entry.note && <EntryNote>{entry.note}</EntryNote>}
        </FeelingEntry>
      ))}
    </Page>
  );
}
