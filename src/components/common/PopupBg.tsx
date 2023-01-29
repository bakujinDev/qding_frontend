import styles from "@/styles/components/common/popupBg.module.scss";

interface IProps {
  bg: any;
  off: React.MouseEventHandler<HTMLButtonElement>;
}

export default function PopupBg({ bg, off }: IProps) {
  return (
    <section
      className={`${styles.popupBg} ${bg ? styles.bg : ""}`}
      onClick={off}
    ></section>
  );
}
