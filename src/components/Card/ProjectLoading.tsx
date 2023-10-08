import React from "react";

export default function ProjectLoading() {
  return (
    <>
      <div
        className="w-full block group shrink-0 drop-shadow-lg rounded-xl self-stretch cursor-pointer 
            sm:max-w-sm active:drop-shadow-none"
      >
        <div className=" border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="h-60 bg-gray-400 w-full object-cover object-center"></div>
          <div className="p-6">
            <p className="bg-gray-400 animate-pulse h-4 w-1/4 mb-2"></p>
            <p className="w-1/2 mb-4 h-6 animate-pulse bg-gray-500"></p>
            <p className="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400"></p>
            <p className="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400"></p>
            <p className="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400"></p>
            <div className="flex items-center flex-wrap">
              <span className="bg-indigo-300 h-4 animate-pulse mt-2 w-32 inline-flex items-center md:mb-2 lg:mb-0"></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
