import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * useBackend is a custom hook that provides authentication-related backend functionalities.
 *
 * @returns {{
 *   isAuthenticated: boolean,
 *   userProfile: object,
 *   doLogin: function(username: string, password: string): Promise<void>,
 *   doLogout: function(): Promise<void>,
 *   getRandomMaze: function(): Promise<object>
 * }}
 */
export default function useBackend() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const nav = useNavigate();

  /**
   * Updates the authentication status of the user.
   *
   * If a token is not found in the local storage, the user profile and authentication status will be set to null,
   * and the user will be redirected to the home page.
   *
   * If a token is found, an authenticated GET request will be made to fetch the user profile from the backend.
   * If the request is successful, the user profile and authentication status will be updated accordingly.
   * If the request fails, the token will be removed from the local storage, the user profile and authentication status will be set to null,
   * and the user will be redirected to the home page.
   *
   * This must be in a useCallback to avoid an infinite loop of calling the useEffect hook
   *
   * @function
   * @returns {void}
   */
  const updateAuthenticationStatus = useCallback(() => {
    if (!localStorage.getItem("token")) {
      setUserProfile(null);
      setIsAuthenticated(false);
      nav("/");
      return;
    }
    authenticatedGET("/backend/profiles/me")
      .then(function (res) {
        setUserProfile(res.data);
        setIsAuthenticated(true);
      })
      .catch(function () {
        localStorage.removeItem("token");
        setUserProfile(null);
        setIsAuthenticated(false);
        nav("/");
      });
  }, [nav]);

  /**
   * Automatically sets the authentication status when the componenet mounts
   */
  useEffect(() => {
    updateAuthenticationStatus();
  }, [updateAuthenticationStatus]);

  /**
   * Logs in user and obtains an authentication token.
   *
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @return {Promise<void>} - A Promise that resolves once the login is successful or rejects if an error occurs.
   */
  function doLogin(username, password) {
    return axios
      .post("/backend/auth/token/login/", {
        username: username,
        password: password,
      })
      .then(function (res) {
        localStorage.setItem("token", res.data.auth_token);
        updateAuthenticationStatus();
      })
      .catch(() => {
        localStorage.removeItem("token");
      });
  }

  /**
   * Updates the display name of the user.
   *
   * @param {string} newDisplayName - The new display name for the user.
   * @return {Promise} - A Promise that resolves once the update is successful.
   */
  function updateDisplayName(profileID, newDisplayName) {
    return authenticatedPATCH(`/backend/profiles/${profileID}/`, {
      display_name: newDisplayName,
    }).then(() => {
      updateAuthenticationStatus();
    });
  }

  /**
   * Logs out the user by removing the token from localStorage and updating the authentication status.
   *
   * @returns {Promise} - A promise that resolves when the user is successfully logged out.
   */
  function doLogout() {
    return authenticatedPOST("/backend/auth/token/logout/", {}).then(
      function () {
        localStorage.removeItem("token");
        updateAuthenticationStatus();
      }
    );
  }

  /**
   * Submit user code for simulation
   *
   * @param userCode - The user's java code
   * @param maze_id - The maze's database pk
   * @returns {Promise} - A promise that resolves when the user entry is submitted
   */
  function submitUserEntry(userCode, maze_id) {
    console.log("submitting tournament entry");
    return authenticatedPOST("/backend/communication/receive_file/", {
      user_code: userCode,
      maze_id: maze_id,
    });
  }

  function submitTournamentEntry(userCode, tournament_id) {
    console.log("submitting tournament entry", tournament_id);
    return authenticatedPOST("/backend/communication/receive_file/", {
      user_code: userCode,
      tournament_id: tournament_id,
    });
  }

  /**
   * Retrieves a random maze configuration from the backend.
   *
   * @returns {Promise} A promise that resolves with the random maze configuration.
   */
  const getRandomMaze = useCallback(() => {
    return authenticatedGET("/backend/maze_configurations/random").then(
      (res) => {
        return res.data;
      }
    );
  }, []);

  // Fetch tournaments from Django API
  const getTournaments = useCallback(() => {
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString();
    return authenticatedGET(
      `/backend/tournaments/?id__gte=0&start__lte=${formattedCurrentDate}&stop__gte=${formattedCurrentDate}`
    ).then((res) => {
      return res.data;
    });
  }, []);

  const getTournamentMaze = useCallback((selectedTournament) => {
    const mazeId = selectedTournament.maze_configuration;
    return authenticatedGET(`/backend/maze_configurations/${mazeId}/`).then(
      (res) => {
        return res.data;
      }
    );
  }, []);

  const getLeaderboard = useCallback((selectedTournament) => {
    return authenticatedGET(
      `/backend/tournaments/${selectedTournament.id}/leaderboard/`
    );
  }, []);

  const getProfile = useCallback((profileID) => {
    return authenticatedGET(`/backend/profiles/${profileID}/`).then((res) => {
      // Check if display_name exists, and return it if it does, otherwise return user.username
      const nameToDisplay = res.data.display_name || res.data.username;

      return nameToDisplay;
    });
  }, []);

  /**
   * Retrieves all the user's snippets from the backend
   */
  const getSnippets = useCallback(() => {
    return authenticatedGET("/backend/snippets").then((res) => {
      return res.data;
    });
  }, []);

  /**
   * Create a new snippet and save it to the user's profile in the backend
   */
  const createSnippet = useCallback((snippet) => {
    return authenticatedPOST("/backend/snippets/", snippet).then((res) => {
      return res.data;
    });
  }, []);

  /**
   * Deletes a snippet with the provided snippet ID.
   *
   * @param {string} snippetID - The ID of the snippet to be deleted.
   * @returns {Promise} - A promise that resolves once the snippet is deleted.
   */
  const deleteSnippet = useCallback((snippetID) => {
    return authenticatedDELETE(`/backend/snippets/${snippetID}/`);
  }, []);

  /**
   * Modifies a snippet with the specified ID using the provided data.
   *
   * @param {number} snippetID - The ID of the snippet to be modified.
   * @param {object} data - The data used to modify the snippet.
   * @returns {Promise} Returns a Promise that resolves to the result of the modification request.
   */
  const modifySnippet = useCallback((snippetID, data) => {
    return authenticatedPATCH(`/backend/snippets/${snippetID}/`, data);
  }, []);

  const createTournament = useCallback((name, mazeID) => {
    return authenticatedPOST("/backend/tournaments/", {
      name: name,
      maze_configuration: mazeID,
      start: new Date().toISOString(),
      stop: new Date(
        new Date().setDate(new Date().getDate() + 7)
      ).toISOString(),
    });
  }, []);

  return {
    isAuthenticated,
    userProfile,
    doLogin,
    doLogout,
    getRandomMaze,
    submitUserEntry,
    getSnippets,
    createSnippet,
    submitTournamentEntry,
    getTournaments,
    getTournamentMaze,
    getLeaderboard,
    getProfile,
    deleteSnippet,
    modifySnippet,
    updateDisplayName,
    createTournament,
  };
}

