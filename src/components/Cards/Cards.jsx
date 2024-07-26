import styles from "./Cards.module.css";
import { ReactComponent as HeartIcon } from "./images/heart.svg";
import { ReactComponent as LevelsIcon } from "./images/levels.svg";
import { ReactComponent as VisionIcon } from "./images/vision_s_power.svg";
import { ReactComponent as AlohomoraIcon } from "./images/alohomora_s_power.svg";
import { sample, shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { useModeContext } from "../../contexts/mode/useModeContext";
import { Link } from "react-router-dom";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

function closeWrongPair(setCards, openCards) {
  setTimeout(() => {
    setCards(cards =>
      cards.map(card => (openCards.some(openCard => openCard.id === card.id) ? { ...card, open: false } : card)),
    );
  }, 1000);
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);

  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  // Контекст и стейт для установки легкого режима и количества попыток
  const { easyMode } = useModeContext();
  const [attempts, setAttempts] = useState(easyMode ? 3 : 1);

  // Стейт для активации суперспособностей
  const [abilities, setAbilities] = useState({
    vision: false,
    visionTries: 1,
    alohomora: false,
    alohomoraTries: 1,
  });

  // Стейт для паузы таймера при активации способности - "Прозрение"
  const [pause, setPause] = useState(false);

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }
  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }
  function resetGame() {
    /*Во избежание читерства и багов, блокируем кнопку
     на 5 сек после активации способности - "Прозрение"*/
    if (pause) {
      return;
    }

    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setAttempts(easyMode ? 3 : 1);
    setAbilities({ ...abilities, vision: false, visionTries: 1, alohomora: false, alohomoraTries: 1 });
    setStatus(STATUS_PREVIEW);
  }

  // Основная логика для суперспособностей
  // "Прозрение"
  function vision() {
    if (abilities.vision && abilities.visionTries < 1) {
      return;
    }

    const openCards = cards.map(card => ({
      ...card,
      open: true,
    }));

    setPause(true);
    setCards(openCards);
    setAbilities({ ...abilities, vision: true, visionTries: 0, alohomora: true });

    setTimeout(() => {
      setPause(false);
      setCards(cards);
      setGameStartDate(new Date(gameStartDate.getTime() + 5000));
      setAbilities({ ...abilities, vision: true, visionTries: 0 });
    }, 5000);
  }

  // "Алохомора"
  function alohomora() {
    if (abilities.alohomora || (abilities.alohomora && abilities.alohomoraTries < 1)) {
      return;
    }

    const closedCards = cards.filter(card => !card.open);
    const randomCards = sample(closedCards);
    const pairsCards = closedCards.filter(
      closedCard =>
        closedCard.id !== randomCards.id &&
        closedCard.suit === randomCards.suit &&
        closedCard.rank === randomCards.rank,
    );

    const openRandomPairsCard = cards.map(card => {
      if (card === randomCards || card === pairsCards[0]) {
        return { ...card, open: true };
      } else {
        return card;
      }
    });

    setAbilities({ ...abilities, alohomora: true, alohomoraTries: 0 });
    setCards(openRandomPairsCard);

    // Если игрок открыл последнюю пару карт с помощью "Алохоморы", присваиваем статус победы
    if (!openRandomPairsCard.some(el => !el.open)) {
      finishGame(STATUS_WON);
    }
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходит в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    const playerLost = openCardsWithoutPair.length >= 2;

    // "Игрок проиграл", т.к на поле есть две открытые карты без пары
    if (playerLost) {
      if (attempts <= 1) {
        finishGame(STATUS_LOST);
        return;
      } else {
        setAttempts(prev => --prev);
        closeWrongPair(setCards, openCardsWithoutPair);
      }
    }

    // ... игра продолжается
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера в интервале
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!pause) {
        setTimer(getTimerValue(gameStartDate, gameEndDate));
      }
    }, 300);

    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate, pause]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>

        <div className={styles.abilities}>
          {status === STATUS_IN_PROGRESS ? (
            <>
              <div className={styles.vision}>
                <VisionIcon onClick={vision} />
                <span>{abilities.visionTries}</span>
              </div>

              <div className={styles.alohomora} onClick={alohomora}>
                <AlohomoraIcon />
                <span>{abilities.alohomoraTries}</span>
              </div>
            </>
          ) : null}
        </div>

        {status === STATUS_IN_PROGRESS ? (
          <Button onClick={resetGame} disabled={pause}>
            Начать заново
          </Button>
        ) : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      <div className={styles.optional}>
        {status === STATUS_IN_PROGRESS && easyMode ? (
          <>
            <HeartIcon />
            <p className={styles.counts}>{attempts}</p>
          </>
        ) : null}

        {status === STATUS_IN_PROGRESS ? (
          <Link to="/">
            <LevelsIcon />
          </Link>
        ) : null}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            pairsCount={pairsCount}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
            abilities={abilities}
          />
        </div>
      ) : null}
    </div>
  );
}
