import React, { useState } from "react";
import { Modal, TextField, Typography, ToggleButtonGroup, ToggleButton, MenuItem } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import useTaskStore from "../../../../store/useTaskStore";
import { Close } from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateTaskModal = () => {
  const { isCreateModalOpen, closeCreateModal, taskData, setTaskData, addTask } = useTaskStore();
  const [value, setValue] = useState<Dayjs | null>(null);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCategoryChange = (event: React.MouseEvent<HTMLElement>, newCategory: string) => {
    if (newCategory !== null) {
      setCategory(newCategory);
      setTaskData({ category: newCategory });
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    setTaskData({ status: newStatus });
  };

  const handleCreate = () => {
    setIsSubmitted(true);
  
    if (!taskData.title || !category || !status || !value) {
      return; 
    }
  
    const newTask = {
      ...taskData,
      id: Date.now(),
      dueDate: value ? value.toISOString() : "",
      category,
      status
    };
  
    // Log the new task to the console for debugging
    console.log("Creating New Task: ", newTask);
  
    // Add task to the store
    addTask(newTask);
  
    // Clear form and reset states
    setTaskData({
      title: "",
      description: "",
      category: "Work",
      dueDate: "",
      status: "",
      attachment: null
    });
    setValue(null);
    setCategory("");
    setStatus("");
    setIsSubmitted(false);
    closeCreateModal();
  };
  

  if (!isCreateModalOpen) return null;

  return (
    <Modal open={isCreateModalOpen} onClose={closeCreateModal} className="flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-lg" style={{ maxWidth: "900px", width: "90%" }}>
        <div className="flex justify-between items-center p-4 border-b border-gray-300 rounded-t-3xl bg-white sticky top-0 z-10">
          <Typography variant="h6" className="text-center mb-4">
            Create Task
          </Typography>
          <button onClick={closeCreateModal} className="text-gray-500 hover:text-gray-700">
            <Close />
          </button>
        </div>

        <div className="flex flex-col gap-4 py-2 px-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
          <div className="flex flex-col">
            <TextField
              fullWidth
              placeholder="Task Title"
              variant="outlined"
              margin="normal"
              value={taskData.title}
              onChange={(e) => setTaskData({ title: e.target.value })}
              sx={{
                backgroundColor: "#F1F1F1",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px"
                },
                "& .MuiInputBase-input": {
                  borderRadius: "8px"
                }
              }}
              error={isSubmitted && !taskData.title}
            />
            {isSubmitted && !taskData.title && <Typography color="error">Task Title is required</Typography>}
          </div>
          <div className="flex flex-col">
            <ReactQuill
              theme="snow"
              value={taskData.description}
              onChange={(value) => setTaskData({ description: value })}
              modules={{
                toolbar: [
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }]
                ]
              }}
              formats={["bold", "italic", "underline", "list", "bullet"]}
              style={{
                height: "150px",
                overflow: "hidden",
                backgroundColor: "#F1F1F1",
                borderRadius: "5px"
              }}
              placeholder="Description"
            />
            {isSubmitted && !taskData.description && <Typography color="error">Description is required</Typography>}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col mb-4 gap-4">
              <Typography variant="subtitle1">Task Category*</Typography>
              <ToggleButtonGroup
                value={category}
                exclusive
                onChange={handleCategoryChange}
                sx={{
                  "& .MuiToggleButton-root": {
                    borderRadius: "24px",
                    border: "1px solid #ccc",
                    textTransform: "none",
                    fontWeight: "bold",
                    padding: "6px 16px",
                    marginRight: "8px"
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#e0e0e0",
                    color: "#000",
                    border: "1px solid #999"
                  }
                }}>
                <ToggleButton value="Work">Work</ToggleButton>
                <ToggleButton value="Personal">Personal</ToggleButton>
              </ToggleButtonGroup>
              {isSubmitted && !category && <Typography color="error">Task Category is required</Typography>}
            </div>

            <div className="flex flex-col mb-4">
              <Typography variant="subtitle1" className="mb-2">
                Due Date*
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={value}
                  onChange={(newValue: Dayjs | null) => setValue(newValue)}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      InputLabelProps: { shrink: false },
                      sx: { backgroundColor: "#F1F1F1", borderRadius: "8px" }
                    }
                  }}
                />
              </LocalizationProvider>
              {isSubmitted && !value && <Typography color="error">Due Date is required</Typography>}
            </div>

            <div className="flex flex-col mb-4 w-1/3">
              <Typography variant="subtitle1" className="mb-2">
                Task Status*
              </Typography>
              <TextField
                value={status}
                onChange={handleStatusChange}
                select
                fullWidth
                required
                sx={{
                  backgroundColor: "#F1F1F1",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px"
                  },
                  "& .MuiInputBase-input": {
                    borderRadius: "8px"
                  }
                }}
                error={isSubmitted && !taskData.status}>
                <MenuItem value="" disabled>
                  <em>Choose</em>
                </MenuItem>
                <MenuItem value="TO-DO">TO-DO</MenuItem>
                <MenuItem value="IN-PROGRESS">IN-PROGRESS</MenuItem>
                <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              </TextField>
              {isSubmitted && !status && <Typography color="error">Task Status is required</Typography>}
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <Typography className="mb-2">Attachment</Typography>
            <label className="border border-gray-300 bg-[#F1F1F1] rounded-lg p-4 text-center cursor-pointer hover:border-blue-600 transition">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  if (file) {
                    setTaskData({ attachment: file });
                  }
                }}
              />
              {taskData.attachment ? (
                <Typography variant="body2">{taskData.attachment.name}</Typography>
              ) : (
                <Typography variant="body2">Drop your files here to upload</Typography>
              )}
            </label>
            {isSubmitted && !taskData.attachment && <Typography color="error">Attachment is required</Typography>}

            {taskData.attachment && taskData.attachment.type.startsWith("image/") && (
              <div className="mt-4 h-1/3">
                <img
                  src={URL.createObjectURL(taskData.attachment)}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "8px",
                    objectFit: "cover"
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end bg-[#F1F1F1] p-4 rounded-b-3xl sticky bottom-0 z-10">
          <button onClick={closeCreateModal} className="bg-[#ffffff] border text-black text-sm font-medium px-7 py-3 rounded-3xl mr-2">
            CANCEL
          </button>
          <button onClick={handleCreate} className="bg-[#7B1984] text-white text-sm font-medium px-7 py-3 rounded-3xl mr-2">
            CREATE
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateTaskModal;
