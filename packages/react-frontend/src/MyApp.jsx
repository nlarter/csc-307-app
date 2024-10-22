
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);


  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }


  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);


  function updateList(person) {
    setCharacters([...characters, person]);
  }

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });
    
    return promise;
  }


  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error('Failed to add user');
        }
      })
      .then((addedUser) => {
        setCharacters((prevCharacters) => [...prevCharacters, addedUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function removeOneCharacter(index) {
    const characterToDelete = characters[index];
    fetch(`http://localhost:8000/users/${characterToDelete.id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.status === 204) {
        const updated = characters.filter((character, i) => {
          return i !== index;
        });
        setCharacters(updated);
      } else if (response.status === 404) {
        console.log('User not found');
      } else {
        console.log('Failed to delete user');
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });
  }

  return (
  <div className="container">
    <Table
      characterData={characters}
      removeCharacter={removeOneCharacter}
    />
    <Form handleSubmit={updateList} />
  </div>
);
}
export default MyApp;
