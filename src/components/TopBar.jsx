import React from 'react';
import styled from 'styled-components';

const Bar = styled.div`
  background: var(--blue-600);
  padding: 16px 20px 14px;
  border-radius: 0 0 20px 20px;
  flex-shrink: 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Greeting = styled.div`
  color: var(--blue-100);
  font-size: 13px;
  font-weight: 500;
`;

const Title = styled.div`
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  margin-top: 2px;
  letter-spacing: -0.3px;
`;

const StreakBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--blue-400);
  color: #fff;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 600;
`;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning 🌸';
  if (h < 17) return 'Good afternoon ☀️';
  return 'Good evening 🌙';
}

export default function TopBar({ streak }) {
  return (
    <Bar>
      <Row>
        <div>
          <Greeting>{getGreeting()}</Greeting>
          <Title>Grandma's Meds 💙</Title>
        </div>
        <StreakBadge>
          <i className="ti ti-flame" aria-hidden="true" />
          {streak} day{streak !== 1 ? 's' : ''}
        </StreakBadge>
      </Row>
    </Bar>
  );
}
