import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Page, SectionTitle, Card, PrimaryBtn, SecondaryBtn, BtnRow, Modal, ModalTitle, EncouragementBanner } from './ui';
import { sendFamilyNotification } from '../utils/notifications';

const ENCOURAGEMENTS = [
  { emoji: '🌟', text: 'You are absolutely amazing!', sub: 'Every dose keeps you healthy and happy 💙' },
  { emoji: '💙', text: 'Thank you for taking care of yourself!', sub: 'Your family loves you so much' },
  { emoji: '🌸', text: 'You did it! So proud of you!', sub: 'You are an inspiration to everyone around you' },
  { emoji: '✨', text: 'Superstar! Video logged!', sub: 'Staying consistent keeps you glowing 🌟' },
  { emoji: '🎉', text: 'Wonderful job, you\'re doing great!', sub: 'We are so thankful for you 💙' },
  { emoji: '🌈', text: 'Beautiful! Keep shining!', sub: 'Your dedication makes a difference every day' },
];

const MedCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${p => p.$taken ? 'var(--green-50)' : '#fff'};
  border-color: ${p => p.$taken ? 'var(--green-100)' : 'var(--blue-100)'};
  transition: all 0.2s;
`;

const MedInfo = styled.div``;
const MedName = styled.div`font-size: 17px; font-weight: 700; color: var(--blue-900);`;
const MedDose = styled.div`font-size: 13px; color: var(--blue-600); margin-top: 2px;`;

const CheckRing = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2.5px solid ${p => p.$done ? 'var(--green-600)' : 'var(--blue-400)'};
  background: ${p => p.$done ? 'var(--green-600)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  i { font-size: 18px; color: ${p => p.$done ? '#fff' : 'var(--blue-400)'}; }
  &:active { transform: scale(0.9); }
`;

const SessionBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
  background: ${p => p.$taken ? 'var(--green-600)' : 'var(--blue-600)'};
  color: #fff;
  margin-bottom: 6px;
  display: inline-block;
`;

const VideoCard = styled(Card)`
  border: 2px dashed ${p => p.$done ? 'var(--green-400)' : 'var(--blue-200)'};
  background: ${p => p.$done ? 'var(--green-50)' : 'var(--blue-50)'};
  text-align: center;
  padding: 22px;
  cursor: pointer;
  transition: all 0.15s;
  &:active { transform: scale(0.98); }
  i { font-size: 40px; color: ${p => p.$done ? 'var(--green-600)' : 'var(--blue-400)'}; display: block; margin-bottom: 8px; }
  .label { font-size: 15px; font-weight: 700; color: ${p => p.$done ? 'var(--green-800)' : 'var(--blue-800)'}; }
  .sub { font-size: 12px; color: var(--gray-600); margin-top: 4px; }
`;

const VideoPreview = styled.video`
  width: 100%;
  border-radius: var(--rad-sm);
  margin: 10px 0;
  max-height: 260px;
  background: #000;
`;

const LiveVideo = styled.video`
  width: 100%;
  border-radius: var(--rad-sm);
  margin-bottom: 10px;
  max-height: 260px;
  background: #000;
  transform: scaleX(-1);
