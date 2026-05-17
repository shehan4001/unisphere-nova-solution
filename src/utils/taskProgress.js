export const markTaskVisited = (taskId) => {
  const today = new Date().toISOString().split("T")[0];

  const visitedTasks =
    JSON.parse(localStorage.getItem("visitedTasks")) || {};

  visitedTasks[taskId] = today;

  localStorage.setItem("visitedTasks", JSON.stringify(visitedTasks));
};

export const isTaskAvailableToday = (taskId) => {
  const today = new Date().toISOString().split("T")[0];

  const visitedTasks =
    JSON.parse(localStorage.getItem("visitedTasks")) || {};

  return visitedTasks[taskId] === today;
};