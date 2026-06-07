import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/dashboard/stats")
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard stats:", error);
      });

    axios
      .get("http://localhost:8080/api/tasks")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  if (!stats) {
    return <p>Loading dashboard...</p>;
  }

  const updateTaskStatus = (taskId, newStatus) => {
    axios
      .patch(
        `http://localhost:8080/api/tasks/${taskId}/status?status=${newStatus}`,
      )
      .then(() => {
        return axios.get("http://localhost:8080/api/tasks");
      })
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error updating task status:", error);
      });
  };

  const todoTasks = tasks.filter((task) => task.status === "TODO");

  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");

  const doneTasks = tasks.filter((task) => task.status === "DONE");

  return (
    <div className="app">
      <h1>TaskFlow Dashboard</h1>
      <p>Mini Jira-style project management system</p>

      <div className="stats-grid">
        <div className="card">
          <h2>{stats.totalTasks}</h2>
          <p>Total Tasks</p>
        </div>

        <div className="card">
          <h2>{stats.todoTasks}</h2>
          <p>TODO</p>
        </div>

        <div className="card">
          <h2>{stats.inProgressTasks}</h2>
          <p>In Progress</p>
        </div>

        <div className="card">
          <h2>{stats.doneTasks}</h2>
          <p>Done</p>
        </div>

        <div className="card">
          <h2>{stats.highPriorityTasks}</h2>
          <p>High Priority</p>
        </div>
      </div>

      <h2 className="section-title">Task Board</h2>

      <div className="kanban-board">
        <div className="column">
          <h2>TODO</h2>
          {todoTasks.map((task) => (
            <div className="task-card" key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Priority: {task.priority}</p>
              <p>Assigned: {task.assignedUser?.name}</p>
              <button onClick={() => updateTaskStatus(task.id, "IN_PROGRESS")}>
                Start
              </button>
            </div>
          ))}
        </div>

        <div className="column">
          <h2>IN PROGRESS</h2>
          {inProgressTasks.map((task) => (
            <div className="task-card" key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Priority: {task.priority}</p>
              <p>Assigned: {task.assignedUser?.name}</p>
              <button onClick={() => updateTaskStatus(task.id, "DONE")}>
                Mark Done
              </button>
            </div>
          ))}
        </div>

        <div className="column">
          <h2>DONE</h2>
          {doneTasks.map((task) => (
            <div className="task-card" key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Priority: {task.priority}</p>
              <p>Assigned: {task.assignedUser?.name}</p>
              <button onClick={() => updateTaskStatus(task.id, "TODO")}>
                Reopen
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
