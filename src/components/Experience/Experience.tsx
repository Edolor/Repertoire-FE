import { ExperienceProps } from "./Experience.types"; 

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function Experience({ data }: ExperienceProps) {
  const s_date = new Date(data.start_date);
  const s_month = months[s_date.getMonth()];
  const s_year = s_date.getFullYear();
  let e_month = "";
  let e_year = "";

  if (data.end_date) {
    const e_date = new Date(data.end_date);
    e_month = months[e_date.getMonth()];
    e_year = e_date.getFullYear().toString();
  }

  return (
    <div className="bg-primaryAbout dark:bg-zinc-500 flex items-center px-6 py-8 gap-12 sm:px-12">
      <div className="bg-black p-12 hidden flex-col gap-6 items-center md:flex">
        <p className="uppercase text-2xl text-white font-bold">{`${s_month} ${s_year}`}</p>
        <div className="w-16 h-px bg-white">&nbsp;</div>
        <p className="uppercase text-2xl text-white font-bold">
          {!data.end_date ? "Present" : `${e_month} ${e_year}`}
        </p>
      </div>

      <div className="flex-flex-col space-y-2">
        <h4 className="text-xl font-bold dark:text-zinc-200 underline capitalize">
          {data.institution}
        </h4>

        <p className="text-xl dark:text-zinc-200">{data.location}</p>

        <p className="text-xl dark:text-zinc-200">{data.about}</p>

        <p className="uppercase text-base text-zinc-700 font-bold dark:text-zinc-200 md:hidden">
          {`${s_month} ${s_year}`} -{" "}
          {!data.end_date ? "Present" : `${e_month} ${e_year}`}
        </p>
      </div>
    </div>
  );
}

export default Experience;
