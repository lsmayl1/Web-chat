import { Props } from "../types";

export const SendIcon = (prop: Props) => {
  return (
    <svg
      width="50px"
      className={prop.className}
      height="50px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.50929 4.23013L18.0693 8.51013C21.9093 10.4301 21.9093 13.5701 18.0693 15.4901L9.50929 19.7701C3.74929 22.6501 1.39929 20.2901 4.27929 14.5401L5.14929 12.8101C5.36929 12.3701 5.36929 11.6401 5.14929 11.2001L4.27929 9.46013C1.39929 3.71013 3.75929 1.35013 9.50929 4.23013Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.34"
        d="M5.43945 12H10.8395"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
