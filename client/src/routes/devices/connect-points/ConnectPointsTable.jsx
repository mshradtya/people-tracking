import { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
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
import ConfirmConnectPointDeletionModal from "@/components/modals/ConfirmConnectPointDeletionModal";
import { useSnackbar } from "@/hooks/useSnackbar";
import CircularProgress from "@mui/material/CircularProgress";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import useAuth from "@/hooks/auth/useAuth";
import { useFetchConnectPoints } from "@/hooks/useFetchConnectPoints";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#ed4354",
    color: theme.palette.common.white,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    textAlign: "center",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: "#ed4354",
    },
  },
});

export default function ConnectPointsTable() {
  const {
    connectPoints,
    isConnectPointsLoading,
    connectPointsSerialNumber,
    fetchConnectPoints,
  } = useFetchConnectPoints();
  const { auth } = useAuth();
  const isSuperAdmin = auth?.role === "SuperAdmin";
  const { showSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedConnectPoint, setSelectedConnectPoint] = useState(null);
  const [
    isConfirmDeleteConnectPointModalOpen,
    setConfirmDeleteConnectPointModalOpen,
  ] = useState(false);

  useEffect(() => {
    const fetchConnectPointsInterval = setInterval(fetchConnectPoints, 200);

    return () => {
      clearInterval(fetchConnectPointsInterval);
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

  const handleDeleteConnectPoint = (row) => {
    setSelectedConnectPoint(row);
    setConfirmDeleteConnectPointModalOpen(true);
  };

  const deleteConnectPoint = async () => {
    try {
      const response = await axiosPrivate.delete(
        `/connect-point/delete/${selectedConnectPoint.cpid}`
      );

      if (response && response.data && response.data.status === 200) {
        handleCloseConfirmDeleteConnectPointModal();
        fetchConnectPoints();
        showSnackbar("success", "Connect Point deleted successfully!");
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

  const handleCloseConfirmDeleteConnectPointModal = () => {
    setConfirmDeleteConnectPointModalOpen(false);
    setSelectedConnectPoint(null);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <ThemeProvider theme={theme}>
        <TableContainer sx={{ maxHeight: "65vh" }}>
          {isConnectPointsLoading ? (
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
                <StyledTableRow>
                  <StyledTableCell align="center" style={{ minWidth: 70 }}>
                    Serial No.
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{ minWidth: 70 }}>
                    Connect Point ID
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{ minWidth: 70 }}>
                    Gateway ID
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{ minWidth: 70 }}>
                    Pillars Covered
                  </StyledTableCell>
                  {isSuperAdmin && (
                    <StyledTableCell align="center" style={{ minWidth: 70 }}>
                      Last Packet DateTime
                    </StyledTableCell>
                  )}
                  {auth?.role === "SuperAdmin" && (
                    <StyledTableCell align="center" style={{ minWidth: 70 }}>
                      Action
                    </StyledTableCell>
                  )}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {connectPoints &&
                  connectPoints
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <StyledTableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.cpid}
                        >
                          <StyledTableCell align="center">
                            {connectPointsSerialNumber + index}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.cpid}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.gwid ? row.gwid : "--"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {`${row.pillarStart} to ${row.pillarEnd}`}
                          </StyledTableCell>
                          {isSuperAdmin && (
                            <StyledTableCell align="center">
                              {row.timestamp ? row.timestamp : "--"}
                            </StyledTableCell>
                          )}
                          {isSuperAdmin && (
                            <StyledTableCell align="center">
                              <div className="flex justify-center">
                                <span>
                                  <IconButton
                                    aria-label="delete"
                                    sx={{ color: "red" }}
                                    onClick={() =>
                                      handleDeleteConnectPoint(row)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </span>
                              </div>
                            </StyledTableCell>
                          )}
                        </StyledTableRow>
                      );
                    })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={connectPoints.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Confirm Delete Modal */}
        <ConfirmConnectPointDeletionModal
          open={isConfirmDeleteConnectPointModalOpen}
          handleClose={handleCloseConfirmDeleteConnectPointModal}
          handleConfirmDelete={deleteConnectPoint}
        />
      </ThemeProvider>
    </Paper>
  );
}
