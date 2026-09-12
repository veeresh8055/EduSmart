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
    <section className='relative overflow-hidden min-h-[32vh] bg-[#eee5d9] border-b border-[#e6ded2] flex items-center'>
      <div className='max-w-5xl mx-auto px-6 py-14 w-full flex flex-col items-center gap-6 page-enter'>
        <div className='text-center'><p className='eyebrow mb-3'>A calmer way to grow</p><h1 className='font-display text-4xl sm:text-5xl font-extrabold text-[#282522]'>Learn the work that matters.</h1><p className='mt-3 text-[#5f5952]'>Browse focused courses and build practical confidence.</p></div>

        {/* Search Bar */}
        <form 
          onSubmit={handleSubmit} 
          className='w-full max-w-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center'
        >
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500' />

            <input
              value={SearchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder='Search courses...'
              className='w-full pl-11 pr-10 py-3.5 bg-[#fffdf9] border border-[#d8cdbf] rounded-xl shadow-sm
              focus:border-[#9b5f47] focus:ring-2 focus:ring-[#9b5f47]/15 focus:outline-none
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
            className='px-7 py-3.5 bg-[#282522] hover:bg-[#423d37] text-white font-semibold rounded-xl transition-colors text-sm'
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
    </section>
  )
}

export default SearchResult
