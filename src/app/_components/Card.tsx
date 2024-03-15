export const Card = ({ children, className }: { children: React.ReactNode; className: string }) => {
  return <div className={`${className} bg-white shadow-md rounded-lg p-6`}>{children}</div>;
};
