export const Spinner = () => (
  <div className="absolute top-0 left-0 z-40 w-screen h-screen flex items-center justify-center flex-col backdrop-blur-sm">
    <div className="w-24 h-24 border-white border-8 rounded-full border-b-0 border-r-0 animate-spin-slow drop-shadow-xl"></div>
    <div className="pt-5 font-bold text-white drop-shadow-xl">LOADING...</div>
  </div>
);
