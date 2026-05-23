import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Page, SectionTitle, Card } from './ui';
import { storage } from '../utils/storage';

const PeriodTabs = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
`;

const PTab = styled.button`
  flex: 1;
  padding: 9px 4px;
  border-radius: var(--rad-sm);
  border: 1.5px solid ${p => p.$active ? 'var(--blue-600)' : 'var(--blue-100)'};
  background: ${p => p.$active ? 'var(--blue-600)' : '#fff'};
  color: ${p => p.$active ? '#fff' : 'var(--blue-600)'};
  font-size: 13px;
  font-weight: 700;
  transition: all 0.15s;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
`;

const StatCard = styled.div`
  background: var(--blue-50);
  border-radius: var(--rad-sm);
  padding: 14px 12px;
  text-align: center;
  border: 1px solid var(--blue-100);
`;

const StatNum = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${p => p.$color || 'var(--blue-600)'};
`;

const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: var(--gray-600);
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const BarLabel = styled.div`font-size: 12px; color: var(--gray-600); width: 32px; flex-shrink: 0;`;

const BarTrack = styled.div`
  flex: 1;
  background: var(--blue-50);
  border-radius: 4px;
  height: 16px;
  overflow: hidden;
  border: 1px solid var(--blue-100);
`;

const BarFill = styled.div`
  height: 100%;
  border-radius: 4px;
  width: ${p => p.$pct}%;
  background: ${p => p.$pct === 100 ? 'var(--green-400)' : p.$pct > 0 ? 'var(--blue-400)' : 'transparent'};
  transition: width 0.4s ease;
`;

const BarPct = styled.div`font-size: 11px; color: var(--gray-600); width: 30px; text-align: right;`;

const LogEntry = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--blue-50);
  &:last-child { border-bottom: none; }
`;

const LogDot = styled.div`
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
  background: ${p => p.$color};
`;

const LogBadge = styled.span`
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 10px;
  background: ${p => p.$type === 'taken' ? 'var(--green-50)' : p.$type === 'video' ? 'var(--blue-50)' : 'var(--red-50)'};
  color: ${p => p.$type === 'taken' ? 'var(--green-800)' : p.$type === 'video' ? 'var(--blue-800)' : 'var(--red-600)'};
  font-weight: 700;
`;

function getDayAdherence(meds, dateStr) {
  const doses = storage.getDateDoses(dateStr);
  const total = meds.filter(m => m.active).length * 2; // morning + evening
  const taken = Object.values(doses).filter(v => v.taken).length;
  if (total === 0) return 0;
  return Math.round((taken / total) * 100);
}

function getLast7Days(meds) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
    days.push({ label, dateStr, pct: getDayAdherence(meds, dateStr) });
  }
  return days;
}

export default function SummaryTab({ meds, streak, feelings }) {
  const [period, setPeriod] = useState('week');

  const activeMeds = meds.filter(m => m.active);
  const totalPerDay = activeMeds.length * 2;

  const stats = useMemo(() => {
    const days = period === 'day' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365;
    let taken = 0, total = 0, videoCount = 0;
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const doses = storage.getDateDoses(dateStr);
      total += totalPerDay;
      taken += Object.values(doses).filter(v => v.taken).length;
      videoCount += Object.values(doses).filter(v => v.hasVideo).length;
    }
    const pct = total > 0 ? Math.round((taken / total) * 100) : 0;
    const missed = total - taken;
    return { taken, total, missed, pct, videoCount };
  }, [period, totalPerDay]);

  const weekDays = useMemo(() => getLast7Days(meds), [meds]);

  const recentLogs = useMemo(() => {
    const logs = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const doses = storage.getDateDoses(dateStr);
      Object.entries(doses).forEach(([key, val]) => {
        const [medId, session] = key.split('_');
        const med = meds.find(m => m.id === parseInt(medId));
        if (!med) return;
        logs.push({
          id: key + dateStr,
          name: `${med.name} — ${session.charAt(0).toUpperCase() + session.slice(1)}`,
          sub: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : `${i} days ago`,
          taken: val.taken,
          hasVideo: val.hasVideo,
        });
      });
    }
    return logs.slice(0, 12);
  }, [meds]);

  return (
    <Page>
      <PeriodTabs>
        {['day', 'week', 'month', 'year'].map(p => (
          <PTab key={p} $active={period === p} onClick={() => setPeriod(p)}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </PTab>
        ))}
      </PeriodTabs>

      <StatGrid>
        <StatCard>
          <StatNum $color={stats.pct >= 80 ? 'var(--green-600)' : stats.pct >= 50 ? 'var(--amber-400)' : 'var(--red-400)'}>
            {stats.pct}%
          </StatNum>
          <StatLabel>Adherence</StatLabel>
        </StatCard>
        <StatCard>
          <StatNum $color="var(--green-600)">{streak}</StatNum>
          <StatLabel>Day Streak 🔥</StatLabel>
        </StatCard>
        <StatCard>
          <StatNum>{stats.taken}</StatNum>
          <StatLabel>Doses Taken</StatLabel>
        </StatCard>
        <StatCard>
          <StatNum $color={stats.missed > 0 ? 'var(--red-400)' : 'var(--green-600)'}>{stats.missed}</StatNum>
          <StatLabel>Doses Missed</StatLabel>
        </StatCard>
      </StatGrid>

      {period === 'week' && (
        <>
          <SectionTitle>Last 7 Days</SectionTitle>
          <Card>
            {weekDays.map(d => (
              <BarRow key={d.dateStr}>
                <BarLabel>{d.label}</BarLabel>
                <BarTrack>
                  <BarFill $pct={d.pct} />
                </BarTrack>
                <BarPct>{d.pct}%</BarPct>
              </BarRow>
            ))}
          </Card>
        </>
      )}

      <SectionTitle>Recent Activity</SectionTitle>
      <Card>
        {recentLogs.length === 0 && (
          <div style={{ color: 'var(--gray-200)', fontSize: 14, textAlign: 'center', padding: '10px 0' }}>
            No activity yet. Start tracking today!
          </div>
        )}
        {recentLogs.map(log => (
          <LogEntry key={log.id}>
            <LogDot $color={log.taken ? 'var(--green-600)' : 'var(--red-400)'} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue-900)' }}>{log.name}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-600)' }}>{log.sub}</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <LogBadge $type={log.taken ? 'taken' : 'missed'}>{log.taken ? 'taken' : 'missed'}</LogBadge>
              {log.hasVideo && <LogBadge $type="video"><i className="ti ti-video" style={{ fontSize: 10 }} /></LogBadge>}
            </div>
          </LogEntry>
        ))}
      </Card>

      {feelings.length > 0 && (
        <>
          <SectionTitle>Recent Feelings</SectionTitle>
          <Card>
            {feelings.slice(0, 5).map(f => (
              <LogEntry key={f.id || f.date}>
                <LogDot $color="var(--blue-400)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue-900)' }}>
                    {(f.chips || f.feelings || []).slice(0, 2).join(', ')}
                    {(f.chips || f.feelings || []).length > 2 ? '...' : ''}
                  </div>
                  {f.note && <div style={{ fontSize: 11, color: 'var(--gray-600)' }}>{f.note.slice(0, 60)}</div>}
                </div>
              </LogEntry>
            ))}
          </Card>
        </>
      )}
    </Page>
  );
}
