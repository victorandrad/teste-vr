import axios from "axios";

// Define url base das requisições
export const api = axios.create({
    baseURL: 'http://localhost:3300',
})