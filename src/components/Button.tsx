"use client";

import { cn } from "@/utils";
import { ReactNode } from "react";

interface ButtonProps {
  className?: string;
  children: ReactNode;
}

export default function 
Button({
  className,
  children,
  ...buttonProps
}: ButtonProps & JSX.IntrinsicElements["button"]) {
  return (
    <button
      className={cn(
        "relative w-fit h-fit font-bold uppercase text-black text-[22px] disabled:text-[#00000040] disabled:opacity-25 group",
        className,
      )}
      {...buttonProps}
    >
      <svg
        width="267"
        height="69"
        viewBox="0 0 267 69"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M33.4161 1.57535L1.44591 33.0754C0.650846 33.8587 0.650847 35.1413 1.44591 35.9247L33.4161 67.4247C33.7902 67.7933 34.2945 68 34.8198 68H232.18C232.706 68 233.21 67.7933 233.584 67.4247L265.554 35.9246C266.349 35.1413 266.349 33.8587 265.554 33.0753L233.584 1.57535C233.21 1.20667 232.706 1 232.18 1H34.8198C34.2945 1 33.7902 1.20667 33.4161 1.57535Z"
          stroke="#FFFED0"
          className="group-hover:scale-[0.9] transition-transform duration-300 origin-center"
        />
        <path
          d="M38.4168 10.5716L15.4581 33.0711C14.6577 33.8555 14.6579 35.1443 15.4585 35.9284L38.4168 58.4128C38.7906 58.7788 39.293 58.9839 39.8162 58.9839H227.184C227.707 58.9839 228.209 58.7788 228.583 58.4128L251.541 35.9284C252.342 35.1443 252.342 33.8555 251.542 33.0711L228.583 10.5716C228.209 10.2052 227.707 10 227.183 10H39.8166C39.2932 10 38.7906 10.2052 38.4168 10.5716Z"
          fill="url(#paint0_linear_9_2)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_9_2"
            x1="133.5"
            y1="10"
            x2="133.5"
            y2="58.9839"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFFED0" />
            <stop offset="1" stopColor="#EFC779" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-fit">
        {children}
      </div>
    </button>
  );
}
