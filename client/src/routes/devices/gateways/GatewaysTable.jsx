import { useState, useEffect, forwardRef } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import ConfirmGatewayDeletionModal from "@/components/modals/ConfirmGatewayDeletionModal";
import { useSnackbar } from "@/hooks/useSnackbar";
import CircularProgress from "@mui/material/CircularProgress";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import useAuth from "@/hooks/auth/useAuth";
import { useFetchGateways } from "@/hooks/useFetchGateways";

export default function GatewaysTable({}) {
  const { gateways, isGatewaysLoading, gatewaysSerialNumber, fetchGateways } =
    useFetchGateways();
  const { auth } = useAuth();
  const { showSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [isConfirmDeleteGatewayModalOpen, setConfirmDeleteGatewayModalOpen] =
    useState(false);

  useEffect(() => {
    const fetchGatewaysInterval = setInterval(fetchGateways, 500);

    return () => {
      clearInterval(fetchGatewaysInterval);
    };
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditUser = (row) => {
    console.log(row);
  };

  const handleDeleteGateway = (row) => {
    setSelectedGateway(row);
    setConfirmDeleteGatewayModalOpen(true);
  };

  const deleteGateway = async () => {
    try {
      const response = await axiosPrivate.delete(
        `/gateway/delete/${selectedGateway.gwid}`
      );

      if (response && response.data && response.data.status === 200) {
        handleCloseConfirmDeleteGatewayModal();
        fetchGateways();
        showSnackbar("success", "Gateway deleted successfully!");
      } else {
        // Handle unexpected response structure or status
        showSnackbar("error", "Unexpected response from the server.");
      }
    } catch (error) {
      // Handle errors, including cases where the response is undefined
      showSnackbar(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleCloseConfirmDeleteGatewayModal = () => {
    setConfirmDeleteGatewayModalOpen(false);
    setSelectedGateway(null);
  };

  const formatDate = (dateString) => {
    const parseDate = new Date(dateString);
    return format(parseDate, "MMMM d, yyyy h:mm a");
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        {isGatewaysLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  Serial No.
                </TableCell>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  Gateway ID
                </TableCell>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  Location
                </TableCell>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  Last Packet DateTime
                </TableCell>
                {auth?.role === "SuperAdmin" && (
                  <TableCell align="center" style={{ minWidth: 70 }}>
                    Action
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {gateways &&
                gateways
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.gwid}
                      >
                        <TableCell align="center">
                          {gatewaysSerialNumber + index}
                        </TableCell>
                        <TableCell align="center">{row.gwid}</TableCell>
                        <TableCell align="center">{row.location}</TableCell>
                        <TableCell align="center">
                          {row.timestamp ? row.timestamp : "--"}
                        </TableCell>
                        {auth?.role === "SuperAdmin" && (
                          <TableCell align="center">
                            <div className="flex justify-center">
                              <span>
                                <IconButton
                                  aria-label="delete"
                                  sx={{ color: "red" }}
                                  onClick={() => handleDeleteGateway(row)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </span>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={gateways.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Confirm Delete Modal */}
      <ConfirmGatewayDeletionModal
        open={isConfirmDeleteGatewayModalOpen}
        handleClose={handleCloseConfirmDeleteGatewayModal}
        handleConfirmDelete={deleteGateway}
      />
    </Paper>
  );
}
