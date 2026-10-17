import { useMemo, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, CheckCheck, Circle, Plus, Sparkles, Trash2 } from 'lucide-react';

type TaskStatus = 'open' | 'done';
type TaskFilter = 'all' | TaskStatus;

interface Task {
  id: number;
  title: string;
  category: string;
  status: TaskStatus;
}

interface TaskRowProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const startingTasks: Task[] = [
  { id: 1, title: 'Make a little space for a good day', category: 'PERSONAL', status: 'done' },
  { id: 2, title: 'Pick the one thing that matters most', category: 'FOCUS', status: 'open' },
  { id: 3, title: 'Take a proper lunch break', category: 'WELLBEING', status: 'open' },
];

function filterItems<T>(items: readonly T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

function TaskRow({ task, onToggle, onDelete }: TaskRowProps) {
  const isDone = task.status === 'done';

  return (
    <li className={`task-row${isDone ? ' task-row--done' : ''}`}>
      <button
        className="task-check"
        type="button"
        aria-label={isDone ? `Mark ${task.title} as not done` : `Complete ${task.title}`}
        onClick={() => onToggle(task.id)}
      >
        {isDone ? <Check size={16} strokeWidth={2.5} /> : <Circle size={19} strokeWidth={1.6} />}
      </button>
      <div className="task-copy">
        <span className="task-title">{task.title}</span>
        <span className="task-category">{task.category}</span>
      </div>
      <button className="delete-button" type="button" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task.id)}>
        <Trash2 size={16} />
      </button>
    </li>
  );
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(startingTasks);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('PERSONAL');
  const completedCount = tasks.filter((task) => task.status === 'done').length;
  const visibleTasks = useMemo(
    () => filterItems(tasks, (task) => filter === 'all' || task.status === filter),
    [filter, tasks],
  );

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    setTasks((current) => [{ id: Date.now(), title: cleanTitle, category: category.trim().toUpperCase() || 'PERSONAL', status: 'open' }, ...current]);
    setTitle('');
  }

  function toggleTask(id: number) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, status: task.status === 'done' ? 'open' : 'done' } : task));
  }

  function deleteTask(id: number) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  const filters: { value: TaskFilter; label: string }[] = [
    { value: 'all', label: 'Everything' },
    { value: 'open', label: 'To do' },
    { value: 'done', label: 'Done' },
  ];

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Daymark home"><span className="brand-mark"><CheckCheck size={19} /></span>daymark<span className="brand-period">.</span></a>
        <a className="top-link" href="https://www.typescriptlang.org/docs/" target="_blank" rel="noreferrer">Made with TypeScript <ArrowUpRight size={14} /></a>
      </header>

      <section className="workspace" id="top">
        <div className="eyebrow"><span className="eyebrow-dot" /> YOUR CALM LITTLE PLANNER</div>
        <div className="intro-row">
          <div>
            <h1>A little more<br /><em>focus.</em></h1>
            <p className="subtitle">Make room for what matters. One small step at a time.</p>
          </div>
          <div className="progress-card">
            <span className="progress-icon"><Sparkles size={18} /></span>
            <span className="progress-label">TODAY'S PROGRESS</span>
            <strong>{completedCount}<span> / {tasks.length}</span></strong>
            <span className="progress-note">{completedCount === tasks.length && tasks.length > 0 ? 'Everything is wrapped up!' : 'small wins so far'}</span>
          </div>
        </div>

        <form className="add-form" onSubmit={addTask}>
          <label className="sr-only" htmlFor="new-task">What would you like to do?</label>
          <span className="form-plus"><Plus size={19} /></span>
          <input id="new-task" value={title} onChange={(event) => setTitle(event.currentTarget.value)} placeholder="What would you like to do?" maxLength={100} />
          <label className="sr-only" htmlFor="task-category">Task category</label>
          <select id="task-category" value={category} onChange={(event) => setCategory(event.currentTarget.value)}>
            <option>PERSONAL</option><option>FOCUS</option><option>WELLBEING</option><option>WORK</option>
          </select>
          <button className="add-button" type="submit" disabled={!title.trim()}>Add task <Plus size={16} /></button>
        </form>

        <div className="list-heading">
          <div><h2>Your list</h2><span className="task-count">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span></div>
          <div className="filters" role="group" aria-label="Filter tasks">
            {filters.map((item) => <button key={item.value} type="button" className={filter === item.value ? 'filter-button filter-button--active' : 'filter-button'} onClick={() => setFilter(item.value)}>{item.label}</button>)}
          </div>
        </div>

        <ul className="task-list">
          {visibleTasks.map((task) => <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />)}
        </ul>
        {visibleTasks.length === 0 && <div className="empty-state"><span className="empty-icon"><Check size={20} /></span><p>{tasks.length === 0 ? 'Your list is clear. Add a task to get started.' : 'Nothing in this view just yet.'}</p></div>}
        <footer className="list-footer"><span><span className="footer-sparkle">✳</span> Progress, not perfection.</span><span>{tasks.length - completedCount} left to do</span></footer>
      </section>
      <footer className="page-footer">A tiny tool for a more intentional day <span>·</span> Built for learning React + TypeScript</footer>
    </main>
  );
}