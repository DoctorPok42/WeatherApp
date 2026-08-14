interface SearchBarProps {
  text: string
  setText: (text: string) => void
  handleSearch: () => void
  getPosition: () => void
}

const SearchBar = ({ text, setText, handleSearch, getPosition }: SearchBarProps) => {
  return (
    <div className="w-full flex justify-center gap-[.6rem] mt-2 mb-8">
      <div className="relative min-w-105">
        <input
          type="text"
          placeholder="Search for a city"
          className="w-full h-[3.1rem] rounded-2xl border border-[#eeeff0] dark:border-[#22272f] bg-card text-[1.05rem] pr-12 pl-[1.1rem] outline-none font-semibold"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
          autoFocus={true}
        />

        <button
          className="absolute text-white right-[.4rem] top-[.4rem] w-[2.3rem] h-[2.3rem] rounded-[11px] flex items-center justify-center bg-[#5271ff] hover:bg-[#3a56d4] transition-colors duration-200 cursor-pointer"
          onClick={() => handleSearch()}
        >
          <svg width="18" height="18">
            <use href="/picto.svg#ic-search" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        className="w-[3.1rem] h-[3.1rem] rounded-2xl bg-card hover:bg-[#3a56d4] border border-[#eeeff0] dark:border-[#22272f] text-[#5271ff] hover:text-white transition-colors duration-200 flex items-center justify-center cursor-pointer"
        onClick={getPosition}
      >
        <svg width="19" height="19">
          <use href="/picto.svg#ic-pin" />
        </svg>
      </button>
    </div>
  )
}

export default SearchBar
