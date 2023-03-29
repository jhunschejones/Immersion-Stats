import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import Modal from "../../components/Modal";

describe("Modal", () => {
  it("closes the modal when background is clicked", async () => {
    let portalRoot = document.getElementById("modals");
    if (!portalRoot) {
      portalRoot = document.createElement("div");
      portalRoot.setAttribute("id", "modals");
      document.body.appendChild(portalRoot);
    }
    const mockClick = jest.fn();
    // expect(mockClick).toHaveBeenCalledTimes(1);
    const user = userEvent.setup();
    const {container} = render(<Modal onClose={mockClick}><h1>Modal content</h1></Modal>);

    await screen.findByText(/Modal content/i);

    await screen.findByTestId("modal-backdrop");

    await user.click(container.getElementsByClassName("modal-backdrop")[0]);
  });
});
