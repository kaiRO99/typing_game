//Kai Ryall Ota
import { useEffect, useRef, useState } from "react";
import "./game.css";

const Game = () => {
  //list of words to display
  const words = [
    "cycle",
    "sour",
    "lace",
    "abundant",
    "soggy",
    "dapper",
    "historical",
    "glistening",
    "waggish",
    "linen",
    "rhetorical",
    "letters",
    "street",
    "start",
    "skinny",
    "summer",
    "courageous",
    "rod",
    "humor",
    "unkempt",
    "ground",
    "pleasure",
    "tiny",
    "penitent",
    "small",
    "interest",
    "foregoing",
    "crowd",
    "familiar",
    "wholesale",
    "automatic",
    "godly",
    "reject",
    "extra-small",
    "old",
    "bumpy",
    "scarf",
    "ghost",
    "yoke",
    "scrub",
    "thundering",
    "murky",
    "zany",
    "cute",
    "hideous",
    "troubled",
    "aboard",
    "unequal",
    "wobble",
    "line",
    "report",
    "thin",
    "enchanted",
    "legal",
    "near",
    "inform",
    "bloody",
    "boorish",
    "actually",
    "mice",
    "pear",
    "mighty",
    "store",
    "wound",
    "giddy",
    "injure",
    "use",
    "instinctive",
    "judge",
    "pause",
    "arrogant",
    "handsome",
    "things",
    "abortive",
    "dime",
    "tub",
    "hour",
    "unequaled",
    "coordinated",
    "animal",
    "lackadaisical",
    "calendar",
    "dirt",
    "maniacal",
    "living",
    "greasy",
    "dusty",
    "blue-eyed",
    "sedate",
    "quince",
    "freezing",
    "drink",
    "crib",
    "hunt",
    "furry",
    "grubby",
    "jazzy",
    "space",
    "ring",
    "trip",
    "fretful",
    "changeable",
    "successful",
    "violet",
    "wary",
    "rescue",
    "bashful",
    "phobic",
    "substance",
    "productive",
    "ruthless",
    "lewd",
    "crook",
    "determined",
    "gleaming",
    "rhyme",
    "sky",
    "tasty",
    "agonizing",
    "pan",
    "desert",
    "poor",
    "heady",
    "safe",
    "thing",
    "base",
    "ready",
    "head",
    "ordinary",
    "shrill",
    "middle",
    "educate",
    "return",
    "cook",
    "highfalutin",
    "unknown",
    "dad",
    "creature",
    "material",
    "remove",
    "smiling",
    "enjoy",
    "cracker",
    "blade",
    "refuse",
    "tedious",
    "science",
    "screw",
    "reading",
    "plant",
    "yellow",
    "discussion",
    "stupid",
    "necessary",
    "blind",
    "key",
    "manage",
  ];

  const [elements, setElements] = useState([]); //list of word elements with positional info
  const [isRunning, setIsRunning] = useState(false); //state of game
  const [life, setLife] = useState(5); //life counter
  const [points, setPoints] = useState(0); //points counter
  const [input, setInput] = useState(""); //input state
  const [startDisabled, setStartDisabled] = useState(false); //state of buttons and input
  const [showPopup, setShowPopup] = useState(false); //state of endgame popup

  //if changed, also need to change .line in game.css
  const threshold = 380; //threshold for words falling to be removed.

  const wordsIntervalRef = useRef(null);
  const lowerIntervalRef = useRef(null);

  const inputRef = useRef(null);

  /**
   * creates a new word element to be placed on the screen
   */
  function createElements() {
    //needs to be less than full width to account for overflow
    let y = Math.floor(Math.random() * 950); //get random starting point
    let wordIndex = Math.floor(Math.random() * words.length); //get random index

    //create new element with y and wordIndex
    const newElement = {
      id: Date.now(),
      style: { position: "absolute", top: 0, left: y },
      word: words[wordIndex],
    };

    // Use functional update to ensure all previous elements are preserved
    setElements((prev) => [...prev, newElement]); //add new element to list
  } //createElements

  /**
   * lowers all word elements, and checks if they need to be removed
   * life is updated, and endgame pop-up enabled if life = 0
   */
  function lower() {
    //updates "top:" of all word elements in list
    setElements((prevElements) => {
      // ? this may not be required, multiple words should not reach the bottom at the same time
      let removed = 0; //counter for items that are removed
      //updated list
      const updatedElements = prevElements.reduce((acc, el) => {
        const newTop = el.style.top + 10; //calculating the new posistion

        //if it is below the threshold
        if (newTop >= threshold) {
          removed++;
          return acc; //don't add it to the updated list
        }

        //otherwise add to updated list
        acc.push({
          ...el,
          style: {
            ...el.style,
            top: newTop,
          },
        });
        return acc; //return updated list
      }, []); //start with empty acc

      //update life or enable endgame pop-up
      if (removed > 0) {
        setLife((prevLife) => {
          const newLife = prevLife - removed;
          if (newLife <= 0) {
            setElements([]);
            handleGameOver();
          }
          return Math.max(0, newLife); // life doesn't go below 0
        });
      }
      //returnd to the setElements
      return updatedElements;
    });
  } //lower

  /**
   * enables the end pop-up
   * disables game
   * disables start and input
   */
  function handleGameOver() {
    setStartDisabled(true);
    setIsRunning(false);
    setShowPopup(true);
  } //handleGameOver

  /**
   * resets all paramaters to start the game again
   */
  function resetGame() {
    setLife(5);
    setInput("");
    setElements([]);
    setPoints(0);
    setShowPopup(false);
    setStartDisabled(false);
  } //resetGame

  /**
   * handler for input element, checlks for "enter"
   * if an element with the same word exists:
   * 1. remove it from the list/screen
   * 2. update points
   * 3. clear input
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      //update word elements
      setElements((prevElements) => {
        let index = prevElements.findIndex((el) => el.word === input);
        console.log("index", index);
        if (index === -1) {
          return prevElements;
        }
        //create new array without the element
        return [
          ...prevElements.slice(0, index),
          ...prevElements.slice(index + 1),
        ];
      });
      setInput(""); //clear input
      //increase the points
      setPoints((prevPoints) => {
        return prevPoints + 5;
      });
    }
  };

  /**
   * called when isRunning changes
   * if the game is started, createElement and loop are called on intervals
   */
  useEffect(() => {
    if (isRunning) {
      setPoints(0);
      // clear any existing intervals before starting new ones, just in case
      clearInterval(wordsIntervalRef.current);
      clearInterval(lowerIntervalRef.current);

      //interval to create new word element
      wordsIntervalRef.current = setInterval(() => {
        createElements();
      }, 2000);
      //interval to lower word elements
      lowerIntervalRef.current = setInterval(() => {
        lower();
      }, 400);
    } else {
      // clear any existing intervals
      clearInterval(wordsIntervalRef.current);
      clearInterval(lowerIntervalRef.current);
    }

    return () => {
      //clearing again?
      clearInterval(wordsIntervalRef.current);
      clearInterval(lowerIntervalRef.current);
    };
    //to handle warning, I think I can ignore it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]); //useEffect

  /**
   * called when isRunning changes
   * if the game is started, focus on the input
   * ? add it to the useEffect above?
   */
  useEffect(() => {
    if (isRunning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRunning]); //useEffect

  return (
    <div className="game">
      <div className="fallingText">
        {elements.map((el) => (
          <p key={el.id} style={el.style}>
            {el.word}
          </p>
        ))}
      </div>
      <hr className="line" />
      <div className="bottom">
        <button
          type="button"
          onClick={() => {
            if (!isRunning) {
              createElements(); //fire once on start because I am using setInterval
            }
            setIsRunning((prev) => !prev); // Toggle the running state
          }}
          disabled={isRunning || startDisabled}
        >
          start
        </button>
        <label className="input">
          <input
            type="text"
            ref={inputRef}
            onChange={(input) => setInput(input.target.value)}
            onKeyDown={handleKeyDown}
            value={input}
            disabled={!isRunning || startDisabled}
          />
        </label>
        <div className="scoreboard">
          <h1 className="life">Life: {life}</h1>
          <h1 className="points">Points: {points}</h1>
        </div>
      </div>
      {/*popup*/}
      {showPopup && (
        <div className="popup">
          <div className="popupContent">
            <h1>Game Over</h1>
            <p>Points: {points}</p>
            <button onClick={resetGame}>Restart</button>
          </div>
        </div>
      )}
    </div>
  );
};//Game

export default Game;
