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

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTask, setEditTask] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "",
    projectId: "",
    assignedUserId: "",
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    message: "",
    userId: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    Promise.all([
      axios.get("http://localhost:8080/api/dashboard/stats"),
      axios.get("http://localhost:8080/api/tasks"),
      axios.get("http://localhost:8080/api/projects"),
      axios.get("http://localhost:8080/api/users"),
    ]).then(([statsRes, tasksRes, projectsRes, usersRes]) => {
      setStats(statsRes.data);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    });
  };

  const refreshTasksAndStats = () => {
    Promise.all([
      axios.get("http://localhost:8080/api/tasks"),
      axios.get("http://localhost:8080/api/dashboard/stats"),
    ]).then(([tasksRes, statsRes]) => {
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    });
  };

  const createTask = (e) => {
    e.preventDefault();

    if (
      !newTask.title ||
      !newTask.projectId ||
      !newTask.assignedUserId ||
      !newTask.priority
    ) {
      alert("Please fill in title, project, priority, and assigned user.");
      return;
    }

    axios.post("http://localhost:8080/api/tasks", newTask).then(() => {
      refreshTasksAndStats();

      setNewTask({
        title: "",
        description: "",
        status: "TODO",
        priority: "",
        projectId: "",
        assignedUserId: "",
      });
    });
  };

  const updateTaskStatus = (taskId, newStatus) => {
    axios
      .patch(
        `http://localhost:8080/api/tasks/${taskId}/status?status=${newStatus}`,
      )
      .then(() => {
        refreshTasksAndStats();
      });
  };

  const deleteTask = (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    axios.delete(`http://localhost:8080/api/tasks/${taskId}`).then(() => {
      refreshTasksAndStats();
    });
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);

    setEditTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      projectId: task.project?.id || "",
      assignedUserId: task.assignedUser?.id || "",
    });
  };

  const updateTask = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:8080/api/tasks/${editingTaskId}`, editTask)
      .then(() => {
        refreshTasksAndStats();
        setEditingTaskId(null);
      });
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);

    axios
      .get(`http://localhost:8080/api/tasks/${task.id}/comments`)
      .then((response) => {
        setComments(response.data);
      });
  };

  const addComment = (e) => {
    e.preventDefault();

    if (!newComment.message || !newComment.userId) {
      alert("Please write a comment and select a user.");
      return;
    }

    axios
      .post(
        `http://localhost:8080/api/tasks/${selectedTask.id}/comments`,
        newComment,
      )
      .then(() =>
        axios.get(
          `http://localhost:8080/api/tasks/${selectedTask.id}/comments`,
        ),
      )
      .then((response) => {
        setComments(response.data);
        setNewComment({
          message: "",
          userId: "",
        });
      });
  };

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

  const todoTasks = tasks.filter((task) => task.status === "TODO");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((task) => task.status === "DONE");

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
            setNewTask({ ...newTask, projectId: Number(e.target.value) })
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
          <option value="">Priority</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>

        <button type="submit">Create Task</button>
      </form>

      <h2 className="section-title">Task Board</h2>

      <div className="kanban-board">
        <TaskColumn
          title="TODO"
          tasks={todoTasks}
          getPriorityClass={getPriorityClass}
          updateTaskStatus={updateTaskStatus}
          startEditing={startEditing}
          openTaskDetails={openTaskDetails}
          deleteTask={deleteTask}
          nextButtonText="Start"
          nextStatus="IN_PROGRESS"
        />

        <TaskColumn
          title="IN PROGRESS"
          tasks={inProgressTasks}
          getPriorityClass={getPriorityClass}
          updateTaskStatus={updateTaskStatus}
          startEditing={startEditing}
          openTaskDetails={openTaskDetails}
          deleteTask={deleteTask}
          nextButtonText="Mark Done"
          nextStatus="DONE"
        />

        <TaskColumn
          title="DONE"
          tasks={doneTasks}
          getPriorityClass={getPriorityClass}
          updateTaskStatus={updateTaskStatus}
          startEditing={startEditing}
          openTaskDetails={openTaskDetails}
          deleteTask={deleteTask}
          nextButtonText="Reopen"
          nextStatus="TODO"
        />
      </div>

      {editingTaskId && (
        <div className="modal-overlay" onClick={() => setEditingTaskId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Task</h2>

            <form onSubmit={updateTask}>
              <input
                type="text"
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
              />

              <input
                type="text"
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({
                    ...editTask,
                    description: e.target.value,
                  })
                }
              />

              <select
                value={editTask.projectId}
                onChange={(e) =>
                  setEditTask({
                    ...editTask,
                    projectId: Number(e.target.value),
                  })
                }
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <select
                value={editTask.assignedUserId}
                onChange={(e) =>
                  setEditTask({
                    ...editTask,
                    assignedUserId: Number(e.target.value),
                  })
                }
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>

              <select
                value={editTask.priority}
                onChange={(e) =>
                  setEditTask({ ...editTask, priority: e.target.value })
                }
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>

              <div className="modal-buttons">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setEditingTaskId(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedTask.title}</h2>

            <p>{selectedTask.description}</p>
            <p>Project: {selectedTask.project?.name}</p>
            <p>Assigned: {selectedTask.assignedUser?.name}</p>
            <p>Priority: {selectedTask.priority}</p>
            <p>Status: {selectedTask.status}</p>

            <h3>Comments</h3>

            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div className="comment-card" key={comment.id}>
                  <p>{comment.message}</p>
                  <small>By: {comment.user?.name}</small>
                </div>
              ))
            )}

            <form className="comment-form" onSubmit={addComment}>
              <textarea
                placeholder="Write a comment..."
                value={newComment.message}
                onChange={(e) =>
                  setNewComment({
                    ...newComment,
                    message: e.target.value,
                  })
                }
              />

              <select
                value={newComment.userId}
                onChange={(e) =>
                  setNewComment({
                    ...newComment,
                    userId: Number(e.target.value),
                  })
                }
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>

              <button type="submit">Add Comment</button>
            </form>

            <button onClick={() => setSelectedTask(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskColumn({
  title,
  tasks,
  getPriorityClass,
  updateTaskStatus,
  startEditing,
  openTaskDetails,
  deleteTask,
  nextButtonText,
  nextStatus,
}) {
  return (
    <div className="column">
      <h2>
        {title} ({tasks.length})
      </h2>

      {tasks.map((task) => (
        <div className="task-card" key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Project: {task.project?.name}</p>
          <p className={getPriorityClass(task.priority)}>{task.priority}</p>
          <p>Assigned: {task.assignedUser?.name}</p>

          <button onClick={() => updateTaskStatus(task.id, nextStatus)}>
            {nextButtonText}
          </button>

          <button onClick={() => startEditing(task)}>Edit</button>

          <button onClick={() => openTaskDetails(task)}>View Details</button>

          <button className="delete-btn" onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
