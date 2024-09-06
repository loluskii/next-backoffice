import { Box, Button } from "@chakra-ui/react"; // Assuming you're using Chakra UI

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  // Helper function to navigate to the previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Helper function to navigate to the next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt="4">
      {/* Show "Previous" button only if there are pages before the current one */}
      {currentPage > 1 && (
        <Button onClick={goToPreviousPage} mr="2">
          Previous
        </Button>
      )}

      {/* Show "Next" button only if there are pages after the current one */}
      {currentPage < totalPages && (
        <Button onClick={goToNextPage} ml="2">
          Next
        </Button>
      )}
    </Box>
  );
};

export default Pagination;
