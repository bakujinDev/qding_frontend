import { render, screen } from "@testing-library/react";
import Qna from "@/pages/qna/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

describe("<Qna />", () => {
  const queryClient = new QueryClient();

  it("renders a heading", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Qna />
      </QueryClientProvider>
    );

    const listTitle = screen.getByText(/모든 질문/i);
    expect(listTitle).toBeInTheDocument();

    const askBtn = screen.getByText(/질문하기/i);
    expect(askBtn).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("검색어를 입력해주세요");
    expect(searchInput).toBeInTheDocument();
  });
});
