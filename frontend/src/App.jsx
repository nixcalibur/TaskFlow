import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:8080/api";

function App() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const [searchText, setSearchText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [activePage, setActivePage] = useState("tasks");
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "DEVELOPER",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    Promise.all([
      axios.get(`${API_URL}/dashboard/stats`),
      axios.get(`${API_URL}/tasks`),
      axios.get(`${API_URL}/projects`),
      axios.get(`${API_URL}/users`),
    ]).then(([statsRes, tasksRes, projectsRes, usersRes]) => {
      setStats(statsRes.data);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    });
  };

  const refreshTasksAndStats = () => {
    Promise.all([
      axios.get(`${API_URL}/tasks`),
      axios.get(`${API_URL}/dashboard/stats`),
    ]).then(([tasksRes, statsRes]) => {
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    });
  };

  const resetNewTask = () => {
    setNewTask({
      title: "",
      description: "",
      status: "TODO",
      priority: "",
      projectId: "",
      assignedUserId: "",
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

    axios.post(`${API_URL}/tasks`, newTask).then(() => {
      refreshTasksAndStats();
      resetNewTask();
      setShowCreateModal(false);
    });
  };

  const updateTaskStatus = (taskId, newStatus) => {
    axios
      .patch(`${API_URL}/tasks/${taskId}/status?status=${newStatus}`)
      .then(refreshTasksAndStats);
  };

  const deleteTask = (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    axios.delete(`${API_URL}/tasks/${taskId}`).then(refreshTasksAndStats);
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

    axios.put(`${API_URL}/tasks/${editingTaskId}`, editTask).then(() => {
      refreshTasksAndStats();
      setEditingTaskId(null);
    });
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);

    axios.get(`${API_URL}/tasks/${task.id}/comments`).then((response) => {
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
      .post(`${API_URL}/tasks/${selectedTask.id}/comments`, newComment)
      .then(() => axios.get(`${API_URL}/tasks/${selectedTask.id}/comments`))
      .then((response) => {
        setComments(response.data);
        setNewComment({
          message: "",
          userId: "",
        });
      });
  };
  const createProject = (e) => {
    e.preventDefault();

    if (!newProject.name) {
      alert("Please enter a project name.");
      return;
    }

    axios.post(`${API_URL}/projects`, newProject).then(() => {
      axios.get(`${API_URL}/projects`).then((response) => {
        setProjects(response.data);
        setNewProject({
          name: "",
          description: "",
        });
      });
    });
  };

  const deleteProject = (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) return;

    axios.delete(`${API_URL}/projects/${projectId}`).then(() => {
      axios.get(`${API_URL}/projects`).then((response) => {
        setProjects(response.data);
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
      default:
        return "";
    }
  };

  const createUser = (e) => {
    e.preventDefault();

    axios.post(`${API_URL}/users`, newUser).then(() => {
      axios.get(`${API_URL}/users`).then((response) => {
        setUsers(response.data);

        setNewUser({
          name: "",
          email: "",
          role: "DEVELOPER",
        });
      });
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const title = task.title?.toLowerCase() || "";
    const description = task.description?.toLowerCase() || "";
    const search = searchText.toLowerCase();

    const matchesSearch =
      title.includes(search) || description.includes(search);
    const matchesPriority =
      priorityFilter === "" || task.priority === priorityFilter;
    const matchesProject =
      projectFilter === "" || task.project?.id === Number(projectFilter);
    const matchesUser =
      userFilter === "" || task.assignedUser?.id === Number(userFilter);

    return matchesSearch && matchesPriority && matchesProject && matchesUser;
  });

  const todoTasks = filteredTasks.filter((task) => task.status === "TODO");
  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "IN_PROGRESS",
  );
  const doneTasks = filteredTasks.filter((task) => task.status === "DONE");

  if (!stats) {
    return <p className="loading">Loading dashboard...</p>;
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>TaskFlow</h1>
          <p>Mini Project Management System</p>
        </div>

        <div className="topbar-actions">
          <button
            className={
              activePage === "tasks"
                ? "secondary-btn active-btn"
                : "secondary-btn"
            }
            onClick={() => setActivePage("tasks")}
          >
            Tasks
          </button>

          <button
            className={
              activePage === "projects"
                ? "secondary-btn active-btn"
                : "secondary-btn"
            }
            onClick={() => setActivePage("projects")}
          >
            Projects
          </button>

          <button
            className={
              activePage === "users"
                ? "secondary-btn active-btn"
                : "secondary-btn"
            }
            onClick={() => setActivePage("users")}
          >
            Users
          </button>

          {activePage === "tasks" && (
            <button
              className="primary-btn"
              onClick={() => setShowCreateModal(true)}
            >
              + New Task
            </button>
          )}
        </div>
      </header>

      {activePage === "tasks" && (
        <>
          <section className="summary-bar">
            <div className="summary-pill">
              <span className="value">{stats.totalTasks}</span>
              <span className="label">Tasks</span>
            </div>

            <div className="summary-pill">
              <span className="value">{stats.todoTasks}</span>
              <span className="label">TODO</span>
            </div>

            <div className="summary-pill">
              <span className="value">{stats.inProgressTasks}</span>
              <span className="label">In Progress</span>
            </div>

            <div className="summary-pill">
              <span className="value">{stats.doneTasks}</span>
              <span className="label">Done</span>
            </div>

            <div className="summary-pill priority">
              <span className="value">{stats.highPriorityTasks}</span>
              <span className="label">High Priority</span>
            </div>
          </section>

          <section className="filter-bar">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>

            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setSearchText("");
                setPriorityFilter("");
                setProjectFilter("");
                setUserFilter("");
              }}
            >
              Clear
            </button>
          </section>

          <main className="kanban-board">
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
          </main>
        </>
      )}

      {activePage === "projects" && (
        <section className="projects-page">
          <div className="page-header">
            <h2>Projects</h2>
            <p>Manage projects used by your tasks.</p>
          </div>

          <form className="project-form" onSubmit={createProject}>
            <input
              type="text"
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Project description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  description: e.target.value,
                })
              }
            />

            <button type="submit">Create Project</button>
          </form>

          <div className="project-grid">
            {projects.map((project) => (
              <div className="project-card" key={project.id}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>

                <button
                  className="danger-btn"
                  onClick={() => deleteProject(project.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activePage === "users" && (
        <section className="users-page">
          <div className="page-header">
            <h2>Users</h2>
            <p>Manage team members.</p>
          </div>

          <form className="project-form" onSubmit={createUser}>
            <input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  email: e.target.value,
                })
              }
            />

            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  role: e.target.value,
                })
              }
            >
              <option value="DEVELOPER">Developer</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>

            <button>Create User</button>
          </form>

          <div className="project-grid">
            {users.map((user) => (
              <div className="project-card" key={user.id}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p>{user.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {showCreateModal && (
        <TaskFormModal
          title="Create Task"
          task={newTask}
          setTask={setNewTask}
          projects={projects}
          users={users}
          onSubmit={createTask}
          onClose={() => {
            setShowCreateModal(false);
            resetNewTask();
          }}
          submitLabel="Create Task"
        />
      )}

      {editingTaskId && (
        <TaskFormModal
          title="Edit Task"
          task={editTask}
          setTask={setEditTask}
          projects={projects}
          users={users}
          onSubmit={updateTask}
          onClose={() => setEditingTaskId(null)}
          submitLabel="Save Changes"
        />
      )}

      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div
            className="modal details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedTask.title}</h2>

            <p>{selectedTask.description}</p>

            <div className="details-grid">
              <span>Project</span>
              <strong>{selectedTask.project?.name}</strong>

              <span>Assigned</span>
              <strong>{selectedTask.assignedUser?.name}</strong>

              <span>Priority</span>
              <strong>{selectedTask.priority}</strong>

              <span>Status</span>
              <strong>{selectedTask.status}</strong>
            </div>

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

            <button
              className="secondary-btn"
              onClick={() => setSelectedTask(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskFormModal({
  title,
  task,
  setTask,
  projects,
  users,
  onSubmit,
  onClose,
  submitLabel,
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Task title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />

          <input
            type="text"
            placeholder="Description"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />

          <select
            value={task.projectId}
            onChange={(e) =>
              setTask({ ...task, projectId: Number(e.target.value) })
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
            value={task.assignedUserId}
            onChange={(e) =>
              setTask({ ...task, assignedUserId: Number(e.target.value) })
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
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
          >
            <option value="">Priority</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          <div className="modal-buttons">
            <button type="submit">{submitLabel}</button>
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
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
    <section className="column">
      <div className="column-header">
        <h2>{title}</h2>
        <span>{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="empty-text">No tasks</p>
      ) : (
        tasks.map((task) => (
          <div className="task-card" key={task.id}>
            <div className="task-card-header">
              <h3>{task.title}</h3>
              <span className={getPriorityClass(task.priority)}>
                {task.priority}
              </span>
            </div>

            <p>{task.description}</p>

            <div className="task-meta">
              <span>{task.project?.name}</span>
              <span>{task.assignedUser?.name}</span>
            </div>

            <div className="task-actions">
              <button onClick={() => updateTaskStatus(task.id, nextStatus)}>
                {nextButtonText}
              </button>

              <button
                className="secondary-btn"
                onClick={() => startEditing(task)}
              >
                Edit
              </button>

              <button
                className="secondary-btn"
                onClick={() => openTaskDetails(task)}
              >
                Details
              </button>

              <button
                className="danger-btn"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default App;
