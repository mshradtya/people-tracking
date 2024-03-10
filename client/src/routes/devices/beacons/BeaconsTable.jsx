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
import Battery2BarIcon from "@mui/icons-material/Battery2Bar";
import Battery30Icon from "@mui/icons-material/Battery30";
import Battery90Icon from "@mui/icons-material/Battery90";

export default function BeaconsTable({
  beacons,
  fetchBeacons,
  isLoading,
  serialNumber,
}) {
  const { showSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

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
                  Gateway ID
                </TableCell>
                <TableCell align="center" style={{ minWidth: 70 }}>
                  SOS
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
                        <TableCell align="center">{row.gateway.gwid}</TableCell>
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
                          {/* <span style={{ marginRight: "5px" }}>
                          {row.battery}%
                        </span> */}
                          {row.battery >= 10 && row.battery < 20 && (
                            <Battery2BarIcon style={{ color: "red" }} />
                          )}
                          {row.battery >= 20 && row.battery < 30 && (
                            <Battery30Icon style={{ color: "orange" }} />
                          )}
                          {/* Add similar conditions for other battery levels */}
                          {row.battery >= 90 && row.battery <= 100 && (
                            <Battery90Icon style={{ color: "green" }} />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex justify-center">
                            <IconButton
                              aria-label="edit"
                              sx={{ color: "orange" }}
                              onClick={() => handleEditUser(row)}
                            >
                              <EditIcon />
                            </IconButton>

                            <IconButton
                              aria-label="delete"
                              sx={{ color: "red" }}
                              onClick={() => handleDeleteUser(row)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
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
