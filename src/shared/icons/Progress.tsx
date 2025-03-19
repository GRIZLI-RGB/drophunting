export const Progress = ({
  size = 20,
  color = "#8E8E8E",
}: {
  size?: number;
  color?: string;
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 10H10V3C10 2.4 9.6 2 9 2C4 2 0 6 0 11C0 16 4 20 9 20C14 20 18 16 18 11C18 10.4 17.6 10 17 10ZM10 17.9C6.2 18.5 2.6 15.8 2.1 12C1.5 8.2 4.2 4.6 8 4.1V11C8 11.6 8.4 12 9 12H15.9C15.5 15.1 13.1 17.5 10 17.9ZM13 0C12.4 0 12 0.4 12 1V7C12 7.6 12.4 8 13 8H19C19.6 8 20 7.6 20 7C20 3.1 16.9 0 13 0ZM14 6V2.1C16 2.5 17.5 4 17.9 6H14Z"
        fill={color}
      />
    </svg>
  );
};
