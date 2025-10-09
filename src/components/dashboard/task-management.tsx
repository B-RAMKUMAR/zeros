"use client";

import { useState } from "react";
import type { Task, Submission, User } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, MoreHorizontal, Download, Edit, Trash2, Loader2, View } from "lucide-react";
import { format } from "date-fns";
import { createTaskAction, updateTaskAction, deleteTaskAction } from "@/lib/task-actions";
import { useToast } from "@/hooks/use-toast";
import DatePicker from "./date-picker";

export default function TaskManagement({ 
  initialTasks,
  allSubmissions,
  apprentices,
}: { 
  initialTasks: Task[];
  allSubmissions: Submission[];
  apprentices: User[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isSubmissionsOpen, setSubmissionsOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { toast } = useToast();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [title, setTitle] = useState("");
  const [phase, setPhase] = useState("");
  const [description, setDescription] = useState("");
  const [objective, setObjective] = useState("");
  const [status, setStatus] = useState<Task["status"]>("Not Started");
  const [eta, setEta] = useState<Date>();
  const [assigneeId, setAssigneeId] = useState<number | undefined>();

  const resetForm = () => {
    setTitle("");
    setPhase("");
    setDescription("");
    setObjective("");
    setStatus("Not Started");
    setEta(undefined);
    setAssigneeId(undefined);
    setSelectedTask(null);
  };

  const handleCreateClick = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setPhase(task.phase);
    setDescription(task.description);
    setObjective(task.objective);
    setStatus(task.status);
    setEta(new Date(task.eta));
    setAssigneeId(task.assigneeId);
    setEditDialogOpen(true);
  };
  
  const handleDeleteTrigger = (task: Task) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
  };
  
  const handleViewSubmissions = (task: Task) => {
    setSelectedTask(task);
    setSubmissionsOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!title || !phase || !eta || !description || !objective || !assigneeId) {
        toast({
          variant: "destructive",
          title: "Missing Fields",
          description: "Please fill out all required fields, including assignee.",
        });
        return;
    }
    
    setIsPending(true);

    const taskData: Task = {
        id: selectedTask ? selectedTask.id : Date.now(),
        title,
        phase,
        objective,
        description,
        status,
        eta: eta.toISOString(),
        assigneeId: assigneeId,
        submissionCount: selectedTask?.submissionCount || 0,
    };

    try {
      if (selectedTask) { // Updating
          await updateTaskAction(taskData);
          setTasks(tasks.map(t => t.id === selectedTask.id ? taskData : t));
          toast({ title: "Task Updated", description: `"${title}" has been successfully updated.` });
          setEditDialogOpen(false);
      } else { // Creating
          await createTaskAction(taskData);
          setTasks(prevTasks => [...prevTasks, {...taskData, id: taskData.id}]);
          toast({ title: "Task Created", description: `"${title}" has been successfully published.` });
          setCreateDialogOpen(false);
      }
    } catch (error) {
       toast({
          variant: "destructive",
          title: "An Error Occurred",
          description: "Failed to save the task. Please try again.",
        });
    }

    setIsPending(false);
    resetForm();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTask) return;
    
    setIsPending(true);

    try {
        await deleteTaskAction(selectedTask.id);
        setTasks(tasks.filter(t => t.id !== selectedTask.id));
        toast({ title: "Task Deleted", description: `"${selectedTask.title}" has been deleted.` });
    } catch (error) {
        toast({
          variant: "destructive",
          title: "An Error Occurred",
          description: "Failed to delete the task. Please try again.",
        });
    }
    setIsPending(false);
    setDeleteDialogOpen(false);
    setSelectedTask(null);
  };

  const TaskForm = (
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Task Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" placeholder="e.g., D3-T1: Final Model Deployment"/>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phase" className="text-right">Phase</Label>
            <Input id="phase" value={phase} onChange={(e) => setPhase(e.target.value)} className="col-span-3" placeholder="Phase 3: Ownership"/>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="objective" className="text-right">Objective</Label>
            <Input id="objective" value={objective} onChange={(e) => setObjective(e.target.value)} className="col-span-3" placeholder="Task's main goal"/>
        </div>
         <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" placeholder="Detailed task description"/>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignee" className="text-right">Assignee</Label>
             <Select onValueChange={(value) => setAssigneeId(Number(value))} value={assigneeId?.toString()}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an Apprentice" />
                </SelectTrigger>
                <SelectContent>
                    {apprentices.map(apprentice => (
                        <SelectItem key={apprentice.id} value={apprentice.id.toString()}>{apprentice.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select onValueChange={(value: Task["status"]) => setStatus(value)} value={status}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Scored">Scored</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="eta" className="text-right">Deadline (ETA)</Label>
            <DatePicker date={eta} setDate={setEta} />
        </div>
    </div>
  );

  const SubmissionsForTask = selectedTask ? allSubmissions.filter(s => s.taskId === selectedTask.id) : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {/* CREATE DIALOG */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateClick}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Fill in the details below to create and publish a new task.
              </DialogDescription>
            </DialogHeader>
            {TaskForm}
            <DialogFooter>
               <Button onClick={() => setCreateDialogOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={handleFormSubmit} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publish Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* EDIT DIALOG */}
        <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>
                        Update the details for this task.
                    </DialogDescription>
                </DialogHeader>
                {TaskForm}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleFormSubmit} disabled={isPending}>
                       {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                       Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        {/* SUBMISSIONS DIALOG */}
        <Dialog open={isSubmissionsOpen} onOpenChange={setSubmissionsOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Submissions for "{selectedTask?.title}"</DialogTitle>
                    <DialogDescription>
                       Review all deliverables submitted for this task.
                    </DialogDescription>
                </DialogHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Apprentice</TableHead>
                            <TableHead>Submitted At</TableHead>
                            <TableHead className="text-right">Deliverable</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {SubmissionsForTask.length > 0 ? SubmissionsForTask.map(sub => (
                            <TableRow key={sub.id}>
                                <TableCell>{sub.assigneeName}</TableCell>
                                <TableCell>{format(new Date(sub.submittedAt), "PPpp")}</TableCell>
                                <TableCell className="text-right">
                                     <Button asChild variant="outline" size="sm">
                                        <a href={sub.fileUrl} download>
                                            <Download className="mr-2 h-4 w-4" />
                                            View File
                                        </a>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">No submissions yet for this task.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>

        {/* DELETE ALERT DIALOG */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the task
                      "{selectedTask?.title}".
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setSelectedTask(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm} disabled={isPending}>
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Continue
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Table>
          <TableHeader>
          <TableRow>
              <TableHead>Task Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Deadline (ETA)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
          {tasks.length > 0 ? tasks.map((task) => {
              const assignee = apprentices.find(a => a.id === task.assigneeId);
              return (
              <TableRow key={task.id}>
              <TableCell className="font-medium">
                <div>{task.title}</div>
                <div className="text-xs text-muted-foreground">{assignee ? assignee.name : 'Unassigned'}</div>
              </TableCell>
              <TableCell>
                  <Badge variant={task.status === "Overdue" ? "destructive" : "outline"}>
                  {task.status}
                  </Badge>
              </TableCell>
              <TableCell>{task.submissionCount || 0}</TableCell>
              <TableCell>{format(new Date(task.eta), "PPp")}</TableCell>
              <TableCell className="text-right">
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Task Actions</span>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewSubmissions(task)}>
                              <View className="mr-2 h-4 w-4" />
                              View Submissions
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClick(task)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Task
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteTrigger(task)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Task
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              </TableCell>
              </TableRow>
          )
          }) : (
              <TableRow>
              <TableCell colSpan={5} className="text-center">
                  No tasks have been created yet.
              </TableCell>
              </TableRow>
          )}
          </TableBody>
      </Table>
    </div>
  );
}
