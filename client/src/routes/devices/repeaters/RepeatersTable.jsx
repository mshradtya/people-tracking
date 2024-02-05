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
import ConfirmDeletionModal from "@/components/modals/ConfirmDeletionModal";
import { useSnackbar } from "@/hooks/useSnackbar";

export default function RepeatersTable({ usersData, getUsersData }) {
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

  const formatDate = (dateString) => {
    const parseDate = new Date(dateString);
    return format(parseDate, "MMMM d, yyyy h:mm a");
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ minWidth: 70 }}>
                ID
              </TableCell>
              <TableCell align="center" style={{ minWidth: 70 }}>
                Name
              </TableCell>
              <TableCell align="center" style={{ minWidth: 70 }}>
                Email
              </TableCell>
              <TableCell align="center" style={{ minWidth: 70 }}>
                Type
              </TableCell>
              <TableCell align="center" style={{ minWidth: 70 }}>
                Created At
              </TableCell>
              <TableCell align="center" style={{ minWidth: 70 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.type}</TableCell>
                    <TableCell align="center">
                      {formatDate(row.created_at)}
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
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={usersData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeletionModal
        open={isConfirmModalOpen}
        handleClose={handleCloseConfirmModal}
        handleConfirmDelete={handleConfirmDelete}
      />
    </Paper>
  );
}
