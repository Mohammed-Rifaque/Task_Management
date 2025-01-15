import React, { useState } from "react";
import { Modal, TextField, Typography, ToggleButtonGroup, ToggleButton, MenuItem } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import useTaskStore from "../../../store/taskStore";
import { Close } from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateTaskModal: React.FC = () => {
  const { isModalOpen, closeModal, taskData, setTaskData } = useTaskStore();
  const [value, setValue] = useState<Dayjs | null>(null);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setStatus(event.target.value);
  };

  const options = [
    { value: "not-started", label: "Not Started" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" }
  ];
  if (!isModalOpen) return null;

  const handleCreate = () => {
    console.log({ ...taskData, dueDate: value });
    closeModal();
  };
  const handleCategoryChange = (event: React.MouseEvent<HTMLElement>, newCategory: string) => {
    if (newCategory !== null) {
      setCategory(newCategory);
    }
  };



  return (
    <Modal open={isModalOpen} onClose={closeModal} className="flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg  w-full max-w-lg" style={{ maxWidth: "800px", width: "90%" }}>
        <div className="flex justify-between p-4 border-b border-gray-300">
          <Typography variant="h6" className="text-center mb-4">
            Create Task
          </Typography>

          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <Close />
          </button>
        </div>

        <div className="flex flex-col p-4 gap-4">
          <TextField
            fullWidth
            placeholder="Task Title"
            variant="outlined"
            margin="normal"
            value={taskData.title}
            sx={{ backgroundColor: "#F1F1F1" }}
            onChange={(e) => setTaskData({ title: e.target.value })}
          />

          <ReactQuill
            theme="snow"
            value={taskData.description}
            onChange={(value) => setTaskData({ ...taskData, description: value })}
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

          <div className="flex justify-between items-center">
            <div className="flex flex-col mb-4 gap-4">
              <Typography variant="subtitle1">Task Category</Typography>
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
            </div>

            <div className="flex flex-col mb-4">
              <Typography variant="subtitle1" className="mb-2">
                Due Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Due Date"
                  value={value}
                  sx={{ backgroundColor: "#F1F1F1" }}
                  onChange={(newValue: Dayjs | null) => {
                    setValue(newValue);
                    setTaskData({ ...taskData, dueDate: newValue ? newValue.toISOString() : undefined });
                  }}
                />
              </LocalizationProvider>
            </div>

            <div className="flex flex-col mb-4 w-1/3">
              <Typography variant="subtitle1" className="mb-2">
                Task Status
              </Typography>
              <TextField
                value={status}
                onChange={handleChange}
                select
                fullWidth
                required
                sx={{
                  backgroundColor: "#F1F1F1"
                }}>
                <MenuItem value="" disabled>
                  <em>Choose </em>
                </MenuItem>
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <Typography className="mb-2">Attachment</Typography>
            <label className="border border-gray-300 bg-[#F1F1F1] rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition">
              <input
                type="file"
                className="hidden"
                onChange={(e) => setTaskData({ attachment: e.target.files ? e.target.files[0] : null })}
              />
              {taskData.attachment ? (
                <Typography variant="body2">{taskData.attachment.name}</Typography>
              ) : (
                <Typography variant="body2">Drop your files here or update</Typography>
              )}
            </label>
          </div>
        </div>
        <div className="flex justify-end mt-4 bg-[#F1F1F1] p-4 rounded-b-3xl">
          <button onClick={closeModal} className="bg-[#ffffff] border  text-black px-4 py-2 rounded-3xl mr-2">
            CANCEL
          </button>
          <button onClick={handleCreate} className="bg-[#7B1984] text-white px-4 py-2 rounded-3xl mr-2">
            CREATE
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default CreateTaskModal;
