import React, { useState } from 'react'
import PageNotFound from '../../PageNotFound'
import Filter from './Filter'
import { SelectChangeEvent } from '@mui/material';

const BoardView = () => {
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [dueDateFilter, setDueDateFilter] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
  

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
      setCategoryFilter(event.target.value as string);
    };
  
    const handleDueDateChange = (event: SelectChangeEvent<string>) => {
      setDueDateFilter(event.target.value as string);
    };
  
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    };
  return (
    <div className="min-h-screen">
         <Filter handleCategoryChange={handleCategoryChange} handleDueDateChange={handleDueDateChange} handleSearchChange={handleSearchChange} categoryFilter={categoryFilter} dueDateFilter={dueDateFilter} searchQuery={searchQuery} />

      <PageNotFound />
    </div>
  )
}

export default BoardView