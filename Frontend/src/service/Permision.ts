import ApiService from "./httpService";

export const FindNumber = async (number: string) => {
  try {
    // Make API request to validate phone number
    const data = await ApiService.getPublic(
      `api/Siligreen/UserData?Mobile=${number}`
    );

    console.log("User data request successful:", data);

    // Check if data is valid
    if (data) {
      return { data, success: 200 };
    } else {
      throw new Error("Invalid response received from server.");
    }
  } catch (error) {
    console.error("Error validating mobile number:", error);
    return { success: 500 };
  }
};
