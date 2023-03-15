import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ChatContainer } from "../components";

describe("ChatContainer", () => {
  test("renders the chat container", () => {
    const { container } = render(<ChatContainer />);
    expect(container.querySelector("#chat_container")).not.toBeNull();
  });

  test("renders the input field and send button", () => {
    const { getByPlaceholderText, getByAltText } = render(<ChatContainer />);
    const inputField = getByPlaceholderText("Ask Kortana...");
    const sendButton = getByAltText("send");

    expect(inputField).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  test("updates input field value when typing", () => {
    const { getByPlaceholderText } = render(<ChatContainer />);
    const inputField = getByPlaceholderText("Ask Kortana...");

    fireEvent.change(inputField, { target: { value: "Hello, Kortana!" } });
    expect(inputField.value).toBe("Hello, Kortana!");
  });

  test("sends a message and receives a response", async () => {
    const fetchMock = async () =>
      Promise.resolve({
        json: () => Promise.resolve({ data: "Hello, how can I help you?" }),
      });

    global.fetch = fetchMock; // Replace the global fetch with the mock implementation

    const { getByPlaceholderText, getByAltText, findByText } = render(
      <ChatContainer />
    );
    const inputField = getByPlaceholderText("Ask Kortana...");
    const sendButton = getByAltText("send");

    fireEvent.change(inputField, { target: { value: "Hello, Kortana!" } });
    fireEvent.click(sendButton);

    await findByText("Hello, Kortana!");
    await waitFor(() =>
      expect(findByText("Hello, how can I help you?")).toBeTruthy()
    );

    // Restore the original fetch implementation after the test
    global.fetch = window.fetch;
  });
});
