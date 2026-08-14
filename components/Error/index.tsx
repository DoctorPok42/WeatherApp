interface ErrorProps {
  text: string
  setText?: (text: string) => void
}

const ErrorPopup = ({ text, setText }: ErrorProps) => {
  return (
    <div className="w-119 mx-auto flex font-bold items-center justify-between bg-[#ff6b6b1a] text-[#e04b4b] border border-[#ff6b6b55] py-[.8rem] px-4 rounded-[14px] text-center">
      {text}

      <svg width="20" height="20" className="text-[#E04B4B] cursor-pointer" onClick={() => setText?.("")}>
        <use href="/picto.svg#ic-x" />
      </svg>
    </div>
  );
};

export default ErrorPopup;
