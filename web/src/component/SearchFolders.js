import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "./Common";
import FoldersTable from "./FoldersTable";

function SearchFolders() {
  const navigator = useNavigate();
  const query = useQuery();
  const foldername = query.get("q") || "";
  const [foldernameInput, setFoldernameInput] = useState(foldername);
  const [folders, setFolders] = useState([]);
  const offset = parseInt(query.get("o")) || 0;
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  function searchFolder() {
    if (foldername === "") {
      return;
    }
    setIsLoading(true);
    fetch("/api/v1/search_folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        foldername: foldername,
        limit: limit,
        offset: offset,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFolders(data.folders ? data.folders : []);
      })
      .catch((error) => {
        alert("search_folders error: " + error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function nextPage() {
    navigator(`/folders?q=${foldername}&o=${offset + limit}`);
  }

  function lastPage() {
    const offsetValue = offset - limit;
    if (offsetValue < 0) {
      return;
    }
    navigator(`/folders?q=${foldername}&o=${offsetValue}`);
  }

  useEffect(() => searchFolder(), [offset, foldername]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page">
      <h3>Search Folders</h3>
      <div className="search_toolbar">
        <input
          onChange={(event) => setFoldernameInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              navigator(`/folders?q=${foldernameInput}&o=0`);
            }
          }}
          type="text"
          placeholder="Enter folder name"
          value={foldernameInput}
        />
        <button
          onClick={() => {
            navigator(`/folders?q=${foldernameInput}&o=0`);
          }}
        >
          {isLoading ? "Loading..." : "Search"}
        </button>
        <button onClick={lastPage}>Last page</button>
        <button disabled>
          {offset} - {offset + limit}
        </button>
        <button onClick={nextPage}>Next page</button>
      </div>
      <FoldersTable folders={folders} />
    </div>
  );
}

export default SearchFolders;
