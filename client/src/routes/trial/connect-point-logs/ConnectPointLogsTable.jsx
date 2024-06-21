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
import CircularProgress from "@mui/material/CircularProgress";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#ed4354",
    color: theme.palette.common.white,
    textAlign: "center",
    height: `calc(70vh / 18)`,
    padding: "0px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    textAlign: "center",
    height: `calc(70vh / 18)`,
    padding: "0px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  height: `calc(70vh / 18)`,
}));

const theme = createTheme({
  palette: {
    primary: {
      main: "#ed4354",
    },
  },
});

const hourRanges = [
  "12-1 AM",
  "1-2 AM",
  "2-3 AM",
  "3-4 AM",
  "4-5 AM",
  "5-6 AM",
  "6-7 AM",
  "7-8 AM",
  "8-9 AM",
  "9-10 AM",
  "10-11 AM",
  "11-12 AM",
  "12-1 PM",
  "1-2 PM",
  "2-3 PM",
  "3-4 PM",
  "4-5 PM",
  "5-6 PM",
  "6-7 PM",
  "7-8 PM",
  "8-9 PM",
  "9-10 PM",
  "10-11 PM",
];

const parseTime = (timeString) => {
  const [time, period] = timeString.split(" ");
  let [hour, minute, second] = time.split(":").map(Number);
  if (period.toLowerCase() === "pm" && hour !== 12) hour += 12;
  if (period.toLowerCase() === "am" && hour === 12) hour = 0;
  return { hour, minute, second };
};

const checkTimestampInRange = (timestamps, range) => {
  const [startHourString, endHourString] = range.split(" ")[0].split("-");
  const period = range.split(" ")[1];

  const startHour =
    startHourString === "12"
      ? period === "AM"
        ? 0
        : 12
      : parseInt(startHourString, 10) +
        (period === "PM" && startHourString !== "12" ? 12 : 0);
  const endHour =
    endHourString === "12"
      ? period === "AM"
        ? 0
        : 12
      : parseInt(endHourString, 10) +
        (period === "PM" && endHourString !== "12" ? 12 : 0);

  const currentHour = new Date().getHours();

  return timestamps.some((timestamp) => {
    const { hour } = parseTime(timestamp);
    if (startHour < endHour) {
      return hour >= startHour && hour < endHour;
    } else {
      return hour >= startHour || hour < endHour;
    }
  })
    ? "✅"
    : currentHour < startHour
    ? "-"
    : "❌";
};

export default function ConnectPointLogsTable({ selectedDate }) {
  const axiosPrivate = useAxiosPrivate();
  const [logs, setLogs] = useState([]);
  const [isLogsLoading, setIsLogsLoading] = useState(true);
  const [logsSerialNumber, setLogsSerialNumber] = useState(1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(16);

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
        <TableContainer>
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
            <Table aria-label="sticky table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center" style={{ minWidth: 70 }}>
                    CPID
                  </StyledTableCell>
                  {hourRanges.map((range) => (
                    <StyledTableCell
                      key={range}
                      align="center"
                      style={{ minWidth: 70 }}
                    >
                      {range}
                    </StyledTableCell>
                  ))}
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
                            {row.cpid}
                          </StyledTableCell>
                          {hourRanges.map((range) => (
                            <StyledTableCell key={range} align="center">
                              {checkTimestampInRange(row.timestamps, range)}
                            </StyledTableCell>
                          ))}
                        </StyledTableRow>
                      );
                    })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[16, 25, 100]}
          component="div"
          count={logs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>
    </Paper>
  );
}
