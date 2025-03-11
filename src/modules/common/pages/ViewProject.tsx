import React from 'react'
import './ViewProjects.css'
import Layout from '../../../shared/layouts/Layout'
import Search from '../../../shared/components/searchComponent/Search'
import { Button, Card, CardActions, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useForm } from 'react-hook-form'
import { searchProjectWithData } from '../../admin/services/projectService'
import { getEmployeeInfo } from '../../employee/services/employeeApi'


interface SearchFormInputs {
    searchTerm: string;
    department: string;
    startDate: string;
    endDate: string;
}

const ViewProject: React.FC = () => {
    const [alignment, setAlignment] = React.useState('basic');
    const [loading, setLoading] = React.useState(true);
    const [filterType, setFilterType] = React.useState('');
    const [results, setResults] = React.useState([]);
    const [avatars, setAvatars] = React.useState([]);

    const {
        register,
        reset,
        setValue,
        getValues,
        trigger,
        formState: { errors },
    } = useForm<SearchFormInputs>();

    const formatDateToUTC7 = (isoString?: string) => {
        return isoString
            ? new Date(isoString).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
            : "N/A";
    };

    const statusColors: Record<string, string> = {
        "New": "blue",
        "Pending": "gray",
        "Complete": "green",
        "Processing": "orange",
        "Cancelled": "red",
    };

    const handleChange = (event, newAlignment: string) => {
        setAlignment(newAlignment);
        handleSubmitSearch();
    };

    const handleClearFilters = () => {
        reset({
            searchTerm: "",
            department: "",
            startDate: "",
            endDate: "",
        });
    }

    const handleFilterResults = (event) => {
        setFilterType(event.target.value);
    }

    const handleSearch = async (searchTerm: string) => {
        setValue("searchTerm", searchTerm);
        handleSubmitSearch();
    }

    const handleSubmitSearch = async () => {
        const isValid = await trigger();
        if (!isValid) return;
        setLoading(false);
        const data = getValues();
        const formattedData = {
            ...data,
            startDate: data.startDate ? new Date(data.startDate).toISOString() : "",
            endDate: data.endDate ? new Date(data.endDate).toISOString() : "",
        };
        console.log(formattedData);
        try {
            const response = await searchProjectWithData(formattedData, 1);
            if (response) {
                setResults(response.pageData);
            }
            const members = response.pageData;
            console.log(members);
            if (members) {
                members.map(async (member) => {
                    const employeeInfo = await getEmployeeInfo(member.employee_id);
                    console.log(employeeInfo);
                    setAvatars((prevAvatars) => [...prevAvatars, employeeInfo.avatar_url]);
                })
            }
            console.log(avatars);
        } catch (error) {
            console.error("Error: ", error);
            throw error;
        }
    }

    return (
        <Layout>
            <div className='search-projects-container'>
                <div className='search-bar-input'>
                    <Search onSearch={handleSearch} />
                    <ToggleButtonGroup
                        color="primary"
                        value={alignment}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"
                        style={{ backgroundColor: "white" }}
                    >
                        <ToggleButton value="basic">Basic Filtering</ToggleButton>
                        <ToggleButton value="advanced">Advanced Filtering</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                {alignment === "advanced" && (
                    <Grid container spacing={2} className='search-bar-filter'>
                        <Grid item xs={0.75} sx={{ mr: -10 }}>
                            <InputLabel>Department:</InputLabel>
                        </Grid>
                        <Grid item xs={2.25}>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                {...register("department")}
                                onChange={(e) => {
                                    setValue("department", e.target.value);
                                    handleSubmitSearch();
                                }}
                            />
                        </Grid>

                        <Grid item xs={0.75} sx={{ mr: -10 }}>
                            <InputLabel>Start Date:</InputLabel>
                        </Grid>
                        <Grid item xs={2.25}>
                            <TextField
                                fullWidth
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...register("startDate", {
                                    validate: (value) => {
                                        const endDate = getValues("endDate");
                                        if (endDate && value && new Date(value) > new Date(endDate)) {
                                            return "Start Date must be before End Date";
                                        }
                                        return true;
                                    }
                                })}
                                error={!!errors.startDate}
                                helperText={errors.startDate?.message}
                                onChange={(e) => {
                                    setValue("startDate", e.target.value);
                                    trigger("endDate"); // Kiểm tra lại endDate
                                    handleSubmitSearch();
                                }}
                            />
                        </Grid>

                        <Grid item xs={0.75} sx={{ mr: -10 }}>
                            <InputLabel>End Date:</InputLabel>
                        </Grid>
                        <Grid item xs={2.25}>
                            <TextField
                                fullWidth
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...register("endDate", {
                                    validate: (value) => {
                                        const startDate = getValues("startDate");
                                        if (startDate && value && new Date(value) < new Date(startDate)) {
                                            return "End Date must be after Start Date";
                                        }
                                        return true;
                                    }
                                })}
                                error={!!errors.endDate}
                                helperText={errors.endDate?.message}
                                onChange={async (e) => {
                                    setValue("endDate", e.target.value);
                                    await trigger("startDate");
                                    await handleSubmitSearch();
                                }}
                            />
                        </Grid>
                        <Grid item xs={1.5} sx={{ fontSize: '18px' }}>
                            <Button
                                startIcon={<CancelOutlinedIcon sx={{ fontSize: '18px' }} />}
                                onClick={handleClearFilters}
                            >
                                Clear All Filters
                            </Button>
                        </Grid>
                    </Grid>
                )}
                <div className='filter-results-display'>
                    <h3>1-5 of 4 054 results</h3>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <Select
                            value={filterType}
                            onChange={handleFilterResults}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            sx={{ p: 0 }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Project Name</MenuItem>
                            <MenuItem value={20}>Start date</MenuItem>
                            <MenuItem value={30}>End date</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <Grid container spacing={2} className='results-card-container'>
                    {results.map((project) => (
                        <Grid item xs={12} sm={6} md={2} key={project._id}>
                            <Card sx={{ maxWidth: 345, boxShadow: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="h5"
                                        style={{
                                            textAlign: "center",
                                            marginBottom: "5px",
                                        }}
                                    >
                                        {project.project_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Code: {project.project_code}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: statusColors[project.project_status] || "black" }}
                                    >
                                        Status: {project.project_status}
                                    </Typography>
                                    <Typography variant="body2">
                                        Duration: {formatDateToUTC7(project?.project_start_date)} - {formatDateToUTC7(project?.project_end_date)}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary">
                                        View Details
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </Layout>
    )
}

export default ViewProject