import { useState, useEffect, forwardRef } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { format } from "date-fns";
import ConfirmBeaconDeletionModal from "@/components/modals/ConfirmBeaconDeletionModal";
import { useSnackbar } from "@/hooks/useSnackbar";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "@/hooks/auth/useAuth";
import { useFetchBeacons } from "@/hooks/useFetchBeacons";
import BatteryIcon from "./BatteryIcon";
import AssignUser from "./AssignUser";

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

export default function BeaconsTable() {
  const { showSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();
  const { beacons, fetchBeacons, serialNumber, isLoading } = useFetchBeacons();
  const { auth } = useAuth();
  const isSuperAdmin = auth?.role === "SuperAdmin";
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openAssignUser, setOpenAssignUser] = useState(false);
  const [selectedBeacon, setSelectedBeacon] = useState(null);
  const [isConfirmDeleteBeaconModalOpen, setConfirmDeleteBeaconModalOpen] =
    useState(false);

  useEffect(() => {
    const fetchBeaconsInterval = setInterval(fetchBeacons, 200);

    return () => {
      clearInterval(fetchBeaconsInterval);
    };
  }, []);

  const handleOpenAssignUser = (beacon) => {
    setSelectedBeacon(beacon);
    setOpenAssignUser(true);
  };

  const handleCloseAssignUser = () => {
    setOpenAssignUser(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteBeacon = (row) => {
    setSelectedBeacon(row);
    setConfirmDeleteBeaconModalOpen(true);
  };

  const deleteBeacon = async () => {
    try {
      const response = await axiosPrivate.delete(
        `/beacon/delete/${selectedBeacon.bnid}`
      );

      if (response && response.data && response.data.status === 200) {
        handleCloseConfirmDeleteBeaconModal();
        fetchBeacons();
        showSnackbar("success", "Beacon deleted successfully!");
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

  const handleCloseConfirmDeleteBeaconModal = () => {
    setConfirmDeleteBeaconModalOpen(false);
    setSelectedBeacon(null);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <ThemeProvider theme={theme}>
        <TableContainer sx={{ maxHeight: 440 }}>
          {isLoading ? (
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
            <Table stickyHeader aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" style={{ minWidth: 70 }}>
                    Serial No.
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{ minWidth: 70 }}>
                    Beacon ID
                  </StyledTableCell>
                  {isSuperAdmin && (
                    <StyledTableCell align="center" style={{ minWidth: 70 }}>
                      Connect Point ID
                    </StyledTableCell>
                  )}
                  {isSuperAdmin && (
                    <StyledTableCell align="center" style={{ minWidth: 70 }}>
                      Gateway ID
                    </StyledTableCell>
                  )}
                  <StyledTableCell align="center" style={{ minWidth: 70 }}>
                    Current Assignee
                  </StyledTableCell>
                  {isSuperAdmin && (
                    <StyledTableCell align="center" style={{ minWidth: 70 }}>
                      SOS
                    </StyledTableCell>
                  )}
                  {isSuperAdmin && (
                    <StyledTableCell align="center" style={{ minWidth: 70 }}>
                      Last Packet DateTime
                    </StyledTableCell>
                  )}
                  <StyledTableCell align="center" style={{ minWidth: 70 }}>
                    Battery
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{ minWidth: 70 }}>
                    Assign User
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {beacons &&
                  beacons
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <StyledTableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row._id}
                        >
                          <StyledTableCell align="center">
                            {serialNumber + index}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.bnid}
                          </StyledTableCell>
                          {isSuperAdmin && (
                            <StyledTableCell align="center">
                              {row.cpid ? row.cpid : "--"}
                            </StyledTableCell>
                          )}
                          {isSuperAdmin && (
                            <StyledTableCell align="center">
                              {row.gwid ? row.gwid : "--"}
                            </StyledTableCell>
                          )}
                          <StyledTableCell align="center">
                            {row.username === "" ? "--" : row.username}
                          </StyledTableCell>
                          {isSuperAdmin && (
                            <StyledTableCell align="center">
                              <span
                                style={{
                                  // fontWeight: `${row.sos === "L" ? "" : "bold"}`,
                                  color: `${row.sos === "L" ? "green" : "red"}`,
                                  animation: `${
                                    row.sos === "L"
                                      ? "none"
                                      : "blink 0.5s linear infinite"
                                  }`,
                                }}
                              >
                                {row.sos === "L" ? "False" : "True"}
                              </span>
                            </StyledTableCell>
                          )}
                          {isSuperAdmin && (
                            <StyledTableCell align="center">
                              {row.timestamp ? row.timestamp : "--"}
                            </StyledTableCell>
                          )}
                          <StyledTableCell align="center">
                            <span>{row.battery}%</span>
                            <BatteryIcon battery={row.battery} />
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <span className="flex justify-center items-center">
                              <IconButton
                                aria-label="addUser"
                                sx={{ color: "rgb(25, 118, 210)" }}
                                onClick={() => handleOpenAssignUser(row)}
                              >
                                <PersonAddIcon />
                              </IconButton>
                              {isSuperAdmin && (
                                <IconButton
                                  aria-label="delete"
                                  sx={{ color: "red" }}
                                  onClick={() => handleDeleteBeacon(row)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </span>
                          </StyledTableCell>
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
          count={beacons.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <AssignUser
          openAssignUser={openAssignUser}
          handleCloseAssignUser={handleCloseAssignUser}
          selectedBeacon={selectedBeacon}
        />

        {/* Confirm Delete Modal */}
        <ConfirmBeaconDeletionModal
          open={isConfirmDeleteBeaconModalOpen}
          handleClose={handleCloseConfirmDeleteBeaconModal}
          handleConfirmDelete={deleteBeacon}
        />
      </ThemeProvider>

      <style jsx>{`
        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </Paper>
  );
}
