import { capitalize } from "../utils/dictionary_utils";

const title = "Newtownards Islamic Cultural Centre";
const description = "Peace be upon you - As-Salamu Alaikum";

const Header = ({ time, nextPrayer, timeToEnd }) => {

  const formatTimeRemaining = (remaining) => {
    if (!remaining) return "-";

    const { hours, minutes, seconds } = remaining;

    if (hours <= 0 && minutes <= 0) return "Starting soon";

    const pad = (n) => String(n).padStart(2, "0");
    if (hours > 0) return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    return `${pad(minutes)}m ${pad(seconds)}s`;
  };

  const formattedRemaining = formatTimeRemaining(timeToEnd);

  return (
    <header className="bg-emerald-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        {/* Logo + title */}
        <div className="flex flex-col items-center justify-center mb-2 md:flex-row">
          <img
            src="/mosque_logo.svg"
            alt="Mosque logo"
            className="h-20 w-auto filter invert brightness-0"
          />
          <h1 className="text-3xl md:text-4xl font-bold mt-3 md:mt-0 md:ml-4 text-center">
            {title}
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-center text-emerald-100 text-lg">
          {description}
        </p>

        {/* Info row: time, next prayer, countdown */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm md:text-base">
          {/* Current time */}
          <div className="bg-emerald-800/40 rounded-2xl px-4 py-3">
            <p className="uppercase tracking-wide text-emerald-200 text-xs">
              Current Time
            </p>
            <p className="font-mono text-2xl md:text-3xl mt-1">
              {time
                ? time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "--:--"}
            </p>
          </div>

          {/* Next prayer */}
          <div className="bg-emerald-800/40 rounded-2xl px-4 py-3">
            <p className="uppercase tracking-wide text-emerald-200 text-xs">
              Next Prayer
            </p>
            <p className="text-xl md:text-2xl font-semibold mt-1">
              {capitalize(nextPrayer) ? capitalize(nextPrayer) : "-"}
            </p>
          </div>

          {/* Time remaining */}
          <div className="bg-emerald-800/40 rounded-2xl px-4 py-3">
            <p className="uppercase tracking-wide text-emerald-200 text-xs">
              Time Until Next Prayer
            </p>
            <p className="font-mono text-2xl md:text-3xl mt-1">
              {formattedRemaining}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
