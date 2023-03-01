import { setLoginPopup } from "../store/reducer/commonReducer";
import { AppState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import LoginPopup from "./common/LoginPopup";
import PopupBg from "./common/PopupBg";

export default function CommonComp() {
  const dispatch = useDispatch();

  const loginPopup = useSelector((state: AppState) => state.common.loginPopup);

  return (
    <>
      {loginPopup ? (
        <>
          <LoginPopup off={() => dispatch(setLoginPopup(false))} />
          <PopupBg bg off={() => dispatch(setLoginPopup(false))} />
        </>
      ) : null}
    </>
  );
}
