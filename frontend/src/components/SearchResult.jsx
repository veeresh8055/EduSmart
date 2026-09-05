import React from 'react'
import { Search, X } from 'lucide-react'

const SearchResult = ({ 
  SearchInput, 
  setSearchInput, 
  handleSubmit, 
  onReset, 
  hasActiveSearch 
}) => {

  const SearchText = [
    'MERN Stack Development', 
    'React for Beginners', 
    'Advanced JavaScript', 
    'Node.js Essentials'
  ]

  return (
    <div className='min-h-[28vh] bg-zinc-100 border-b border-zinc-200 flex items-center'>
      <div className='max-w-4xl mx-auto px-6 w-full flex flex-col items-center gap-6'>

        {/* Search Bar */}
        <form 
          onSubmit={handleSubmit} 
          className='w-full max-w-2xl flex items-center gap-4 justify-center'
        >
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500' />

            <input
              value={SearchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder='Search courses...'
              className='w-full pl-10 pr-10 py-3 bg-white border border-zinc-300 rounded-xl
              focus:border-zinc-500 focus:ring-1 focus:ring-zinc-200 focus:outline-none
              transition-all text-base placeholder-zinc-500'
            />

            {SearchInput && (
              <button
                type='button'
                onClick={() => setSearchInput('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 p-1 
                hover:bg-zinc-100 rounded-lg transition-colors'
              >
                <X className='w-4 h-4 text-zinc-500 hover:text-zinc-700' />
              </button>
            )}
          </div>

          <button
            type='submit'
            className='px-6 py-3 bg-zinc-800 hover:bg-zinc-900 text-white 
            font-medium rounded-xl transition-colors text-sm'
          >
            Search
          </button>
        </form>

        {/* Quick Tags */}
        <div className='flex flex-wrap justify-center gap-3'>
          {SearchText.map((item, index) => (
            <button
              key={index}
              onClick={() => setSearchInput(item)}
              className='px-4 py-2 bg-zinc-200 hover:bg-zinc-300 
              border border-zinc-300 rounded-lg text-sm font-medium 
              text-zinc-800 transition-colors'
            >
              {item}
            </button>
          ))}
        </div>

        {/* Reset */}
        {hasActiveSearch && (
          <button
            onClick={onReset}
            className='px-4 py-2 bg-zinc-100 hover:bg-zinc-200 
            text-zinc-700 font-medium text-sm rounded-lg 
            border border-zinc-300 transition-colors'
          >
            Reset filter
          </button>
        )}

      </div>
    </div>
  )
}

export default SearchResult