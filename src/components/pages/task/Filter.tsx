import { FormControl, MenuItem, Select, Typography, TextField, InputAdornment } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { SelectChangeEvent } from '@mui/material/Select'
import useTaskStore from '../../../store/useTaskStore';

interface FilterProps {
  categoryFilter: string;
  dueDateFilter: string;
  searchQuery: string;
  handleCategoryChange: (event: SelectChangeEvent<string>) => void;
  handleDueDateChange: (event: SelectChangeEvent<string>) => void;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

}

const Filter: React.FC<FilterProps> = ({
  categoryFilter,
  dueDateFilter,
  searchQuery,
  handleCategoryChange,
  handleDueDateChange,
  handleSearchChange,
}) => {
  const { openCreateModal } = useTaskStore();  

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Filter by category and due date */}
      <div className="flex items-center gap-3">
        <Typography variant="body1" className="mr-2">
          Filter by:
        </Typography>
        
        {/* Category Filter */}
        <FormControl variant="outlined" className="mr-2 w-32">
          <Select
            value={categoryFilter}
            onChange={handleCategoryChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={{
              borderRadius: "32px",
              padding: "4px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "32px",
              },
              "& .MuiOutlinedInput-input": {
                padding: "6px 8px",
              },
            }}
          >
            <MenuItem value="">
              <em>Category</em>
            </MenuItem>
            <MenuItem value="Work">Work</MenuItem>
            <MenuItem value="Personal">Personal</MenuItem>
          </Select>
        </FormControl>

        {/* Due Date Filter */}
        <FormControl variant="outlined" className="mr-2 w-32">
          <Select
            value={dueDateFilter}
            onChange={handleDueDateChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={{
              borderRadius: "32px",
              padding: "4px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "32px",
              },
              "& .MuiOutlinedInput-input": {
                padding: "6px 8px",
              },
            }}
          >
            <MenuItem value="">
              <em>Due Date</em>
            </MenuItem>
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="This Week">This Week</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Search Bar and Add Task Button */}
      <div className="flex items-center gap-3">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mr-2 w-48"
          sx={{
            borderRadius: "24px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "24px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <button className="bg-[#7B1984] hover:bg-purple-700 text-white rounded-full px-8 py-3 text-sm"  onClick={openCreateModal} >
          ADD TASK
        </button>
      </div>
    </div>
  )
}

export default Filter
