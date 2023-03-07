import { render, screen } from "@testing-library/react";
import Github from "@/pages/auth/github/index";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: { search: null },
      asPath: "",
    };
  },
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

jest.mock("@tanstack/react-query", () => ({
  useMutation: () => ({ isLoading: false, isSuccess: true }),
}));

describe("<EmailAuthentication/>", () => {
  it("test ui", () => {
    render(<Github />);

    const title = screen.getByText(/깃허브를 통한 로그인 중입니다./i);
    expect(title).toBeInTheDocument();
  });

  it("test func", () => {
    render(<Github />);

    const isSuccess = screen.getByText(/인증이 완료되었습니다./i);
    expect(isSuccess).toBeInTheDocument();
  });
});
