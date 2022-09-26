type HeaderProps = {
  code: string;
  description: string;
};

export const Header = ({ code, description }: HeaderProps) => (
  <header className="z-10 w-11/12 mx-auto md:w-3/5 xl:w-1/3 h-16 bg-slate-700/80 text-white rounded-full flex items-center justify-start relative md:absolute top-4 md:left-4 drop-shadow-xl">
    <label
      htmlFor="channelDescription"
      className="w-24 rounded-l-full bg-slate-800/70 h-full flex items-center justify-center font-bold text-2xl"
    >
      {code || "000"}
    </label>
    <p
      id="channelDescription"
      className="flex-1 h-full pl-6 capitalize flex items-center justify-start text-lg truncate text-ellipsis mr-12"
      title={description}
    >
      {description}
    </p>
  </header>
);
