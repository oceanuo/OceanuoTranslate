interface TranslateButtonProps {
  onClick: () => void;
  isTranslating: boolean;
  isMobile: boolean;
}

export default function TranslateButton({ onClick, isTranslating, isMobile }: TranslateButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-1 rounded-md transition duration-300 flex items-center justify-center ${
        isMobile ? 'h-12 w-full' : 'h-full w-10 mx-1'
      } ${
        isTranslating
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
    >
      <span className={`text-lg font-medium ${isMobile ? '' : '[writing-mode:vertical-lr] rotate-180'}`}>
        {isTranslating ? 'Stop' : 'Translate'}
      </span>
    </button>
  );
}
