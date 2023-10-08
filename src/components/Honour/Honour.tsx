import Image from "next/image";
import { months, HonourProps } from "./Honour.types";

export default function Honour({ data }: HonourProps) {
  let date: Date | null;
  let month: string | undefined;
  let year: string | undefined;
  let day: string | undefined;

  if (data?.issue_date) {
    date = new Date(data.issue_date);
    month = months[date.getMonth()];
    year = date.getFullYear().toString();
    day = date.getDate().toString();
    if (day.length < 2) {
      // Change one digit days to 2 digits.
      day = `0${day}`;
    }
  }

  return (
    <div className="flex flex-col space-y-2 items-center">
      <Image src={`${data.banner}`} className="h-32" alt={data.sub_about ? data.sub_about : ""} />

      <h4 className="text-lg text-center font-bold dark:text-zinc-100">
        {data.title}
      </h4>

      <p className="text-lg text-center text-zinc-700 dark:text-zinc-200">
        {data.about}
      </p>

      {data.sub_about && (
        <p className="text-lg text-center text-zinc-700 dark:text-zinc-200">
          {data.sub_about}
        </p>
      )}

      {data.issue_date && !data.sub_about && (
        <p className="text-lg text-center text-zinc-700 dark:text-zinc-200">
          Issue Date: {`${day} ${month} ${year}`}
        </p>
      )}

      {data.certification_no && (
        <p className="text-base text-center uppercase text-zinc-700 dark:text-zinc-200">
          Certification Number: {data.certification_no}
        </p>
      )}
    </div>
  );
}
