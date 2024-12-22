import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [touchedIds, setTouchedIds] = useState([]);
  const [touchedLetters, setTouchedLetters] = useState([]);
  const [spanoGramAnswerIds, setSpanoGramAnswerIds] = useState([]);
  const [answerIds, setAnserIds] = useState([]);
  const [message, setMessage] = useState('');
  const [correct, setCorrect] = useState(0);
  const letters = ['E', 'N', 'I', 'S', 'U', 'B', 'S', 'S', 'H', 'N', 'G', 'S', 'C', 'T', 'E', 'I', 'I', 'U', 'L', 'N', 'R', 'S', 'F', 'N', 'A', 
    'I', 'P', 'P', 'L', 'N', 'S', 'S', 'O', 'N', 'I', 'E', 'F', 'R', 'T', 'H', 'G', 'M', 'I', 'E', 'N', 'D', 'R', 'A'];

    const correctWords = ['NIPPON', 'BUSINESSCLASS', 'RAMEN', 'FLIGHT', 'FRIEND'];
    const spanoGram = 'THERISINGSUN'

  useEffect(() => {
    const handleTouchStart = (event) => {
      if (!event.target.closest(".word-list")) {
        event.preventDefault();
      }
      if(answerIds.length + spanoGramAnswerIds.length === 48 ) {
        return;
      }
      setMessage("");
      const targetId = event.target.dataset.id;
      const targetLetter = event.target.id;
      if (targetId && (!touchedIds.includes(targetId) && !answerIds.includes(targetId) && !spanoGramAnswerIds.includes(targetId) )) {
        setTouchedIds((prevIds) => [...prevIds, targetId]);
        setTouchedLetters((prevLetters) => [...prevLetters, targetLetter]);
      }
    };

    const handleTouchMove = (event) => {
      if(answerIds.length + spanoGramAnswerIds.length === 48 ) {
        return;
      }
      const target = document.elementFromPoint(
        event.touches[0].clientX,
        event.touches[0].clientY
      );
      if (target && target.dataset.id && !touchedIds.includes(target.dataset.id)  && !answerIds.includes(target.dataset.id) && !spanoGramAnswerIds.includes(target.dataset.id)) {
        setTouchedIds((prevIds) => [...prevIds, target.dataset.id]);
        setTouchedLetters((prevLetters) => [...prevLetters, target.id]);
      }
    };

    const handleTouchEnd = () => {
      if(correct === 6) {
        return;
      }
      const word = touchedLetters.join('');
      if(spanoGram === word) {
        touchedIds.forEach(id => {
          setSpanoGramAnswerIds((prevIds) => [...prevIds, id]);
        })
        console.log('correct: ', correct)
        if(correct === 5 ) {
          setMessage('MERRY CHRISTMAS BABE!')
          setCorrect(correct + 1);
        } else {
          setMessage('SPANGRAM!!')
          setCorrect(correct + 1);
        }
      }
      if(correctWords.includes(word)) {
        touchedIds.forEach(id => {
          setAnserIds((prevIds) => [...prevIds, id]);
        })
        console.log('correct: ', correct)
        if(correct === 5 ) {
          setMessage('MERRY CHRISTMAS BABE!')
          setCorrect(correct + 1);
        } else {
          setMessage('GOOD JOB BABE!')
          setCorrect(correct + 1);
        }
      } 
      if(!correctWords.includes(word) && spanoGram !== word && correct < 5) {
        setMessage('TRY AGAIN BABE!')
      }
      setTouchedIds([]);
      setTouchedLetters([]);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [answerIds, correct, correctWords, spanoGramAnswerIds, touchedLetters]);

  return (
    <>
    <div className='theme'>
      <p className='t-header'>STEPH'S THEME</p>
      <p className='t-p'> Your Christmas Gift!</p>
    </div>
    {touchedLetters ? (
      <div className='letters'>{touchedLetters.join("")}</div>
    ) : (
      <div className='letters'></div>
    )}
    {message ? (
      <p className='message'>{message}</p>
    ) : (
      <p className='message'></p>
    )}
    <div className="grid-container">
      {letters.map((letter, index) => (
        <div
          id={letter}
          key={index}
          data-id={index} // Unique identifier using the index
          className="grid-item"
          style={{backgroundColor : touchedIds.includes(index.toString()) ? 'lightgrey' : answerIds.includes(index.toString()) ? 'skyblue' : spanoGramAnswerIds.includes(index.toString()) ? 'gold' : ''}}
        >
          {letter}
        </div>
      ))}
    </div>
    <p className='progress'> {correct} of 6 words found.</p>
    {correct === 6 ? (
      <div className='word-list'>
        <p className='clue'>Clues:</p>
        {correctWords.map((word, index) => {
          return(<p className='word' key={index}>{word}</p>)
        })}
        <p className='word'>{spanoGram}</p>
      </div>
    ): null}
    </>
  );
}

export default App;