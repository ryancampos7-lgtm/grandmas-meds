import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Page, SectionTitle, Card, PrimaryBtn, SecondaryBtn, BtnRow,
  Modal, ModalTitle, Input, Label, PillSelect
} from './ui';
import { requestNotificationPermission } from '../utils/notifications';

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--blue-50);
  &:last-child { border-bottom: none; }
`;

const RowLabel = styled.div`font-size: 15px; color: var(--blue-900); font-weight: 500;`;
const RowSub = styled.div`font-size: 12px; color: var(--gray-600); margin-top: 1px;`;
const RowVal = styled.div`font-size: 14px; color: var(--blue-600); font-weight: 600;`;

const EditBtn = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid var(--blue-200);
  background: var(--blue-50);
  color: var(--blue-800);
  font-size: 13px;
  font-weight: 600;
`;

const DangerBtn = styled(EditBtn)`
  border-color: var(--red-400);
  background: var(--red-50);
  color: var(--red-600);
`;

const NotifyChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 20px;
  background: var(--blue-600);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  margin: 4px 6px 4px 0;
`;

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border-radius: var(--rad-sm);
  border: 1.5px dashed var(--blue-200);
  background: transparent;
  color: var(--blue-600);
  font-size: 14px;
  font-weight: 600;
  justify-content: center;
`;

const HistoryEntry = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid var(--blue-50);
  &:last-child { border-bottom: none; }