/**
 * Makes an authenticated GET request to the specified address.
 *
 * @param {string} address - The URL of the resource to request.
 *
 * @return {Promise} - A Promise that resolves to the response from the GET request.
 */
function authenticatedGET(address) {
  return axios.get(address, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
}

/**
 * Sends a POST request to the specified address with the provided data, including an authorization token in the headers.
 *
 * @param {string} address - The address to send the request to.
 * @param {object} data - The data to send in the request body.
 * @returns {Promise} - A Promise that resolves to the response from the server.
 */
function authenticatedPOST(address, data) {
  return axios.post(address, data, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
}

/**
 * Makes an authenticated DELETE request to the specified address using Axios.
 *
 * @param {string} address - The address to send the DELETE request to.
 * @return {Promise} - A promise that resolves with the response from the DELETE request.
 */
function authenticatedDELETE(address) {
  return axios.delete(address, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
}

/**
 * Sends a PUT request to the specified address with the provided data, including an authorization token in the headers.
 *
 * @param {string} address - The address to send the request to.
 * @param {object} data - The data to send in the request body.
 * @returns {Promise} - A Promise that resolves to the response from the server.
 */
function authenticatedPUT(address, data) {
  return axios.put(address, data, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
}

/**
 * Sends a PATCH request to the specified address with the provided data, including an authorization token in the headers.
 *
 * @param {string} address - The address to send the request to.
 * @param {object} data - The data to send in the request body.
 * @returns {Promise} - A Promise that resolves to the response from the server.
 */
function authenticatedPATCH(address, data) {
  return axios.patch(address, data, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
}
