import './App.css';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

function getLineSegments(ids, gridEl, color) {
  if (!gridEl || ids.length < 2) return [];
  const gridRect = gridEl.getBoundingClientRect();
  const segments = [];
  for (let i = 0; i < ids.length - 1; i++) {
    const el1 = gridEl.querySelector(`[data-id="${ids[i]}"]`);
    const el2 = gridEl.querySelector(`[data-id="${ids[i + 1]}"]`);
    if (!el1 || !el2) continue;
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();
    const cx1 = r1.left + r1.width / 2 - gridRect.left;
    const cy1 = r1.top + r1.height / 2 - gridRect.top;
    const cx2 = r2.left + r2.width / 2 - gridRect.left;
    const cy2 = r2.top + r2.height / 2 - gridRect.top;
    const dx = cx2 - cx1;
    const dy = cy2 - cy1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) continue;
    const radius = r1.width / 2;
    segments.push({
      x1: cx1 + (dx / dist) * radius,
      y1: cy1 + (dy / dist) * radius,
      x2: cx2 - (dx / dist) * radius,
      y2: cy2 - (dy / dist) * radius,
      color,
    });
  }
  return segments;
}

function App() {
  const [touchedIds, setTouchedIds] = useState([]);
  const [touchedLetters, setTouchedLetters] = useState([]);
  const [spanoGramAnswerIds, setSpanoGramAnswerIds] = useState([]);
  const [answerIds, setAnserIds] = useState([]);
  const [message, setMessage] = useState('');
  const [correct, setCorrect] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [answerPaths, setAnswerPaths] = useState([]);
  const [spanoGramPath, setSpanoGramPath] = useState([]);
  const [lineSegments, setLineSegments] = useState([]);
  const [layoutVersion, setLayoutVersion] = useState(0);
  const [electrifiedIds, setElectrifiedIds] = useState([]);
  const [electrifiedGoldIds, setElectrifiedGoldIds] = useState([]);
  const gridRef = useRef(null);

  const letters = ['E', 'N', 'I', 'S', 'U', 'B', 'S', 'S', 'H', 'N', 'G', 'S', 'C', 'T', 'E', 'I', 'I', 'U', 'L', 'N', 'R', 'S', 'F', 'N', 'A', 
    'I', 'P', 'P', 'L', 'N', 'S', 'S', 'O', 'N', 'I', 'E', 'F', 'R', 'T', 'H', 'G', 'M', 'I', 'E', 'N', 'D', 'R', 'A'];

  const correctWords = ['NIPPON', 'BUSINESSCLASS', 'RAMEN', 'FLIGHT', 'FRIEND'];
  const spanoGram = 'THERISINGSUN';

  const processTouchOrClick = (target) => {
    const targetId = target.dataset.id;
    const targetLetter = target.id;
    if (
      targetId &&
      !touchedIds.includes(targetId) &&
      !answerIds.includes(targetId) &&
      !spanoGramAnswerIds.includes(targetId)
    ) {
      setTouchedIds((prev) => [...prev, targetId]);
      setTouchedLetters((prev) => [...prev, targetLetter]);
    }
  };

  const handleEnd = () => {
    if (correct === 6) return;
    const word = touchedLetters.join('');
    if (spanoGram === word) {
      const foundIds = [...touchedIds];
      foundIds.forEach((id) => {
        setSpanoGramAnswerIds((prev) => [...prev, id]);
      });
      setSpanoGramPath(foundIds);
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setMessage(newCorrect === 6 ? 'MERRY CHRISTMAS!' : 'SPANGRAM!!');
      setElectrifiedGoldIds(foundIds);
      setTimeout(() => setElectrifiedGoldIds([]), 1500);
      if (newCorrect === 6) {
        setTimeout(() => launchConfetti(), 400);
      }
    } else if (correctWords.includes(word)) {
      const foundIds = [...touchedIds];
      foundIds.forEach((id) => {
        setAnserIds((prev) => [...prev, id]);
      });
      setAnswerPaths((prev) => [...prev, foundIds]);
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setMessage(newCorrect === 6 ? 'MERRY CHRISTMAS!' : 'GOOD JOB!');
      setElectrifiedIds(foundIds);
      setTimeout(() => setElectrifiedIds([]), 1500);
      if (newCorrect === 6) {
        setTimeout(() => launchConfetti(), 400);
      }
    } else if (correct < 5) {
      setMessage('TRY AGAIN!');
    }
    setTouchedIds([]);
    setTouchedLetters([]);
    setMouseDown(false);
  };

  const launchConfetti = () => {
    const duration = 4000;
    const end = Date.now() + duration;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        particleCount: 10,
        angle: 270,
        spread: 80,
        origin: { x: Math.random(), y: 0 },
        startVelocity: 20,
        gravity: 1.2,
        colors: ['#ff6b6b', '#ffd700', '#00f7ff', '#ff69b4', '#adff2f'],
      });
    }, 120);
  };

  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;
    const ro = new ResizeObserver(() => setLayoutVersion((v) => v + 1));
    ro.observe(gridEl);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const gridEl = gridRef.current;
    const all = [];
    answerPaths.forEach((path) => all.push(...getLineSegments(path, gridEl, 'skyblue')));
    if (spanoGramPath.length >= 2) all.push(...getLineSegments(spanoGramPath, gridEl, 'gold'));
    all.push(...getLineSegments(touchedIds, gridEl, 'skyblue'));
    setLineSegments(all);
  }, [touchedIds, answerPaths, spanoGramPath, layoutVersion]);

  useEffect(() => {
    const handleTouchStart = (event) => {
      if (
        event.target.closest(".grid-container") ||
        event.target.closest(".message") ||
        event.target.closest(".letters") ||
        event.target.closest(".progress")
      ) {
        event.preventDefault();
      }
      if (answerIds.length + spanoGramAnswerIds.length === 48) return;
      setMessage('');
      processTouchOrClick(event.target);
    };

    const handleTouchMove = (event) => {
      if (answerIds.length + spanoGramAnswerIds.length === 48) return;
      const target = document.elementFromPoint(
        event.touches[0].clientX,
        event.touches[0].clientY
      );
      if (target) processTouchOrClick(target);
    };

    const handleMouseDown = (event) => {
      if (event.target.classList.contains("grid-item")) {
        setMouseDown(true);
        setMessage('');
        processTouchOrClick(event.target);
      }
    };

    const handleMouseMove = (event) => {
      if (!mouseDown) return;
      const target = document.elementFromPoint(event.clientX, event.clientY);
      if (target && target.classList.contains("grid-item")) {
        processTouchOrClick(target);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleEnd, { passive: false });

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
    };
  }, [answerIds, correct, spanoGramAnswerIds, touchedLetters, mouseDown]);

  return (
    <>
      <div className='theme'>
        <p className='t-header'>STEPH'S THEME</p>
        <p className='t-p'> Your Christmas Gift!</p>
      </div>

      <div className='letters'>
        {touchedLetters.join("")}
      </div>

      <p className='message'>{message}</p>

      <div className="grid-container" ref={gridRef}>
        <svg
          className="connection-lines"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          {lineSegments.map((seg, i) => (
            <line
              key={i}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke={seg.color}
              strokeWidth={8}
              strokeLinecap="round"
            />
          ))}
        </svg>
        {letters.map((letter, index) => {
          const idStr = index.toString();
          const isElectrified = electrifiedIds.includes(idStr);
          const isElectrifiedGold = electrifiedGoldIds.includes(idStr);
          return (
            <div
              id={letter}
              key={index}
              data-id={index}
              className={`grid-item${isElectrified ? ' electrified' : ''}${isElectrifiedGold ? ' electrified-gold' : ''}`}
              style={{
                backgroundColor: touchedIds.includes(idStr)
                  ? 'lightgrey'
                  : answerIds.includes(idStr)
                  ? 'skyblue'
                  : spanoGramAnswerIds.includes(idStr)
                  ? 'gold'
                  : ''
              }}
            >
              {letter}
            </div>
          );
        })}
      </div>

      <p className='progress'> {correct} of 6 words found.</p>

      {correct === 6 && (
        <div className='word-list'>
          <p className='clue'>Clues:</p>
          {correctWords.map((word, index) => (
            <p className='word' key={index}>{word}</p>
          ))}
          <p className='word'>{spanoGram}</p>
        </div>
      )}
    </>
  );
}

export default App;
