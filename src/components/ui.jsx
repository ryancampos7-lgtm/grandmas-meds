import React, { useEffect } from 'react';
import styled from 'styled-components';

export const Page = styled.div`
  padding: 16px 16px 0;
`;

export const SectionTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: var(--blue-600);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 20px 0 10px;
`;

export const Card = styled.div`
  background: #fff;
  border-radius: var(--rad);
  border: 1px solid var(--blue-100);
  padding: 14px 16px;
  margin-bottom: 10px;
`;

export const PrimaryBtn = styled.button`
  width: 100%;
  padding: 13px;
  background: var(--blue-600);
  color: #fff;
  border: none;
  border-radius: var(--rad-sm);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: background 0.15s, transform 0.1s;
  &:hover { background: var(--blue-800); }
  &:active { transform: scale(0.98); }
`;

export const SecondaryBtn = styled.button`
  flex: 1;
  padding: 12px;
  background: var(--blue-50);
  color: var(--blue-800);
  border: 1px solid var(--blue-200);
  border-radius: var(--rad-sm);
  font-size: 14px;
  font-weight: 600;
  transition: background 0.15s;
  &:hover { background: var(--blue-100); }
`;

export const BtnRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

/* ===== MODAL ===== */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(4, 44, 83, 0.55);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 500;
  animation: fadeIn 0.15s ease;
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
`;

const Sheet = styled.div`
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 0 20px 20px;
  width: 100%;
  max-width: 480px;
  max-height: 88vh;
  overflow-y: auto;
  animation: slideUp 0.2s ease;
  @keyframes slideUp { from { transform: translateY(60px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
`;

const Handle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: var(--blue-100);
  margin: 12px auto 16px;
`;

export const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--blue-900);
  margin-bottom: 16px;
`;

export function Modal({ onClose, children }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <Overlay onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Sheet>
        <Handle />
        {children}
      </Sheet>
    </Overlay>
  );
}

export const Input = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--blue-100);
  border-radius: var(--rad-sm);
  font-size: 15px;
  color: var(--blue-900);
  background: var(--blue-50);
  margin-bottom: 10px;
  outline: none;
  &:focus { border-color: var(--blue-400); background: #fff; }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--blue-100);
  border-radius: var(--rad-sm);
  font-size: 14px;
  color: var(--blue-900);
  background: var(--blue-50);
  resize: none;
  outline: none;
  line-height: 1.5;
  &:focus { border-color: var(--blue-400); background: #fff; }
`;

export const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--blue-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 5px;
`;

const PillWrap = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const PillOpt = styled.button`
  padding: 8px 18px;
  border-radius: 20px;
  border: 1.5px solid ${p => p.$active ? 'var(--blue-600)' : 'var(--blue-200)'};
  background: ${p => p.$active ? 'var(--blue-600)' : 'var(--blue-50)'};
  color: ${p => p.$active ? '#fff' : 'var(--blue-800)'};
  font-size: 14px;
  font-weight: 600;
  transition: all 0.15s;
`;

export function PillSelect({ options, value, onChange }) {
  return (
    <PillWrap>
      {options.map(opt => (
        <PillOpt key={opt} $active={value === opt} onClick={() => onChange(opt)}>
          {opt}
        </PillOpt>
      ))}
    </PillWrap>
  );
}

export const EncouragementBanner = styled.div`
  background: linear-gradient(135deg, var(--blue-600), var(--blue-800));
  border-radius: var(--rad);
  padding: 18px;
  text-align: center;
  margin-bottom: 14px;

  .emoji { font-size: 32px; margin-bottom: 6px; }
  .text { color: #fff; font-size: 16px; font-weight: 700; line-height: 1.4; }
  .sub { color: var(--blue-100); font-size: 13px; margin-top: 4px; }
`;