`;

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function SettingsTab({ meds, updateMeds, addMedHistoryEntry, medHistory, settings, updateSettings, family, updateFamily }) {
  const [modal, setModal] = useState(null); // 'time-morning' | 'time-evening' | 'edit-med' | 'add-med' | 'add-family'
  const [editMed, setEditMed] = useState(null);
  const [formData, setFormData] = useState({});

  function openEditMed(med) {
    setEditMed(med);
    setFormData({ name: med.name, dose: med.dose, session: med.session });
    setModal('edit-med');
  }

  function openAddMed() {
    setFormData({ name: '', dose: '', session: 'morning' });
    setModal('add-med');
  }

  function saveEditMed() {
    const changes = [];
    if (formData.name !== editMed.name) changes.push(`Name: ${editMed.name} → ${formData.name}`);
    if (formData.dose !== editMed.dose) changes.push(`Dose: ${editMed.dose} → ${formData.dose}`);
    if (formData.session !== editMed.session) changes.push(`Session: ${editMed.session} → ${formData.session}`);
    if (changes.length) {
      addMedHistoryEntry({
        change: `${formData.name}: ${changes.join(', ')}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    }
    updateMeds(meds.map(m => m.id === editMed.id ? { ...m, ...formData } : m));
    setModal(null);
  }

  function saveAddMed() {
    if (!formData.name.trim() || !formData.dose.trim()) return;
    const newMed = { id: Date.now(), name: formData.name.trim(), dose: formData.dose.trim(), session: formData.session, active: true };
    addMedHistoryEntry({
      change: `${newMed.name} added: ${newMed.dose} (${newMed.session})`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    updateMeds([...meds, newMed]);
    setModal(null);
  }

  function removeMed(med) {
    if (!window.confirm(`Remove ${med.name} from the list?`)) return;
    addMedHistoryEntry({
      change: `${med.name} removed`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    updateMeds(meds.map(m => m.id === med.id ? { ...m, active: false } : m));
  }

  async function enableNotifications() {
    const granted = await requestNotificationPermission();
    if (granted) {
      updateSettings({ notificationsEnabled: true });
      alert('Notifications enabled! You will get reminders for your medications 💙');
    } else {
      alert('Notifications were not allowed. Please enable them in your browser/phone settings.');
    }
  }

  function saveTime(which) {
    updateSettings({ [which === 'morning' ? 'morningTime' : 'eveningTime']: formData.time });
    setModal(null);
  }

  function addFamily() {
    if (!formData.famName?.trim()) return;
    updateFamily([...family, { id: Date.now(), name: formData.famName.trim(), relation: formData.famRelation || '', contact: formData.famContact || '' }]);
    setModal(null);
  }

  function removeFamily(id) {
    updateFamily(family.filter(f => f.id !== id));
  }

  return (
    <Page>
      {/* Reminder Times */}
      <SectionTitle>Reminder Times</SectionTitle>
      <Card>
        <Row>
          <div>
            <RowLabel><i className="ti ti-sun" style={{ marginRight: 6, color: 'var(--amber-400)' }} />Morning</RowLabel>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <RowVal>{formatTime(settings.morningTime)}</RowVal>
            <EditBtn onClick={() => { setFormData({ time: settings.morningTime }); setModal('time-morning'); }}>Edit</EditBtn>
          </div>
        </Row>
        <Row>
          <div>
            <RowLabel><i className="ti ti-moon" style={{ marginRight: 6, color: 'var(--blue-400)' }} />Evening</RowLabel>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <RowVal>{formatTime(settings.eveningTime)}</RowVal>
            <EditBtn onClick={() => { setFormData({ time: settings.eveningTime }); setModal('time-evening'); }}>Edit</EditBtn>
          </div>
        </Row>
        <Row style={{ borderBottom: 'none' }}>
          <div>
            <RowLabel>Push Notifications</RowLabel>
            <RowSub>{settings.notificationsEnabled ? '✅ Enabled' : 'Not yet enabled'}</RowSub>
          </div>
          {!settings.notificationsEnabled && (
            <EditBtn onClick={enableNotifications}>Enable</EditBtn>
          )}
        </Row>
      </Card>

      {/* Medications */}
      <SectionTitle>Medications</SectionTitle>
      <Card>
        {meds.filter(m => m.active).length === 0 && (
          <div style={{ color: 'var(--gray-200)', textAlign: 'center', padding: '8px 0' }}>No medications added yet.</div>
        )}
        {meds.filter(m => m.active).map(med => (
          <Row key={med.id}>
            <div>
              <RowLabel>{med.name}</RowLabel>
              <RowSub>{med.dose} — {med.session.charAt(0).toUpperCase() + med.session.slice(1)}</RowSub>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <EditBtn onClick={() => openEditMed(med)}>Edit</EditBtn>
              <DangerBtn onClick={() => removeMed(med)}>Remove</DangerBtn>
            </div>
          </Row>
        ))}
      </Card>
      <AddBtn onClick={openAddMed}>
        <i className="ti ti-plus" />
        Add Medication
      </AddBtn>

      {/* Change History */}
      <SectionTitle>Change History</SectionTitle>
      <Card>
        {medHistory.length === 0 && (
          <div style={{ color: 'var(--gray-200)', fontSize: 13 }}>No changes recorded yet.</div>
        )}
        {medHistory.slice(0, 20).map(h => (
          <HistoryEntry key={h.id}>
            <div style={{ fontSize: 11, color: 'var(--blue-600)', fontWeight: 700 }}>{h.date}</div>
            <div style={{ fontSize: 13, color: 'var(--blue-900)', marginTop: 2 }}>{h.change}</div>
          </HistoryEntry>
        ))}
      </Card>

      {/* Family Notifications */}
      <SectionTitle>Family Notifications</SectionTitle>
      <Card>
        <RowSub style={{ marginBottom: 8 }}>These people will be notified when a dose is logged:</RowSub>
        <div>
          {family.map(f => (
            <NotifyChip key={f.id}>
              <i className="ti ti-bell" style={{ fontSize: 13 }} />
              {f.name}{f.relation ? ` (${f.relation})` : ''}
              <button
                onClick={() => removeFamily(f.id)}
                style={{ background: 'transparent', border: 'none', color: '#fff', marginLeft: 2, cursor: 'pointer', padding: 0 }}
                aria-label={`Remove ${f.name}`}
              >
                <i className="ti ti-x" style={{ fontSize: 12 }} />
              </button>
            </NotifyChip>
          ))}
        </div>
        <AddBtn onClick={() => { setFormData({}); setModal('add-family'); }}>
          <i className="ti ti-plus" />
          Add Family Member
        </AddBtn>
      </Card>

      {/* Profile */}
      <SectionTitle>Profile</SectionTitle>
      <Card>
        <Row>
          <RowLabel>Name</RowLabel>
          <RowVal>{settings.userName || 'Dorothy'}</RowVal>
        </Row>
        <Row style={{ borderBottom: 'none' }}>
          <div>
            <RowLabel>App Version</RowLabel>
            <RowSub>Grandma's Meds v1.0</RowSub>
          </div>
        </Row>
      </Card>

      <div style={{ height: 20 }} />

      {/* MODALS */}
      {(modal === 'time-morning' || modal === 'time-evening') && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Set {modal === 'time-morning' ? 'Morning' : 'Evening'} Time</ModalTitle>
          <Label>Reminder time</Label>
          <Input
            type="time"
            value={formData.time || ''}
            onChange={e => setFormData(f => ({ ...f, time: e.target.value }))}
          />
          <BtnRow>
            <SecondaryBtn onClick={() => setModal(null)}>Cancel</SecondaryBtn>
            <PrimaryBtn style={{ flex: 1 }} onClick={() => saveTime(modal === 'time-morning' ? 'morning' : 'evening')}>
              Save Time
            </PrimaryBtn>
          </BtnRow>
        </Modal>
      )}

      {modal === 'edit-med' && editMed && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Edit {editMed.name}</ModalTitle>
          <Label>Medication name</Label>
          <Input value={formData.name || ''} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
          <Label>Dose / amount</Label>
          <Input value={formData.dose || ''} onChange={e => setFormData(f => ({ ...f, dose: e.target.value }))} placeholder="e.g. 10mg" />
          <Label>Session</Label>
          <PillSelect options={['morning', 'evening']} value={formData.session} onChange={v => setFormData(f => ({ ...f, session: v }))} />
          <BtnRow>
            <SecondaryBtn onClick={() => setModal(null)}>Cancel</SecondaryBtn>
            <PrimaryBtn style={{ flex: 1 }} onClick={saveEditMed}>Save Changes</PrimaryBtn>
          </BtnRow>
        </Modal>
      )}

      {modal === 'add-med' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Add Medication 💊</ModalTitle>
          <Label>Medication name</Label>
          <Input value={formData.name || ''} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Aspirin" />
          <Label>Dose / amount</Label>
          <Input value={formData.dose || ''} onChange={e => setFormData(f => ({ ...f, dose: e.target.value }))} placeholder="e.g. 81mg" />
          <Label>Session</Label>
          <PillSelect options={['morning', 'evening']} value={formData.session || 'morning'} onChange={v => setFormData(f => ({ ...f, session: v }))} />
          <BtnRow>
            <SecondaryBtn onClick={() => setModal(null)}>Cancel</SecondaryBtn>
            <PrimaryBtn style={{ flex: 1 }} onClick={saveAddMed}>Add Medication</PrimaryBtn>
          </BtnRow>
        </Modal>
      )}

      {modal === 'add-family' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Add Family Member 👨‍👩‍👧</ModalTitle>
          <Label>Name</Label>
          <Input value={formData.famName || ''} onChange={e => setFormData(f => ({ ...f, famName: e.target.value }))} placeholder="e.g. Sarah" />
          <Label>Relation (optional)</Label>
          <Input value={formData.famRelation || ''} onChange={e => setFormData(f => ({ ...f, famRelation: e.target.value }))} placeholder="e.g. Daughter, Granddaughter" />
          <Label>Phone or email (optional)</Label>
          <Input value={formData.famContact || ''} onChange={e => setFormData(f => ({ ...f, famContact: e.target.value }))} placeholder="For notifications (future)" />
          <BtnRow>
            <SecondaryBtn onClick={() => setModal(null)}>Cancel</SecondaryBtn>
            <PrimaryBtn style={{ flex: 1 }} onClick={addFamily}>Add Member</PrimaryBtn>
          </BtnRow>
        </Modal>
      )}
    </Page>
  );
}
