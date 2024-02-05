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
import axios from "axios";
import { useSnackbar } from "@/hooks/useSnackbar";

const schema = yup
  .object({
    name: yup.string().required("Please Enter Name"),
    email: yup
      .string()
      .email("Email Must Be Valid")
      .required("Please Enter Email"),
  })
  .required();

export default function AddNewWearableModal({
  handleCloseUserDetails,
  getUsersData,
}) {
  const { showSnackbar } = useSnackbar();
  const [type, setType] = useState("user");
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

  const onSubmit = (data, e) => {
    Object.assign(data, { type: type });

    axios
      .post("/api/users", JSON.stringify(data))
      .then((res) => {
        if (res.status === 200) {
          showSnackbar("success", "User Added Successfully");
          e.target.reset();
          getUsersData();
          handleClose();
        }
      })
      .catch((err) => {
        showSnackbar("error", "Something went wrong");
      });
  };

  const handleChange = (event) => {
    setType(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Wearable Details</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid sm:grid-rows-1 md:grid-rows-3 gap-5 mb-4">
            <div>
              <TextField
                fullWidth
                label="Name"
                size="small"
                variant="outlined"
                {...register("name")}
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
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="mod">Moderator</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
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
