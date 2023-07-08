import axios from "src/configs/axios-interceptor"

export const renderRoleDropdown = async () => {
    return await axios.get('/roles')
}