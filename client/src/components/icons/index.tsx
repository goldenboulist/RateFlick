import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function baseProps(size = 20): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  };
}

export function IconEye({ size = 20, className, ...p }: IconProps) {
  return (
    <svg
      {...baseProps(size)}
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      {...p}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export function IconEyeOff({ size = 20, className, ...p }: IconProps) {
  return (
    <svg
      {...baseProps(size)}
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      {...p}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}

export function IconSearch({ size = 20, className, ...p }: IconProps) {
  return (
    <svg
      {...baseProps(size)}
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      {...p}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

export function IconChevronDown({ size = 16, className, ...p }: IconProps) {
  return (
    <svg
      {...baseProps(size)}
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      {...p}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

export function IconStar({ size = 16, className, ...p }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} {...p}>
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.45 4.73L5.82 21z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconCalendar({ size = 16, className, ...p }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} {...p}>
      <path
        d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconSortAsc({ size = 16, className, ...p }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} {...p}>
      <path
        d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconSortDesc({ size = 16, className, ...p }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} {...p}>
      <path
        d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h6v-2H3v2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconTrendDown({ size = 16, className, ...p }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} {...p}>
      <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" fill="currentColor" />
    </svg>
  );
}

export function IconTrendUp({ size = 16, className, ...p }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} {...p}>
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" fill="currentColor" />
    </svg>
  );
}

export function IconFilm({ size = 48, className, ...p }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} {...p}>
      <path
        d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

export function IconArrowTopRightOnSquare({ size = 16, className, ...p }: IconProps) {
  return (
    <svg
      {...baseProps(size)}
      className={className}
      stroke="currentColor"
      strokeWidth={1.5}
      {...p}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5M19.5 3v6m0 0h-6m6 0l-9 9"
      />
    </svg>
  );
}

export function IconPalette({ size = 16, className, ...p }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} {...p}>
      <path
        d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconCheck({ size = 16, className, ...p }: IconProps) {
  return (
    <svg
      {...baseProps(size)}
      className={className}
      stroke="currentColor"
      strokeWidth={2}
      {...p}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
