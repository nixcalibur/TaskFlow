import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "",
    projectId: "",
    assignedUserId: "",
  });

  useEffect(() => {
    axios.get("http://localhost:8080/api/dashboard/stats").then((response) => {
      setStats(response.data);
    });

    axios.get("http://localhost:8080/api/tasks").then((response) => {
      setTasks(response.data);
    });

    axios.get("http://localhost:8080/api/projects").then((response) => {
      setProjects(response.data);
    });

    axios.get("http://localhost:8080/api/users").then((response) => {
      setUsers(response.data);
    });
  }, []);

  const updateTaskStatus = (taskId, newStatus) => {
    axios
      .patch(
        `http://localhost:8080/api/tasks/${taskId}/status?status=${newStatus}`,
      )
      .then(() => axios.get("http://localhost:8080/api/tasks"))
      .then((response) => {
        setTasks(response.data);
      });
  };

  const createTask = (e) => {
    e.preventDefault();

    if (!newTask.title || !newTask.projectId || !newTask.assignedUserId) {
      alert("Please fill in title, project, and assigned user.");
      return;
    }

    axios
      .post("http://localhost:8080/api/tasks", newTask)
      .then(() => axios.get("http://localhost:8080/api/tasks"))
      .then((response) => {
        setTasks(response.data);
        setNewTask({
          title: "",
          description: "",
          status: "TODO",
          priority: "",
          projectId: 1,
          assignedUserId: 1,
        });
      });
  };

  const todoTasks = tasks.filter((task) => task.status === "TODO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((task) => task.status === "DONE");
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "LOW":
        return "priority-low";
      case "MEDIUM":
        return "priority-medium";
      case "HIGH":
        return "priority-high";
      case "CRITICAL":
        return "priority-critical";
      default:
        return "";
    }
  };

  if (!stats) {
    return <p>Loading dashboard...</p>;
  }

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

      <h2 className="section-title">Create Task</h2>
      <form className="task-form" onSubmit={createTask}>
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />

        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <select
          value={newTask.projectId}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              projectId: Number(e.target.value),
            })
          }
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <select
          value={newTask.assignedUserId}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              assignedUserId: Number(e.target.value),
            })
          }
        >
          <option value="">Assign User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>

        <button type="submit">Create Task</button>
      </form>

      <h2 className="section-title">Task Board</h2>

      <div className="kanban-board">
        <div className="column">
          <h2>TODO ({todoTasks.length})</h2>
          {todoTasks.map((task) => (
            <div className="task-card" key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Project: {task.project?.name}</p>
              <p className={getPriorityClass(task.priority)}>{task.priority}</p>
              <p>Assigned: {task.assignedUser?.name}</p>
              <button onClick={() => updateTaskStatus(task.id, "IN_PROGRESS")}>
                Start
              </button>
            </div>
          ))}
        </div>

        <div className="column">
          <h2>IN PROGRESS ({inProgressTasks.length})</h2>
          {inProgressTasks.map((task) => (
            <div className="task-card" key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p className={getPriorityClass(task.priority)}>{task.priority}</p>
              <p>Assigned: {task.assignedUser?.name}</p>
              <button onClick={() => updateTaskStatus(task.id, "DONE")}>
                Mark Done
              </button>
            </div>
          ))}
        </div>

        <div className="column">
          <h2>DONE ({doneTasks.length})</h2>
          {doneTasks.map((task) => (
            <div className="task-card" key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p className={getPriorityClass(task.priority)}>{task.priority}</p>
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
