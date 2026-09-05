// Home.jsx - Fixed logic
import CourseSection from '@/components/CourseSection'
import SearchResult from '@/components/SearchResult'
import React, { useState } from 'react'

const Home = () => {
  const [SearchInput, setSearchInput] = useState('')
  const [ActiveSearch, setActiveSearch] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setActiveSearch(SearchInput)
  }

  const resetFilter = () => {
    setSearchInput("")
    setActiveSearch("")
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <SearchResult
        SearchInput={SearchInput}
        setSearchInput={setSearchInput}
        handleSubmit={handleSubmit}
        onReset={resetFilter}
        hasActiveSearch={!!ActiveSearch}  // ✅ Fixed: ActiveSearch not SearchInput
      />
      <CourseSection ActiveSearch={ActiveSearch} />
    </div>
  )
}

export default Home