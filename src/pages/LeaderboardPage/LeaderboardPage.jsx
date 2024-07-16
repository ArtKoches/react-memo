import styles from "./LeaderboardPage.module.css";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { useEffect, useState } from "react";
import { leaderboardApi } from "../../api";
import { format, addSeconds } from "date-fns";

export function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    leaderboardApi
      .getLeaders()
      .then(leaders => leaders.sort((a, b) => a.time - b.time))
      .then(leaders => setLeaders(leaders))
      .catch(error => error.message);
  }, []);

  const formattedTime = seconds => {
    const helperDate = addSeconds(new Date(0), seconds);
    return format(helperDate, "mm:ss");
  };

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
            <th>Время</th>
          </tr>
        </thead>
        <tbody className={styles.tableLeaders}>
          {leaders
            .map((leader, position) => (
              <tr key={leader.id}>
                <td># {++position}</td>
                <td>{leader.name}</td>
                <td>{formattedTime(leader.time)}</td>
              </tr>
            ))
            .slice(0, 10)}
        </tbody>
      </table>
    </div>
  );
}
