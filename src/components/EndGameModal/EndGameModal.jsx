import styles from "./EndGameModal.module.css";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { Button } from "../Button/Button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { leaderboardApi } from "../../api";
import { ReactComponent as PostLeaderBtn } from "./images/add_leader.svg";

export function EndGameModal({ isWon, pairsCount, gameDurationSeconds, gameDurationMinutes, onClick }) {
  const title = isWon ? "Вы победили!" : "Вы проиграли!";
  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;
  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  const [load, setLoad] = useState(false);
  const loadMessage = <p className={styles.loadMessage}>Данные загружаются...</p>;
  const [error, setError] = useState(null);
  const errorMessage = <p className={styles.errorMessage}>{error}</p>;
  const [isLeader, setIsLeader] = useState(false);
  const timeElapsed = gameDurationMinutes * 60 + gameDurationSeconds;
  const [newLeader, setNewLeader] = useState({
    name: "",
    time: timeElapsed,
  });

  useEffect(() => {
    const gotIntoLeaderboard = isWon && pairsCount === 9;

    if (gotIntoLeaderboard) {
      setIsLeader(true);
    }
  }, [isWon, pairsCount]);

  const onChange = event => {
    const { name, value } = event.target;
    setNewLeader({ ...newLeader, [name]: value });

    if (error) {
      setError(prev => !prev);
    }
  };

  const onKeyDown = event => {
    if (event.key === "Enter") {
      onSubmit();
    }
    if (error) {
      setError(prev => !prev);
    }
  };

  const onSubmit = async () => {
    try {
      if (!newLeader.name.trim() || !newLeader.time) {
        throw new Error("Введите имя");
      }

      setLoad(true);
      await leaderboardApi.addLeader({ leader: newLeader }).finally(() => setLoad(false));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.modal}>
      <img className={isLeader ? styles.__image : styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{isLeader ? "Вы попали \n на Лидерборд!" : title}</h2>

      {isLeader ? (
        <>
          <input
            className={styles.leaderName}
            name="name"
            type="text"
            placeholder="Пользователь"
            value={newLeader.name}
            onChange={onChange}
            onKeyDown={onKeyDown}
            autoFocus={true}
          />
          {errorMessage}

          {load ? loadMessage : <PostLeaderBtn className={styles.postLeaderBtn} onClick={onSubmit} />}
        </>
      ) : null}

      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>
      <Button onClick={onClick}>Начать сначала</Button>

      {isLeader ? (
        <Link className={styles.leaderboardLink} to="/game/leaderboard">
          Перейти к лидерборду
        </Link>
      ) : null}
    </div>
  );
}
