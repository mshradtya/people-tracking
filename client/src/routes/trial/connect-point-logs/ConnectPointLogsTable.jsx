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
import CircularProgress from "@mui/material/CircularProgress";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";

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

export default function ConnectPointLogsTable({ selectedDate }) {
  const axiosPrivate = useAxiosPrivate();
  const [logs, setLogs] = useState([]);
  const [isLogsLoading, setIsLogsLoading] = useState(true);
  const [logsSerialNumber, setLogsSerialNumber] = useState(1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchSosHistory = async (selectedDate) => {
      try {
        const response = await axiosPrivate.get(
          `/connect-point/logs?date=${selectedDate}`
        );
        console.log(response.data);
        setLogs(response.data);
        setIsLogsLoading(false);
        setLogsSerialNumber(1);
      } catch (error) {
        showSnackbar("error", error.response.data.message);
      }
    };

    fetchSosHistory(selectedDate);
  }, [selectedDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <ThemeProvider theme={theme}>
        <TableContainer sx={{ maxHeight: 440 }}>
          {isLogsLoading ? (
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
                    Timestamps
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {logs &&
                  logs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <StyledTableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          <StyledTableCell align="center">
                            {logsSerialNumber + index}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.cpid}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.timestamps.join(" | ")}
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
          count={history.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>
    </Paper>
  );
}
