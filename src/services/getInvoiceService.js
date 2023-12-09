import axios from 'axios';

const getInvoice = async () => {
    try {
        const response = await axios.get('http://localhost:8000/invoice/get');
        console.log(response);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error occurred:', error);
        
        if (error.response && error.response.data) {
            console.error('Error response data:', error.response.data);
        }
        
        throw error;
    }
};

export {getInvoice};
