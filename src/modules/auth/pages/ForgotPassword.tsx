import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import Layout from "../../../shared/layouts/Layout";

type FormData = {
    email: string;
};

const ForgotPassword = () => {
    const { forgotPassword } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        mode: "onBlur",
    });

    const onSubmit = async (data: FormData) => {
        try {
            await forgotPassword(data.email);
            toast.success("Please check your email to get a new password!", {
                icon: "🔥",
            });
        } catch (error) {
            toast(error.toString(), {
                icon: "❌",
            });
        }
    };

    return (
        <Layout>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                <Container maxWidth="sm">
                    <Box sx={{ textAlign: "center", p: 4, boxShadow: 3, borderRadius: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Forget password?
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                {...register("email", {
                                    required: "Please enter email again",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Invalid email format",
                                    },
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                sx={{ mb: 2 }}
                            />
                            <Button type="submit" variant="contained" fullWidth>
                                Send request
                            </Button>
                        </form>
                    </Box>
                </Container>
            </Box>
        </Layout>
    );
};

export default ForgotPassword;