import Vue from "vue";
import axios from "axios";
import * as Sentry from "@sentry/vue";

let API_URL = process.env.VUE_APP_API_URL;
let API_URL_2 = process.env.VUE_APP_API_URL_2;

const api = axios.create({
  baseURL: API_URL
});

const api2 = axios.create({
  baseURL: API_URL_2
});

const HTTP = {
  get(url, data, api2) {
    return api2 ? api2.get(`${url}`, data) : api.get(`${url}`, data);
  },
  post(url, data, api2) {
    return api2 ? api2.post(`${url}`, data) : api.get(`${url}`, data);
  },
  put(url, data, api2) {
    return api2 ? api2.put(`${url}`, data) : api.get(`${url}`, data);
  },
  init() {
    // Intercept the request to make sure the token is injected into the header.
    api.interceptors.request.use(config => {
      const token = localStorage.getItem("bearer");
      if (token !== "" || token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        window.location.replace("/auth");
      }
      return config;
    });

    api.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        return errorHandling(error);
      }
    );

    api2.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        return errorHandling(error);
      }
    );

    axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        return errorHandling(error);
      }
    );
  }
};

function errorHandling(error) {
  let message = "Something went wrong, please try again";
  if (!error.response) {
    message = "Network connection unstable";
    errorToast(message);
    return Promise.reject(error.message);
  } else {
    switch (error.response.status) {
      case 400:
        // **Temporary coment for ignore sentry error
        // Sentry.addBreadcrumb({category: "response", data: error.response.data});
        // Sentry.captureException(new Error("API 400"));
        errorToast(message);
        return Promise.reject(error.response.data);
      case 401:
        localStorage.setItem("priv", "");
        localStorage.setItem("bearer", "");
        localStorage.setItem("staff_id", "");
        localStorage.setItem("staff_name", "");
        window.location.replace("/");
      case 403:
        window.location.replace("/error/403");
      case 422:
        if (getKey(error.response.data.errors)) {
          message = getKey(error.response.data.errors);
          warningToast(message);
        } else {
          if (error.response.data.errors.id)
            message = error.response.data.errors.id;
          else if (error.response.data.errors.message)
            message = error.response.data.errors.message;
          else if (error.response.data.errors.customer)
            message = error.response.data.errors.customer;
          else if (error.response.data.errors.credit_limit_amount)
            message = error.response.data.errors.credit_limit_amount;
          else if (error.response.data.errors.warehouse_coverage)
            message = error.response.data.errors.warehouse_coverage;
          else if (error.response.data.errors.warehouse_creation)
            message = error.response.data.errors.warehouse_creation;
          else message = "Something wrong with your input";
          errorToast(message);
        }
        return Promise.reject(error.response.data);
      case 423:
        Sentry.addBreadcrumb({
          category: "response",
          data: error.response.data
        });
        Sentry.captureException(new Error("API 423"));
        message = error.response.data.errors.message;
        errorToast(message);
        return Promise.reject(error.response.data);
      case 404:
        // **Temporary coment for ignore sentry error
        // Sentry.addBreadcrumb({category: "response", data: error.response.data});
        // Sentry.captureException(new Error("API 404"));
        message = "This resource couldn't be found";
        errorToast(message);
        return Promise.reject(error.response.data);
      case 500:
        // **Temporary coment for ignore sentry error
        // Sentry.addBreadcrumb({category: "response", data: error.response});
        // Sentry.captureException(new Error("API 500"));
        errorToast(message);
        return Promise.reject(error.response.data);
      case 503: // Maintenance mode
        window.location.replace("/error/503");
    }
  }
}

function errorToast(message) {
  Vue.$toast.open({
    position: "top-right",
    message: message,
    type: "error"
  });
}

function warningToast(message) {
  Vue.$toast.open({
    position: "top-right",
    message: message,
    type: "warning"
  });
}

function getKey(errors) {
  for (var key in errors) {
    if (key.includes("rem_qty")) {
      return errors[key];
    }
  }
}

export default HTTP;
