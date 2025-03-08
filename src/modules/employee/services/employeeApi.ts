import apiService from "../../../core/api/api"

interface EmployeeData {
    "_id": string,
    "user_id": string,
    "job_rank": string,
    "contract_type": string,
    "account": string,
    "address": string,
    "phone": string,
    "full_name": string,
    "avatar_url": string,
    "department_code": string,
    "salary": number,
    "start_date": string,
    "end_date": string,
    "updated_by": string,
    "created_at": string,
    "updated_at": string,
    "is_deleted": boolean,
    "__v": number,
}

export const getEmployeeInfo = async (_id: string): Promise<EmployeeData> => {
    try {
        const response = await apiService.get<EmployeeData>(`/employees/${_id}`);
        return response.data;
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}

export const updateEmployeeInfo = async (_id: string): Promise<void> => {
    try {
        const response = await apiService.put<EmployeeData>(`/employees/${_id}`);
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}