const baseHost = "https://wedev-api.sky.pro/api/leaderboard";

export const leaderboardApi = {
  getLeaders: async function getLeadersList() {
    try {
      const response = await fetch(baseHost, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Ошибка сервера");
      }

      const data = await response.json();
      return data.leaders;
    } catch (error) {
      if (error.message === "Failed to fetch") {
        throw new Error("Проверьте интернет соединение");
      }

      throw new Error(error.message);
    }
  },

  addLeader: async function postNewLeader({ leader }) {
    try {
      const response = await fetch(baseHost, {
        method: "POST",
        body: JSON.stringify(leader),
      });

      if (!response.ok) {
        throw new Error("Ошибка сервера");
      }

      const data = await response.json();
      return data.leaders;
    } catch (error) {
      if (error.message === "Failed to fetch") {
        throw new Error("Проверьте интернет соединение");
      }

      throw new Error(error.message);
    }
  },
};
