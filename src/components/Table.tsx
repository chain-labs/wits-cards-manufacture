"use client";

import { cn } from "@/utils";

type TableProps = {
  header: React.ReactNode[];
  body: Array<React.ReactNode[]>;
};

export default function Table({ header, body }: TableProps) {
  return (
    <div className="max-h-[300px] max-w-[80vw] min-w-[500px] w-full lg:w-fit overflow-y-auto [scroll-snap-type]:[y_mandatory] rounded-[6px] mr-[8px] bg-white">
      <table className="w-full">
        <thead>
          <tr>
            {header.map((head, i) => (
              <th key={i} className={cn("p-[1px] sticky top-0 z-10 bg-white border-[1px] border-agpurple")}>
                <div className={cn("bg-agblack", "px-[12px] py-[10px]")}>
                  <div
                    className={cn(
                      "uppercase tracking-widest text-[14px] leading-[24px] font-sans",
                      "[&_svg]:text-[24px]",
                      "grid grid-flow-col gap-[8px]",
                      "text-nowrap",
                      "[&_img]:[min-w-[24px] min-h-[24px]]",
                    )}
                  >
                    {head}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cn("relative", "font-lato")}>
          {body.length ? (
            body.map((row, i) => (
              <tr key={i} className="[scroll-snap-align]:[start]">
                {row.map((cell, j) => (
                  <td key={j} className="border-[1px] border-agpurple">
                    <div
                      className={cn(
                        "text-[14px] font-general-sans font-medium",
                        "[&_svg]:text-[24px]",
                        "flex gap-[8px]",
                        "px-[12px] py-[10px]",
                      )}
                    >
                      {cell}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={header.length} className="text-center p-[12px]">No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
