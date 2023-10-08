import React from "react";

export default function AboutLoading() {
  const fields = [1, 2, 3, 4];
  return (
    <>
      <aside className="flex flex-wrap gap-x-14 gap-y-6">
        {fields.map((el, index) => {
          return (
            <p
              key={index}
              className="w-32 bg-zinc-300 animate-pulse py-3 px-10"
            >
              &nbsp;
            </p>
          );
        })}
      </aside>

      <p className="my-6 animate-pulse w-3/4 bg-zinc-500">&nbsp;</p>

      <div>
        <div className="bg-zinc-300 animate-pulse flex items-center px-6 py-8 gap-12 sm:px-12">
          <div className="p-12 hidden w-40 h-40 bg-zinc-500 animate-pulse md:block"></div>

          <div className="flex-flex-col space-y-4 w-full">
            <h4 className="w-2/3 bg-zinc-600 animate-pulse">&nbsp;</h4>

            <p className="w-1/3 bg-zinc-500 animate-pulse">&nbsp;</p>

            <p className="w-1/3 bg-zinc-500 animate-pulse">&nbsp;</p>

            <p className="w-1/2 bg-zinc-600 animate-pulse md:hidden">&nbsp;</p>
          </div>
        </div>
      </div>
    </>
  );
}
