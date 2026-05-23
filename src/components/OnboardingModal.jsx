import React, { useState } from 'react';
import styled from 'styled-components';
import { PrimaryBtn, Input, Label } from './ui';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: var(--blue-900);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 24px;
  padding: 32px 24px;
  width: 100%;
  max-width: 380px;
  text-align: center;
`;

const BigEmoji = styled.div`font-size: 56px; margin-bottom: 12px;`;
const Title = styled.h1`font-size: 24px; font-weight: 700; color: var(--blue-900); margin-bottom: 8px;`;
const Sub = styled.p`font-size: 15px; color: var(--gray-600); line-height: 1.5; margin-bottom: 24px;`;

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  padding: 12px;
  background: var(--blue-50);
  border-radius: var(--rad-sm);
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--blue-900);
  font-weight: 500;
`;

export default function OnboardingModal({ onDone }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('Dorothy');
  const [enableNotifications, setEnableNotifications] = useState(true);

  if (step === 0) return (
    <Overlay>
      <Card>
        <BigEmoji>💙</BigEmoji>
        <Title>Welcome to Grandma's Meds!</Title>
        <Sub>A loving way to stay on top of your medications — with reminders, video logs, and family updates.</Sub>
        <PrimaryBtn onClick={() => setStep(1)}>Get Started 🌟</PrimaryBtn>
      </Card>
    </Overlay>
  );

  if (step === 1) return (
    <Overlay>
      <Card>
        <BigEmoji>🌸</BigEmoji>
        <Title>What's your name?</Title>
        <Sub>We'll use this to personalize your experience.</Sub>
        <div style={{ textAlign: 'left', marginBottom: 16 }}>
          <Label>Your name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dorothy" />
        </div>
        <PrimaryBtn onClick={() => setStep(2)}>Next →</PrimaryBtn>
      </Card>
    </Overlay>
  );

  if (step === 2) return (
    <Overlay>
      <Card>
        <BigEmoji>🔔</BigEmoji>
        <Title>Stay Reminded</Title>
        <Sub>Would you like reminders when it's time to take your medications?</Sub>
        <CheckRow>
          <input
            type="checkbox"
            checked={enableNotifications}
            onChange={e => setEnableNotifications(e.target.checked)}
            style={{ width: 20, height: 20, accentColor: 'var(--blue-600)' }}
          />
          Yes, remind me for morning & evening doses
        </CheckRow>
        <div style={{ fontSize: 12, color: 'var(--gray-600)', marginBottom: 20, textAlign: 'left' }}>
          You can change reminder times anytime in Settings.
        </div>
        <PrimaryBtn onClick={() => onDone({ name, enableNotifications })}>
          Let's Go! 💙
        </PrimaryBtn>
      </Card>
    </Overlay>
  );

  return null;
}
