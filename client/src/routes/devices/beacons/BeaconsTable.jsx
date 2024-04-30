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

export default function BeaconsTable() {
  const { showSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();
  const { beacons, fetchBeacons, serialNumber, isLoading } = useFetchBeacons();
  const { auth } = useAuth();
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
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  Serial No.
                </TableCell>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  Beacon ID
                </TableCell>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  Connect Point ID
                </TableCell>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  Gateway ID
                </TableCell>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  Assigned To
                </TableCell>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  SOS
                </TableCell>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  Last Packet DateTime
                </TableCell>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  Battery
                </TableCell>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {beacons &&
                beacons
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row._id}
                      >
                        <TableCell align="center">
                          {serialNumber + index}
                        </TableCell>
                        <TableCell align="center">{row.bnid}</TableCell>
                        <TableCell align="center">
                          {row.cpid ? row.cpid : "--"}
                        </TableCell>
                        <TableCell align="center">
                          {row.gwid ? row.gwid : "--"}
                        </TableCell>
                        <TableCell align="center">
                          {row.username === "none" ? "--" : row.username}
                        </TableCell>
                        <TableCell align="center">
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
                        </TableCell>
                        <TableCell align="center">
                          {row.timestamp ? row.timestamp : "--"}
                        </TableCell>
                        <TableCell align="center">
                          <span>{row.battery}%</span>
                          <BatteryIcon battery={row.battery} />
                        </TableCell>
                        <TableCell align="center">
                          <span className="flex justify-center items-center">
                            <IconButton
                              aria-label="addUser"
                              sx={{ color: "rgb(25, 118, 210)" }}
                              onClick={() => handleOpenAssignUser(row)}
                            >
                              <PersonAddIcon />
                            </IconButton>
                            {auth?.role === "SuperAdmin" && (
                              <IconButton
                                aria-label="delete"
                                sx={{ color: "red" }}
                                onClick={() => handleDeleteBeacon(row)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </span>
                        </TableCell>
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
