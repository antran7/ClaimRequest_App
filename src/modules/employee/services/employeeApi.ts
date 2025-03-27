import apiService from "../../../core/api/api"
import { EmployeeData, EmployeeInfo } from "../constants/employee";

export const getEmployeeInfo = async (_id: string): Promise<EmployeeData> => {
    try {
        const response = await apiService.get<EmployeeData>(`/employees/${_id}`);
        if (!response.data) {
            throw new Error("No employee data!");
        }
        return response.data;
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}

export const updateEmployeeInfo = async (_id: string, employeeInfo: EmployeeInfo): Promise<void> => {
    try {
        await apiService.put<EmployeeData>(`/employees/${_id}`, employeeInfo);
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}