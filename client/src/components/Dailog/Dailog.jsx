import { Ellipsis } from "lucide-react";
import React, { useState } from "react";

const DialogComponent = ({ dialogContent }) => {
  console.log("🚀 ~ DialogComponent ~ dialogContent:", dialogContent);
  const [isOpen, setIsOpen] = useState(false);

  // Function to open the dialog
  const openDialog = () => {
    setIsOpen(true);
  };

  // Function to close the dialog
  const closeDialog = () => {
    setIsOpen(false);
  };

  // Function to close the dialog if clicked outside the content
  const handleOutsideClick = (event) => {
    // If the click is on the dialog box container but not inside the content box, close it
    if (event.target.id === "dialogBox") {
      closeDialog();
    }
  };

  const handleActionClick = (handler) => {
    handler(); // Run the passed function
    closeDialog(); // Close the dialog
  };

  return (
    <div className="flex items-center justify-center">
      {/* Button to open the dialog */}
      <button
        onClick={openDialog}
        className="p-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <Ellipsis />
      </button>

      {/* Dialog Box */}
      {isOpen && (
        <div
          id="dialogBox"
          onClick={handleOutsideClick}
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
        >
          <div className="bg-white p-4 rounded shadow-lg w-1/3 ">
            {dialogContent.map((content, index) => {
              return (
                <button
                  key={index}
                  onClick={() => handleActionClick(content.handler)}
                  className="text-l py-1 px-5 rounded-xl hover:bg-gray-400"
                >
                  {content.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogComponent;
