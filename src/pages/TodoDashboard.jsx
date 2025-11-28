import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import {
  Trash2,
  Plus,
  LogOut,
  CheckCircle2,
  Calendar,
  Clock,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast.js";
import Profile from "./Profile";

const API = "http://localhost:4000/api/todos";

const TodoDashboard = ({ onLogout }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newTodoCategory, setNewTodoCategory] = useState("general");
  const [newTodoPriority, setNewTodoPriority] = useState("medium");
  const [newTodoDueDate, setNewTodoDueDate] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { toast } = useToast();

  // ---------------------------------------------------------------
  // 1) LOAD TODOS FROM BACKEND (GET)
  // ---------------------------------------------------------------
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error loading todos:", err));
  }, []);

  // ---------------------------------------------------------------
  // 2) ADD TODO (POST)
  // ---------------------------------------------------------------
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todoData = {
      text: newTodo.trim(),
      category: newTodoCategory,
      priority: newTodoPriority,
      due_date: newTodoDueDate || null,
    };

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todoData),
      });

      const newItem = await response.json();
      setTodos([newItem, ...todos]);

      setNewTodo("");
      setNewTodoDueDate("");

      toast({
        title: "Task added!",
        description: `Your ${newTodoCategory} task has been added.`,
      });
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // ---------------------------------------------------------------
  // 3) TOGGLE TODO (PUT)
  // ---------------------------------------------------------------
  const toggleTodo = async (id) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !target.completed }),
      });

      const updated = await response.json();
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  // ---------------------------------------------------------------
  // 4) DELETE TODO (DELETE)
  // ---------------------------------------------------------------
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });

      setTodos(todos.filter((t) => t.id !== id));

      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      });
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ---------------------------------------------------------------
  // FILTERED LIST
  // ---------------------------------------------------------------
  const filteredTodos = todos.filter((todo) => {
    if (activeTab === "all") return true;
    if (activeTab === "daily") return todo.category === "daily";
    if (activeTab === "weekly") return todo.category === "weekly";
    if (activeTab === "pending") return !todo.completed;
    if (activeTab === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const dailyCount = todos.filter((t) => t.category === "daily").length;
  const weeklyCount = todos.filter((t) => t.category === "weekly").length;

  const formatDueDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (showProfile) {
    return (
      <Profile
        onBack={() => setShowProfile(false)}
        completedTasks={completedCount}
        totalTasks={totalCount}
      />
    );
  }

  // ---------------------------------------------------------------
  // UI STARTS HERE — unchanged
  // ---------------------------------------------------------------
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-background/40">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">My Tasks</h1>
            <p className="text-muted-foreground mt-1">
              {completedCount} of {totalCount} tasks completed
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowProfile(true)}
              className="hover:bg-white/10 p-2 rounded-full transition"
            >
              <Avatar className="w-10 h-10 ring-2 ring-primary/40">
                <AvatarImage src="./src/assets/Untitled design.png" />
                <AvatarFallback>GB</AvatarFallback>
              </Avatar>
            </Button>

            <Button variant="outline" size="sm" onClick={onLogout} className="rounded-lg">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Completed */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xl font-bold">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>

          {/* Remaining */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xl font-bold">{totalCount - completedCount}</p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
            </CardContent>
          </Card>

          {/* Daily */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xl font-bold">{dailyCount}</p>
                <p className="text-xs text-muted-foreground">Daily Tasks</p>
              </div>
            </CardContent>
          </Card>

          {/* Weekly */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-lg rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xl font-bold">{weeklyCount}</p>
                <p className="text-xs text-muted-foreground">Weekly Tasks</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Todo */}
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Add New Task</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={addTodo} className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="What needs to be done?"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" variant="gradient" className="gap-2 rounded-lg">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Category
                  </label>
                  <Select value={newTodoCategory} onValueChange={setNewTodoCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Priority
                  </label>
                  <Select value={newTodoPriority} onValueChange={setNewTodoPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Due Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={newTodoDueDate}
                    onChange={(e) => setNewTodoDueDate(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Todo List */}
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Your Tasks
            </CardTitle>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-muted/20 rounded-xl p-1">
                <TabsTrigger className="rounded-lg" value="all">
                  All
                </TabsTrigger>
                <TabsTrigger className="rounded-lg" value="daily">
                  Daily
                </TabsTrigger>
                <TabsTrigger className="rounded-lg" value="weekly">
                  Weekly
                </TabsTrigger>
                <TabsTrigger className="rounded-lg" value="pending">
                  Pending
                </TabsTrigger>
                <TabsTrigger className="rounded-lg" value="completed">
                  Completed
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-3">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground opacity-80">
                <CheckCircle2 className="w-14 h-14 mx-auto mb-4 opacity-50" />
                <p>No tasks here. Add one above!</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition-all"
                >
                  {/* Checkbox */}
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mt-1 scale-110"
                  />

                  {/* Text & info */}
                  <div className="flex-1 min-w-0">
                    <label
                      className={`cursor-pointer block ${
                        todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {todo.text}
                    </label>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        className={`text-xs px-2 py-0.5 rounded-md border-none ${getPriorityColor(
                          todo.priority
                        )} bg-opacity-20`}
                      >
                        {todo.priority}
                      </Badge>

                      <Badge variant="secondary" className="text-xs">
                        {todo.category}
                      </Badge>

                      {todo.due_date && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDueDate(todo.due_date)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delete */}
                  <div className="flex items-center gap-2">
                    {todo.completed && (
                      <Badge variant="secondary" className="text-xs">
                        Done
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TodoDashboard;
