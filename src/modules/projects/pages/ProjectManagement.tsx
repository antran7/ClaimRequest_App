import React from "react";
import Navbar from "../components/Navbar";
import { Button } from "@mui/material";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Add as PlusIcon } from "@mui/icons-material";

const ProjectManagement = () => {
  return (
    <div className="grid grid-cols-12 min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="col-span-2 bg-white shadow-lg p-4">
        <Navbar />
      </div>
      
      {/* Main Content */}
      <div className="col-span-10 p-8">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h5" className="font-bold text-gray-800">
            Project Management
          </Typography>
          <Button variant="contained" color="primary" startIcon={<PlusIcon />}>
            Add Project
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((project) => (
            <Card key={project} className="shadow-md rounded-lg overflow-hidden">
              <CardHeader
                title={<Typography variant="h6">Project {project}</Typography>}
              />
              <CardContent>
                <Typography color="textSecondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
                <Button variant="contained" color="secondary" className="mt-4">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
