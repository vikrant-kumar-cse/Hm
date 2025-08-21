import React, { useState } from "react";
import axios from "axios";

const MessDownload = () => {
  const [month, setMonth] = useState("");

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/messrecord/download/?month=${month}`,
        { responseType: "blob" } // Important for file download
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `mess_reduction_${month}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("No Data Found for this month or server error!");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Download Monthly Reduction Data</h2>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={handleDownload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Download CSV
      </button>
    </div>
  );
};

export default MessDownload;
