import NotFound from "@/pages/404";
import { render, screen, fireEvent } from "@testing-library/react";

const mockRoutePush = jest.fn();

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: { search: null },
      asPath: "",
      push: mockRoutePush,
    };
  },
}));

describe("<404/>", () => {
  it("check ui", () => {
    render(<NotFound />);

    const title = screen.getByText(/새로운 질문들을 만날 수 있어요!/i);
    expect(title).toBeInTheDocument();

    const clickHere = screen.getByText("여기");
    expect(clickHere).toBeInTheDocument();

    const explain = screen.getByText(/새로운 질문들을 만날 수 있어요!/i);
    expect(explain).toBeInTheDocument();
  });

  it("check func", () => {
    render(<NotFound />);

    const clickHere = screen.getByText("여기");
    fireEvent.click(clickHere);
    expect(mockRoutePush).toHaveBeenCalledWith("/qna");
    
    const sadIcon = screen.getByTestId("dissatisFiedIcon");
    fireEvent.click(sadIcon);
    expect(mockRoutePush).toHaveBeenCalledWith("/qna");
  });
});
