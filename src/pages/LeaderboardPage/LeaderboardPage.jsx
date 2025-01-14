import styles from "./LeaderboardPage.module.css";
import { ReactComponent as ActiveHardMode } from "./images/active_hard_mode.svg";
import { ReactComponent as NoSuperPowers } from "./images/no_s_powers.svg";
import { ReactComponent as NoHardMode } from "./images/no_hard_mode.svg";
import { ReactComponent as ActiveSuperPowers } from "./images/active_s_powers.svg";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { useEffect, useState } from "react";
import { leaderboardApi } from "../../api";
import { format, addSeconds } from "date-fns";

export function LeaderboardPage() {
  const [load, setLoad] = useState(true);
  const loadMessage = (
    <tbody className={styles.loadMessage}>
      <tr>
        <td>Список загружается...</td>
      </tr>
    </tbody>
  );
  const [error, setError] = useState(null);
  const errorMessage = (
    <tbody className={styles.errorMessage}>
      <tr>
        <td>{error}</td>
      </tr>
    </tbody>
  );

  const formattedTime = seconds => {
    const helperDate = addSeconds(new Date(0), seconds);
    return format(helperDate, "mm:ss");
  };

  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    leaderboardApi
      .getLeaders()
      .then(leaders => setLeaders(leaders))
      .catch(error => setError(error.message))
      .finally(() => setLoad(false));
  }, [setLeaders]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Лидерборд</h1>
        <Link to="/">
          <Button>Начать игру</Button>
        </Link>
      </header>
      <table className={styles.leaderboardTable}>
        <thead className={styles.tableHeader}>
          <tr>
            <th>Позиция</th>
            <th>Пользователь</th>
            <th>Достижения</th>
            <th>Время</th>
          </tr>
        </thead>
        {error ? (
          errorMessage
        ) : load ? (
          loadMessage
        ) : (
          <tbody className={styles.tableLeaders}>
            {leaders
              .sort((a, b) => a.time - b.time)
              .map((leader, position) => (
                <tr key={leader.id}>
                  <td># {++position}</td>
                  <td>{leader.name}</td>
                  <td>{leader.achievements.includes(1) ? <ActiveHardMode /> : <NoHardMode />}</td>
                  <td>{leader.achievements.includes(2) ? <NoSuperPowers /> : <ActiveSuperPowers />}</td>
                  <td>{formattedTime(leader.time)}</td>
                </tr>
              ))
              .slice(0, 10)}
          </tbody>
        )}
      </table>
    </div>
  );
}