`;

export default function TodayTab({ meds, todayDoses, markDose, unmarkDose, settings, family }) {
  const [videoModal, setVideoModal] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [recorded, setRecorded] = useState(null);
  const [recording, setRecording] = useState(false);
  const [encouragement, setEncouragement] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const hour = new Date().getHours();
  const currentSession = hour < 12 ? 'morning' : 'evening';
  const otherSession = currentSession === 'morning' ? 'evening' : 'morning';

  const sessionMeds = meds.filter(m => m.active && m.session === currentSession);
  const otherMeds = meds.filter(m => m.active && m.session === otherSession);

  function isTaken(medId, session) {
    return !!todayDoses[`${medId}_${session}`]?.taken;
  }

  function hasVideo(session) {
    return meds.filter(m => m.active && m.session === session)
      .some(m => todayDoses[`${m.id}_${session}`]?.hasVideo);
  }

  function allTaken(session) {
    const s = meds.filter(m => m.active && m.session === session);
    return s.length > 0 && s.every(m => isTaken(m.id, session));
  }

  async function openVideoModal(session) {
    setVideoModal(session);
    setRecorded(null);
    setStreaming(false);
    setRecording(false);
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStreaming(true);
    } catch (err) {
      alert('Camera access was denied. Please allow camera access in your browser settings.');
    }
  }

  function startRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(streamRef.current);
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecorded(url);
      setStreaming(false);
      stopStream();
    };
    mr.start();
    mediaRecorderRef.current = mr;
    setRecording(true);
    setTimeout(() => stopRecording(), 30000); // auto-stop at 30s
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  }

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }

  function submitVideo() {
    // Mark all meds in this session with video
    meds.filter(m => m.active && m.session === videoModal).forEach(m => {
      markDose(m.id, videoModal, true);
    });
    stopStream();
    setVideoModal(null);
    const enc = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
    setEncouragement(enc);
    // Notify family
    const names = family.map(f => f.name).join(', ');
    sendFamilyNotification(family, `Dorothy has taken her ${videoModal} medications and logged a video! 💙`);
    setTimeout(() => setEncouragement(null), 5000);
  }

  function closeVideoModal() {
    stopStream();
    setVideoModal(null);
    setRecorded(null);
    setStreaming(false);
    setRecording(false);
  }

  function renderMeds(session, medList) {
    const timeLabel = session === 'morning'
      ? `${formatTime(settings.morningTime)}`
      : `${formatTime(settings.eveningTime)}`;
    const sessionLabel = session === 'morning' ? 'Morning' : 'Evening';

    return (
      <>
        <SectionTitle>{sessionLabel} Meds — {timeLabel}</SectionTitle>
        {medList.map(med => {
          const taken = isTaken(med.id, session);
          return (
            <MedCard key={med.id} $taken={taken}>
              <MedInfo>
                <SessionBadge $taken={taken}>{sessionLabel}</SessionBadge>
                <MedName>{med.name}</MedName>
                <MedDose>{med.dose}</MedDose>
              </MedInfo>
              <CheckRing
                $done={taken}
                onClick={() => taken ? unmarkDose(med.id, session) : markDose(med.id, session)}
                aria-label={taken ? `Unmark ${med.name}` : `Mark ${med.name} as taken`}
              >
                <i className="ti ti-check" aria-hidden="true" />
              </CheckRing>
            </MedCard>
          );
        })}

        <VideoCard
          $done={hasVideo(session)}
          onClick={() => openVideoModal(session)}
          role="button"
          aria-label={`Record ${sessionLabel} dose video`}
        >
          <i className={`ti ${hasVideo(session) ? 'ti-circle-check' : 'ti-video'}`} aria-hidden="true" />
          <div className="label">
            {hasVideo(session) ? '✅ Video logged!' : `Record ${sessionLabel} Dose Video`}
          </div>
          <div className="sub">
            {hasVideo(session) ? 'Your family has been notified 💙' : 'Tap to record proof of your dose'}
          </div>
        </VideoCard>
      </>
    );
  }

  return (
    <Page>
      {encouragement && (
        <EncouragementBanner>
          <div className="emoji">{encouragement.emoji}</div>
          <div className="text">{encouragement.text}</div>
          <div className="sub">{encouragement.sub}</div>
        </EncouragementBanner>
      )}

      {allTaken(currentSession) && !encouragement && (
        <EncouragementBanner>
          <div className="emoji">🎉</div>
          <div className="text">All {currentSession} meds taken!</div>
          <div className="sub">You are doing wonderfully today 💙</div>
        </EncouragementBanner>
      )}

      {renderMeds(currentSession, sessionMeds)}

      {otherMeds.length > 0 && (
        <>
          <div style={{ height: 4 }} />
          {renderMeds(otherSession, otherMeds)}
        </>
      )}

      {/* Video Modal */}
      {videoModal && (
        <Modal onClose={closeVideoModal}>
          <ModalTitle>
            {videoModal === 'morning' ? '🌅 Morning' : '🌙 Evening'} Dose Video 💙
          </ModalTitle>

          {!streaming && !recorded && (
            <>
              <div style={{
                background: 'var(--blue-50)', borderRadius: 'var(--rad)',
                padding: '24px', textAlign: 'center', marginBottom: 14
              }}>
                <i className="ti ti-video" style={{ fontSize: 52, color: 'var(--blue-400)', display: 'block', marginBottom: 10 }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--blue-800)' }}>Ready to record!</div>
                <div style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 4 }}>Hold up your medication and smile 😊</div>
              </div>
              <BtnRow>
                <SecondaryBtn onClick={closeVideoModal}>Cancel</SecondaryBtn>
                <PrimaryBtn style={{ flex: 1 }} onClick={startCamera}>Open Camera</PrimaryBtn>
              </BtnRow>
            </>
          )}

          {streaming && (
            <>
              <LiveVideo ref={videoRef} autoPlay muted playsInline />
              {!recording ? (
                <PrimaryBtn onClick={startRecording}>
                  <i className="ti ti-player-record" style={{ marginRight: 8 }} />
                  Start Recording
                </PrimaryBtn>
              ) : (
                <PrimaryBtn
                  onClick={stopRecording}
                  style={{ background: 'var(--red-600)' }}
                >
                  <i className="ti ti-square" style={{ marginRight: 8 }} />
                  Stop Recording
                </PrimaryBtn>
              )}
              <SecondaryBtn onClick={closeVideoModal} style={{ width: '100%', marginTop: 8 }}>Cancel</SecondaryBtn>
            </>
          )}

          {recorded && (
            <>
              <div style={{ fontSize: 13, color: 'var(--blue-600)', fontWeight: 600, marginBottom: 6 }}>Preview your video:</div>
              <VideoPreview src={recorded} controls playsInline />
              <EncouragementBanner style={{ marginBottom: 12 }}>
                <div className="emoji">✨</div>
                <div className="text">Looking great! Ready to log it?</div>
                <div className="sub">Your family will be notified 💙</div>
              </EncouragementBanner>
              <BtnRow>
                <SecondaryBtn onClick={() => { setRecorded(null); setStreaming(false); }}>Re-record</SecondaryBtn>
                <PrimaryBtn style={{ flex: 1 }} onClick={submitVideo}>Submit Video 💙</PrimaryBtn>
              </BtnRow>
            </>
          )}
        </Modal>
      )}
    </Page>
  );
}

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
}
