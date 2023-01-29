import { ReactElement } from "react";
import DefaultHeader from "./header/DefaultHeader";

interface IProps {
  children: ReactElement<any, any>;
}

export default function Layout({ children }: IProps) {
  return (
    <>
      <DefaultHeader />
      <div>{children}</div>
    </>
  );
}
