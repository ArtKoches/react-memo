// const baseHost = "https://wedev-api.sky.pro/api/leaderboard";
const newBaseHost = "https://wedev-api.sky.pro/api/v2/leaderboard";

export const leaderboardApi = {
  getLeaders: async function getLeadersList() {
    try {
      const response = await fetch(newBaseHost, {
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
      const response = await fetch(newBaseHost, {
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
