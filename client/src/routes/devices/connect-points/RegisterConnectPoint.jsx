import { useState } from "react";
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
import { useFetchConnectPoints } from "@/hooks/useFetchConnectPoints";

const schema = yup
  .object({
    id: yup
      .number()
      .typeError("Please Enter Valid Connect Point ID")
      .required("Please Enter Valid Connect Point ID"),
    pillarStart: yup
      .number()
      .typeError("Please Enter Valid Pillar Number")
      .required("Please Enter Valid Pillar Number"),
    pillarEnd: yup
      .number()
      .typeError("Please Enter Valid Pillar Number")
      .required("Please Enter Valid Pillar Number"),
  })
  .required();

export default function RegisterConnectPoint({
  handleCloseConnectPointDetails,
}) {
  const { fetchConnectPoints } = useFetchConnectPoints();
  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar } = useSnackbar();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    handleCloseConnectPointDetails();
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
      const response = await axiosPrivate.post("/connect-point/register", {
        cpid: data.id,
        pillarStart: data.pillarStart,
        pillarEnd: data.pillarEnd,
      });

      // Clear form errors
      e.target.reset();

      // If the response is successful, close the modal and fetch gateways
      if (response?.data?.status === 201) {
        handleClose();
        fetchConnectPoints();
        showSnackbar("success", "Connect Point Added Successfully");
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
      <DialogTitle>Connect Point Details</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid sm:grid-rows-1 mb-4 gap-4">
            <div>
              <TextField
                fullWidth
                label="Connect Point ID"
                size="small"
                variant="outlined"
                {...register("id")}
              />
              <p className="text-orange-600 ">{errors.id?.message}</p>
            </div>
          </div>
          <div className="grid sm:grid-rows-1 mb-4 gap-4">
            <div>
              <TextField
                fullWidth
                label="Starting Pillar Number"
                size="small"
                variant="outlined"
                {...register("pillarStart")}
              />
              <p className="text-orange-600 ">{errors.id?.message}</p>
            </div>
          </div>
          <div className="grid sm:grid-rows-1 mb-4 gap-4">
            <div>
              <TextField
                fullWidth
                label="Ending Pillar Number"
                size="small"
                variant="outlined"
                {...register("pillarEnd")}
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
