import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "@/hooks/useSnackbar";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { useFetchBeacons } from "@/hooks/useFetchBeacons";

const schema = yup
  .object({
    id: yup
      .number()
      .typeError("Please Enter Valid Beacon ID")
      .required("Please Enter Valid Beacon ID"),
  })
  .required();

export default function RegisterBeacon({ handleCloseBeaconDetails }) {
  const { fetchBeacons } = useFetchBeacons();
  const { showSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();
  const [open, setOpen] = useState(true);

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
      });

      // Clear form errors
      e.target.reset();

      // If the response is successful, close the modal and fetch gateways
      if (response?.data?.status === 201) {
        handleClose();
        fetchBeacons();
        showSnackbar("success", "Beacon Added Successfully");
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
