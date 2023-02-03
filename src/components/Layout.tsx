import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactElement } from "react";
import DefaultHeader from "./header/DefaultHeader";
import styles from "@/styles/components/layout.module.scss";

interface IProps {
  children: ReactElement<any, any>;
}

export default function Layout({ children }: IProps) {
  return (
    <div className={styles.layoutCont}>
      <DefaultHeader />

      <div className={styles.contBox}>{children}</div>

      <ReactQueryDevtools />
    </div>
  );
}
