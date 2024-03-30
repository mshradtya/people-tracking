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
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { format } from "date-fns";
// import ConfirmDeletionModal from "@/components/modals/ConfirmDeletionModal";
import { useSnackbar } from "@/hooks/useSnackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Battery0BarIcon from "@mui/icons-material/Battery0Bar";
import Battery20Icon from "@mui/icons-material/Battery20";
import Battery30Icon from "@mui/icons-material/Battery30";
import Battery50Icon from "@mui/icons-material/Battery50";
import Battery60Icon from "@mui/icons-material/Battery60";
import Battery80Icon from "@mui/icons-material/Battery80";
import Battery90Icon from "@mui/icons-material/Battery90";
import useAuth from "@/hooks/auth/useAuth";
import { useFetchBeacons } from "@/hooks/useFetchBeacons";

export default function BeaconsTable() {
  const { beacons, fetchBeacons, serialNumber, isLoading } = useFetchBeacons();
  const { auth } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    const fetchBeaconsInterval = setInterval(fetchBeacons, 500);

    return () => {
      clearInterval(fetchBeaconsInterval);
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

  const handleDeleteUser = (row) => {
    setSelectedUser(row);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      let data = JSON.stringify({ id: selectedUser.id });
      let config = {
        method: "delete",
        url: "/api/users",
        data: data,
      };

      axios
        .request(config)
        .then((res) => {
          if (res.status === 200) {
            showSnackbar("success", "User deleted successfully");
            getUsersData();
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setConfirmModalOpen(false);
          setSelectedUser(null);
        });
    }
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
    setSelectedUser(null);
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
                {auth?.role === "SuperAdmin" && (
                  <TableCell align="center" style={{ minWidth: 70 }}>
                    Action
                  </TableCell>
                )}
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
                        <TableCell align="center">Aditya Mishra</TableCell>
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
                          {row.battery > 0 && row.battery <= 10 && (
                            <Battery0BarIcon style={{ color: "red" }} />
                          )}
                          {row.battery > 10 && row.battery <= 20 && (
                            <Battery20Icon style={{ color: "red" }} />
                          )}
                          {row.battery > 20 && row.battery <= 30 && (
                            <Battery20Icon style={{ color: "red" }} />
                          )}
                          {row.battery > 30 && row.battery <= 40 && (
                            <Battery30Icon style={{ color: "red" }} />
                          )}
                          {row.battery > 40 && row.battery <= 50 && (
                            <Battery50Icon style={{ color: "orange" }} />
                          )}
                          {row.battery > 50 && row.battery <= 60 && (
                            <Battery50Icon style={{ color: "orange" }} />
                          )}
                          {row.battery > 60 && row.battery <= 70 && (
                            <Battery60Icon style={{ color: "orange" }} />
                          )}
                          {row.battery > 70 && row.battery <= 80 && (
                            <Battery60Icon style={{ color: "green" }} />
                          )}
                          {row.battery > 80 && row.battery <= 90 && (
                            <Battery80Icon style={{ color: "green" }} />
                          )}
                          {row.battery > 90 && row.battery <= 100 && (
                            <Battery90Icon style={{ color: "green" }} />
                          )}
                        </TableCell>
                        {auth?.role === "SuperAdmin" && (
                          <TableCell align="center">
                            <IconButton
                              aria-label="delete"
                              sx={{ color: "red" }}
                              onClick={() => handleDeleteUser(row)}
                            >
                              <DeleteIcon />
                            </IconButton>
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
        count={beacons.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Confirm Delete Modal */}
      {/* <ConfirmDeletionModal
        open={isConfirmModalOpen}
        handleClose={handleCloseConfirmModal}
        handleConfirmDelete={handleConfirmDelete}
      /> */}

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
