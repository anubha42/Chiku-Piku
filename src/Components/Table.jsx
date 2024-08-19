import React from 'react';


const Table = ({ stories, handleEdit, handleDelete }) => {

    return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>contentURL</th>
            <th>duration</th>
            <th>poster</th>
            <th>description</th>
            <th>narrators</th>
            <th colSpan={2} className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {stories ? (
            stories.map((story, i) => (
              <tr key={story.id}>
                <td>{story.id}</td>
                <td>{story.name}</td>
                <td>{story.contentURL}</td>
                <td>{story.duration}</td>
                <td>{story.poster}</td>
                <td>{story.description}</td>
                <td>{story.narrators.map((narrators) => (<li key={narrators.name}>{narrators.name}</li>))} </td>
                <td className="text-right">
                  <button
                    onClick={() => handleEdit(story.id)}
                    className="button muted-button"
                  >
                    Edit
                  </button>
                </td>
                <td className="text-left">
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="button muted-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;