import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  background: #fff;
  border-top: 1px solid var(--blue-100);
  display: flex;
  padding: 6px 0 calc(6px + env(safe-area-inset-bottom, 0px));
  z-index: 100;
`;

const NavBtn = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  border: none;
  background: transparent;
  padding: 6px 4px;
  transition: transform 0.1s;
  &:active { transform: scale(0.92); }

  i {
    font-size: 24px;
    color: ${p => p.$active ? 'var(--blue-600)' : 'var(--gray-200)'};
    transition: color 0.15s;
  }

  span {
    font-size: 10px;
    font-weight: 600;
    color: ${p => p.$active ? 'var(--blue-600)' : 'var(--gray-200)'};
    transition: color 0.15s;
  }
`;

const TABS = [
  { id: 'today',    icon: 'ti-pill',        label: 'Today'    },
  { id: 'feeling',  icon: 'ti-mood-smile',  label: 'Feeling'  },
  { id: 'summary',  icon: 'ti-chart-bar',   label: 'Summary'  },
  { id: 'settings', icon: 'ti-settings',    label: 'Settings' },
];

export default function BottomNav({ tab, setTab }) {
  return (
    <Nav>
      {TABS.map(t => (
        <NavBtn key={t.id} $active={tab === t.id} onClick={() => setTab(t.id)} aria-label={t.label}>
          <i className={`ti ${t.icon}`} aria-hidden="true" />
          <span>{t.label}</span>
        </NavBtn>
      ))}
    </Nav>
  );
}
