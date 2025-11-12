import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [touchedIds, setTouchedIds] = useState([]);
  const [touchedLetters, setTouchedLetters] = useState([]);
  const [spanoGramAnswerIds, setSpanoGramAnswerIds] = useState([]);
  const [answerIds, setAnserIds] = useState([]);
  const [message, setMessage] = useState('');
  const [correct, setCorrect] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);

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
      touchedIds.forEach((id) => {
        setSpanoGramAnswerIds((prev) => [...prev, id]);
      });
      setCorrect((prev) => prev + 1);
      setMessage(correct === 5 ? 'MERRY CHRISTMAS!' : 'SPANGRAM!!');
    } else if (correctWords.includes(word)) {
      touchedIds.forEach((id) => {
        setAnserIds((prev) => [...prev, id]);
      });
      setCorrect((prev) => prev + 1);
      setMessage(correct === 5 ? 'MERRY CHRISTMAS!' : 'GOOD JOB!');
    } else if (correct < 5) {
      setMessage('TRY AGAIN!');
    }
    setTouchedIds([]);
    setTouchedLetters([]);
    setMouseDown(false);
  };

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

      <div className="grid-container">
        {letters.map((letter, index) => (
          <div
            id={letter}
            key={index}
            data-id={index}
            className="grid-item"
            style={{
              backgroundColor: touchedIds.includes(index.toString())
                ? 'lightgrey'
                : answerIds.includes(index.toString())
                ? 'skyblue'
                : spanoGramAnswerIds.includes(index.toString())
                ? 'gold'
                : ''
            }}
          >
            {letter}
          </div>
        ))}
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
