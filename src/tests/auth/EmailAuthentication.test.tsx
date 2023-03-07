import { render, screen } from "@testing-library/react";
import EmailAuthentication from "@/pages/auth/email_authentication/[token]";

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
    render(<EmailAuthentication />);

    const title = screen.getByText(/메일 인증 페이지 입니다./i);
    expect(title).toBeInTheDocument();
  });

  it("test func", () => {
    render(<EmailAuthentication />);

    const isSuccess = screen.getByText(/인증이 완료되었습니다./i);
    expect(isSuccess).toBeInTheDocument();
  });
});
