import axios from "axios";

// Define url base das requisições
export const api = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
})