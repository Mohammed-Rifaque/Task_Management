import React, { useState, useEffect } from "react";
import { Modal, TextField, Typography, ToggleButtonGroup, ToggleButton, MenuItem } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Close } from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useTaskStore from "../../../../store/useTaskStore";

const EditTaskModal = () => {
  const { isEditModalOpen, closeEditModal, taskData, setTaskData, updateTask } = useTaskStore();
  const [value, setValue] = useState<Dayjs | null>(null);
  const [category, setCategory] = useState(taskData?.category || "");
  const [status, setStatus] = useState(taskData?.status || "");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (taskData) {
      setValue(taskData.dueDate ? dayjs(taskData.dueDate) : null);
      setCategory(taskData.category || "");
      setStatus(taskData.status || "");
    }
  }, [taskData]);

  const handleSave = () => {
    setIsSubmitted(true);

    if (!taskData.title || !category || !status || !value) {
      return;
    }

    const updatedTask = {
      ...taskData,
      dueDate: value ? value.toISOString() : "",
      category,
      status
    };

    updateTask(updatedTask);
    closeEditModal();
  };

  if (!isEditModalOpen) return null;

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    };

    return date.toLocaleString("en-US", options).toLowerCase().replace(",", "");
  }

  return (
    <Modal open={isEditModalOpen} onClose={closeEditModal} className="flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-4xl" style={{ maxWidth: "1100px", width: "90%" }}>
      <div className="flex justify-between items-center p-4 border-b border-gray-300 rounded-t-3xl bg-white sticky top-0 z-10">
      <Typography variant="h6">Edit Task</Typography>
          <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
            <Close />
          </button>
        </div>

        <div className="flex gap-6 pl-6 pt-4">
          <div className="flex flex-col w-2/3 gap-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
            <TextField
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              fullWidth
              placeholder="Task Title"
              variant="outlined"
              margin="normal"
              value={taskData.title}
              disabled
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
            />

            <div>
              <Typography variant="subtitle1" className="mb-2">
                Description
              </Typography>
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
              {isSubmitted && !taskData.description && <Typography color="error">Description is required</Typography>}
            </div>
            <div className="flex justify-between">
              <div>
                <Typography variant="subtitle1" className="mb-2">
                  Task Category*
                </Typography>

                <ToggleButtonGroup
                  value={category}
                  exclusive
                  onChange={(e, newCategory) => setCategory(newCategory)}
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
                {isSubmitted && !category && <Typography color="error">Category is required</Typography>}
              </div>
              <div>
                <Typography variant="subtitle1" className="mb-2">
                  Due Date*
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { backgroundColor: "#f9f9f9", borderRadius: "8px" }
                      }
                    }}
                  />
                </LocalizationProvider>
                {isSubmitted && !value && <Typography color="error">Due Date is required</Typography>}
              </div>

              <div className="w-1/3">
                <Typography variant="subtitle1" className="mb-2">
                  Task Status*
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px"
                  }}
                  error={isSubmitted && !status}
                  helperText={isSubmitted && !status ? "Task Status is required" : ""}>
                  <MenuItem value="" disabled>
                    Select Status
                  </MenuItem>
                  <MenuItem value="TO-DO">TO-DO</MenuItem>
                  <MenuItem value="IN-PROGRESS">IN-PROGRESS</MenuItem>
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                </TextField>
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
                  <Typography variant="body2">Drop your files here or update</Typography>
                )}
              </label>

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
          <div className="flex flex-col w-1/3 gap-4 bg-[#F1F1F1]">
            <div className="bg-white border-b-2 px-4 py-2 pt-0">
              <Typography variant="h6" color="gray">
                Activity
              </Typography>
            </div>

            <div className="px-5 pr-6">
              <table className="w-full px-3 py-1">
                <tbody>
                  <tr className="w-full">
                    <td className="w-3/5 py-2">
                      <Typography variant="body2" className="text-gray-700 font-medium">
                        You created this task
                      </Typography>
                    </td>
                    <td className="w-2/5 py-2 text-end">
                      <Typography variant="body2" className="text-gray-700 font-medium">
                        {formatDate(taskData.dueDate)}
                      </Typography>
                    </td>
                  </tr>

                  <tr className="w-full">
                    <td className="w-3/5 py-2">
                      <Typography variant="body2" className="text-gray-700 font-medium">
                        You changed status from in progress to complete
                      </Typography>
                    </td>
                    <td className="w-2/5 py-2 text-end">
                      <Typography variant="body2" className="text-gray-700 font-medium">
                        {formatDate(taskData.dueDate)}
                      </Typography>
                    </td>
                  </tr>

                  <tr className="w-full">
                    <td className="w-3/5 py-2">
                      <Typography variant="body2" className="text-gray-700 font-medium">
                        You uploaded a file
                      </Typography>
                    </td>
                    <td className="w-2/5 py-2 text-end">
                      <Typography variant="body2" className="text-gray-700 font-medium">
                        {formatDate(taskData.dueDate)}
                      </Typography>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end bg-[#F1F1F1] p-4 rounded-b-3xl sticky bottom-0 z-10">
          <button onClick={closeEditModal} className="bg-[#ffffff] border text-black text-sm font-medium px-7 py-3 rounded-3xl mr-2">
            CANCEL
          </button>
          <button onClick={handleSave} className="bg-[#7B1984] text-white text-sm font-medium px-7 py-3 rounded-3xl mr-2">
            UPDATE
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditTaskModal;
