import { useState } from "react";
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
import useAxiosPrivate from "../../../hooks/auth/useAxiosPrivate";
import { useSnackbar } from "@/hooks/useSnackbar";

const schema = yup
  .object({
    name: yup.string().required("Please Enter Full Name"),
    username: yup.string().required("Please Enter Username"),
    email: yup
      .string()
      .email("Email Must Be Valid")
      .required("Please Enter Email"),
    password: yup.string().required("Please Enter Password"),
  })
  .required();

export default function AddNewUserModal({
  handleCloseUserDetails,
  fetchUsers,
}) {
  const { showSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();
  const [type, setType] = useState("User");
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    handleCloseUserDetails();
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
      const response = await axiosPrivate.post("/auth/register", {
        name: data.name,
        username: data.username,
        email: data.email,
        role: type,
        password: data.password,
      });

      // Clear form errors
      e.target.reset();

      // If the response is successful, close the modal and fetch gateways
      if (response?.data?.status === 201) {
        handleCloseUserDetails();
        fetchUsers();
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

  const handleChange = (event) => {
    setType(event.target.value);
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
                label="Email"
                size="small"
                variant="outlined"
                {...register("email")}
              />
              <p className="text-orange-600 ">{errors.email?.message}</p>
            </div>
            <div>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  label="Role"
                  size="small"
                  onChange={handleChange}
                >
                  <MenuItem value="User">User</MenuItem>
                  {/* <MenuItem value="mod">Moderator</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem> */}
                </Select>
              </FormControl>
            </div>
            <div>
              <TextField
                fullWidth
                label="Password"
                size="small"
                variant="outlined"
                {...register("password")}
              />
              <p className="text-orange-600 ">{errors.email?.message}</p>
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
