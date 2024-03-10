import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "@/hooks/useSnackbar";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";

const schema = yup
  .object({
    id: yup
      .number()
      .typeError("Please Enter Valid Beacon ID")
      .required("Please Enter Valid Beacon ID"),
  })
  .required();

export default function AddNewWearableModal({
  handleCloseBeaconDetails,
  fetchBeacons,
}) {
  const { showSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();
  const [gateway, setGateway] = useState(null);
  const [selectedGwid, setSelectedGwid] = useState("");
  const [gatewayIds, setGatewayIds] = useState([]);
  const [open, setOpen] = useState(true);

  const fetchGateways = async () => {
    try {
      const response = await axiosPrivate.get("/gateways");
      setGatewayIds(() => {
        return response.data.gateways.map((gateway) => ({
          gwid: gateway.gwid,
          _id: gateway._id, // Assuming _id is the MongoDB ID field
        }));
      });
    } catch (error) {
      showSnackbar("error", error.response.data.message);
      navigate("/login", { state: location, replace: true });
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  const handleClose = () => {
    setOpen(false);
    handleCloseBeaconDetails();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data, e) => {
    try {
      const response = await axiosPrivate.post("/beacon/register", {
        bnid: data.id,
        gateway: gateway._id,
      });

      // Clear form errors
      e.target.reset();

      // If the response is successful, close the modal and fetch gateways
      if (response?.data?.status === 201) {
        handleClose();
        fetchBeacons();
        showSnackbar("success", "Gateway Added Successfully");
      } else {
        showSnackbar("error", "Something went wrong");
      }
    } catch (error) {
      showSnackbar(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleChange = (event) => {
    const selectedGateway = gatewayIds.find(
      (item) => item.gwid === event.target.value
    );
    setGateway(selectedGateway);
    setSelectedGwid(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Beacon Details</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid sm:grid-rows-1  gap-5 mb-4">
            <div>
              <TextField
                fullWidth
                label="Beacon ID"
                size="small"
                variant="outlined"
                {...register("id")}
              />
              <p className="text-orange-600 ">{errors.id?.message}</p>
            </div>
            <div>
              <FormControl fullWidth>
                <InputLabel>Gateway ID</InputLabel>
                <Select
                  value={selectedGwid}
                  label="ID"
                  size="small"
                  onChange={handleChange}
                >
                  {gatewayIds &&
                    gatewayIds.map((gateway) => (
                      <MenuItem key={gateway.gwid} value={gateway.gwid}>
                        {gateway.gwid}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="flex justify-center items-center w-full mb-4">
            <Button type="submit" variant="outlined">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
