import { Button } from "../button/Button";

type RemoteProps = {
  code: string;
  goPrevious: () => void;
  goNext: () => void;
};

export const Remote = ({ code, goPrevious, goNext }: RemoteProps) => (
  <div className="w-48 h-72 lg:w-72 lg:h-96 max-h-screen max-w-screen m-5 bg-sky-800/75 text-white rounded-3xl flex flex-col items-center justify-between">
    <div className="w-full h-32 bg-cyan-900 text-center rounded-t-3xl flex flex-col justify-center">
      <p className="text-sm uppercase">
        Now showing
      </p>
      <p className="text-6xl pt-2 m-0 cursor-default font-bold" aria-label="code">
        {code}
      </p>
    </div>
    <div className="w-full h-auto flex-1 flex items-center justify-around">
      <Button onClick={goPrevious} ariaLabel="previousButton">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </Button>
      <Button onClick={goNext} ariaLabel="nextButton">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </Button>
    </div>
  </div>
);
