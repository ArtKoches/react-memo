import styles from "./SelectLevelPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { useState } from "react";
import { useModeContext } from "../../contexts/mode/useModeContext";

export function SelectLevelPage() {
  const navigate = useNavigate();
  const { onCheckedMode } = useModeContext();
  const [level, setLevel] = useState(null);

  const onChange = event => {
    const { value } = event.target;
    setLevel(value);
  };

  const onGameStart = () => navigate(level);

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <input
              className={styles.levelSelect}
              id="1"
              name="level"
              type="radio"
              value="/game/3"
              onChange={onChange}
            />
            <label className={styles.levelLink} htmlFor="1">
              1
            </label>
          </li>
          <li className={styles.level}>
            <input
              className={styles.levelSelect}
              id="2"
              name="level"
              type="radio"
              value="/game/6"
              onChange={onChange}
            />
            <label className={styles.levelLink} htmlFor="2">
              2
            </label>
          </li>
          <li className={styles.level}>
            <input
              className={styles.levelSelect}
              id="3"
              name="level"
              type="radio"
              value="/game/9"
              onChange={onChange}
            />
            <label className={styles.levelLink} htmlFor="3">
              3
            </label>
          </li>
        </ul>
        <section className={styles.gameControls}>
          <label className={styles.controlsDescription}>
            <input className={styles.controlsCheckbox} name="mode" type="checkbox" onClick={onCheckedMode} />
            <span className={styles.controlsCustomCheckbox}></span>
            Легкий режим (3 попытки)
          </label>
          <Button className={styles.controlsButton} onClick={onGameStart}>
            Старт
          </Button>
          <Link className={styles.controlsLeaderboardLink} to="/game/leaderboard">
            Перейти к лидерборду
          </Link>
        </section>
      </div>
    </div>
  );
}
