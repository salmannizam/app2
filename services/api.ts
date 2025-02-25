// services/api.ts
import axios, { AxiosResponse } from 'axios';

// Define your base URL for the API
const api = axios.create({
  baseURL: 'https://sctrackerapi.azurewebsites.net', // your base URL
  // baseURL: 'http://77.37.45.105:4004', // your base URL
  timeout: 5000, // set a timeout if necessary
});

// Define types for request data and responses

// Define the shape of the data sent in the request (SurveyDetails)
interface PreSurveyDetails {
  SurveyID: string;
  ResultID: string;
  OutletName: string;
  State: string;
  country: string;
  Location: string;
  Address: string;
  Zone: string;
  StartDate: string;
  StartTime: string;
  EndDate: string;
  EndTime: string;
  ProjectId: string;
}


//survy questions
interface answeredQuestions {
  SurveyID: string;
  ResultID: string;
  QuestionID: number;
  AnswerID: string;
  AnswerText: string;
  Location: string;
  Remarks: string;
  DeviceID: string;
  projectid: string;
}

interface SubmitSurvey {
  PreSurveyDetails: PreSurveyDetails;
  answeredQuestions: answeredQuestions[];
  images?: { [key: number]: File }; // This will be a map of question ID to file (image)
}

// Define the shape of the response data
interface ApiResponse {
  success: boolean;
  message: string;
  status: string;
  data: any;
}

// Add request interceptors to add headers (for example, Authorization)
api.interceptors.request.use((config) => {
  // Add authentication token or other headers here (if required)
  // const token = getTokenFromSomewhere(); // For example, using AsyncStorage
  // if (token) {
  //   config.headers['Authorization'] = `Bearer ${token}`;
  // }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// Add response interceptors (for error handling, etc.)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle errors globally (you can show a Toast or handle error responses)
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = "Something went wrong. Please try again.";

    if (error.response) {
      // The request was made and the server responded with a status code outside 2xx
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response from server. Check your internet connection.";
    } else {
      // Something happened in setting up the request
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);


// API Call to submit survey details (POST request)
export const validateProjectId = (ProjectId: string, surveyId: string): Promise<AxiosResponse<ApiResponse>> => {
  return api.post('/survey/validate-project', { ProjectId, surveyId });
};


export const getResultId = (ProjectId: string, surveyId: string, outletName: string): Promise<AxiosResponse<ApiResponse>> => {
  return api.post('/survey/get-resultid', { ProjectId, surveyId, OutletName: outletName });
};


export const getSurveyQuestions = (surveyId: string): Promise<AxiosResponse<ApiResponse>> => {
  console.log("surveyId",surveyId)
  return api.get(`/survey/get-questions/${surveyId}`);

  // return api.get(`/survey/get-questions/s20250216154732`);
};

export const submitPreSurveyDetails = (surveyData: SubmitSurvey): Promise<AxiosResponse<ApiResponse>> => {
  return api.post('/survey/submit-survey', surveyData, {
  });
};

