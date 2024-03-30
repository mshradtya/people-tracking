import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAxiosPrivate from "@/hooks/auth/useAxiosPrivate";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useFetchBeaconUsers } from "@/hooks/useFetchBeaconUsers";

const schema = yup
  .object({
    name: yup.string().required("Please Enter Full Name"),
    username: yup.string().required("Please Enter Username"),
    designation: yup.string().required("Please Enter Designation"),
    email: yup
      .string()
      .email("Email Must Be Valid")
      .required("Please Enter Email"),
    phone: yup.number().required("Please Enter Phone Number"),
  })
  .required();

export default function RegisterBeaconUser({ handleCloseBeaconUserDetails }) {
  const { fetchBeaconUsers } = useFetchBeaconUsers();
  const { showSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    handleCloseBeaconUserDetails();
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
      const response = await axiosPrivate.post("/beacon/user/register", {
        name: data.name,
        username: data.username,
        designation: data.designation,
        email: data.email,
        phone: data.phone,
      });

      // Clear form errors
      e.target.reset();

      // If the response is successful, close the modal and fetch gateways
      if (response?.data?.status === 201) {
        handleCloseBeaconUserDetails();
        fetchBeaconUsers();
        showSnackbar("success", "User Added Successfully");
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
      <DialogTitle>User Details</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid sm:grid-rows-1 md:grid-rows-3 gap-5 mb-4">
            <div>
              <TextField
                fullWidth
                label="Full Name"
                size="small"
                variant="outlined"
                {...register("name")}
              />
              <p className="text-orange-600 ">{errors.name?.message}</p>
            </div>
            <div>
              <TextField
                fullWidth
                label="Username"
                size="small"
                variant="outlined"
                {...register("username")}
              />
              <p className="text-orange-600 ">{errors.name?.message}</p>
            </div>
            <div>
              <TextField
                fullWidth
                label="Designation"
                size="small"
                variant="outlined"
                {...register("designation")}
              />
              <p className="text-orange-600 ">{errors.designation?.message}</p>
            </div>
            <div>
              <TextField
                fullWidth
                label="Email"
                size="small"
                variant="outlined"
                {...register("email")}
              />
              <p className="text-orange-600 ">{errors.email?.message}</p>
            </div>
            <div>
              <TextField
                fullWidth
                label="Phone Number"
                size="small"
                variant="outlined"
                {...register("phone")}
              />
              <p className="text-orange-600 ">{errors.phone?.message}</p>
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
