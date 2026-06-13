import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="dark"
    className="toaster group"
    position="bottom-right"
    richColors
    closeButton
    {...props}
  />
);

export { Toaster };
